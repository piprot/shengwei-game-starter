const ABILITY_IDS = [
  "insight",
  "deploy",
  "mobilize",
  "strategy",
  "authority",
  "stability",
  "recovery",
  "execution",
  "structure",
  "communication"
];

const RESOURCE_IDS = ["energy", "trust", "influence", "capital"];
const VALID_ROLES = new Set(["parachute", "founder", "highPotential"]);

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateSave(save) {
  if (!isObject(save)) return "save must be an object";
  if (typeof save.version !== "number") return "save.version must be a number";
  if (typeof save.profileCreated !== "boolean") {
    return "save.profileCreated must be a boolean";
  }
  const profile = save.profile;
  if (!isObject(profile)) return "save.profile must be an object";
  if (typeof profile.name !== "string" || !profile.name.trim()) {
    return "save.profile.name must be a non-empty string";
  }
  if (!VALID_ROLES.has(profile.role)) return "save.profile.role is invalid";
  if (!isObject(profile.abilities)) {
    return "save.profile.abilities must be an object";
  }
  for (const id of ABILITY_IDS) {
    if (!isFiniteNumber(profile.abilities[id])) {
      return `save.profile.abilities.${id} must be a non-negative number`;
    }
  }
  if (!isObject(profile.resources)) {
    return "save.profile.resources must be an object";
  }
  for (const id of RESOURCE_IDS) {
    if (!isFiniteNumber(profile.resources[id])) {
      return `save.profile.resources.${id} must be a non-negative number`;
    }
  }
  for (const key of [
    "chapterRecords",
    "unlockedChapters",
    "completedSideQuests",
    "achievements",
    "decisionHistory",
    "duelHistory",
    "claimedChallenges",
    "completedRandomEvents",
    "completedBranchNodes"
  ]) {
    if (!Array.isArray(save[key])) return `save.${key} must be an array`;
  }
  for (const key of [
    "duelWins",
    "duelLosses",
    "playCount",
    "masteryPoints",
    "assessmentScore"
  ]) {
    if (!isFiniteNumber(save[key])) {
      return `save.${key} must be a non-negative number`;
    }
  }
  if (typeof save.highPressureMode !== "boolean") {
    return "save.highPressureMode must be a boolean";
  }
  if (
    save.lastSavedAt !== undefined &&
    !isFiniteNumber(save.lastSavedAt)
  ) {
    return "save.lastSavedAt must be a non-negative number";
  }
  if (save.saveHash !== undefined && typeof save.saveHash !== "string") {
    return "save.saveHash must be a string";
  }
  if (
    !save.unlockedChapters.every(
      (item) => typeof item === "number" && Number.isInteger(item) && item > 0
    )
  ) {
    return "save.unlockedChapters must contain positive integers";
  }
  return null;
}

export function cleanSave(save) {
  const error = validateSave(save);
  if (error) return null;
  try {
    return JSON.stringify(save).length > 256 * 1024 ? null : save;
  } catch {
    return null;
  }
}

export function serverAbilityScore(save) {
  const abilities = save?.profile?.abilities || {};
  return Object.values(abilities).reduce(
    (sum, value) => sum + abilityLevel(Number(value || 0)),
    0
  );
}

function abilityLevel(exp) {
  const thresholds = [0, 4, 10, 18, 28, 40];
  let level = 1;
  for (const threshold of thresholds.slice(1)) {
    if (exp >= threshold) level += 1;
    else break;
  }
  return Math.min(6, level);
}
