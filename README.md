# NSeSA Helper

Unofficial NSeSA extension for improving the usability of Fenworks.

![NSeSA Helper icon](icons/icon128.png)

NSeSA Helper is not affiliated with or endorsed by Fenworks or NSeSA. An existing Fenworks account with access to matches is needed to use the Dashboard and match features.

## Install in Chrome/Chromium

1. Download **NSeSA-Helper-0.1.0.zip** from the [release page](https://github.com/czechitoot/nsesa-extension/releases/tag/v0.1.0).
2. Extract the ZIP somewhere permanent, such as Documents/Chrome Extensions. It contains an **nsesa-helper** folder.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked**, then select the **nsesa-helper** folder containing `manifest.json`.
5. Refresh any open Fenworks tabs.
6. Pin **NSeSA Helper** if desired. Click its icon for bookmark shortcuts and **Settings**.

Keep the extracted folder in place: Chrome loads the extension from it. No build step or additional software is required. School-managed browsers may require IT approval to install unpacked extensions.

## Settings

Open **Settings** from the extension menu. Click **Save settings** in the upper-right corner after editing. Changes apply automatically to open Fenworks tabs, and preferences stay saved locally in your browser.

- **Create clickable links in chat — on by default.** Makes web addresses clickable in full match chat and the chat sidebar, including newly received messages without refreshing. Links open in a new tab.
- **Move match chat below match details — off by default.** Moves the existing full match chat below the details and rosters while keeping its message box and controls. Turning it off restores the original position.
- **Unsquish match details — on by default.** Stacks Home and Away vertically when the match details panel is narrow, giving team names more room.
- **Color code matches by game on the Dashboard — on by default.** Applies your game colors to Dashboard and schedule rows. Turning it off restores the site's original colors without deleting your game entries.
- **Games.** Add, edit, or delete game titles and colors. Titles match part of the game text, ignoring case and punctuation; the first matching entry wins.
- **Bookmarks.** Add, edit, or delete shortcut names and web addresses. Fenworks and Smash Helper are included by default. Shortcuts open in new tabs.

## Updating a manual installation

Replace the files in your existing extension folder with the new release, click **Reload** on `chrome://extensions`, and refresh your Fenworks tabs. Updating the same installation preserves your saved preferences.

## Permissions and privacy

- Page access is limited to `https://app.fenworks.com/*`.
- Chat text and match information are processed locally to provide the page enhancements; they are not saved or sent to the developer.
- The only extension API permission is `storage`, used to save preferences locally.
- There is no advertising, analytics, tracking, or remotely loaded code.
- Opening a bookmark or chat link does not grant the extension access to the destination website.

See [PRIVACY.md](PRIVACY.md) for details about data handling and a guide to the source files. The browser runs the readable JavaScript in this repository directly.

## Support

If something stops working, [open an issue](https://github.com/czechitoot/nsesa-extension/issues) describing the problem. Fenworks layout changes may require an extension update. Avoid including private chat messages or account details.

