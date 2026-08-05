const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const aspect = viewportWidth / viewportHeight;
const isPortrait = aspect < 1;

export const GAME_WIDTH = isPortrait
  ? Math.max(320, Math.min(540, Math.round(960 * aspect)))
  : 960;

export const GAME_HEIGHT = isPortrait
  ? 960
  : Math.max(320, Math.min(540, Math.round(960 / aspect)));
