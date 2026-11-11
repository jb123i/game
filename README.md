# Learn to Draw

Incremental drawing game played in the browser. Draw lines and circles for in-game rewards, then trace skill-tree upgrades using one or several strokes.

**Play:** https://learn-to-draw.jb123i.workers.dev/

The game's self-contained source is in `index.html`, and progress saves locally. The latest update adds an adjustable pencil eraser (8–64 px), unlocked by a $2.50 upgrade after the Pencil Eraser. The grid and other drawing guides are unaffected by erasing.

## Contextual upgrade details

The Selected upgrade panel stays hidden until you hover, focus, or tap a skill-tree node. Click or tap to keep it open, and dismiss it with the close control or by clicking blank space. Trace and Erase tools remain visible independently of the panel.

## November 2026 gameplay update

- Grid Paper paints its graph immediately after purchase.
- Every accuracy point pays $0.01 in line and circle studies.
- Skill-tree Erase stays hidden until Pencil Eraser is purchased.
- With active Endurance, players may use multiple energy-consuming strokes on the same line or circle, and finish early to conserve energy. Partial shapes resume after reload.

## iPad mini 2 / iOS 12 offline play

LtD is designed to run on iPad mini 2's final Safari (iOS 12.5.x) as well as newer browsers. It includes a touch-event fallback for pre-Pointer-Events Safari, uses older-compatible JavaScript syntax, and caches the game for offline launching.

1. Connect the iPad to Wi-Fi and open https://learn-to-draw.jb123i.workers.dev/ **directly in Safari**.
2. In Safari's Share sheet, horizontally swipe through the lower action row to find **Add to Home Screen**. Tap **Add**. (The iOS 12 interface does not show a modern **Open as Web App** toggle.)
3. Open **Learn to Draw** using the new Home Screen icon **while still online**. Wait for **Ready offline** in the header.
4. Turn on Airplane Mode, ensure Wi-Fi is disabled, fully close the Home Screen app, and relaunch it. Complete a practice stroke and confirm progress persists after closing/reopening.

Notes:
- iOS 12 can maintain separate service-worker caches and local game saves for Safari and the Home Screen app. Launching the Home Screen version online once lets it fill **its own** offline cache.
- Safari's storage on the iPad does not synchronize with browser storage on a desktop computer.
- Avoid deleting the Home Screen app or clearing its website data while traveling; these can remove offline game files and saved progress.
- Real iPad mini 2 device testing is still required. A **Ready offline** indicator and successful Airplane Mode relaunch are the best on-device checks.
