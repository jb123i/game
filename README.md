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
- Each eraser pass uses one stroke on the drawing paper and in the skill tree.
- With active Endurance, players may use multiple energy-consuming strokes on the same line or circle, and finish early to conserve energy. Partial shapes resume after reload.

## iPad mini 2 / iOS 12 offline play

1. Open [Learn to Draw](https://learn-to-draw.jb123i.workers.dev/) in a regular Safari tab while connected to Wi-Fi. You can bookmark that address in Safari.
2. Wait for **Ready offline** in the header. The page checks that its service worker can read the saved game files and that this Safari session can write progress.
3. Quit Safari, enable Airplane Mode, and make sure Wi-Fi is off. Reopen Safari and load the same tab or bookmark.
4. Draw a stroke by touch. Quit and reopen Safari again to check that the drawing and progress are still there.

If the badge says **Offline not ready**, reconnect to Wi-Fi and reload from the same tab. Safari stores saves and game files on the device. Clearing website data can remove both.

When releasing a new offline build, set the same new build ID in the `ltd-build` meta tag in `index.html` and in `sw.js`. The worker installs only after caching the matching game. Existing saves stay in the site's local storage.

## Sketchbook specialization chapters

After purchasing Shape Composer, players can choose **Living Ink ($12)** or **Perspective Lab ($12)**. The choice is earned by completing at least three different drawing study types at 80% accuracy or better *after* acquiring Composer; repeating one study does not count.

- **Living Ink:** Sketch ramps or outlines of circles, squares, triangles and balloons, then release the drawings into a lightweight 2D physics scene. Objects fall, roll, collide, and balloons rise; nearby drawn balloons can pull a drawn square upward. Three one-time ball-delivery challenges reward additional in-game currency.
- **Perspective Lab:** Draw four depth lines per challenge toward one-point or two-point vanishing guides. Each edge must reach 70% accuracy. Three one-time challenges teach receding edges and reward in-game currency.
- **Chapter 1** allows one specialization. Completing three challenges in that chosen workshop opens **Chapter 2**, allowing the other branch to be bought. Ownership, trials, completed challenges, and chapter progress are saved alongside the existing game state.
- Both workshops are part of the self-contained `index.html` and include a pre-Pointer-Events touch fallback for iPad mini 2. Workshop sketches are reset when you leave the activity; challenge milestones and the rest of the sketchbook are preserved.
