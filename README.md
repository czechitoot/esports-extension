# NSeSA Helper 0.1.0

Unofficial NSeSA extension for improving the usability of Fenworks.

![NSeSA Helper icon](icons/icon128.png)

Vibe coded by Coach Ebbeka (David City) for NSeSA use.

## Install in Vivaldi or Chromium

1. Extract **NSeSA-Helper-0.1.0.zip** somewhere you will keep it, such as Documents/Vivaldi Extensions. The ZIP contains one folder: **nsesa-helper**.
2. Open `vivaldi://extensions` in Vivaldi, or `chrome://extensions` in Chrome/Chromium.
3. Enable **Developer mode**.
4. Click **Load unpacked**, then choose the **nsesa-helper** folder containing `manifest.json` (not the ZIP or its parent directory).
5. Disable the earlier Fenworks color extension/userscript to avoid competing changes, then refresh your open Fenworks tabs.
6. Pin **NSeSA Helper** if desired. Click its icon for bookmarks and **Settings**.

Keep the extracted folder in place. There is no build step, account, or additional dependency.

The Chromium loading steps follow the official guide:
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked

## Settings

**Narrow match layouts:** When the central team header has less than 560 pixels of room, Home and Away stack vertically so each team name gets the full width. Long names wrap. Wider headers retain the side-by-side layout. This responds to available space, including sidebars and browser zoom. The **Unsquish match details** checkbox controls this feature and starts ON.

**Color code matches by game on the Dashboard** also starts ON. Turn it off to restore original Dashboard and schedule colors without deleting your game entries. Existing saved preferences are preserved when replacing files in the same installed folder.

Click **Save settings** in the upper-right header after editing. Changes apply to open Fenworks tabs automatically. Settings are stored locally in this browser and persist across restarts. Deleting every game or bookmark is supported; deleted defaults do not reappear.

Game titles are substring matches against schedule season-link text, ignoring case, punctuation and trademark symbols. For example, “Super Smash Bros Ultimate” also matches “Super Smash Bros. Ultimate”. If Fenworks uses an abbreviated title, edit the match text to that abbreviation. The first matching entry wins.

| Default match text | Color |
| --- | --- |
| Super Smash Bros Ultimate | Light purple — #E6D5F7 |
| Marvel Rivals | Light red — #F8D0D0 |
| Rocket League | Light blue — #CFE5FF |
| Chess | Light green — #D6F0D4 |
| Fortnite | Light cyan-blue — #BCEFF5 |
| Valorant | Valorant-style red — #FF4655 |
| Mario Kart | Gold — #F2CF66 |

- **Create clickable links in chat** starts ON. Supports `http://`, `https://`, and `www.` links, including newly arriving messages. Existing links and message editors are left alone. Turning it off removes links created by the extension.
- **Move match chat below match details** starts OFF. On `/match/*`, it moves the existing chat wrapper after the details/rosters, preserving the original chat height. Hide/Show Chat stays in its original toolbar. Turning the option off restores the chat's original position. If the expected layout cannot be identified, the extension leaves it alone.
- **Bookmarks** start with Fenworks and Smash Helper. Names and full HTTP/HTTPS URLs are editable. All bookmarks and Settings open new tabs.

## Quick live test

1. On the dashboard/schedule, check all available games. Change a game's color, save, and confirm it updates. Delete an entry and confirm its row returns to the site's original color.
2. Open a full match chat containing a URL. Confirm it opens a new tab without opening the message options menu. Repeat in the pop-out/sidebar chat and with a newly arriving message.
3. Turn link creation off, save, and confirm the extension-created links become plain text. Turn it on again.
4. With a draft in the match message box, enable chat relocation and save. Check the draft, Send, Flag Match, and Hide/Show Chat controls. Disable relocation and verify restoration. Navigate to another match and back.
5. Add/edit/delete a game and a bookmark. Save and reopen Settings to confirm persistence. Check each popup shortcut.

## Permissions and privacy

- Manifest V3. The only API permission is `storage`.
- Content scripts run only on `https://app.fenworks.com/*`.
- No wildcard host permissions, remote scripts, analytics, or external requests made by the extension.
- Opening a bookmark does not grant the extension access to that website.
- Icons at 16, 32, 48 and 128 pixels use a thick blue N with a white headset and large ear cups, designed for toolbar readability. The editable icon source is `icons/icon-source.svg`.

## Validation and limits

Manifest JSON, referenced resources, all JavaScript syntax and icon dimensions passed validation. Browser tests in Chrome 152 passed 28 checks covering colors, matching, safe chat links, dynamic sidebar-like markup, toggles, relocation/restoration using the supplied match HTML, preserved draft and form handler, settings editing and popup navigation. Extension APIs were mocked for those browser tests.

This release is distributed as an unpacked extension, not through a browser store. The author has reported that it works in live use; the checklist above is useful for testing your own account and layout. The sidebar screenshot was available, but its HTML was not: link creation uses shared chat/message hooks. If Fenworks changes its markup, selectors may need adjustment. No live messages were sent during testing.

After replacing extension files, click **Reload** on the extensions page and refresh Fenworks tabs. Saving preferences alone does not require reloading the extension.

## Source and privacy review

See [PRIVACY.md](PRIVACY.md) for the exact scope of access, stored data, network behavior, and a map of the source files. No build step is needed: the browser runs the readable JavaScript in this repository directly.
