(() => {
  'use strict';
  if (location.origin !== 'https://app.fenworks.com') return;
  const api = globalThis.EsportsHelper;
  let settings, timer, moved = null;
  const painted = new Set();
  const teamGrids = new Set();
  const teamResize = new ResizeObserver(entries => {
    for (const entry of entries) entry.target.toggleAttribute('data-esports-narrow', entry.contentRect.width < 560);
  });
  function roomForTeamNames() {
    const onMatch = settings.unsquish && /^\/match\//i.test(location.pathname);
    for (const grid of teamGrids) {
      if (!grid.isConnected || !onMatch) {
        teamResize.unobserve(grid); teamGrids.delete(grid);
        grid.removeAttribute('data-esports-teams'); grid.removeAttribute('data-esports-narrow');
      }
    }
    if (!onMatch) return;
    // The supplied score header has home and away cards around a dash.
    // Measure this header, not the viewport: sidebars and rosters consume space.
    for (const grid of document.querySelectorAll('main div.grid')) {
      const children = grid.children;
      if (children.length !== 3 || !children[0].querySelector('h2[title]') ||
          !children[2].querySelector('h2[title]') || children[1].textContent.trim() !== '-') continue;
      if (!teamGrids.has(grid)) {
        teamGrids.add(grid); grid.dataset.esportsTeams = '';
        grid.toggleAttribute('data-esports-narrow', grid.getBoundingClientRect().width < 560);
        teamResize.observe(grid);
      }
    }
  }
  const competitionSelector = ['/seasons/view/', '/tournaments/view/']
    .flatMap(path => [path, location.origin + path])
    .map(path => `a[href^="${path}"]:not([data-esports-match-link])`).join(', ');
  const teamSelector = 'a[href^="/teams/"], a[href^="/team/"], a[href^="https://app.fenworks.com/teams/"], a[href^="https://app.fenworks.com/team/"]';
  function ink(hex) {
    const parts = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
      .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    return parts[0] * .2126 + parts[1] * .7152 + parts[2] * .0722 > .179 ? '#142033' : '#ffffff';
  }
  function colorRows() {
    const wanted = new Map();
    // Match pages also contain competition links; they are not schedule rows.
    if (settings.colorMatches && !/^\/match\//i.test(location.pathname)) {
      for (const link of document.querySelectorAll(competitionSelector)) {
        if (link.closest('nav, header, aside, [role="navigation"]')) continue;
        const title = api.normalize(link.textContent);
        const game = settings.games.find(g => title.includes(api.normalize(g.title)));
        if (!game) continue;
        let row = link.parentElement;
        for (let depth = 0; row && depth < 9; depth++, row = row.parentElement) {
          if (row.matches('body, main, #root, [role="main"]')) break;
          // Never let a match climb into the container holding multiple schedule rows.
          if (row.querySelectorAll(competitionSelector).length > 1) break;
          if (row.querySelector(teamSelector)) {
            // Responsive cards contain separate mobile and desktop layouts.
            // Paint their shared card, including playoff tournament cards.
            const card = row.closest('[role="button"]');
            if (card && card.querySelectorAll(competitionSelector).length === 1) row = card;
            wanted.set(row, game.color); break;
          }
        }
      }
    }
    for (const row of painted) {
      if (!wanted.has(row)) {
        row.removeAttribute('data-esports-row');
        row.style.removeProperty('--esports-color'); row.style.removeProperty('--esports-ink');
        painted.delete(row);
      }
    }
    for (const [row, color] of wanted) {
      row.dataset.esportsRow = '';
      row.style.setProperty('--esports-color', color);
      row.style.setProperty('--esports-ink', ink(color));
      painted.add(row);
    }
  }
  const sortedDays = new Set();
  function matchDay(group) {
    const heading = group.firstElementChild;
    if (!heading?.matches('div.sticky') || !group.querySelector(competitionSelector) ||
        !group.querySelector(teamSelector)) return null;
    const match = /^(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/.exec(heading.textContent.trim());
    if (!match) return null;
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[1]);
    const date = new Date(Date.UTC(Number(match[3]), month, Number(match[2])));
    return date.getUTCMonth() === month && date.getUTCDate() === Number(match[2]) ? date.getTime() : null;
  }
  function orderPastDays() {
    const wanted = new Set();
    if (settings.newestPastDays && !/^\/match\//i.test(location.pathname)) {
      for (const tabs of document.querySelectorAll('[role="tablist"][aria-label="Match date range"]')) {
        const selected = tabs.querySelector('[role="tab"][aria-selected="true"]');
        if (selected?.textContent.trim().toUpperCase() !== 'PAST') continue;
        // Find the nearest schedule containing both the date tabs and day groups.
        for (let scope = tabs.parentElement; scope && !scope.matches('body, #root'); scope = scope.parentElement) {
          const lists = new Set();
          for (const heading of scope.querySelectorAll('div.sticky')) {
            const group = heading.parentElement;
            if (matchDay(group) !== null) lists.add(group.parentElement);
          }
          if (!lists.size) continue;
          for (const list of lists) {
            if (Array.from(list.children).every(group => matchDay(group) !== null)) wanted.add(list);
          }
          break;
        }
      }
    }
    for (const list of new Set([...sortedDays, ...wanted])) {
      if (!list.isConnected) { sortedDays.delete(list); continue; }
      const groups = Array.from(list.children);
      const dates = groups.map(matchDay);
      if (dates.every(date => date !== null)) {
        const direction = wanted.has(list) ? -1 : 1;
        const ordered = groups.map((group, index) => ({group, date: dates[index]}))
          .sort((a, b) => direction * (a.date - b.date));
        // Keep the original nodes and parent so controls and delegated events survive.
        ordered.forEach(({group}, index) => {
          if (list.children[index] !== group) list.insertBefore(group, list.children[index]);
        });
      }
      if (wanted.has(list)) sortedDays.add(list); else sortedDays.delete(list);
    }
  }
  const matchCards = new Map();
  function resolveMatchLink(link) {
    link.dispatchEvent(new Event('esports-helper:resolve-match', {bubbles: true}));
    try {
      const url = new URL(link.getAttribute('href'), location.origin);
      return url.origin === location.origin && /^\/(?:match|seasons\/view)\/[1-9]\d*$/.test(url.pathname) ? url.href : null;
    } catch { return null; }
  }
  function matchTabControls() {
    const wanted = new Set();
    if (settings.matchNewTabs && /^\/(?:dashboard(?:\/.*)?)?$/i.test(location.pathname)) {
      for (const card of document.querySelectorAll('main [role="button"]')) {
        if (card.querySelector(competitionSelector) && card.querySelector(teamSelector) &&
            card.querySelectorAll(competitionSelector).length === 1) wanted.add(card);
      }
    }
    for (const [card, link] of matchCards) {
      if (!wanted.has(card)) {
        link.remove(); card.removeAttribute('data-esports-match-card'); matchCards.delete(card);
      }
    }
    for (const card of wanted) {
      let link = matchCards.get(card);
      if (!link || link.parentElement !== card) {
        link?.remove();
        link = document.createElement('a'); link.dataset.esportsMatchLink = '';
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.title = 'Open in new tab'; link.setAttribute('aria-label', 'Open match in new tab');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(svg.namespaceURI, 'path');
        path.setAttribute('d', 'M14 3h7v7M21 3 10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5');
        svg.append(path); link.append(svg);
        for (const type of ['click', 'auxclick']) link.addEventListener(type, event => {
          event.stopPropagation();
          if (!settings.matchNewTabs || !resolveMatchLink(link)) event.preventDefault();
        });
        link.addEventListener('keydown', event => event.stopPropagation());
        card.append(link); matchCards.set(card, link);
      }
      const valid = Boolean(resolveMatchLink(link));
      link.hidden = !valid;
      card.toggleAttribute('data-esports-match-card', valid);
    }
  }
  function openModifiedMatch(event) {
    if (!settings?.matchNewTabs || !/^\/(?:dashboard(?:\/.*)?)?$/i.test(location.pathname)) return;
    const modified = event.type === 'click' && event.button === 0 && (event.ctrlKey || event.metaKey);
    const middle = (event.type === 'auxclick' || event.type === 'mousedown') && event.button === 1;
    if (!modified && !middle) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('a, button, input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    const card = target.closest('[role="button"]');
    const link = matchCards.get(card);
    if (!link || !resolveMatchLink(link)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    // Suppress middle-button autoscroll on press; open once on release.
    if (event.type !== 'mousedown') link.click();
  }
  for (const type of ['click', 'auxclick', 'mousedown']) document.addEventListener(type, openModifiedMatch, true);
  function trimURL(raw) {
    let url = raw.replace(/[.,!?;:]+$/g, '');
    for (const [open, close] of [['(', ')'], ['[', ']'], ['{', '}']]) {
      while (url.endsWith(close) && url.split(close).length > url.split(open).length) url = url.slice(0, -1);
    }
    return url;
  }
  function chatLinks() {
    if (!settings.linkify) {
      for (const a of document.querySelectorAll('a[data-esports-link]')) a.replaceWith(document.createTextNode(a.textContent));
      return;
    }
    // Shared message hooks cover match chat and the portal-rendered sidebar.
    const roots = document.querySelectorAll('.chat__body, [data-message-id], [role="log"], [aria-label*="chat" i] [class*="message" i]');
    const nodes = new Set();
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement.closest('a, input, textarea, select, script, style, code, pre, [contenteditable]:not([contenteditable="false"])') && /(?:https?:\/\/|www\.)/i.test(node.data)) nodes.add(node);
      }
    }
    for (const node of nodes) {
      const text = node.data, fragment = document.createDocumentFragment();
      const regex = /\b(?:https?:\/\/|www\.)[^\s<>"\u0027]+/gi;
      let last = 0, match;
      while ((match = regex.exec(text))) {
        const label = trimURL(match[0]);
        const href = api.safeURL(/^www\./i.test(label) ? 'https://' + label : label);
        if (!href) continue;
        fragment.append(text.slice(last, match.index));
        const a = document.createElement('a');
        a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.dataset.esportsLink = '';
        // A full-match message is itself a button. Do not open its options menu.
        for (const type of ['click', 'auxclick']) a.addEventListener(type, event => event.stopPropagation());
        a.addEventListener('keydown', event => event.stopPropagation());
        fragment.append(a); last = match.index + label.length;
      }
      if (last) { fragment.append(text.slice(last)); node.replaceWith(fragment); }
    }
  }
  function restoreChat() {
    if (!moved) return;
    const {block, marker} = moved;
    if (block.isConnected && marker.isConnected && block.parentNode === marker.parentNode) marker.after(block);
    marker.remove(); moved = null;
  }
  function placeChat() {
    const panel = document.getElementById('match-chat-panel');
    if (moved && (!moved.block.isConnected || !panel || !moved.block.contains(panel))) restoreChat();
    if (!settings.moveChat || !/^\/match\//i.test(location.pathname)) { restoreChat(); return; }
    if (!panel) return;
    if (moved) {
      if (moved.details.isConnected && moved.block.previousElementSibling !== moved.details) moved.details.after(moved.block);
      return;
    }
    // Find the shared parent shown in the supplied HTML, using roster cards as
    // the details hook. Move the complete chat wrapper within its original parent
    // so React's delegated events, references, input and hide/show controls survive.
    let block = panel;
    for (let depth = 0; block.parentElement && depth < 7; depth++, block = block.parentElement) {
      if (block.parentElement.matches('main, body, #root')) break;
      const details = Array.from(block.parentElement.children).find(sibling => sibling !== block && sibling.querySelector('.match-roster-player-card'));
      if (!details) continue;
      const marker = document.createComment('EsportsHelper original chat position');
      block.before(marker); details.after(block);
      moved = {block, details, marker}; return;
    }
  }
  const observer = new MutationObserver(schedule);
  function watch() { observer.observe(document.body, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'class', 'hidden', 'aria-selected']}); }
  function run() {
    timer = null;
    if (!settings) return;
    observer.disconnect();
    try { matchTabControls(); orderPastDays(); colorRows(); chatLinks(); placeChat(); roomForTeamNames(); }
    finally { watch(); }
  }
  function schedule() { if (!timer) timer = setTimeout(run, 100); }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) { settings = api.clean(changes.settings.newValue); schedule(); }
  });
  window.addEventListener('popstate', schedule);
  api.load().then(value => { settings = value; run(); }).catch(error => console.warn('Esports Helper could not load settings:', error));
})();
