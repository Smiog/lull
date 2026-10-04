# Lull

> A silent pomodoro — forget the hour, mind your work.

A menu-bar pomodoro that **hides the timer while you focus**. Start, work until you're tired, then stop — if you've focused 25+ minutes, you earn a proportional break. No countdown to watch.

## Features

- **Invisible timer during focus** — nothing to stare at
- **25-minute minimum** to earn a break; force-break available
- **5:1 break ratio** — 25m focus → 5m break
- **Break-end notification** with a chime
- **Tray-only** — menu bar resident, no Dock icon
- **Display stays awake** during focus
- **Close hides, doesn't quit** — timer keeps running

## How it works

`idle → focus → break → idle`, with a `warn` detour if you stop before 25m: you can keep focusing or force a break. The timer runs during focus but is never shown; it only appears as the break countdown.

## Getting started

```bash
npm install
npm start
```

## Tech stack

Electron + vanilla HTML/CSS/JS. No framework, no build step.

## Project structure

```
src/
├─ main.js       main process
├─ preload.js    context bridge
├─ renderer.js   state machine + UI
├─ index.html    page skeleton
└─ style.css     styles
assets/
├─ icon.png      tray icon (1x)
└─ icon@2x.png   tray icon (2x)
```

## License

[MIT](./LICENSE)
