'use strict';
const api = globalThis.NSeSA;
const status = document.getElementById('status');
const form = document.getElementById('settings-form');
function field(labelText, type, value) {
  const label = document.createElement('label'); label.textContent = labelText;
  const input = document.createElement('input'); input.type = type; input.value = value; input.required = true;
  label.append(input); return {label, input};
}
function addRow(kind, value = {}) {
  const row = document.createElement('div'); row.className = 'edit-row ' + kind;
  const first = field(kind === 'games' ? 'Game title / match text' : 'Display name', 'text', value.title ?? value.name ?? '');
  const second = field(kind === 'games' ? 'Color' : 'URL', kind === 'games' ? 'color' : 'url', value.color ?? value.url ?? (kind === 'games' ? '#D6E7F5' : ''));
  first.input.maxLength = 200;
  second.input.addEventListener('input', () => second.input.setCustomValidity(''));
  const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Delete'; remove.className = 'delete';
  remove.setAttribute('aria-label', 'Delete ' + (value.title || value.name || (kind === 'games' ? 'game' : 'bookmark')));
  remove.addEventListener('click', () => { row.remove(); status.textContent = 'Unsaved changes'; });
  row.append(first.label, second.label, remove); document.getElementById(kind).append(row);
  return first.input;
}
for (const [button, kind] of [['add-game', 'games'], ['add-bookmark', 'bookmarks']]) {
  document.getElementById(button).addEventListener('click', () => { addRow(kind).focus(); status.textContent = 'Unsaved changes'; });
}
form.addEventListener('input', () => { status.textContent = 'Unsaved changes'; });
form.addEventListener('submit', async event => {
  event.preventDefault();
  const games = [], bookmarks = [];
  for (const row of document.querySelectorAll('#games .edit-row')) {
    const [title, color] = row.querySelectorAll('input');
    if (!api.normalize(title.value)) { title.setCustomValidity('Enter a game title containing letters or numbers.'); title.reportValidity(); title.addEventListener('input', () => title.setCustomValidity(''), {once: true}); return; }
    games.push({title: title.value.trim(), color: color.value});
  }
  for (const row of document.querySelectorAll('#bookmarks .edit-row')) {
    const [name, url] = row.querySelectorAll('input');
    if (!name.value.trim()) { name.setCustomValidity('Enter a display name.'); name.reportValidity(); name.addEventListener('input', () => name.setCustomValidity(''), {once: true}); return; }
    if (!api.safeURL(url.value)) { url.setCustomValidity('Use a complete https:// or http:// URL.'); url.reportValidity(); return; }
    bookmarks.push({name: name.value.trim(), url: url.value.trim()});
  }
  const save = document.getElementById('save-settings'); save.disabled = true;
  try {
    await chrome.storage.local.set({settings: {games, bookmarks, linkify: document.getElementById('linkify').checked, moveChat: document.getElementById('moveChat').checked, unsquish: document.getElementById('unsquish').checked, colorMatches: document.getElementById('colorMatches').checked}});
    status.textContent = 'Saved. Open Fenworks tabs update automatically.';
  } catch (error) { status.textContent = 'Could not save: ' + error.message; }
  finally { save.disabled = false; }
});
api.load().then(settings => {
  settings.games.forEach(value => addRow('games', value)); settings.bookmarks.forEach(value => addRow('bookmarks', value));
  document.getElementById('linkify').checked = settings.linkify; document.getElementById('moveChat').checked = settings.moveChat;
  document.getElementById('unsquish').checked = settings.unsquish; document.getElementById('colorMatches').checked = settings.colorMatches;
  document.getElementById('controls').disabled = false;
  document.getElementById('save-settings').disabled = false;
}).catch(error => { document.getElementById('load-error').textContent = 'Could not load settings. Reopen this page. ' + error.message; });
