# Neon Chase

Phaser 3 + Vite + TypeScript browser game starter.

[![CI](https://github.com/piprot/shengwei-game-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/piprot/shengwei-game-starter/actions/workflows/ci.yml)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Controls

- Move: Arrow keys / WASD
- Touch: Hold and drag
- Pause: P
- Mute: M
- Restart: R
- Help: H

## Structure

- `src/main.ts`: Phaser game entry
- `src/config.ts`: game canvas config
- `src/scenes/BootScene.ts`: boot scene
- `src/scenes/GameScene.ts`: main gameplay scene
- `.github/workflows/ci.yml`: build CI

## Gameplay

Collect gems, build combos, avoid chasing enemies, and survive increasing waves.
