(() => {
  'use strict';
  if (location.origin !== 'https://app.fenworks.com') return;
  const api = globalThis.NSeSA;
  let settings, timer, moved = null;
  const painted = new Set();
  const teamGrids = new Set();
  const teamResize = new ResizeObserver(entries => {
    for (const entry of entries) entry.target.toggleAttribute('data-nsesa-narrow', entry.contentRect.width < 560);
  });
  function roomForTeamNames() {
    const onMatch = settings.unsquish && /^\/match\//i.test(location.pathname);
    for (const grid of teamGrids) {
      if (!grid.isConnected || !onMatch) {
        teamResize.unobserve(grid); teamGrids.delete(grid);
        grid.removeAttribute('data-nsesa-teams'); grid.removeAttribute('data-nsesa-narrow');
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
        teamGrids.add(grid); grid.dataset.nsesaTeams = '';
        grid.toggleAttribute('data-nsesa-narrow', grid.getBoundingClientRect().width < 560);
        teamResize.observe(grid);
      }
    }
  }
  const seasonSelector = 'a[href^="/seasons/view/"], a[href^="https://app.fenworks.com/seasons/view/"]';
  const teamSelector = 'a[href^="/teams/"], a[href^="/team/"], a[href^="https://app.fenworks.com/teams/"], a[href^="https://app.fenworks.com/team/"]';
  function ink(hex) {
    const parts = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
      .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    return parts[0] * .2126 + parts[1] * .7152 + parts[2] * .0722 > .179 ? '#142033' : '#ffffff';
  }
  function colorRows() {
    const wanted = new Map();
    // Match pages also contain season links; they are not schedule rows.
    if (settings.colorMatches && !/^\/match\//i.test(location.pathname)) {
      for (const link of document.querySelectorAll(seasonSelector)) {
        if (link.closest('nav, header, aside, [role="navigation"]')) continue;
        const title = api.normalize(link.textContent);
        const game = settings.games.find(g => title.includes(api.normalize(g.title)));
        if (!game) continue;
        let row = link.parentElement;
        for (let depth = 0; row && depth < 9; depth++, row = row.parentElement) {
          if (row.matches('body, main, #root, [role="main"]')) break;
          // Never let a match climb into the container holding multiple schedule rows.
          if (row.querySelectorAll(seasonSelector).length > 1) break;
          if (row.querySelector(teamSelector)) { wanted.set(row, game.color); break; }
        }
      }
    }
    for (const row of painted) {
      if (!wanted.has(row)) {
        row.removeAttribute('data-nsesa-row');
        row.style.removeProperty('--nsesa-color'); row.style.removeProperty('--nsesa-ink');
        painted.delete(row);
      }
    }
    for (const [row, color] of wanted) {
      row.dataset.nsesaRow = '';
      row.style.setProperty('--nsesa-color', color);
      row.style.setProperty('--nsesa-ink', ink(color));
      painted.add(row);
    }
  }
  function trimURL(raw) {
    let url = raw.replace(/[.,!?;:]+$/g, '');
    for (const [open, close] of [['(', ')'], ['[', ']'], ['{', '}']]) {
      while (url.endsWith(close) && url.split(close).length > url.split(open).length) url = url.slice(0, -1);
    }
    return url;
  }
  function chatLinks() {
    if (!settings.linkify) {
      for (const a of document.querySelectorAll('a[data-nsesa-link]')) a.replaceWith(document.createTextNode(a.textContent));
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
        a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.dataset.nsesaLink = '';
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
      const marker = document.createComment('NSeSA original chat position');
      block.before(marker); details.after(block);
      moved = {block, details, marker}; return;
    }
  }
  const observer = new MutationObserver(schedule);
  function watch() { observer.observe(document.body, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'class', 'hidden']}); }
  function run() {
    timer = null;
    if (!settings) return;
    observer.disconnect();
    try { colorRows(); chatLinks(); placeChat(); roomForTeamNames(); }
    finally { watch(); }
  }
  function schedule() { if (!timer) timer = setTimeout(run, 100); }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) { settings = api.clean(changes.settings.newValue); schedule(); }
  });
  window.addEventListener('popstate', schedule);
  api.load().then(value => { settings = value; run(); }).catch(error => console.warn('NSeSA Helper could not load settings:', error));
})();
