import type { AbilityDef, AbilityId, RoleDef, RoleId } from "./types";

export const ABILITY_ORDER: AbilityId[] = [
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

export const ABILITIES: Record<AbilityId, AbilityDef> = {
  insight: {
    id: "insight",
    name: "识人",
    code: "SIGHT",
    tagline: "看懂人，才能看穿局",
    color: "#f2c14e",
    sources: ["《人物志》九征八观", "《冰鉴》识人八字诀", "《孙子兵法》知胜有五"]
  },
  deploy: {
    id: "deploy",
    name: "用人",
    code: "PLACE",
    tagline: "把对的人放进对的坑",
    color: "#57c7a3",
    sources: ["《韩非子·用人》循天顺人", "《贞观政要》唯才是举", "德鲁克：用人之所长"]
  },
  mobilize: {
    id: "mobilize",
    name: "驭人",
    code: "MOVE",
    tagline: "让一群人愿意一起走",
    color: "#e9826c",
    sources: ["《论语》为政以德", "《孙子兵法》令之以文，齐之以武", "毛泽东：出主意、用干部、抓重点"]
  },
  strategy: {
    id: "strategy",
    name: "谋权",
    code: "SHAPE",
    tagline: "在授权之前先建势",
    color: "#8f8cd9",
    sources: ["《权经》谋权篇", "《韩非子》法、术、势", "马基雅维利《君主论》"]
  },
  authority: {
    id: "authority",
    name: "掌权",
    code: "HOLD",
    tagline: "权力是用来创造结果的",
    color: "#4db7d6",
    sources: ["《权经》用权篇", "《孙子兵法》致人而不致于人", "《鬼谷子》权变思维"]
  },
  stability: {
    id: "stability",
    name: "固权",
    code: "STAY",
    tagline: "把个人影响力变成组织能力",
    color: "#7fb069",
    sources: ["《贞观政要》善始慎终", "《资治通鉴》谦退与团结", "《党委会的工作方法》民主集中制"]
  },
  recovery: {
    id: "recovery",
    name: "情绪自愈",
    code: "FUEL",
    tagline: "先管理精力，再管理结果",
    color: "#e9b872",
    sources: ["《卓有成效的管理者》自我管理", "《高效能人士的七个习惯》主动积极", "现代精力管理研究"]
  },
  execution: {
    id: "execution",
    name: "执行力",
    code: "DELIVER",
    tagline: "把方向拆成可验收的成果",
    color: "#d97aa2",
    sources: ["《卓有成效的管理者》要事优先", "《孙子兵法》兵贵神速", "目标管理实践"]
  },
  structure: {
    id: "structure",
    name: "结构思考",
    code: "FRAME",
    tagline: "没有答案时，先拆出问题",
    color: "#5ca9e9",
    sources: ["《矛盾论》抓主要矛盾", "《实践论》从实践中找规律", "结构化问题解决框架"]
  },
  communication: {
    id: "communication",
    name: "协同沟通",
    code: "ALIGN",
    tagline: "把话说清楚，把事对齐",
    color: "#d4a5e8",
    sources: ["《论语》不患人之不己知", "《高效能人士的七个习惯》知彼解己", "非暴力沟通原则"]
  }
};

export const ROLES: Record<RoleId, RoleDef> = {
  parachute: {
    id: "parachute",
    name: "空降管理者",
    shortName: "空降",
    description: "进入陌生组织，90 天内建立信任、识别关键人物、完成第一场变革。",
    startingAbilities: {
      insight: 3,
      strategy: 2,
      recovery: 1,
      communication: 1
    },
    startingResources: { energy: 80, trust: 35, influence: 60, capital: 50 }
  },
  founder: {
    id: "founder",
    name: "创业者",
    shortName: "创业",
    description: "在资源有限、方向混沌的环境里快速试错、组织突围、保住现金流。",
    startingAbilities: {
      execution: 3,
      structure: 2,
      recovery: 2,
      strategy: 1
    },
    startingResources: { energy: 90, trust: 40, influence: 45, capital: 35 }
  },
  highPotential: {
    id: "highPotential",
    name: "高潜人才",
    shortName: "高潜",
    description: "不靠职位权力，用专业、影响力和系统思考推动跨部门协作。",
    startingAbilities: {
      communication: 3,
      insight: 2,
      structure: 2,
      deploy: 1
    },
    startingResources: { energy: 75, trust: 60, influence: 40, capital: 45 }
  }
};

export const ABILITY_EXP_TABLE = [0, 4, 10, 18, 28, 40];

export function abilityLevel(exp: number): number {
  let level = 1;
  for (const threshold of ABILITY_EXP_TABLE.slice(1)) {
    if (exp >= threshold) {
      level += 1;
    } else {
      break;
    }
  }
  return Math.min(6, level);
}

export function totalAbilityLevels(abilities: Record<AbilityId, number>): number {
  return ABILITY_ORDER.reduce((sum, id) => sum + abilityLevel(abilities[id]), 0);
}

export function rankForTotal(total: number): { name: string; min: number; color: string } {
  const ranks = [
    { name: "初阶观察者", min: 0, color: "#9fb3c8" },
    { name: "实干者", min: 16, color: "#57c7a3" },
    { name: "破局者", min: 26, color: "#4db7d6" },
    { name: "变革者", min: 38, color: "#e9826c" },
    { name: "执权者", min: 48, color: "#f2c14e" }
  ];
  return [...ranks].reverse().find((rank) => total >= rank.min) ?? ranks[0];
}

export function createDefaultAbilities(): Record<AbilityId, number> {
  return {
    insight: 0,
    deploy: 0,
    mobilize: 0,
    strategy: 0,
    authority: 0,
    stability: 0,
    recovery: 0,
    execution: 0,
    structure: 0,
    communication: 0
  };
}

export function resourceLabel(resource: keyof typeof RESOURCE_NAMES): string {
  return RESOURCE_NAMES[resource];
}

export const RESOURCE_NAMES = {
  energy: "精力",
  trust: "信任",
  influence: "影响力",
  capital: "组织资源"
} as const;
