/* Shared by extension pages and the isolated content script. */
globalThis.EsportsHelper = (() => {
  const matchSite = new URL(chrome.runtime.getManifest().content_scripts[0].matches[0].replace('*', ''));
  function bookmarkName(bookmark) {
    const url = new URL(bookmark.url);
    // Rebrand the original default shortcut while preserving customized labels.
    const originalLabel = matchSite.hostname.split('.').at(-2);
    return url.origin === matchSite.origin && url.pathname === '/' &&
      bookmark.name.trim().toLowerCase() === originalLabel ? 'Match dashboard' : bookmark.name.trim();
  }
  const defaults = {
    games: [
      {title: 'Super Smash Bros Ultimate', color: '#E6D5F7'},
      {title: 'Marvel Rivals', color: '#F8D0D0'},
      {title: 'Rocket League', color: '#CFE5FF'},
      {title: 'Chess', color: '#D6F0D4'},
      {title: 'Fortnite', color: '#BCEFF5'},
      {title: 'Valorant', color: '#FF4655'},
      {title: 'Mario Kart', color: '#F2CF66'}
    ],
    linkify: true,
    moveChat: false,
    unsquish: true,
    colorMatches: true,
    bookmarks: [
      {name: 'Match dashboard', url: matchSite.origin},
      {name: 'Smash Helper', url: 'https://smashhelper.link'}
    ]
  };
  const normalize = text => String(text).normalize('NFKC').toLowerCase()
    .replace(/[™®]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  function safeURL(value) {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  }
  function clean(value = {}) {
    if (!value || typeof value !== 'object') value = {};
    return {
      games: Array.isArray(value.games) ? value.games.filter(g => g && typeof g.title === 'string' && normalize(g.title) && /^#[\da-f]{6}$/i.test(g.color)).map(g => ({title: g.title.trim(), color: g.color})) : structuredClone(defaults.games),
      bookmarks: Array.isArray(value.bookmarks) ? value.bookmarks.filter(b => b && typeof b.name === 'string' && b.name.trim() && safeURL(b.url)).map(b => ({name: bookmarkName(b), url: b.url})) : structuredClone(defaults.bookmarks),
      linkify: typeof value.linkify === 'boolean' ? value.linkify : true,
      moveChat: typeof value.moveChat === 'boolean' ? value.moveChat : false,
      unsquish: typeof value.unsquish === 'boolean' ? value.unsquish : true,
      colorMatches: typeof value.colorMatches === 'boolean' ? value.colorMatches : true
    };
  }
  async function load() { return clean((await chrome.storage.local.get('settings')).settings); }
  return {defaults, normalize, safeURL, clean, load};
})();
