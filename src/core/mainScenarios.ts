import type { AbilityId, RoleId, StoryNode, StoryOption } from "./types.ts";
import { ABILITIES } from "./abilities.ts";

interface ExtraSceneBase {
  titleZh: string;
  titleEn: string;
  contextZh: string;
  contextEn: string;
  stakeZh: string;
  stakeEn: string;
}

const EXTRA_SCENE_BASES: ExtraSceneBase[] = [
  {
    titleZh: "值班事故",
    titleEn: "On-Call Incident",
    contextZh:
      "深夜两点，系统监控连续告警，核心服务开始降级。值班工程师已经忙了半小时，群里开始出现互相猜测：“是不是上线改的？”“是不是数据脚本的问题？”",
    contextEn:
      "At 2 a.m., monitoring alerts fire in sequence and core service degrades. The on-call engineer has worked for half an hour, and the channel fills with guesses: is it a deployment, a data script, or something else?",
    stakeZh: "你的第一优先是止血，而不是找责任人；复盘要留在服务恢复之后。",
    stakeEn: "Your first priority is containment, not blame; the postmortem comes after the service is restored."
  },
  {
    titleZh: "人选组合",
    titleEn: "Team Composition",
    contextZh:
      "你有一笔有限的人才预算，要在十个候选人里挑出五个人组成新团队。每个人身上都有可见特质，也可能藏着简历看不出来的短板。",
    contextEn:
      "With a limited talent budget, you must choose five people from a pool of ten to build a new team. Every candidate has visible traits, and some hide weaknesses no résumé reveals.",
    stakeZh: "你选谁，比你说什么更能暴露你的管理判断；组合要配得过未来半年的关键任务。",
    stakeEn: "Who you pick reveals more than what you say; the combination must match the critical tasks of the next six months."
  },
  {
    titleZh: "优先级抉择",
    titleEn: "Prioritization Under Overload",
    contextZh:
      "四件重要的事同时到期：客户续约、预算答辩、核心员工谈话、系统安全整改。团队只能同时推进两件。",
    contextEn:
      "Four important things land at once: a client renewal, a budget defense, a conversation with a core employee, and a security remediation. The team can only push two at a time.",
    stakeZh: "优先级不是按紧急程度排，而是按“不做哪一件损失最大”排。",
    stakeEn: "Priority is not sorted by urgency; it is sorted by which omission costs the most."
  },
  {
    titleZh: "伦理两难",
    titleEn: "Ethics Dilemma",
    contextZh:
      "一个重要客户提出灰色要求：先按口头承诺开工，付款以后再补合同，理由是“流程太慢会错过机会”。合规部门提醒你风险。",
    contextEn:
      "A key client makes a gray request: start on a verbal promise, sign the contract after payment, because process is too slow for the opportunity. Compliance warns you of the risk.",
    stakeZh: "保住客户与守住规则不能靠和稀泥；你需要一个既尊重机会、又不破例的方案。",
    stakeEn: "Keeping the client and holding the rule cannot be handled by vague compromise; you need a plan that respects the opportunity without breaking the precedent."
  },
  {
    titleZh: "危机通报",
    titleEn: "Crisis Communication",
    contextZh:
      "负面消息开始在内部和外部同时扩散：客户截图、离职传闻、供应商抱怨出现在同一个晚上。高管要求你统一口径。",
    contextEn:
      "Bad news spreads inside and outside at once: a client screenshot, a departure rumor, and a supplier complaint surface the same evening. Leadership asks you to unify the message.",
    stakeZh: "口径统一不等于隐瞒；你要让内部敢说话、外部看到行动。",
    stakeEn: "A unified message is not concealment; it lets the inside speak honestly and the outside see action."
  },
  {
    titleZh: "历史案例",
    titleEn: "Decision Lab Case",
    contextZh:
      "你面对一个和经典管理案例几乎同构的局面：资源有限、时间紧迫、各方利益纠缠，但没有一个人能给你完整信息。",
    contextEn:
      "You face a situation nearly identical to a classic management case: limited resources, a tight deadline, and tangled interests, with no one able to give you complete information.",
    stakeZh: "案例已经告诉你会发生什么；你的价值在于这次能否做出不同选择。",
    stakeEn: "The case already shows what will happen; your value is whether you choose differently this time."
  },
  {
    titleZh: "风险敞口",
    titleEn: "Risk Exposure",
    contextZh:
      "月度风险报告显示：某个业务线的敞口连续三个月上升，但没有触发任何红线。财务说“数据波动正常”，业务说“这是增长”。",
    contextEn:
      "The monthly risk report shows exposure in one business line rising for three consecutive months without triggering any red line. Finance calls it normal fluctuation; the business calls it growth.",
    stakeZh: "风险往往不是突然爆发的，而是被“看起来正常”的标签盖住的；你要决定何时把它摆上台面。",
    stakeEn: "Risk rarely explodes suddenly; it hides under the label of normal. You must decide when to put it on the table."
  }
];

const CHAPTER_EXTRA_DETAILS: Record<
  number,
  { zh: string; en: string }
> = {
  1: {
    zh: "空降第二个月，前任遗留的问题开始集中暴露。",
    en: "Two months into the parachute role, the predecessor's unresolved problems surface at once."
  },
  2: {
    zh: "授权仍未落地，你只能靠成果换名分。",
    en: "Authority has still not landed, so you must trade visible results for legitimacy."
  },
  3: {
    zh: "重组名单已经提交，人心开始重新排队。",
    en: "The restructuring list is submitted and people are already choosing sides."
  },
  4: {
    zh: "反对声浪稍有平息，但暗流仍在。",
    en: "Public opposition has eased, but the undercurrent remains."
  },
  5: {
    zh: "季度目标压顶，每一个决策都被放大。",
    en: "Quarterly targets loom and every decision is amplified."
  },
  6: {
    zh: "权力边界正在被反复试探。",
    en: "Your authority boundary is being tested again and again."
  },
  7: {
    zh: "你正在准备交接，组织开始考验旧习惯。",
    en: "As you prepare the handover, the organization begins testing its old habits."
  },
  8: {
    zh: "危机刚过，团队仍处在应激状态。",
    en: "The crisis has passed, but the team is still in survival mode."
  },
  9: {
    zh: "离开倒计时开始，每个决定都在塑造遗产。",
    en: "The departure countdown begins, and every decision shapes your legacy."
  }
};

const CHAPTER_TITLES_ZH: Record<number, string> = {
  1: "识局",
  2: "谋权",
  3: "用人",
  4: "驭势",
  5: "执权",
  6: "掌权",
  7: "固权",
  8: "破局",
  9: "成业"
};

const CHAPTER_TITLES_EN: Record<number, string> = {
  1: "Read the Situation",
  2: "Build Power",
  3: "Deploy People",
  4: "Move the Tide",
  5: "Hold Execution",
  6: "Guard Authority",
  7: "Consolidate Power",
  8: "Break Through",
  9: "Leave a Legacy"
};

function buildOptions(
  ability: AbilityId,
  base: ExtraSceneBase,
  slot: number
): StoryOption[] {
  const abilityName = ABILITIES[ability].name;
  const variant = slot % 2;
  const expertLabelsZh = [
    `先把${abilityName}所需的事实和流程对齐，再让决策公开可验收`,
    `先用一个小范围试点验证${abilityName}的判断，再决定是否全面推开`
  ];
  const partialLabelsZh = [
    "先按现状推进，边做边观察",
    "先处理最显眼的问题，把深层原因留到下一轮"
  ];
  const riskLabelsZh = [
    "当众摊牌，用一次强信号逼局面转向",
    "绕过流程直接调动资源，抢在对手之前完成动作"
  ];
  const secondary: AbilityId = ability === "structure" ? "insight" : "structure";
  const options: StoryOption[] = [
    {
      label: expertLabelsZh[variant],
      summary: `把「${base.titleZh}」变成一次可验证的${abilityName}练习。`,
      quality: "expert",
      effects: { [ability]: 2, [secondary]: 1 },
      resources: { energy: -6, trust: 5, influence: 2 },
      feedback: `你用${abilityName}把模糊局面拆成了可执行的流程，团队开始相信判断可以复制。`,
      theory: ABILITIES[ability].sources[0]
    },
    {
      label: partialLabelsZh[variant],
      summary: `先稳住眼前，再回头补齐证据。`,
      quality: "partial",
      effects: { [ability]: 1 },
      resources: { energy: -4, trust: -1, influence: 2 },
      feedback: `你缓解了眼前的紧张，但${abilityName}背后的核心张力还没有真正打开。`,
      theory: ABILITIES[ability].sources[1] ?? ABILITIES[ability].sources[0]
    },
    {
      label: riskLabelsZh[variant],
      summary: `用一次强信号换取局面破口。`,
      quality: "risk",
      effects: { [ability]: 1, authority: ability === "authority" ? 2 : 1 },
      resources: { energy: -9, trust: -6, influence: 4, capital: -2 },
      feedback: `你用强信号推进了局面，也付出了信任和资源的代价。`,
      theory: "《权经》：用权有度，过刚则折。"
    }
  ];
  return options.map((option, index) => {
    if (index === 0) {
      return {
        ...option,
        label: expertLabelsZh[variant],
        summary: `把「${base.titleZh}」变成一次可验证的${abilityName}练习。`
      };
    }
    return option;
  });
}

function buildExtraMainNodes(): {
  nodes: StoryNode[];
  en: Record<string, { title: string; context: string; stake: string }>;
  theoryEn: Record<string, string[]>;
  intel: Record<string, string[]>;
  roleVariants: Record<
    string,
    Partial<Record<RoleId, { context: string; stake: string }>>
  >;
} {
  const nodes: StoryNode[] = [];
  const en: Record<string, { title: string; context: string; stake: string }> = {};
  const theoryEn: Record<string, string[]> = {};
  const intel: Record<string, string[]> = {};
  const roleVariants: Record<
    string,
    Partial<Record<RoleId, { context: string; stake: string }>>
  > = {};
  for (let chapterId = 1; chapterId <= 9; chapterId += 1) {
    const detail = CHAPTER_EXTRA_DETAILS[chapterId];
    const focusPool = [
      "insight",
      "structure",
      "strategy",
      "communication",
      "deploy",
      "mobilize",
      "authority",
      "execution",
      "recovery",
      "stability"
    ] as AbilityId[];
    EXTRA_SCENE_BASES.forEach((base, slot) => {
      const nodeNumber = slot + 3;
      const id = `c${chapterId}n${nodeNumber}`;
      const ability = focusPool[(chapterId + slot) % focusPool.length];
      nodes.push({
        id,
        chapterId,
        title: `${CHAPTER_TITLES_ZH[chapterId]} · ${base.titleZh}`,
        kind: "main",
        context: `${base.contextZh} ${detail.zh}`,
        stake: base.stakeZh,
        options: buildOptions(ability, base, slot)
      });
      en[id] = {
        title: `${CHAPTER_TITLES_EN[chapterId]} · ${base.titleEn}`,
        context: `${base.contextEn} ${detail.en}`,
        stake: base.stakeEn
      };
      theoryEn[id] = [
        "Evidence before judgment, and judgment before commitment.",
        "Process protects decisions better than personal force.",
        "Shared ownership turns resistance into momentum."
      ];
      intel[id] = [
        `「${base.titleZh}」涉及的记录需要交叉核对`,
        `当前章节背景：${detail.zh}`,
        "真正的判断依据往往不在第一份材料里"
      ];
      roleVariants[id] = {
        parachute: {
          context: `空降视角：${base.contextZh} ${detail.zh}`,
          stake: base.stakeZh
        },
        founder: {
          context: `创业视角：${base.contextZh} ${detail.zh}`,
          stake: base.stakeZh
        },
        highPotential: {
          context: `高潜视角：${base.contextZh} ${detail.zh}`,
          stake: base.stakeZh
        }
      };
    });
  }
  return { nodes, en, theoryEn, intel, roleVariants };
}

const built = buildExtraMainNodes();

export const EXTRA_MAIN_NODES = built.nodes;
export const EXTRA_MAIN_EN = built.en;
export const EXTRA_MAIN_THEORY_EN = built.theoryEn;
export const EXTRA_MAIN_INTEL = built.intel;
export const EXTRA_MAIN_ROLE_VARIANTS = built.roleVariants;
