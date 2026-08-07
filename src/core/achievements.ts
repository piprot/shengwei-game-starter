import { totalAbilityLevels } from "./abilities.ts";
import { SIDE_QUEST_ARCS } from "./story.ts";
import { TRIAL_STAGES } from "./trials.ts";
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
    description: "完成 30 题能力基线测评",
    icon: "02"
  },
  {
    id: "training_first",
    name: "第一次训练",
    description: "完成任意能力专项训练",
    icon: "19"
  },
  {
    id: "training_four",
    name: "四线并进",
    description: "完成 4 条能力训练路线",
    icon: "20"
  },
  {
    id: "training_all",
    name: "能力训练家",
    description: "完成全部 10 条能力训练路线",
    icon: "21"
  },
  {
    id: "trial_first",
    name: "试炼初胜",
    description: "首次通关成长试炼关卡",
    icon: "22"
  },
  {
    id: "trial_five",
    name: "五关连破",
    description: "通关 5 个成长试炼关卡",
    icon: "23"
  },
  {
    id: "trial_all",
    name: "试炼霸主",
    description: "通关全部成长试炼关卡",
    icon: "24"
  },
  {
    id: "mba_clear",
    name: "MBA 破局者",
    description: "完成任一 MBA 高难案例",
    icon: "25"
  },
  {
    id: "hidden_route",
    name: "高阶路线",
    description: "进入一次能力隐藏复盘路线",
    icon: "26"
  },
  {
    id: "alternate_ending",
    name: "备选结局收集者",
    description: "记录一条备选结局",
    icon: "27"
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
    id: "side_trust_rebuild",
    name: "信任重建者",
    description: "完成“信任重建”支线剧情弧",
    icon: "13"
  },
  {
    id: "side_resilience",
    name: "韧性组织者",
    description: "完成“韧性组织”支线剧情弧",
    icon: "14"
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
  if (id === "training_first") {
    return save.completedTraining.length >= 1;
  }
  if (id === "training_four") {
    return save.completedTraining.length >= 4;
  }
  if (id === "training_all") {
    return save.completedTraining.length >= 10;
  }
  if (id === "trial_first") {
    return save.trialCleared.length >= 1;
  }
  if (id === "trial_five") {
    return save.trialCleared.length >= 5;
  }
  if (id === "trial_all") {
    return save.trialCleared.length >= TRIAL_STAGES.length;
  }
  if (id === "mba_clear") {
    return save.trialCleared.some((trialId) => trialId.startsWith("mba_"));
  }
  if (id === "hidden_route") {
    return save.hiddenRoutes.length >= 1;
  }
  if (id === "alternate_ending") {
    return save.alternateEndings.length >= 1;
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
    const arcNodes = SIDE_QUEST_ARCS.flatMap((arc) => arc.nodes);
    return arcNodes.every((nodeId) =>
      save.completedSideQuests.includes(nodeId)
    );
  }
  if (id.startsWith("side_")) {
    const arc = SIDE_QUEST_ARCS.find((item) => item.id === id.replace("side_", ""));
    return Boolean(
      arc && arc.nodes.every((nodeId) => save.completedSideQuests.includes(nodeId))
    );
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
