import { totalAbilityLevels } from "./abilities.ts";
import type { SaveState } from "./types";

export interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  reward: number;
}

export interface ChallengeState extends ChallengeDef {
  current: number;
  target: number;
  done: boolean;
}

const CHALLENGE_POOL: Array<ChallengeDef & { target: number; progress(save: SaveState): number }> = [
  {
    id: "expert_3",
    title: "连续精准",
    description: "完成 3 次专家级情境选择",
    target: 3,
    reward: 4,
    progress: (save) =>
      save.decisionHistory.filter((record) => record.quality === "expert").length
  },
  {
    id: "side_1",
    title: "支线推进",
    description: "完成 1 个支线剧情节点",
    target: 1,
    reward: 4,
    progress: (save) => save.completedSideQuests.length
  },
  {
    id: "duel_1",
    title: "一次对决",
    description: "完成 1 场 1v1 对决",
    target: 1,
    reward: 4,
    progress: (save) => save.duelWins + save.duelLosses
  },
  {
    id: "chapter_1",
    title: "章节突破",
    description: "完成任意一章主线",
    target: 1,
    reward: 6,
    progress: (save) =>
      save.chapterRecords.filter((record) => record.completedNodeIds.length >= 2)
        .length
  },
  {
    id: "rank_20",
    title: "能力跃迁",
    description: "综合能力值达到 20",
    target: 20,
    reward: 6,
    progress: (save) => totalAbilityLevels(save.profile.abilities)
  }
];

export function dailyChallenges(save: SaveState): ChallengeState[] {
  const today = new Date().toISOString().slice(0, 10);
  const seed = [...today].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const start = seed % CHALLENGE_POOL.length;
  return CHALLENGE_POOL.slice(start)
    .concat(CHALLENGE_POOL.slice(0, start))
    .slice(0, 3)
    .map((challenge) => {
      const current = Math.min(challenge.target, challenge.progress(save));
      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        reward: challenge.reward,
        current,
        target: challenge.target,
        done: current >= challenge.target
      };
    });
}

export function claimableChallenges(
  save: SaveState
): ChallengeState[] {
  return dailyChallenges(save).filter(
    (challenge) =>
      challenge.done && !save.claimedChallenges.includes(challenge.id)
  );
}
