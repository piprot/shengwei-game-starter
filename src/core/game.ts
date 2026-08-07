import {
  ABILITIES,
  ABILITY_ORDER,
  ROLES,
  abilityLevel,
  createDefaultAbilities,
  rankForTotal,
  totalAbilityLevels
} from "./abilities.ts";
import { getNode } from "./story.ts";
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
} from "./types.ts";

const SAVE_KEY = "adaptive-ascent-save-v1";

/** 难度档位对应的资源缩放系数（负面 delta 放大、正面 delta 收窄）。 */
export const PRESSURE_FACTORS: Record<
  "normal" | "pressure" | "extreme",
  { neg: number; pos: number }
> = {
  normal: { neg: 1, pos: 1 },
  pressure: { neg: 1.4, pos: 0.7 },
  extreme: { neg: 1.8, pos: 0.5 }
};

/** 各难度档位的每回合决策时限（毫秒）。标准档不计时（返回 0）。 */
export function roundDurationMsForDifficulty(
  difficulty: "normal" | "pressure" | "extreme"
): number {
  if (difficulty === "pressure") return 22000;
  if (difficulty === "extreme") return 14000;
  return 0;
}

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
  claimedChallenges: [],
  claimedDaily: {},
  assessmentScore: 0,
  completedRandomEvents: [],
  completedBranchNodes: [],
  completedTraining: [],
  trainingScores: {},
  trialEnergy: 100,
  trialCleared: [],
  trialItems: [],
  completedPracticeTasks: [],
  trialStreak: 0,
  lastTrialEnergyDate: "",
  trialAccelerator: false,
  trialOpenAnswers: {},
  hiddenRoutes: [],
  alternateEndings: [],
  highPressureMode: false,
  difficulty: "normal"
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
      return migrateSave(parsed);
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
      : [],
    claimedDaily:
      save.claimedDaily && typeof save.claimedDaily === "object"
        ? save.claimedDaily
        : {},
    assessmentScore: Number(save.assessmentScore) || 0,
    completedRandomEvents: Array.isArray(save.completedRandomEvents)
      ? save.completedRandomEvents
      : [],
    completedBranchNodes: Array.isArray(save.completedBranchNodes)
      ? save.completedBranchNodes
      : [],
    completedTraining: Array.isArray(save.completedTraining)
      ? save.completedTraining
      : [],
    trainingScores:
      save.trainingScores && typeof save.trainingScores === "object"
        ? { ...save.trainingScores }
        : {},
    trialEnergy: clamp(Number(save.trialEnergy) || 100, 0, 100),
    trialCleared: Array.isArray(save.trialCleared) ? save.trialCleared : [],
    trialItems: Array.isArray(save.trialItems) ? save.trialItems : [],
    completedPracticeTasks: Array.isArray(save.completedPracticeTasks)
      ? save.completedPracticeTasks
      : [],
    trialStreak: Math.max(0, Number(save.trialStreak) || 0),
    lastTrialEnergyDate:
      typeof save.lastTrialEnergyDate === "string"
        ? save.lastTrialEnergyDate
        : "",
    trialAccelerator: Boolean(save.trialAccelerator),
    trialOpenAnswers:
      save.trialOpenAnswers && typeof save.trialOpenAnswers === "object"
        ? { ...save.trialOpenAnswers }
        : {},
    hiddenRoutes: Array.isArray(save.hiddenRoutes)
      ? save.hiddenRoutes
      : [],
    alternateEndings: Array.isArray(save.alternateEndings)
      ? save.alternateEndings
      : [],
    highPressureMode: Boolean(save.highPressureMode),
    difficulty:
      save.difficulty === "pressure" || save.difficulty === "extreme"
        ? save.difficulty
        : "normal"
  };
}

/**
 * 计算存档核心进度的内容哈希（确定性）。
 * 刻意排除 lastSavedAt / saveHash 本身，避免每次保存都改变哈希。
 */
export function computeSaveHash(save: SaveState): string {
  const projection = {
    v: save.version,
    p: save.profile,
    cr: save.chapterRecords,
    uc: save.unlockedChapters,
    csq: save.completedSideQuests,
    ach: save.achievements,
    dw: save.duelWins,
    dl: save.duelLosses,
    pc: save.playCount,
    mp: save.masteryPoints,
    dh: (save.decisionHistory ?? []).map((d) => [d.nodeId, d.optionIndex, d.qualityScore]),
    duh: (save.duelHistory ?? []).length,
    cc: save.claimedChallenges,
    cd: save.claimedDaily,
    as: save.assessmentScore,
    cre: save.completedRandomEvents,
    cbn: save.completedBranchNodes,
    ct: save.completedTraining,
    ts: save.trainingScores ?? {},
    trial: [
      save.trialEnergy,
      save.trialCleared,
      save.trialItems,
      save.completedPracticeTasks,
      save.trialStreak,
      save.lastTrialEnergyDate,
      save.trialAccelerator,
      save.trialOpenAnswers,
      save.hiddenRoutes,
      save.alternateEndings
    ],
    diff: save.difficulty
  };
  const json = JSON.stringify(projection);
  let hash = 5381;
  for (let i = 0; i < json.length; i += 1) {
    hash = ((hash << 5) + hash + json.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

export function saveState(save: SaveState): void {
  save.lastSavedAt = Date.now();
  save.saveHash = computeSaveHash(save);
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

/**
 * 版本不符时向前/向后兼容迁移：保留已知字段、默认缺失字段、
 * 保留未知字段（旧存档遇到新增字段不再被清空）。
 */
export function migrateSave(parsed: any): SaveState {
  const base = normalizeSave({ ...structuredClone(DEFAULT_SAVE), ...parsed } as SaveState);
  const result: any = { ...base };
  for (const key of Object.keys(parsed)) {
    if (!(key in base)) result[key] = parsed[key];
  }
  result.version = DEFAULT_SAVE.version;
  return result as SaveState;
}

export function resetSave(): SaveState {
  const fresh = structuredClone(DEFAULT_SAVE);
  saveState(fresh);
  return fresh;
}

export function importSaveJson(text: string): SaveState {
  const parsed = JSON.parse(text) as SaveState;
  const save =
    parsed.version === DEFAULT_SAVE.version ? normalizeSave(parsed) : migrateSave(parsed);
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
    const effectiveDifficulty =
      save.difficulty !== "normal"
        ? save.difficulty
        : save.highPressureMode
          ? "pressure"
          : "normal";
    const factor = PRESSURE_FACTORS[effectiveDifficulty];
    const adjustedDelta =
      delta < 0
        ? Math.round(delta * factor.neg)
        : Math.round(delta * factor.pos);
    save.profile.resources[resource] = clamp(
      save.profile.resources[resource] + adjustedDelta,
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
  } else if (node.kind === "branch") {
    if (!save.completedBranchNodes.includes(nodeId)) {
      save.completedBranchNodes.push(nodeId);
      save.masteryPoints += 5;
    }
  } else if (node.kind === "random") {
    if (!save.completedRandomEvents.includes(nodeId)) {
      save.completedRandomEvents.push(nodeId);
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

  save.trialEnergy = clamp(
    save.trialEnergy + (node.kind === "main" ? 5 : 3),
    0,
    100
  );
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
  const relevantLevel = Math.max(
    ...Object.keys(option.effects).map((id) =>
      abilityLevel(save.profile.abilities[id as AbilityId])
    ),
    1
  );
  const unlockBonus = relevantLevel >= 5 ? 14 : relevantLevel >= 3 ? 8 : 0;
  return {
    option,
    optionIndex,
    gainedAbilityIds,
    resourceDeltas: option.resources,
    qualityScore: scoreQuality(option.quality, save.profile, unlockBonus)
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
  if (node.kind === "branch") {
    return save.completedBranchNodes.includes(nodeId);
  }
  if (node.kind === "random") {
    return save.completedRandomEvents.includes(nodeId);
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
    save.trialEnergy = clamp(
      save.trialEnergy + (won ? 15 : 5),
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

export interface TrainingOutcome {
  correct: number;
  total: number;
  gainedExp: number;
  firstComplete: boolean;
}

export function applyTrainingResult(
  save: SaveState,
  abilityId: AbilityId,
  correct: number,
  total: number
): TrainingOutcome {
  const firstComplete = !save.completedTraining.includes(abilityId);
  const gainedExp = firstComplete ? Math.min(6, Math.max(2, correct * 2)) : 0;
  if (firstComplete) {
    save.completedTraining.push(abilityId);
    save.profile.abilities[abilityId] += gainedExp;
    save.masteryPoints += Math.max(1, Math.min(4, correct));
    save.trialEnergy = clamp(save.trialEnergy + 10, 0, 100);
    save.achievements.push("training_first");
    if (save.completedTraining.length >= 4) {
      save.achievements.push("training_four");
    }
    if (save.completedTraining.length >= 10) {
      save.achievements.push("training_all");
    }
  }
  save.trainingScores[abilityId] = Math.max(
    save.trainingScores[abilityId] ?? 0,
    correct
  );
  save.achievements = [...new Set(save.achievements)];
  saveState(save);
  return { correct, total, gainedExp, firstComplete };
}

export interface TrialAnswerOutcome {
  cleared: boolean;
  correct: boolean;
  energyChange: number;
  gainedExp: number;
  item?: string;
}

export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function applyDailyTrialRecovery(save: SaveState): boolean {
  const today = todayDateKey();
  if (save.lastTrialEnergyDate === today) {
    return false;
  }
  const stageBonus = Math.min(20, save.trialCleared.length);
  const acceleratorBonus = save.trialAccelerator ? 20 : 0;
  save.trialEnergy = clamp(
    save.trialEnergy + 50 + stageBonus + acceleratorBonus,
    0,
    100
  );
  save.lastTrialEnergyDate = today;
  saveState(save);
  return true;
}

export function buyTrialEnergy(
  save: SaveState,
  cost = 15,
  amount = 30
): boolean {
  if (save.profile.resources.capital < cost || save.trialEnergy >= 100) {
    return false;
  }
  save.profile.resources.capital = clamp(
    save.profile.resources.capital - cost,
    0,
    100
  );
  save.trialEnergy = clamp(save.trialEnergy + amount, 0, 100);
  saveState(save);
  return true;
}

export function buyTrialEnergyWithInfluence(
  save: SaveState,
  cost = 25,
  amount = 30
): boolean {
  if (
    save.profile.resources.influence < cost ||
    save.trialEnergy >= 100
  ) {
    return false;
  }
  save.profile.resources.influence = clamp(
    save.profile.resources.influence - cost,
    0,
    100
  );
  save.trialEnergy = clamp(save.trialEnergy + amount, 0, 100);
  saveState(save);
  return true;
}

export function investTrialAccelerator(
  save: SaveState,
  cost = 40
): boolean {
  if (
    save.trialAccelerator ||
    save.profile.resources.capital < cost
  ) {
    return false;
  }
  save.profile.resources.capital = clamp(
    save.profile.resources.capital - cost,
    0,
    100
  );
  save.trialAccelerator = true;
  saveState(save);
  return true;
}

export function hireTrialAlly(save: SaveState, cost = 20): boolean {
  if (
    save.trialItems.includes("临时同伴") ||
    save.profile.resources.trust < cost
  ) {
    return false;
  }
  save.profile.resources.trust = clamp(
    save.profile.resources.trust - cost,
    0,
    100
  );
  save.trialItems.push("临时同伴");
  saveState(save);
  return true;
}

export function submitTrialSummary(
  save: SaveState,
  stageId: string,
  summary: string
): boolean {
  if (!summary.trim()) {
    return false;
  }
  save.trialOpenAnswers[stageId] = summary.trim();
  saveState(save);
  return true;
}

export function recordHiddenRoute(
  save: SaveState,
  routeId: string
): void {
  if (!save.hiddenRoutes.includes(routeId)) {
    save.hiddenRoutes.push(routeId);
    save.achievements.push("hidden_route");
    save.achievements = [...new Set(save.achievements)];
  }
  saveState(save);
}

export function recordAlternateEnding(
  save: SaveState,
  endingId: string
): void {
  if (!save.alternateEndings.includes(endingId)) {
    save.alternateEndings.push(endingId);
  }
  saveState(save);
}

export function applyTrialAnswer(
  save: SaveState,
  stageId: string,
  abilityId: AbilityId,
  correct: boolean,
  staminaCost: number,
  rewardExp: number,
  rewardItem?: string,
  resourceCost = 0,
  wrongPenalty = 6
): TrialAnswerOutcome {
  const cleared = correct && !save.trialCleared.includes(stageId);
  const energyChange = -(staminaCost + (correct ? 0 : wrongPenalty));
  if (resourceCost > 0) {
    save.profile.resources.capital = clamp(
      save.profile.resources.capital - resourceCost,
      0,
      100
    );
  }
  save.trialEnergy = clamp(save.trialEnergy + energyChange, 0, 100);
  if (cleared) {
    save.trialCleared.push(stageId);
    save.profile.abilities[abilityId] += rewardExp;
    if (rewardItem) {
      save.trialItems.push(rewardItem);
    }
    save.masteryPoints += 2;
    save.trialStreak += 1;
    save.achievements.push("trial_first");
    if (save.trialCleared.length >= 5) save.achievements.push("trial_five");
    if (save.trialCleared.length >= 19) save.achievements.push("trial_all");
    if (stageId.startsWith("mba_")) save.achievements.push("mba_clear");
  } else {
    save.trialStreak = 0;
    save.masteryPoints += 1;
  }
  save.achievements = [...new Set(save.achievements)];
  saveState(save);
  return {
    cleared,
    correct,
    energyChange,
    gainedExp: cleared ? rewardExp : 0,
    item: cleared ? rewardItem : undefined
  };
}

export function completePracticeTask(
  save: SaveState,
  taskId: string,
  abilityId: AbilityId,
  rewardEnergy: number,
  rewardExp: number
): boolean {
  if (save.completedPracticeTasks.includes(taskId)) {
    return false;
  }
  save.completedPracticeTasks.push(taskId);
  save.trialEnergy = clamp(save.trialEnergy + rewardEnergy, 0, 100);
  save.profile.abilities[abilityId] += rewardExp;
  save.masteryPoints += 1;
  saveState(save);
  return true;
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

export type CloudConflictResolution =
  | "local-newer"
  | "remote-newer"
  | "conflict"
  | "equal"
  | "no-remote";

/**
 * 云端同步冲突判定：用「时间戳 + 内容哈希」双校验。
 * 相比原先只比 playCount，能在「同一游玩次数但内容不同」时正确识别冲突，
 * 避免本地无脑覆盖远端进度。
 */
export function resolveCloudConflict(
  local: SaveState | null,
  remote: SaveState | null
): CloudConflictResolution {
  if (!remote) return "no-remote";
  if (!local) return "remote-newer";
  const localTime = local.lastSavedAt ?? 0;
  const remoteTime = remote.lastSavedAt ?? 0;
  if (remoteTime > localTime) return "remote-newer";
  if (localTime > remoteTime) return "local-newer";
  // 时间戳相同或缺失 → 退化为内容哈希 / playCount
  if (local.saveHash && remote.saveHash) {
    return local.saveHash === remote.saveHash ? "equal" : "conflict";
  }
  if (remote.playCount > local.playCount) return "remote-newer";
  if (local.playCount > remote.playCount) return "local-newer";
  return "conflict";
}
