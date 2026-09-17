# NSeSA Helper

An unofficial NSeSA extension with quality of life improvements for Esports matches and improving the usability of Fenworks.

![NSeSA Helper icon](icons/icon128.png)

NSeSA Helper is not affiliated with or endorsed by Fenworks or NSeSA. An existing Fenworks account with access to matches is needed to use the Dashboard and match features.

## Disclaimer

NSeSA Helper is provided as is, without warranty. Install and use it at your own risk. No support is provided, and continued compatibility or future updates are not guaranteed.

## Installation

### Option 1: Manual ZIP installation in Chrome/Chromium

1. Download **NSeSA-Helper-0.1.0.zip** from the [release page](https://github.com/czechitoot/nsesa-extension/releases/tag/v0.1.0).
2. Extract the ZIP somewhere permanent, such as Documents/Chrome Extensions. It contains an **nsesa-helper** folder.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked**, then select the **nsesa-helper** folder containing `manifest.json`.
5. Refresh any open Fenworks tabs.
6. Pin **NSeSA Helper** if desired. Click its icon for bookmark shortcuts and **Settings**.

Keep the extracted folder in place: Chrome loads the extension from it. No build step or additional software is required. School-managed browsers may require IT approval to install unpacked extensions.

### Option 2: Force-install on school-managed Chromebooks

This option requires a Google Admin administrator. Apply it to the intended student organizational unit or group, and test with a small group first. Students do not need Developer mode or a manual download.

1. Open **Devices → Chrome → Apps & extensions → Users & browsers** and select the intended students.
2. Click **+ → Add Chrome app or extension by ID** (not **Add by URL**).
3. Enter extension ID: `hipmfkchepandbeigagaddfonaooakei`.
4. Select **From a custom URL** and enter `https://smashhelper.link/extension/updates.xml`.
5. Set the installation policy to **Force install** and save. Users cannot disable or remove a force-installed extension.
6. After policy updates reach a test Chromebook, confirm NSeSA Helper appears at `chrome://extensions` and works on Fenworks.

The custom URL is an XML update manifest, not the ZIP or installation page. This self-hosted extension has a different ID from the Chrome Web Store version; a later move to that version requires changing the school's assignment.

### Option 3: Allow students to install from Smash Helper

This option is for school-managed Chromebooks whose administrator permits installation from the designated source. It is not a general installation method for unmanaged Chrome on Windows or macOS.

1. In Google Admin, add the extension by ID and custom URL using steps 1–4 above, then choose **Allow install**.
2. For the same students, find **App and extension install sources** in the app/extension settings and add these URL patterns, one per line:

   ```text
   https://smashhelper.link/extension
   https://smashhelper.link/extension/*
   ```

3. Ensure applicable policies permit external extensions and do not block this extension. Save the changes and allow them to reach the Chromebook.
4. Students visit [the NSeSA Helper installation page](https://smashhelper.link/extension), click **Install NSeSA Helper**, and accept Chrome's installation prompt.

Both the page starting the installation and the CRX download URL must be allowed. Students should not need to extract files or enable Developer mode. If the browser only downloads the file or blocks installation, the administrator should verify the effective policies at `chrome://policy`; do not bypass school restrictions.

Administrators should validate this optional-install flow on a managed test Chromebook before sharing it with students. The hosted page and download endpoints must be live before options 2 and 3 can be used.

Google documentation: [Custom extension deployment](https://developers.google.com/chromeos/app-development/learn/extensions#publishing_and_hosting), [app and extension policies](https://support.google.com/chrome/a/answer/9039146), and [allowed installation sources](https://chromeenterprise.google/policies/extension-install-sources/).

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

