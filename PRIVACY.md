# Permissions and privacy

NSeSA Helper is an unofficial extension for improving the usability of Fenworks.

## What it can access

The content script runs only on `https://app.fenworks.com/*`. On those pages it can read and change the page content, including displayed match information and chat messages. It uses this access to color schedule rows, turn URL text into links, and rearrange the match layout.

The manifest does not request access to other websites, browser history, cookies, downloads, or the clipboard. Opening a bookmark does not grant access to its destination.

## What it stores

`chrome.storage.local` stores game match text and colors, bookmark names and URLs, and feature toggle preferences. Settings stay in the local browser profile. The extension does not save chat messages or match details. Removing the extension removes its local settings.

## Network activity

The extension has no analytics, tracking, external scripts, or server. Its source contains no network request code. Clicking a bookmark or chat link opens its destination as a normal browser tab; that website then handles the visit under its own policies.

## Review the source

- `manifest.json`: permissions, site scope, and files the browser loads.
- `content.js` and `content.css`: page changes and chat link creation.
- `settings.js`: defaults, validation, and local storage reads.
- `options.html`, `options.js`, `ui.css`: settings interface and saving preferences.
- `popup.html`, `popup.js`: bookmark buttons and opening the settings tab.
- `icons/icon-source.svg`: editable source for the icon.

There is no bundler, obfuscated code, runtime dependency, or remote code to inspect elsewhere. The shipped JavaScript is the source the browser executes. Public source allows independent review; it is not a security audit or endorsement by Fenworks.
