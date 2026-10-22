# AGENTS.md

## Project summary and core loop
Say yes (eventually), pick your cozy Bay outings, then celebrate with confetti and see your itinerary.

## How to play / controls
Answer the invite to Victoria/Linh's Bay quest. Pressing No changes its text to more and more dramatic pleas, and the Yes button grows each time. Once you say Yes, pick the outings you want and press Let's go to see your itinerary.
Controls: Mouse click on buttons; ♪ button in the top-right toggles music.

## Important files
- `/index.html` — entry point: importmap, canvas/DOM shell, script bootstrap
- `/rosebud-game-defaults.css` — project file
- `/rosebud-game-defaults.js` — game module
- `/art_direction.md` — visual direction used for generated art
- `/sound_direction.md` — audio direction used for generated sound
- `/main.js` — game bootstrap and main loop

## Assets and audio
Images: `assets/bay-bg.webp`
Audio: `assets/audio/cozy-loop.mp3`, `assets/audio/yay-jingle.mp3`
Sound direction: - Gentle chiptune lofi loop, cozy and cute - SFX: soft pixel blip on click (procedural), happy jingle on choice
Playback note: reference media as `assets/...`; browsers start audio only after the first user gesture.

## Notes for future edits
DOM/CSS only. Edit NO_LINES and OUTINGS arrays in main.js to change text/options.

## Final validation status
Static: 0 blocking, 10 advisory; overall clean. Runtime behavior was not checked during generation.
Finished via the `finish` tool.
