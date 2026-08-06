export type AbilityId =
  | "insight"
  | "deploy"
  | "mobilize"
  | "strategy"
  | "authority"
  | "stability"
  | "recovery"
  | "execution"
  | "structure"
  | "communication";

export type ResourceKey = "energy" | "trust" | "influence" | "capital";

export type RoleId = "parachute" | "founder" | "highPotential";

export type OptionQuality = "expert" | "partial" | "risk";

export interface AbilityDef {
  id: AbilityId;
  name: string;
  code: string;
  tagline: string;
  color: string;
  sources: string[];
  subSkills: string[];
  trainingPath: string;
}

export interface StoryOption {
  label: string;
  summary: string;
  quality: OptionQuality;
  effects: Partial<Record<AbilityId, number>>;
  resources: Partial<Record<ResourceKey, number>>;
  feedback: string;
  theory: string;
  branchTo?: Partial<Record<RoleId, string>>;
}

export interface StoryNode {
  id: string;
  chapterId: number;
  title: string;
  kind: "main" | "side" | "branch" | "random";
  context: string;
  stake: string;
  options: StoryOption[];
}

export interface ChapterDef {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  focus: AbilityId[];
  nodeIds: string[];
}

export interface RoleDef {
  id: RoleId;
  name: string;
  shortName: string;
  description: string;
  objective: string;
  lens: string;
  focusAbilities: AbilityId[];
  startingAbilities: Partial<Record<AbilityId, number>>;
  startingResources: Record<ResourceKey, number>;
}

export interface PlayerProfile {
  name: string;
  role: RoleId;
  abilities: Record<AbilityId, number>;
  resources: Record<ResourceKey, number>;
}

export interface DuelProfile {
  name: string;
  role: RoleId;
  abilities: Record<AbilityId, number>;
  resources: Record<ResourceKey, number>;
  color: string;
  isHuman: boolean;
}

export interface ChapterRecord {
  chapterId: number;
  completedNodeIds: string[];
  stars: number;
}

export interface DecisionRecord {
  nodeId: string;
  optionIndex: number;
  quality: OptionQuality;
  qualityScore: number;
  chapterId: number;
}

export interface DuelHistoryEntry {
  opponentName: string;
  playerScore: number;
  opponentScore: number;
  won: boolean;
  timestamp: number;
}

export interface SaveState {
  version: number;
  profileCreated: boolean;
  profile: PlayerProfile;
  chapterRecords: ChapterRecord[];
  unlockedChapters: number[];
  completedSideQuests: string[];
  achievements: string[];
  duelWins: number;
  duelLosses: number;
  playCount: number;
  masteryPoints: number;
  decisionHistory: DecisionRecord[];
  duelHistory: DuelHistoryEntry[];
  claimedChallenges: string[];
  assessmentScore: number;
  completedRandomEvents: string[];
  completedBranchNodes: string[];
  highPressureMode: boolean;
  /** 难度档位：标准 / 高压 / 极限。驱动资源缩放、回合时限与突发干扰。 */
  difficulty: "normal" | "pressure" | "extreme";
  /** 最近一次本地保存的时间戳（毫秒）。用于云端同步冲突判定。 */
  lastSavedAt?: number;
  /** 存档核心进度的内容哈希。用于云端同步冲突判定（同游玩次数但内容不同也能识别）。 */
  saveHash?: string;
}

export interface ChoiceOutcome {
  option: StoryOption;
  optionIndex: number;
  gainedAbilityIds: AbilityId[];
  resourceDeltas: Partial<Record<ResourceKey, number>>;
  qualityScore: number;
}

export interface DuelResult {
  winnerName: string;
  scores: [number, number];
  roundResults: Array<{
    node: StoryNode;
    picks: [number, number];
    points: [number, number];
  }>;
}
