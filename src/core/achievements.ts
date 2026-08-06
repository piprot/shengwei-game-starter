import { totalAbilityLevels } from "./abilities.ts";
import type { SaveState } from "./types";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_step",
    name: "第一次判断",
    description: "完成第一个真实职场情境",
    icon: "01"
  },
  {
    id: "assessment_done",
    name: "能力画像",
    description: "完成 10 题能力基线测评",
    icon: "02"
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `chapter_${index + 1}`,
    name: `第 ${index + 1} 章完成`,
    description: `完成第 ${index + 1} 章的两个主线情境`,
    icon: String(index + 3).padStart(2, "0")
  })),
  {
    id: "perfect_chapter",
    name: "专家级章节",
    description: "任一章达到三星评价",
    icon: "12"
  },
  {
    id: "all_side",
    name: "支线收集者",
    description: "完成全部 6 个支线任务",
    icon: "13"
  },
  {
    id: "duel_winner",
    name: "第一场胜利",
    description: "赢得一场 1v1 对决",
    icon: "14"
  },
  {
    id: "duel_ten",
    name: "常驻对决者",
    description: "累计完成 10 场 1v1 对决",
    icon: "15"
  },
  {
    id: "rank_leader",
    name: "变革者",
    description: "综合能力值达到 38",
    icon: "16"
  },
  {
    id: "role_ending",
    name: "角色结局",
    description: "完成第九章并解锁角色结局",
    icon: "17"
  },
  {
    id: "master",
    name: "执权者",
    description: "综合能力值达到 48",
    icon: "18"
  }
];

export function isAchievementUnlocked(save: SaveState, id: string): boolean {
  if (save.achievements.includes(id)) {
    return true;
  }
  if (id === "first_step") {
    return save.playCount >= 1;
  }
  if (id.startsWith("chapter_")) {
    const chapterId = Number(id.split("_")[1]);
    return Boolean(
      save.chapterRecords.find(
        (record) =>
          record.chapterId === chapterId &&
          record.completedNodeIds.length >= 2
      )
    );
  }
  if (id === "perfect_chapter") {
    return save.chapterRecords.some((record) => record.stars >= 220);
  }
  if (id === "all_side") {
    return save.completedSideQuests.length >= 6;
  }
  if (id === "duel_winner") {
    return save.duelWins >= 1;
  }
  if (id === "duel_ten") {
    return save.duelWins + save.duelLosses >= 10;
  }
  if (id === "rank_leader") {
    return totalAbilityLevels(save.profile.abilities) >= 38;
  }
  if (id === "role_ending") {
    return Boolean(
      save.chapterRecords.find(
        (record) =>
          record.chapterId === 9 &&
          record.completedNodeIds.length >= 2
      )
    );
  }
  if (id === "master") {
    return totalAbilityLevels(save.profile.abilities) >= 48;
  }
  return false;
}

export function unlockedCount(save: SaveState): number {
  return ACHIEVEMENTS.filter((achievement) =>
    isAchievementUnlocked(save, achievement.id)
  ).length;
}
