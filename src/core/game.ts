import {
  ABILITIES,
  ABILITY_ORDER,
  ROLES,
  abilityLevel,
  createDefaultAbilities,
  rankForTotal,
  totalAbilityLevels
} from "./abilities";
import { getNode } from "./story";
import type {
  AbilityId,
  ChoiceOutcome,
  DecisionRecord,
  DuelHistoryEntry,
  OptionQuality,
  PlayerProfile,
  ResourceKey,
  RoleId,
  SaveState,
  StoryOption
} from "./types";

const SAVE_KEY = "adaptive-ascent-save-v1";

export const DEFAULT_SAVE: SaveState = {
  version: 1,
  profileCreated: false,
  profile: {
    name: "你",
    role: "highPotential",
    abilities: createDefaultAbilities(),
    resources: { energy: 75, trust: 60, influence: 40, capital: 45 }
  },
  chapterRecords: [],
  unlockedChapters: [1],
  completedSideQuests: [],
  achievements: [],
  duelWins: 0,
  duelLosses: 0,
  playCount: 0,
  masteryPoints: 0,
  decisionHistory: [],
  duelHistory: [],
  claimedChallenges: []
};

export function createProfile(name: string, role: RoleId): PlayerProfile {
  const roleDef = ROLES[role];
  const abilities = createDefaultAbilities();
  for (const [id, exp] of Object.entries(roleDef.startingAbilities) as Array<
    [AbilityId, number]
  >) {
    abilities[id] = exp;
  }
  return {
    name: name.trim() || "你",
    role,
    abilities,
    resources: { ...roleDef.startingResources }
  };
}

export function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return structuredClone(DEFAULT_SAVE);
    }
    const parsed = JSON.parse(raw) as SaveState;
    if (parsed.version !== DEFAULT_SAVE.version) {
      return structuredClone(DEFAULT_SAVE);
    }
    return normalizeSave(parsed);
  } catch {
    return structuredClone(DEFAULT_SAVE);
  }
}

function normalizeSave(save: SaveState): SaveState {
  const profile = save.profile;
  const abilities = createDefaultAbilities();
  for (const id of ABILITY_ORDER) {
    abilities[id] = Math.max(0, Number(profile.abilities[id]) || 0);
  }
  const resources: PlayerProfile["resources"] = {
    energy: clamp(Number(profile.resources.energy) || 75, 0, 100),
    trust: clamp(Number(profile.resources.trust) || 60, 0, 100),
    influence: clamp(Number(profile.resources.influence) || 40, 0, 100),
    capital: clamp(Number(profile.resources.capital) || 45, 0, 100)
  };
  return {
    version: DEFAULT_SAVE.version,
    profileCreated: Boolean(save.profileCreated),
    profile: {
      name: profile.name || "你",
      role: profile.role,
      abilities,
      resources
    },
    chapterRecords: Array.isArray(save.chapterRecords) ? save.chapterRecords : [],
    unlockedChapters: Array.isArray(save.unlockedChapters)
      ? save.unlockedChapters
      : [1],
    completedSideQuests: Array.isArray(save.completedSideQuests)
      ? save.completedSideQuests
      : [],
    achievements: Array.isArray(save.achievements) ? save.achievements : [],
    duelWins: Number(save.duelWins) || 0,
    duelLosses: Number(save.duelLosses) || 0,
    playCount: Number(save.playCount) || 0,
    masteryPoints: Number(save.masteryPoints) || 0,
    decisionHistory: Array.isArray(save.decisionHistory)
      ? save.decisionHistory
      : [],
    duelHistory: Array.isArray(save.duelHistory) ? save.duelHistory : [],
    claimedChallenges: Array.isArray(save.claimedChallenges)
      ? save.claimedChallenges
      : []
  };
}

export function saveState(save: SaveState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function resetSave(): SaveState {
  const fresh = structuredClone(DEFAULT_SAVE);
  saveState(fresh);
  return fresh;
}

export function importSaveJson(text: string): SaveState {
  const parsed = JSON.parse(text) as SaveState;
  if (parsed.version !== DEFAULT_SAVE.version) {
    throw new Error("存档版本不匹配，无法导入");
  }
  const save = normalizeSave(parsed);
  saveState(save);
  return save;
}

export function activateProfile(save: SaveState, profile: PlayerProfile): void {
  save.profile = profile;
  save.profileCreated = true;
  saveState(save);
}

export function applyStoryChoice(
  save: SaveState,
  nodeId: string,
  optionIndex: number
): ChoiceOutcome {
  const node = getNode(nodeId);
  const option = node.options[optionIndex];
  const outcome = buildOutcome(save, option, optionIndex);

  const decisionRecord: DecisionRecord = {
    nodeId,
    optionIndex,
    quality: option.quality,
    qualityScore: outcome.qualityScore,
    chapterId: node.chapterId
  };
  save.decisionHistory.push(decisionRecord);

  for (const [abilityId, gained] of Object.entries(option.effects) as Array<
    [AbilityId, number]
  >) {
    save.profile.abilities[abilityId] += gained;
  }
  for (const [resource, delta] of Object.entries(option.resources) as Array<
    [ResourceKey, number]
  >) {
    save.profile.resources[resource] = clamp(
      save.profile.resources[resource] + delta,
      0,
      100
    );
  }

  save.playCount += 1;
  if (node.kind === "side") {
    if (!save.completedSideQuests.includes(nodeId)) {
      save.completedSideQuests.push(nodeId);
      save.masteryPoints += 5;
    }
  } else {
    const record =
      save.chapterRecords.find((item) => item.chapterId === node.chapterId) ??
      {
        chapterId: node.chapterId,
        completedNodeIds: [],
        stars: 0
      };
    if (!record.completedNodeIds.includes(nodeId)) {
      record.completedNodeIds.push(nodeId);
      record.stars += outcome.qualityScore;
    }
    if (!save.chapterRecords.some((item) => item.chapterId === node.chapterId)) {
      save.chapterRecords.push(record);
    }
    if (record.completedNodeIds.length >= 2) {
      save.masteryPoints += 10;
      save.achievements.push(`chapter_${node.chapterId}`);
      const nextChapter = node.chapterId + 1;
      if (nextChapter <= 9 && !save.unlockedChapters.includes(nextChapter)) {
        save.unlockedChapters.push(nextChapter);
      }
    }
  }

  save.achievements = [...new Set(save.achievements)];
  saveState(save);
  return outcome;
}

function buildOutcome(
  save: SaveState,
  option: StoryOption,
  optionIndex: number
): ChoiceOutcome {
  const gainedAbilityIds = (Object.entries(option.effects) as Array<
    [AbilityId, number]
  >)
    .filter(([, gained]) => gained > 0)
    .map(([id]) => id);
  return {
    option,
    optionIndex,
    gainedAbilityIds,
    resourceDeltas: option.resources,
    qualityScore: scoreQuality(option.quality, save.profile)
  };
}

export function scoreQuality(
  quality: OptionQuality,
  profile: PlayerProfile,
  abilityBonus = 0
): number {
  const base = quality === "expert" ? 100 : quality === "partial" ? 55 : 20;
  const best = bestAbilityLevel(profile) + abilityBonus;
  const roleFocus = ROLES[profile.role].focusAbilities;
  const roleBest = Math.max(
    ...roleFocus.map((id) => abilityLevel(profile.abilities[id]))
  );
  return Math.round(base + Math.min(30, best * 3) + Math.min(12, roleBest * 2));
}

function bestAbilityLevel(profile: PlayerProfile): number {
  return Math.max(...ABILITY_ORDER.map((id) => abilityLevel(profile.abilities[id])));
}

export function chapterStarCount(stars: number): number {
  if (stars >= 220) return 3;
  if (stars >= 160) return 2;
  if (stars >= 80) return 1;
  return 0;
}

export function isChapterComplete(save: SaveState, chapterId: number): boolean {
  const record = save.chapterRecords.find((item) => item.chapterId === chapterId);
  return Boolean(record && record.completedNodeIds.length >= 2);
}

export function isNodeComplete(save: SaveState, nodeId: string): boolean {
  const node = getNode(nodeId);
  if (node.kind === "side") {
    return save.completedSideQuests.includes(nodeId);
  }
  return Boolean(
    save.chapterRecords
      .find((record) => record.chapterId === node.chapterId)
      ?.completedNodeIds.includes(nodeId)
  );
}

export function profileSummary(save: SaveState) {
  const total = totalAbilityLevels(save.profile.abilities);
  const rank = rankForTotal(total);
  const chapterCount = save.chapterRecords.filter((record) =>
    isChapterComplete(save, record.chapterId)
  ).length;
  return {
    total,
    rank,
    chapterCount,
    abilityCount: ABILITY_ORDER.filter(
      (id) => abilityLevel(save.profile.abilities[id]) >= 2
    ).length
  };
}

export function recordDuelResult(
  save: SaveState,
  won: boolean,
  humanIsPlayerOne: boolean,
  scoreDelta: number,
  opponentName: string,
  playerScore: number,
  opponentScore: number
): SaveState {
  if (won) {
    save.duelWins += 1;
    save.masteryPoints += Math.max(1, Math.floor(scoreDelta / 25));
  } else {
    save.duelLosses += 1;
    save.masteryPoints += 1;
  }
  if (humanIsPlayerOne) {
    save.profile.resources.energy = clamp(
      save.profile.resources.energy + (won ? 5 : -5),
      0,
      100
    );
    save.profile.resources.influence = clamp(
      save.profile.resources.influence + (won ? 8 : -3),
      0,
      100
    );
  }
  save.achievements.push("first_duel");
  save.achievements = [...new Set(save.achievements)];
  save.duelHistory.push({
    opponentName,
    playerScore,
    opponentScore,
    won,
    timestamp: Date.now()
  });
  saveState(save);
  return save;
}

export function decisionProfile(save: SaveState): {
  identity: string;
  counts: { expert: number; partial: number; risk: number };
  totalScore: number;
} {
  const counts = { expert: 0, partial: 0, risk: 0 };
  let totalScore = 0;
  for (const record of save.decisionHistory) {
    counts[record.quality] += 1;
    totalScore += record.qualityScore;
  }
  const total = Math.max(1, save.decisionHistory.length);
  const expertRatio = counts.expert / total;
  const partialRatio = counts.partial / total;
  const riskRatio = counts.risk / total;
  let identity = "平衡型领导者";
  if (save.decisionHistory.length < 3) {
    identity = "观察期决策者";
  } else if (expertRatio >= 0.7) {
    identity = "精准决策者";
  } else if (riskRatio >= 0.35) {
    identity = "高压破局者";
  } else if (partialRatio >= 0.6) {
    identity = "渐进探索者";
  }
  return { identity, counts, totalScore };
}

export function buildDuelProfile(
  profile: PlayerProfile,
  name?: string,
  color = "#41c7c0"
) {
  return {
    name: name || profile.name,
    role: profile.role,
    abilities: { ...profile.abilities },
    resources: { ...profile.resources },
    color,
    isHuman: true
  };
}

export function buildAiProfile(role: RoleId, strength: number) {
  const base = createDefaultAbilities();
  for (const id of ABILITY_ORDER) {
    base[id] = Math.floor((Math.random() * 6 + strength * 3 + 4) % 24);
  }
  const roleDef = ROLES[role];
  for (const [id, exp] of Object.entries(roleDef.startingAbilities) as Array<
    [AbilityId, number]
  >) {
    base[id] += exp + strength;
  }
  return {
    name: roleDef.shortName + "陪练",
    role,
    abilities: base,
    resources: { energy: 75, trust: 45, influence: 50, capital: 40 },
    color: "#e9826c",
    isHuman: false
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function abilityLabel(id: AbilityId): string {
  return ABILITIES[id].name;
}

export function optionQualityLabel(quality: OptionQuality): string {
  if (quality === "expert") return "专家级应对";
  if (quality === "partial") return "部分有效";
  return "高风险应对";
}
