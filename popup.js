'use strict';
document.getElementById('settings').addEventListener('click', () => {
  chrome.tabs.create({url: chrome.runtime.getURL('options.html')}).catch(showError);
});
function showError(error) { document.getElementById('status').textContent = 'Could not open: ' + error.message; }
globalThis.NSeSA.load().then(settings => {
  const nav = document.getElementById('bookmarks');
  for (const bookmark of settings.bookmarks) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = bookmark.name; button.title = bookmark.url;
    button.addEventListener('click', () => chrome.tabs.create({url: bookmark.url}).catch(showError)); nav.append(button);
  }
  if (!settings.bookmarks.length) { const p = document.createElement('p'); p.textContent = 'Add shortcuts in Settings.'; nav.append(p); }
}).catch(showError);
