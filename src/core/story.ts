import type {
  AbilityId,
  ChapterDef,
  OptionQuality,
  RoleId,
  StoryNode
} from "./types";
import { ROLE_OPTION_SETS } from "./roleOptions.ts";

export const CHAPTERS: ChapterDef[] = [
  {
    id: 1,
    code: "I",
    title: "识局",
    subtitle: "先诊断，再动手",
    focus: ["insight", "structure"],
    nodeIds: ["c1n1", "c1n2"]
  },
  {
    id: 2,
    code: "II",
    title: "谋权",
    subtitle: "在授权之前先建势",
    focus: ["strategy", "communication"],
    nodeIds: ["c2n1", "c2n2"]
  },
  {
    id: 3,
    code: "III",
    title: "用人",
    subtitle: "把对的人放进对的坑",
    focus: ["deploy", "insight"],
    nodeIds: ["c3n1", "c3n2"]
  },
  {
    id: 4,
    code: "IV",
    title: "驭势",
    subtitle: "让一群人不情愿的人一起走",
    focus: ["mobilize", "communication"],
    nodeIds: ["c4n1", "c4n2"]
  },
  {
    id: 5,
    code: "V",
    title: "执权",
    subtitle: "把决策变成可验收的成果",
    focus: ["execution", "authority"],
    nodeIds: ["c5n1", "c5n2"]
  },
  {
    id: 6,
    code: "VI",
    title: "掌权",
    subtitle: "用制度守住权力边界",
    focus: ["authority", "structure"],
    nodeIds: ["c6n1", "c6n2"]
  },
  {
    id: 7,
    code: "VII",
    title: "固权",
    subtitle: "让组织不依赖任何个人",
    focus: ["stability", "deploy"],
    nodeIds: ["c7n1", "c7n2"]
  },
  {
    id: 8,
    code: "VIII",
    title: "破局",
    subtitle: "在不确定中快速调整",
    focus: ["structure", "recovery"],
    nodeIds: ["c8n1", "c8n2"]
  },
  {
    id: 9,
    code: "IX",
    title: "成业",
    subtitle: "让成功可以延续",
    focus: ["stability", "strategy"],
    nodeIds: ["c9n1", "c9n2"]
  }
];

export const CHAPTER_REFLECTIONS: Record<number, string> = {
  1: "你完成了对组织的第一次诊断。真正的权力地图很少写在组织架构图上，它藏在谁被问、谁沉默、谁真正决定资源走向里。",
  2: "你在授权不完整时推进了变革。权力的起点不是职位，而是你能否用行动让关键人愿意把资源交给你。",
  3: "人才决策开始从印象走向证据。用人的核心不是谁更好，而是这个组织此刻需要什么样的能力组合。",
  4: "你理解了反对声往往携带真实信息。把阻力变成共同责任，是比压制阻力更持久的影响力。",
  5: "目标只有被拆成可验收的结果，才会变成执行。管理者的价值不是喊方向，而是让方向每天都能被检查。",
  6: "权力需要边界和制度，而不是依赖个人强势。被架空常常不是能力问题，而是流程没有保护决策权。",
  7: "你开始把个人判断转化为组织能力。固权的本质，是让组织在不依赖你的时候也能稳定运行。",
  8: "危机里最重要的是先控制范围，再寻找机会。速度不能替代结构，勇气也不能替代证据。",
  9: "你完成了从做事到建立系统的转身。真正的成业，是你离开之后，组织仍然知道如何做对决策。"
};

export interface SideQuestArc {
  id: string;
  title: string;
  summary: string;
  intro: string;
  nodes: string[];
  conclusion: string;
}

export const SIDE_QUEST_ARCS: SideQuestArc[] = [
  {
    id: "trust_rebuild",
    title: "信任重建",
    summary: "在高压管理中保留人的温度，把一次帮助变成长期的团队信任。",
    intro:
      "你决定不只在制度和结果上建立权威，还愿意处理人的情绪、勇气和尊严。这条支线会考验你是否能把善意变成可持续的组织关系。",
    nodes: ["s1", "s4", "s2"],
    conclusion:
      "当团队开始相信你不会在关键时刻缺席，他们的忠诚就不再是对权力的服从，而是对共同目标的承诺。"
  },
  {
    id: "resilience",
    title: "韧性组织",
    summary: "在高压、疲惫和连续失败中，建立能保护产能又扛住危机的团队。",
    intro:
      "执行力不只是冲刺，更是知道何时保护精力、何时缩小问题范围、何时重新凝聚团队。这条支线会把你从个人救火带到组织韧性。",
    nodes: ["s5", "s3", "s6"],
    conclusion:
      "当团队能在危机中先隔离风险、再共同复盘，而不是互相指责，你就真正建立了不依赖你个人的执行系统。"
  },
  {
    id: "power_boundaries",
    title: "权力边界",
    summary:
      "在越级汇报、绕过决策和交接断点之间，把个人权威变成可重复的组织规则。",
    intro:
      "权力不会因为头衔自动稳定，它需要被看见、被约束、被交接。这条支线会考验你能否在制度与信任之间守住边界，而不是靠一次次私下谈话补救。",
    nodes: ["s7", "s8", "s9"],
    conclusion:
      "当关键决策重新回到流程、关键信息不再依赖某一个人，你的权威才真正成为组织能力。"
  }
];

export const STORY_NODES: StoryNode[] = [
  {
    id: "c1n1",
    chapterId: 1,
    title: "空降首周",
    kind: "main",
    context:
      "你刚接手一家营收停滞的事业部。前任留下的人表面客气，但关键数据迟迟不交。CEO 只给了你 90 天，团队私下说“又来一个救火队长”。",
    stake: "你必须在信息不足时决定：先建立关系，还是先拿到数据。",
    options: [
      {
        label: "先约核心骨干喝咖啡",
        summary: "逐个访谈，记录谁在影响决策、谁在隐瞒什么。",
        quality: "expert",
        effects: { insight: 3, communication: 2 },
        resources: { energy: -8, trust: 8, influence: 4 },
        feedback:
          "你通过非正式访谈摸清了真实权力地图，也给了对方表达的空间。数据缺口背后不是流程问题，而是信任问题。",
        theory: "《人物志》八观：观察人在不同情境中的取舍，才能看见真实动机。",
        branchTo: {
          parachute: "c1b-parachute",
          founder: "c1b-founder",
          highPotential: "c1b-highPotential"
        }
      },
      {
        label: "直接要求全量数据",
        summary: "以新任负责人的身份限期提交，建立管理权威。",
        quality: "partial",
        effects: { authority: 3, execution: 1 },
        resources: { energy: -5, trust: -8, influence: 5 },
        feedback:
          "你拿到了部分数据，也消耗了第一波信任。权力不是靠要求得到的，先诊断再施压会更稳。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "先拜访 CEO 弄清期望",
        summary: "向上对齐目标，把 90 天要求翻译成可量化的指标。",
        quality: "partial",
        effects: { strategy: 3, structure: 1 },
        resources: { energy: -6, trust: 2, influence: 7 },
        feedback:
          "向上对齐是对的，但你忽略了团队的真实阻力。高层支持不能替代一线信息。",
        theory: "《权经》：权乃人授，授为大焉。"
      }
    ]
  },
  {
    id: "c1n2",
    chapterId: 1,
    title: "午休情报",
    kind: "main",
    context:
      "午饭时，行政主管无意间提到：上季度“突然多了一笔外包费”，但没人说得清用途。你查预算表，发现签名栏是前任和财务经理。",
    stake: "这是一条可能影响你判断的线索，你如何处置？",
    options: [
      {
        label: "先查合同再下结论",
        summary: "把外包费、合同、交付物全部拉齐，形成完整事实链。",
        quality: "expert",
        effects: { structure: 3, insight: 2 },
        resources: { energy: -9, trust: 1, influence: 4 },
        feedback:
          "你没有被八卦带走，而是把零散信息结构化成证据链。这个判断让财务经理主动交出了更多历史问题。",
        theory: "《实践论》：从感性材料上升到理性认识，才能抓住本质。"
      },
      {
        label: "当众问财务经理",
        summary: "在周会上直接要求解释，展示你眼里不揉沙。",
        quality: "risk",
        effects: { authority: 2, communication: -1 },
        resources: { energy: -6, trust: -10, influence: 3 },
        feedback:
          "你赢得了“强硬”的标签，却让整个团队进入防御状态。线索还没查清，你已经把调查变成了站队。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      },
      {
        label: "暂不声张，记入观察清单",
        summary: "先存档，等接触更多证据后再决定是否触发。",
        quality: "partial",
        effects: { recovery: 2, insight: 1 },
        resources: { energy: -3, trust: 2, influence: 0 },
        feedback:
          "你稳住了情绪，但如果没有后续动作，这条线索可能被遗忘。观察必须搭配明确的验证节点。",
        theory: "《鬼谷子》：审时度势，谋定后动。"
      }
    ]
  },
  {
    id: "c2n1",
    chapterId: 2,
    title: "授权真空",
    kind: "main",
    context:
      "公司组织架构调整，你的直属上级突然调走。你名义上负责项目，但预算审批、人员任命都悬而未决，CEO 说“先干起来，授权再谈”。",
    stake: "没有正式授权，你的第一场变革要如何启动？",
    options: [
      {
        label: "先立功再争权",
        summary: "用两周内可交付的小胜利证明自己，再谈资源授权。",
        quality: "expert",
        effects: { execution: 3, strategy: 2 },
        resources: { energy: -8, trust: 5, influence: 7 },
        feedback:
          "你没有停在“权力不够”的抱怨里，而是用可验证的成果换授权。这正是《权经》所说的“携为上，功次之”。",
        theory: "《权经》：携为上，功次之；权乃人授，授为大焉。"
      },
      {
        label: "直接越级要授权",
        summary: "把组织架构调整当作机会，向 CEO 要明确的书面授权。",
        quality: "partial",
        effects: { strategy: 3, authority: 1 },
        resources: { energy: -6, trust: -3, influence: 5 },
        feedback:
          "你推动了授权，但代价是让临时上级感到被绕开。权力拿到了，盟友少了。",
        theory: "马基雅维利：权力来自他人对你的依赖。"
      },
      {
        label: "先观望再行动",
        summary: "等授权落地，避免在没有名分时做容易翻车的事。",
        quality: "risk",
        effects: { recovery: 2 },
        resources: { energy: -3, trust: -4, influence: -4 },
        feedback:
          "谨慎本身没有错，但观望太久会让团队失去方向，也让 CEO 认为你无法在模糊中推进。",
        theory: "《孙子兵法》：善战者，先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c2n2",
    chapterId: 2,
    title: "第一场会",
    kind: "main",
    context:
      "你召集第一次全员会。有人当面说“新官上任三把火”，有人沉默，有人故意问尖锐问题。你需要用一场会建立势能。",
    stake: "会议结果会影响团队愿不愿意跟你上第一艘船。",
    options: [
      {
        label: "先讲事实，再邀请提问",
        summary: "用数据说明现状，把问题开放给所有人，并现场记录。",
        quality: "expert",
        effects: { communication: 3, mobilize: 2 },
        resources: { energy: -7, trust: 7, influence: 5 },
        feedback:
          "你没有被质疑激怒，反而把质疑变成了公共议题。沉默者开始说话，反对者也愿意把真实顾虑摆上台面。",
        theory: "毛泽东《党委会的工作方法》：先当学生，再当先生。"
      },
      {
        label: "用魄力压住场面",
        summary: "明确宣布规矩，谁先质疑谁先拿出方案。",
        quality: "partial",
        effects: { authority: 3, mobilize: -1 },
        resources: { energy: -5, trust: -5, influence: 6 },
        feedback:
          "场面安静了，但只是暂时。你用权威换来了服从，没有换来承诺。",
        theory: "《孙子兵法》：令之以文，齐之以武。"
      },
      {
        label: "私下先拉拢关键人",
        summary: "会前逐个沟通关键骨干，会上只走过场。",
        quality: "risk",
        effects: { strategy: 3 },
        resources: { energy: -6, trust: -6, influence: 2 },
        feedback:
          "私下结盟让少数人站到了你这边，但公开场合的沉默会变成更大的不透明。",
        theory: "《韩非子》：事以密成，语以泄败。"
      }
    ]
  },
  {
    id: "c3n1",
    chapterId: 3,
    title: "重组名单",
    kind: "main",
    context:
      "你拿到团队盘点结果：有人能力强但忠诚度存疑，有人平庸但掌握核心客户，有人年轻但执行力出色。组织要求你提交一份 30 人精简到 22 人的名单。",
    stake: "名单会决定团队未来一年的人才结构，也会决定谁恨你、谁谢你。",
    options: [
      {
        label: "按关键岗位重新匹配",
        summary: "先定义未来 6 个月的关键岗位，再用人岗匹配决定去留。",
        quality: "expert",
        effects: { deploy: 3, structure: 2 },
        resources: { energy: -9, trust: 3, influence: 6 },
        feedback:
          "你没有被资历和亲疏绑架，而是先定义组织需要什么，再决定谁留下。名单里有争议，但逻辑清晰。",
        theory: "《贞观政要》：用非其才，必难致治；舍短取长，各尽其能。"
      },
      {
        label: "优先保自己人",
        summary: "把可靠但未必最强的人放在核心岗位，降低短期风险。",
        quality: "risk",
        effects: { strategy: 3, authority: 1 },
        resources: { energy: -5, trust: -8, influence: 3 },
        feedback:
          "你获得了短期安全感，却把组织推向了裙带化。明眼人很快会看到名单背后的逻辑。",
        theory: "《资治通鉴》：才者，德之资也；德者，才之帅也。"
      },
      {
        label: "尽量保留所有人",
        summary: "用轮岗和培训代替裁员，避免冲突。",
        quality: "partial",
        effects: { communication: 2, recovery: 1 },
        resources: { energy: -6, trust: 5, influence: -3 },
        feedback:
          "你避开了短期冲突，却让组织继续背着过剩结构和模糊职责。善意不能替代配置决策。",
        theory: "《韩非子·用人》：使事不相干，使士不兼官。"
      }
    ]
  },
  {
    id: "c3n2",
    chapterId: 3,
    title: "救火队长",
    kind: "main",
    context:
      "项目连续三天出问题，团队习惯性把所有事都推给你。你发现一位年轻骨干能独立解决 80% 的问题，但他总在等你确认。",
    stake: "你是继续做救火队长，还是真正“把工作还回去”？",
    options: [
      {
        label: "授权边界并验收结果",
        summary: "明确告诉他决策权限、判断标准和汇报节点，然后让他自己闭环。",
        quality: "expert",
        effects: { deploy: 3, authority: 2 },
        resources: { energy: -5, trust: 8, influence: 5 },
        feedback:
          "你第一次把责任完整交给别人。他做砸了一件事，但学会了自主判断；你从救火队长变成了组织者。",
        theory: "《权经》：授能干者，授忠诚者，权惟用，不为大也。"
      },
      {
        label: "继续亲自把关",
        summary: "自己确认每一份交付，确保短期不出错。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -12, trust: 2, influence: -2 },
        feedback:
          "短期项目稳住了，但你的精力被彻底锁死。团队越来越依赖你，组织能力没有增长。",
        theory: "《卓有成效的管理者》：管理者必须把时间投入真正重要的决策。"
      },
      {
        label: "让他尝试，但暗中兜底",
        summary: "表面上放手，私下安排老员工盯着进度。",
        quality: "partial",
        effects: { structure: 2, communication: 1 },
        resources: { energy: -7, trust: 4, influence: 1 },
        feedback:
          "你给了他试错空间，但暗中监控让他很快察觉，信任打了折扣。授权要么完整，要么说清楚是联合管理。",
        theory: "《论语》：君子信而后劳其民。"
      }
    ]
  },
  {
    id: "c4n1",
    chapterId: 4,
    title: "反对声浪",
    kind: "main",
    context:
      "你推动新流程，运营负责人公开反对，理由是“会拖慢交付”。他资历深、人脉广，你的方案确实没有覆盖他的顾虑。",
    stake: "压制反对会失去人心，让步会失去变革，你需要第三条路。",
    options: [
      {
        label: "把他的顾虑变成方案前提",
        summary: "先补齐交付保障条款，再邀请他担任试点负责人。",
        quality: "expert",
        effects: { mobilize: 3, communication: 2 },
        resources: { energy: -8, trust: 8, influence: 7 },
        feedback:
          "你没有把反对者当敌人，而是把他变成共同责任人。当他的利益被写进方案，反对声变成了推动力。",
        theory: "《孙子兵法》：上下同欲者胜；《论语》：举直错诸枉，则民服。"
      },
      {
        label: "高层背书强行推进",
        summary: "带着 CEO 的批准直接宣布执行，让反对者服从。",
        quality: "partial",
        effects: { authority: 3, strategy: 1 },
        resources: { energy: -6, trust: -8, influence: 5 },
        feedback:
          "方案落地了，但运营团队在暗处执行走样。你赢了命令，输了协同。",
        theory: "《韩非子》：法势术并用，但不能代替人心。"
      },
      {
        label: "撤回方案重新评估",
        summary: "暂缓推进，避免在反对声中强行变革。",
        quality: "risk",
        effects: { recovery: 2, structure: 1 },
        resources: { energy: -4, trust: 3, influence: -6 },
        feedback:
          "你避免了冲突，却把领导权让给了阻力。下一次再提变革，所有人都会知道你可以被拖住。",
        theory: "《孙子兵法》：不可胜在己，可胜在敌。"
      }
    ]
  },
  {
    id: "c4n2",
    chapterId: 4,
    title: "跨部门僵局",
    kind: "main",
    context:
      "产品、销售、研发三部门互相推责，一个客户项目停了 10 天。你没有直接管理销售和研发，但 CEO 让你牵头解决。",
    stake: "跨部门协同的关键不是命令，而是让各方都觉得这件事与自己有关。",
    options: [
      {
        label: "建立联合作战室",
        summary: "把三个部门的关键人放进同一目标、同一看板、同一例会。",
        quality: "expert",
        effects: { communication: 3, execution: 2 },
        resources: { energy: -9, trust: 6, influence: 8 },
        feedback:
          "你没有去争谁对谁错，而是重新定义了共同目标和协作机制。僵局变成了一个可管理的项目。",
        theory: "德鲁克：管理就是让平凡的人做出不平凡的事。"
      },
      {
        label: "用客户压力倒逼",
        summary: "把客户投诉放大给三部门负责人，逼他们立刻行动。",
        quality: "partial",
        effects: { execution: 3 },
        resources: { energy: -6, trust: -5, influence: 4 },
        feedback:
          "问题暂时解决了，但互相指责的剧本没有变。下次危机仍然会重演。",
        theory: "《孙子兵法》：致人而不致于人。"
      },
      {
        label: "请 CEO 拍板责任",
        summary: "让最高层裁决责任归属，避免自己卷入政治。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -4, trust: -6, influence: -5 },
        feedback:
          "你把协调难题上交了，短期内安全，但 CEO 会把“不会横向推动”记在心里。",
        theory: "《资治通鉴》：推功于贤智之人，以维持团结。"
      }
    ]
  },
  {
    id: "c5n1",
    chapterId: 5,
    title: "目标拆解",
    kind: "main",
    context:
      "公司给你定了“收入翻倍”的目标，但没有给路径。团队听完只会点头，没人知道明天该做什么。",
    stake: "目标必须被拆成可执行、可追踪、可问责的颗粒。",
    options: [
      {
        label: "用关键结果倒推行动",
        summary: "把目标拆成 3 个关键结果，每个结果配负责人、里程碑和验收标准。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -8, trust: 4, influence: 6 },
        feedback:
          "你给团队的不是口号，而是一张能每天检查的作战图。目标开始变得真实。",
        theory: "《卓有成效的管理者》：要事优先，把资源集中在少数真正重要的任务上。"
      },
      {
        label: "先保营收再谈体系",
        summary: "让销售猛攻大客户，先完成数字，再回头补管理。",
        quality: "partial",
        effects: { execution: 3, strategy: 1 },
        resources: { energy: -7, trust: 2, influence: 2 },
        feedback:
          "短期数字可能好看，但组织会陷入“谁有客户谁说了算”，目标拆解缺位迟早反噬。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      },
      {
        label: "让各部门自行提目标",
        summary: "把拆解责任交给部门负责人，你只做汇总。",
        quality: "risk",
        effects: { communication: 2 },
        resources: { energy: -5, trust: 5, influence: -4 },
        feedback:
          "你尊重了各部门，却没有建立共同逻辑。汇总出来的目标互相冲突，执行必然脱节。",
        theory: "毛泽东《矛盾论》：抓主要矛盾，其他问题才能迎刃而解。"
      }
    ]
  },
  {
    id: "c5n2",
    chapterId: 5,
    title: "季度冲刺",
    kind: "main",
    context:
      "距离季度结束还有 15 天，目标缺口 30%。团队已经连续加班，士气下降，有人开始把“冲刺失败”当既定事实。",
    stake: "你需要在真实缺口和团队承受力之间找到平衡。",
    options: [
      {
        label: "重排优先级，砍掉非关键项",
        summary: "重新审视管线，停掉三个低价值项目，把火力集中到最大机会。",
        quality: "expert",
        effects: { execution: 3, structure: 2 },
        resources: { energy: -6, trust: 5, influence: 6 },
        feedback:
          "你没有靠更多加班解决问题，而是靠取舍。团队第一次感到目标是可以被管理的。",
        theory: "德鲁克：管理者的成果不是做了多少事，而是做对了多少重要的事。"
      },
      {
        label: "全员加班保目标",
        summary: "要求所有人两周内取消休假，用时间换数字。",
        quality: "partial",
        effects: { authority: 2, execution: 2 },
        resources: { energy: -12, trust: -8, influence: 2 },
        feedback:
          "你可能完成了这个季度，但下个季度会有人离职。精力透支不是可持续的执行力。",
        theory: "《高效能人士的七个习惯》：关注你的影响圈，而不是耗尽自己。"
      },
      {
        label: "先向下修目标",
        summary: "提前和 CEO 沟通缺口，把目标调整为可完成值。",
        quality: "risk",
        effects: { communication: 2, recovery: 1 },
        resources: { energy: -5, trust: 2, influence: -6 },
        feedback:
          "你把现实风险讲清楚了，但在老板眼里，你还没打就认输了。修目标必须建立在新机会之上。",
        theory: "《权经》：权惟用，不为大也。"
      }
    ]
  },
  {
    id: "c6n1",
    chapterId: 6,
    title: "被架空",
    kind: "main",
    context:
      "你发现 CFO 和销售副总绕过你直接决策，你的批示在系统中只是“参考”。你名义上还是负责人，实际已经被架空。",
    stake: "你要夺回的不只是权力，而是组织对“谁该承担结果”的共识。",
    options: [
      {
        label: "建立关键决策闭环",
        summary: "把重大事项纳入联签机制，用流程重新定义权力边界。",
        quality: "expert",
        effects: { authority: 3, structure: 2 },
        resources: { energy: -8, trust: 2, influence: 7 },
        feedback:
          "你没有公开对抗，而是用流程让绕过你变成“不合规”。制度比个人更能守权。",
        theory: "《韩非子》：法度既立，虽庸主可治。"
      },
      {
        label: "在 CEO 面前摊牌",
        summary: "列出所有绕过决策的案例，要求 CEO 表态。",
        quality: "partial",
        effects: { strategy: 3 },
        resources: { energy: -6, trust: -4, influence: 4 },
        feedback:
          "你争取到了表态，但也让 CFO 和销售副总形成了更紧密的联盟。摊牌必须有后手。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "先忍到业绩翻身",
        summary: "暂时接受现状，等自己做出不可替代的成果再谈。",
        quality: "risk",
        effects: { recovery: 3 },
        resources: { energy: -4, trust: -3, influence: -4 },
        feedback:
          "忍耐会给你时间，但也会让组织形成“你不需要被尊重”的默认规则。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c6n2",
    chapterId: 6,
    title: "越级汇报",
    kind: "main",
    context:
      "你的一位核心下属开始频繁向 CEO 直接汇报，且引用你的决策时故意曲解。你没有直接证据，但团队都看见了。",
    stake: "处理不当会显得你心胸狭窄，不处理会开坏先例。",
    options: [
      {
        label: "建立团队信息公约",
        summary: "在集体层面约定信息同步机制，同时单独和他校准汇报口径。",
        quality: "expert",
        effects: { authority: 3, structure: 2 },
        resources: { energy: -7, trust: 6, influence: 5 },
        feedback:
          "你把个人矛盾转化为团队机制，既守住了边界，又没有把下属逼成敌人。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "公开警告他",
        summary: "在周会上明确越级汇报的红线，杀一儆百。",
        quality: "partial",
        effects: { authority: 3, mobilize: -1 },
        resources: { energy: -5, trust: -7, influence: 4 },
        feedback:
          "边界立住了，但代价是他和 CEO 的关系更深。强硬管理换不来忠诚。",
        theory: "《孙子兵法》：齐之以武，但也要令之以文。"
      },
      {
        label: "不闻不问",
        summary: "只要结果好，就不过问汇报路径。",
        quality: "risk",
        effects: { recovery: 2 },
        resources: { energy: -3, trust: -4, influence: -5 },
        feedback:
          "你避免了冲突，却默许了另一条权力通道。团队开始猜测谁才是真正做主的人。",
        theory: "《资治通鉴》：防微杜渐，不塞隙穴则暴雨疾风必坏。"
      }
    ]
  },
  {
    id: "c7n1",
    chapterId: 7,
    title: "接班人",
    kind: "main",
    context:
      "公司准备让你晋升，要求你提名接班人。两个候选人：一个是能力强但和你不亲近的老将，一个是忠诚但能力有待提升的年轻人。",
    stake: "接班人选择决定你的权力能否延续，也决定组织能否离开你运转。",
    options: [
      {
        label: "用能力匹配岗位，并设计陪跑期",
        summary: "提名老将接核心业务，同时让年轻人在高挑战项目里加速成长。",
        quality: "expert",
        effects: { stability: 3, deploy: 2 },
        resources: { energy: -8, trust: 8, influence: 7 },
        feedback:
          "你没有把接班当成私事。组织形成了双梯队，你的影响力也从个人依赖变成了制度安排。",
        theory: "司马光：谦退也是一种气量和器识；推功于贤智之人。"
      },
      {
        label: "提名忠诚的自己人",
        summary: "优先确保权力延续，让年轻人逐步补能力。",
        quality: "risk",
        effects: { strategy: 3, stability: -1 },
        resources: { energy: -5, trust: -6, influence: 3 },
        feedback:
          "短期看权力没有旁落，但组织很快会失去最优秀的人才。接班不是忠诚测试。",
        theory: "《贞观政要》：用非其才，必难致治。"
      },
      {
        label: "让公司外部招聘",
        summary: "避免内部站队，请公司空降一位更有经验的接班人。",
        quality: "partial",
        effects: { structure: 2, communication: 1 },
        resources: { energy: -6, trust: 1, influence: -4 },
        feedback:
          "外部人带来新经验，但组织内部成长通道被堵住了。你回避了培养责任。",
        theory: "《韩非子·用人》：明主之道，使智者尽其虑。"
      }
    ]
  },
  {
    id: "c7n2",
    chapterId: 7,
    title: "制度化",
    kind: "main",
    context:
      "你发现很多好经验只存在你脑子里：关键客户的判断、风险清单、决策复盘。你一旦出差，团队就回到老路。",
    stake: "怎么把“你会做”变成“组织会做”？",
    options: [
      {
        label: "建立决策复盘知识库",
        summary: "把高频决策做成检查清单和案例库，让团队按流程复现你的判断。",
        quality: "expert",
        effects: { stability: 3, structure: 2 },
        resources: { energy: -9, trust: 4, influence: 6 },
        feedback:
          "你开始把个人经验产品化。即使你不在场，组织也能稳定运行，这是固权的最高形态。",
        theory: "毛泽东《党委会的工作方法》：制度建党，民主集中，不依赖个人。"
      },
      {
        label: "只带核心徒弟",
        summary: "把关键经验传给最信任的一个人，保证权力有人承接。",
        quality: "partial",
        effects: { deploy: 2, strategy: 1 },
        resources: { energy: -5, trust: 4, influence: 2 },
        feedback:
          "你降低了短期风险，却把组织能力绑定在另一个人身上。个人依赖换了一种形式。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "保持神秘优势",
        summary: "不公开判断依据，让自己始终不可替代。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -4, trust: -5, influence: -5 },
        feedback:
          "你暂时保住了地位，却让组织无法放大你的价值。不可替代的下场是不可晋升。",
        theory: "《贞观政要》：善始慎终，创业难守成更难。"
      }
    ]
  },
  {
    id: "c8n1",
    chapterId: 8,
    title: "现金流危机",
    kind: "main",
    context:
      "一个周末，财务告诉你：下月现金流只够发 60% 工资。原因是最大客户突然暂停付款，且没有任何书面解释。",
    stake: "你必须在 48 小时内做出让公司活下去的关键决策。",
    options: [
      {
        label: "先隔离风险，再找机会",
        summary: "立刻暂停非关键支出，同时盘点可快速回款的客户与可融资资产。",
        quality: "expert",
        effects: { structure: 3, execution: 2, recovery: 1 },
        resources: { energy: -8, trust: 5, influence: 6 },
        feedback:
          "你没有让恐慌扩散，而是把危机拆成隔离、回款、融资三条线。团队开始按优先级行动。",
        theory: "《矛盾论》：抓住主要矛盾，其他矛盾就能牵动起来。"
      },
      {
        label: "全员通报并开源节流",
        summary: "公开现金流缺口，号召所有人一起找客户、砍成本。",
        quality: "partial",
        effects: { communication: 2, mobilize: 2 },
        resources: { energy: -6, trust: 4, influence: 3 },
        feedback:
          "透明度带来了危机意识，但也引发了恐慌和离职风险。危机通报需要配行动方案。",
        theory: "《孙子兵法》：上下同欲者胜。"
      },
      {
        label: "先向老板求救",
        summary: "让大股东先垫资，把问题交给更有资源的人。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: -3, influence: -5 },
        feedback:
          "你可能拿到了钱，但也交出了主导权。危机中最危险的信号是“我只等别人救”。",
        theory: "《权经》：权乃人授，授为大焉，但受制于人则不能自主。"
      }
    ]
  },
  {
    id: "c8n2",
    chapterId: 8,
    title: "关键客户流失",
    kind: "main",
    context:
      "你的明星销售突然带着核心客户跳槽到竞对。客户说“我们不是被挖走的，是被服务拖走的”。销售团队人心惶惶。",
    stake: "你如何同时处理客户流失、团队信心和“下一个会是谁”的猜疑？",
    options: [
      {
        label: "先复盘服务链，再谈问责",
        summary: "带客户和交付团队做一次真实复盘，找出系统漏洞，再决定人员调整。",
        quality: "expert",
        effects: { structure: 3, mobilize: 2, recovery: 1 },
        resources: { energy: -9, trust: 6, influence: 5 },
        feedback:
          "你让团队看到，问题不是一个人的背叛，而是一整套服务机制的失败。猜疑被复盘替代。",
        theory: "《实践论》：错误常常是正确的先导，关键是从失败中找出规律。"
      },
      {
        label: "立即重罚相关责任人",
        summary: "公开处理服务负责人，向客户和团队展示态度。",
        quality: "partial",
        effects: { authority: 3, execution: 1 },
        resources: { energy: -6, trust: -6, influence: 3 },
        feedback:
          "你给了外界交代，但内部开始人人自危。真正的问题可能被问责仪式掩盖了。",
        theory: "《韩非子》：明赏罚，但罚不中则众不惧。"
      },
      {
        label: "把客户再抢回来",
        summary: "亲自去见客户，承诺全套服务升级，用诚意挽回。",
        quality: "risk",
        effects: { execution: 2, communication: 2 },
        resources: { energy: -10, trust: 2, influence: 2 },
        feedback:
          "诚意很重要，但如果你一个人能挽回客户，系统漏洞依然存在。下一次流失只是时间问题。",
        theory: "《孙子兵法》：善战者，先为不可胜。"
      }
    ]
  },
  {
    id: "c9n1",
    chapterId: 9,
    title: "功成身退",
    kind: "main",
    context:
      "你的改革成功了：收入增长、团队稳定、CEO 想让你进入更高层。但你知道，继续上升意味着离开一手带起来的组织。",
    stake: "个人成功和事业延续之间，你如何取舍？",
    options: [
      {
        label: "完成交接再上升",
        summary: "把接班人、知识库、风险预案全部落地，并承诺陪跑一个季度。",
        quality: "expert",
        effects: { stability: 3, deploy: 2, strategy: 1 },
        resources: { energy: -7, trust: 8, influence: 8 },
        feedback:
          "你没有把晋升当终点，而是把组织延续当责任。你的权力在交接中反而变得更加可靠。",
        theory: "《资治通鉴》：谦退是一种气量；《贞观政要》：善始慎终。"
      },
      {
        label: "抓住机会立即上升",
        summary: "让组织快速适应新领导，把精力投入更大的平台。",
        quality: "partial",
        effects: { authority: 2, execution: 2 },
        resources: { energy: -5, trust: -4, influence: 5 },
        feedback:
          "你抓住了个人机会，但组织可能因交接断层而退回原样。高层的信任也会打折扣。",
        theory: "《孙子兵法》：将能而君不御者胜。"
      },
      {
        label: "拒绝晋升继续掌权",
        summary: "留在自己最熟悉的战场，维持当前的稳定。",
        quality: "risk",
        effects: { stability: 2, recovery: 1 },
        resources: { energy: -3, trust: -2, influence: -6 },
        feedback:
          "你把安全感当成了目标，却限制了组织的人才流动。固权不等于把所有人留在原地。",
        theory: "《权经》：权惟用，不为大也。"
      }
    ]
  },
  {
    id: "c9n2",
    chapterId: 9,
    title: "传承抉择",
    kind: "main",
    context:
      "你离开前的最后一项决策：是否把一条高毛利但高风险的创新业务继续投入。项目已经烧钱 8 个月，团队说“再坚持半年就能赢”。",
    stake: "你留给组织的不是结论，而是决策方法和承担责任的勇气。",
    options: [
      {
        label: "建立“继续/止损”检查点",
        summary: "用数据定义半年后的验证标准，同时准备两套资源方案。",
        quality: "expert",
        effects: { structure: 3, strategy: 2, execution: 1 },
        resources: { energy: -8, trust: 6, influence: 6 },
        feedback:
          "你没有武断地砍掉项目，也没有被情绪绑架。组织学到了如何理性地拥抱不确定。",
        theory: "《矛盾论》：不同质的矛盾，只有用不同质的方法才能解决。"
      },
      {
        label: "立即止损",
        summary: "按财务纪律砍掉项目，把资源还给核心业务。",
        quality: "partial",
        effects: { execution: 3, authority: 1 },
        resources: { energy: -6, trust: -2, influence: 3 },
        feedback:
          "纪律是对的，但你留下的组织可能学会了“高风险就是错误”。真正的自适应管理不是回避风险。",
        theory: "《孙子兵法》：善战者，先为不可胜。"
      },
      {
        label: "让继任者决定",
        summary: "不把难题留给自己的任期，把决策交给下一任。",
        quality: "risk",
        effects: { recovery: 2, strategy: 1 },
        resources: { energy: -4, trust: -4, influence: -4 },
        feedback:
          "你把责任推给了未来，等于给继任者埋雷。传承最重要的是把决策方法和勇气一起传下去。",
        theory: "《贞观政要》：创业难，守成更难，关键在于持续担当。"
      }
    ]
  },
  {
    id: "s1",
    chapterId: 2,
    title: "危机安抚",
    kind: "side",
    context:
      "一位核心员工刚在公开场合被客户羞辱，回到工位脸色发白。你恰好路过，他没有向你求助。",
    stake: "你的一两句话可能决定他今天是否还能继续工作。",
    options: [
      {
        label: "先请他进会议室喝杯水",
        summary: "不评判、不建议，先让他把情绪说出来。",
        quality: "expert",
        effects: { recovery: 3, communication: 1 },
        resources: { energy: -4, trust: 6, influence: 3 },
        feedback:
          "你让情绪先落了地。他恢复后主动复盘了客户事件，还提出了流程改进。",
        theory: "《高效能人士的七个习惯》：知彼解己，先理解再被理解。"
      },
      {
        label: "当场替他圆场",
        summary: "出面为客户解释，让员工知道你会护着他。",
        quality: "partial",
        effects: { mobilize: 2, authority: 1 },
        resources: { energy: -5, trust: 5, influence: 1 },
        feedback:
          "你的保护让他感激，但他没有学会处理下一次羞辱。护短只能救急，不能救成长。",
        theory: "《孙子兵法》：令之以文，齐之以武。"
      },
      {
        label: "装作没看见",
        summary: "尊重他的自尊，等他主动开口再介入。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -2, trust: -4, influence: -2 },
        feedback:
          "你避免了他的尴尬，但孤独感会放大他的崩溃。关键时刻，沉默也会被记住。",
        theory: "《论语》：君子成人之美，不成人之恶。"
      }
    ]
  },
  {
    id: "s2",
    chapterId: 4,
    title: "新人入职",
    kind: "side",
    context:
      "新来的管培生第一周就提出一个看似天真的方案，被老同事笑了。他下班后还在工位改方案。",
    stake: "你会如何对待一个还在学习如何表达的人？",
    options: [
      {
        label: "让他讲完，再教他结构",
        summary: "给他 10 分钟完整表达，然后用提问帮他补上背景和证据。",
        quality: "expert",
        effects: { deploy: 2, communication: 2 },
        resources: { energy: -5, trust: 7, influence: 4 },
        feedback:
          "你保护了发言的勇气，也教了他专业表达的方法。他后来成了团队里最敢提新想法的人。",
        theory: "德鲁克：用人之所长，而不是用人之所短。"
      },
      {
        label: "让他私下先学流程",
        summary: "提醒他先了解公司规则，成熟后再提建议。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -3, trust: 1, influence: -1 },
        feedback:
          "你把他拉回了流程，但也可能扼杀了他提出新视角的意愿。",
        theory: "《贞观政要》：舍短取长，用其所长。"
      },
      {
        label: "不表态",
        summary: "让团队自然淘汰不成熟的表达，避免特殊照顾。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -2, trust: -4, influence: -3 },
        feedback:
          "你的不表态被解读为默认嘲笑。一个高潜人才可能因此变得不敢表达。",
        theory: "《人物志》：察其行而辨其品，审其变而见其性。"
      }
    ]
  },
  {
    id: "s3",
    chapterId: 6,
    title: "深夜复盘",
    kind: "side",
    context:
      "今天你连续处理了三场冲突，晚上 11 点回到家，手机还在弹工作消息。明天还有一场重要的客户提案。",
    stake: "你如何保护自己的精力，同时不丢掉对团队的责任？",
    options: [
      {
        label: "设 30 分钟关机边界",
        summary: "把手机交给家人，做一次简单呼吸练习，明早 6 点提前处理消息。",
        quality: "expert",
        effects: { recovery: 3, structure: 1 },
        resources: { energy: 10, trust: 1, influence: 1 },
        feedback:
          "你没有把“负责”理解为“随时响应”。恢复后的提案比深夜的即时回复更有价值。",
        theory: "《高效能人士的七个习惯》：先做重要不紧急的事，保护产能。"
      },
      {
        label: "把消息全部回完",
        summary: "确保团队明天醒来没有问题，再考虑休息。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -8, trust: 3, influence: 1 },
        feedback:
          "团队感受到了你的负责，但你的精力被碎片化消耗。长期来看，你会成为新的瓶颈。",
        theory: "《卓有成效的管理者》：时间是最稀缺的资源。"
      },
      {
        label: "约同事明天一起加班",
        summary: "召集核心成员明早提前开会，把压力转成团队行动。",
        quality: "risk",
        effects: { mobilize: 1, communication: 1 },
        resources: { energy: -6, trust: -3, influence: -2 },
        feedback:
          "你把焦虑传播给了团队，却没有给出清晰的优先级。集体疲惫不等于集体执行。",
        theory: "《孙子兵法》：上下同欲者胜，但同欲不等于同耗。"
      }
    ]
  },
  {
    id: "s4",
    chapterId: 3,
    title: "谈判桌上的沉默",
    kind: "side",
    context:
      "你陪同销售负责人见一位关键客户。客户突然问起你上一家公司的失败项目，场面安静了几秒，所有人都在等你回应。",
    stake: "你的一句话可能保住这笔订单，也可能让团队失去谈判主动权。",
    options: [
      {
        label: "承认失败，并讲出可迁移的方法",
        summary: "不回避过去，把失败经验转成客户关心的交付保障。",
        quality: "expert",
        effects: { communication: 3, structure: 1 },
        resources: { energy: -5, trust: 7, influence: 6 },
        feedback:
          "你没有防御，也没有表演真诚，而是让客户看到你会从失败中提取可复用的方法。销售负责人悄悄松了口气。",
        theory: "《实践论》：错误常常是正确的先导，关键是从失败中找出规律。"
      },
      {
        label: "把问题推给销售负责人",
        summary: "暗示客户这是团队执行问题，和自己没有关系。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -3, trust: -5, influence: 2 },
        feedback:
          "你保住了自己的形象，却让团队在客户面前失去一致性。订单即使签下，信任也已经打折。",
        theory: "《孙子兵法》：上下同欲者胜。"
      },
      {
        label: "避而不答，转移话题",
        summary: "用客户更关心的问题把沉默带过去。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -4, trust: -3, influence: -2 },
        feedback:
          "你暂时避开了尴尬，但客户记得你没有正面回答。回避本身也是一种答案。",
        theory: "《权经》：揣为上，事次之，但不可失信于人。"
      }
    ]
  },
  {
    id: "s5",
    chapterId: 5,
    title: "周末交付危机",
    kind: "side",
    context:
      "周六晚上，关键项目发现严重数据错误，客户周一上午就要看演示。团队核心成员已经连续两周没有休息。",
    stake: "你需要决定：连夜修复，还是先把风险告诉客户。",
    options: [
      {
        label: "先隔离错误范围，再决定加班方案",
        summary: "用 30 分钟确认错误影响，只留下真正必要的人处理。",
        quality: "expert",
        effects: { structure: 3, execution: 2, recovery: 1 },
        resources: { energy: -6, trust: 6, influence: 5 },
        feedback:
          "你没有让所有人盲目加班，而是先缩小问题范围。团队看到你在用结构保护他们的精力。",
        theory: "《矛盾论》：抓住主要矛盾，其他问题才能迎刃而解。"
      },
      {
        label: "全员立即上线处理",
        summary: "先把错误修完，其他事情等演示结束后再说。",
        quality: "partial",
        effects: { execution: 3 },
        resources: { energy: -12, trust: -2, influence: 2 },
        feedback:
          "问题可能修完了，但团队连续加班的风险会在下个季度爆发。你不是在管理精力，只是在透支未来。",
        theory: "《卓有成效的管理者》：时间是最稀缺的资源。"
      },
      {
        label: "周一直接带风险上会",
        summary: "不临时修复，把真实情况完整告诉客户。",
        quality: "risk",
        effects: { communication: 2, recovery: 1 },
        resources: { energy: -3, trust: 3, influence: -6 },
        feedback:
          "坦诚值得肯定，但你本可以在周末先控制错误范围。只带风险上会，客户会认为团队没有执行能力。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "s6",
    chapterId: 8,
    title: "团队崩溃时刻",
    kind: "side",
    context:
      "业务连续受挫后，核心团队在复盘会上开始互相指责，有人提出辞职，有人把失败归咎于你。",
    stake: "你需要在情绪失控前，重新建立团队对彼此和目标的信任。",
    options: [
      {
        label: "先叫停指责，重新约定复盘规则",
        summary: "把讨论从“谁错了”转成“我们从哪里学到了什么”。",
        quality: "expert",
        effects: { mobilize: 3, communication: 2 },
        resources: { energy: -7, trust: 8, influence: 6 },
        feedback:
          "你没有急着背锅，也没有找人顶罪，而是先改变讨论结构。团队开始把失败当成共同材料。",
        theory: "毛泽东《党委会的工作方法》：先当学生，再当先生。"
      },
      {
        label: "独自承担责任",
        summary: "把所有失败都揽到自己身上，让团队停止争吵。",
        quality: "partial",
        effects: { recovery: 2, authority: 1 },
        resources: { energy: -8, trust: 5, influence: -2 },
        feedback:
          "团队暂时安静了，但他们没有学会面对失败。过度背锅也会让真正的问题消失。",
        theory: "《论语》：君子求诸己，小人求诸人。"
      },
      {
        label: "点名批评最响的反对者",
        summary: "用高压让团队先服从，再讨论下一步。",
        quality: "risk",
        effects: { authority: 3 },
        resources: { energy: -5, trust: -8, influence: 3 },
        feedback:
          "你压住了场面，却把团队拆成了更小的阵营。下一次失败时，没有人愿意先开口。",
        theory: "《孙子兵法》：令之以文，齐之以武，但文武必须并用。"
      }
    ]
  },
  {
    id: "s7",
    chapterId: 6,
    title: "越级汇报",
    kind: "side",
    context:
      "核心下属开始跳过你直接向 CEO 汇报，并在高层会议里曲解你的决策。团队都在看你会如何处理这件事。",
    stake: "处理越级汇报不能只靠私下警告，也不能公开羞辱，你需要让规则重新变得可信。",
    options: [
      {
        label: "先对齐决策闭环，再私下谈话",
        summary: "把越级汇报变成流程问题：明确关键决策必须进入联合机制，再单独说明边界。",
        quality: "expert",
        effects: { authority: 3, structure: 2 },
        resources: { energy: -6, trust: 6, influence: 6 },
        feedback:
          "你没有把冲突变成站队，而是让所有人看到：越过流程会付出协作成本，守住流程会获得信任。下属很快回到了正式汇报路径。",
        theory: "《权经》：用权有度，授权赋能，主动掌控，先胜后战。"
      },
      {
        label: "当场驳回并警告",
        summary: "在高管会上公开纠正对方，树立不可越级的威严。",
        quality: "partial",
        effects: { authority: 3 },
        resources: { energy: -5, trust: -6, influence: 4 },
        feedback:
          "威严立住了，但下属从此把真实信息藏得更深。越级汇报减少了，越过你决策的行为却增加了。",
        theory: "《孙子兵法》：致人而不致于人。"
      },
      {
        label: "暂时沉默观察",
        summary: "不急着表态，先收集对方越级汇报的真实动机。",
        quality: "risk",
        effects: { insight: 2 },
        resources: { energy: -4, trust: -3, influence: -4 },
        feedback:
          "沉默被读成了默许。团队开始绕过你直接找高层，权力边界在观望中彻底失守。",
        theory: "《鬼谷子》：审定形势，谋定后动。"
      }
    ]
  },
  {
    id: "s8",
    chapterId: 7,
    title: "绕过决策",
    kind: "side",
    context:
      "一位资深的部门负责人开始绕过你直接推动业务合作，投资人和高层都收到了他的方案，而你被留在结果面前负责。",
    stake: "你要在制度与信任之间守住边界，而不是靠一次谈话让所有人选边站。",
    options: [
      {
        label: "把方案纳入正式决策评审",
        summary: "承认方案价值，同时要求它进入预算与风险评审，让权力回到机制。",
        quality: "expert",
        effects: { structure: 3, authority: 2 },
        resources: { energy: -7, trust: 5, influence: 7 },
        feedback:
          "你没有否定对方，而是让所有人都看到：好方案必须经过同一套规则。这位负责人反而成了流程的维护者。",
        theory: "《权经》：权乃人授，授为大焉；用制度守住权力边界。"
      },
      {
        label: "直接取消合作",
        summary: "用否决权证明谁说了算，避免被架空。",
        quality: "partial",
        effects: { authority: 3 },
        resources: { energy: -5, trust: -8, influence: 3 },
        feedback:
          "方案停了，但组织记住了你习惯用否决代替规则。下一次对方会带着更隐蔽的联盟回来。",
        theory: "《韩非子》：法、术、势并用，不能以力代制。"
      },
      {
        label: "让 CEO 裁断",
        summary: "把边界问题交给更高层，避免自己卷入政治。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -3, trust: -5, influence: -5 },
        feedback:
          "你把协调难题上交了，短期内安全，但高层会记住你无法横向守住边界。",
        theory: "《资治通鉴》：推功于人，以维系团结。"
      }
    ]
  },
  {
    id: "s9",
    chapterId: 8,
    title: "交接断点",
    kind: "side",
    context:
      "你即将晋升，却发现关键业务高度依赖你个人的沟通网络。你休假一天，项目就停滞半天，没人知道下一步该问谁。",
    stake: "你要把个人经验变成组织能力，而不是让交接变成一次赌博。",
    options: [
      {
        label: "建立决策手册与交接演练",
        summary: "把高频判断写成清单，让接替者用真实案例演练并验收。",
        quality: "expert",
        effects: { structure: 3, stability: 2 },
        resources: { energy: -8, trust: 6, influence: 5 },
        feedback:
          "你离开后，团队第一次在没有你的情况下完成了一次完整决策。经验变成了流程，权力变成了能力。",
        theory: "《卓有成效的管理者》：管理者必须把时间投入真正重要的决策。"
      },
      {
        label: "只带关键助手熟悉关系",
        summary: "挑一个人贴身跟学人脉和流程，降低短期风险。",
        quality: "partial",
        effects: { deploy: 2, communication: 1 },
        resources: { energy: -6, trust: 3, influence: -3 },
        feedback:
          "单点备份解决了眼前问题，但组织仍然依赖某一个关键人。你走后，断点只是换了名字。",
        theory: "《贞观政要》：以天下之财，非其人不可治。"
      },
      {
        label: "把问题留给接替者",
        summary: "相信组织会自然适应，把精力留给新岗位。",
        quality: "risk",
        effects: { recovery: 2 },
        resources: { energy: -4, trust: -4, influence: -6 },
        feedback:
          "新岗位还没站稳，旧业务已经失速。你个人赢了晋升，组织付出了代价。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c1b-parachute",
    chapterId: 1,
    title: "权力地图",
    kind: "branch",
    context:
      "你选择先做权力地图。行政主管愿意配合，但财务经理仍保持距离，你需要判断谁是你的第一联盟。",
    stake: "你要把第一轮访谈变成可信的联盟基础。",
    options: [
      {
        label: "先与行政主管共建信息网络",
        summary: "把行政主管变成你的组织雷达，但不让她承担风险。",
        quality: "expert",
        effects: { insight: 3, communication: 2 },
        resources: { energy: -6, trust: 8, influence: 5 },
        feedback: "你把第一个盟友放进了正确位置，组织信息开始流向你。",
        theory: "《人物志》：观其外而知其内，察其行而辨其品。"
      },
      {
        label: "先争取财务经理",
        summary: "用透明度换取财务数据，先建立专业信任。",
        quality: "partial",
        effects: { authority: 2, structure: 2 },
        resources: { energy: -7, trust: 5, influence: 3 },
        feedback: "你拿到了数据，但行政主管开始觉得你绕过了她。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "自己组建临时信息小组",
        summary: "绕过双方，从一线骨干收集信息。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -9, trust: -4, influence: 1 },
        feedback: "你信息更全面了，但也在第一周制造了两个潜在的反对者。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c1b-founder",
    chapterId: 1,
    title: "现金流最小验证",
    kind: "branch",
    context:
      "你决定先用访谈建立信任，但创始人直觉提醒你：如果没有现金流验证，团队只会继续内耗。",
    stake: "你要在信任和现金流之间找到第一个可验证的突破口。",
    options: [
      {
        label: "选一个 48 小时可验证的现金流动作",
        summary: "把访谈结论压缩成一个最小验证，让团队看到数据变化。",
        quality: "expert",
        effects: { execution: 3, structure: 2 },
        resources: { energy: -8, trust: 5, influence: 6 },
        feedback: "你用一个可验证动作把关系访谈变成了业务推进。",
        theory: "德鲁克：管理者的成果是贡献，不是忙碌。"
      },
      {
        label: "先补齐团队信息再验证",
        summary: "等访谈完成，信息足够后再行动。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "团队觉得你重视他们，但业务仍没有新的变化。",
        theory: "《权经》：揣为上，事次之。"
      },
      {
        label: "跳过访谈直接做验证",
        summary: "用创始人直觉先跑一个动作，不浪费时间。",
        quality: "risk",
        effects: { execution: 3, strategy: 1 },
        resources: { energy: -7, trust: -6, influence: 2 },
        feedback: "你可能验证了业务，却让团队认为你并不真的听他们。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      }
    ]
  },
  {
    id: "c1b-highPotential",
    chapterId: 1,
    title: "横向共识会",
    kind: "branch",
    context:
      "你没有正式任命，决定先用访谈建立横向共识。现在你需要让这轮共识变成一个能被各部门认可的行动计划。",
    stake: "你要让每个部门都觉得自己参与了，而不是被通知。",
    options: [
      {
        label: "把访谈结论转成共同行动计划",
        summary: "让每个关键人都带一个自己愿意负责的动作进入计划。",
        quality: "expert",
        effects: { communication: 3, mobilize: 2 },
        resources: { energy: -7, trust: 8, influence: 6 },
        feedback: "计划不再是你一个人的，各部门开始主动认领责任。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "先向更高层汇报结论",
        summary: "用高层支持推动部门执行。",
        quality: "partial",
        effects: { strategy: 3 },
        resources: { energy: -5, trust: -3, influence: 4 },
        feedback: "你获得了背书，却削弱了横向共识的主动性。",
        theory: "《权经》：携为上，功次之。"
      },
      {
        label: "直接发出执行清单",
        summary: "自己整理清单，要求各部门配合。",
        quality: "risk",
        effects: { execution: 2, authority: 1 },
        resources: { energy: -6, trust: -6, influence: 2 },
        feedback: "清单很快被各部门当成别人家的事。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "c2b-parachute",
    chapterId: 2,
    title: "空降 · 授权真空下的第一选择",
    kind: "branch",
    context:
      "你作为空降管理者，在没有正式授权时决定先做小胜利。团队开始观察你会把第一个承诺投给谁。",
    stake: "你要让高层看到你能在没有名分时建立判断秩序。",
    options: [
      {
        label: "先锁定一个 14 天内能赢的项目",
        summary: "选一个边界清楚、风险可控、能证明你判断力的项目。",
        quality: "expert",
        effects: { execution: 3, strategy: 2 },
        resources: { energy: -6, trust: 5, influence: 6 },
        feedback: "你把授权真空变成观察期，用可验证结果换回了主动权。",
        theory: "《权经》：携为上，功次之。"
      },
      {
        label: "先向上说明需要授权",
        summary: "让 CEO 明确授权边界，避免名不正言不顺。",
        quality: "partial",
        effects: { strategy: 2, communication: 1 },
        resources: { energy: -5, trust: 2, influence: 3 },
        feedback: "你争取了授权，但也可能让高层觉得你在等别人给权力。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "先绕开授权推进关键动作",
        summary: "不等正式文件，先做出改变。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -6, trust: -4, influence: 2 },
        feedback: "你展现了行动力，但越权动作会留下权力边界风险。",
        theory: "《韩非子》：事以密成，语以泄败。"
      }
    ]
  },
  {
    id: "c2b-founder",
    chapterId: 2,
    title: "创业 · 授权真空下的第一选择",
    kind: "branch",
    context:
      "你作为创始人，在没有明确组织授权时决定先验证现金流。团队开始等待你给出第一个可执行方向。",
    stake: "你要让团队相信，即使没有完整体系，你也能找到活路。",
    options: [
      {
        label: "先锁定一个可回款的客户动作",
        summary: "选一个能在两周内产生现金流的动作，先跑通再谈体系。",
        quality: "expert",
        effects: { execution: 3, structure: 2 },
        resources: { energy: -7, trust: 5, influence: 5 },
        feedback: "你用一个真实回款动作建立了创业团队的第一套确定性。",
        theory: "德鲁克：管理者的成果是贡献，不是忙碌。"
      },
      {
        label: "先补齐合伙人共识",
        summary: "避免创始人独断，先统一方向再行动。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "共识变多了，但业务动作仍没有开始。",
        theory: "《论语》：君子信而后劳其民。"
      },
      {
        label: "直接砍掉低效业务",
        summary: "用创始人权力快速止血，把资源转向高潜力方向。",
        quality: "risk",
        effects: { execution: 3 },
        resources: { energy: -7, trust: -5, influence: 1 },
        feedback: "资源被集中了，但团队对未来的安全感被同时砍掉。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      }
    ]
  },
  {
    id: "c2b-highPotential",
    chapterId: 2,
    title: "高潜 · 授权真空下的第一选择",
    kind: "branch",
    context:
      "你作为高潜骨干，在没有正式任命时决定先建立横向共识。各部门开始等待你证明项目值得参与。",
    stake: "你要让关键人愿意把时间投给一个没有头衔的你。",
    options: [
      {
        label: "先建立一个共同目标工作台",
        summary: "用一张看板把各部门目标、责任和截止时间公开对齐。",
        quality: "expert",
        effects: { communication: 3, structure: 2 },
        resources: { energy: -6, trust: 6, influence: 5 },
        feedback: "你没有要求授权，而是让协作关系变得可操作。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "先私下说服两个关键部门",
        summary: "减少公开阻力，先获得核心支持。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 2, influence: 2 },
        feedback: "你获得了局部支持，但未被邀请的部门会感到被排除。",
        theory: "《权经》：揣为上，事次之。"
      },
      {
        label: "直接向上级提交完整方案",
        summary: "用高层推动打破部门僵局。",
        quality: "risk",
        effects: { authority: 1, execution: 1 },
        resources: { energy: -4, trust: -4, influence: 2 },
        feedback: "方案被推进了，但横向关系反而变得更疏远。",
        theory: "《韩非子》：事以密成，语以泄败。"
      }
    ]
  },
  {
    id: "c3b-parachute",
    chapterId: 3,
    title: "空降 · 人才配置的第一次落子",
    kind: "branch",
    context:
      "你作为空降管理者开始重组关键岗位。团队最担心的是你会不会用亲疏替代能力。",
    stake: "你的第一个人事动作会成为未来规则的样本。",
    options: [
      {
        label: "先定义岗位成果，再评估人选",
        summary: "让人才判断从印象变成岗位匹配证据。",
        quality: "expert",
        effects: { deploy: 3, structure: 2 },
        resources: { energy: -7, trust: 6, influence: 5 },
        feedback: "你让人事决定变得可解释，团队开始用成果而非关系理解你。",
        theory: "《贞观政要》：用非其才，必难致治。"
      },
      {
        label: "先稳住核心客户负责人",
        summary: "优先保护掌握客户的老人，避免业务波动。",
        quality: "partial",
        effects: { execution: 2, strategy: 1 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "业务暂时稳定，但团队认为你被核心客户绑架。",
        theory: "《权经》：携为上，功次之。"
      },
      {
        label: "先替换最反对你的老将",
        summary: "用人事动作立威，让其他人快速表态。",
        quality: "risk",
        effects: { authority: 3 },
        resources: { energy: -6, trust: -8, influence: 2 },
        feedback: "你获得了短期服从，但组织开始为自保而隐藏信息。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c3b-founder",
    chapterId: 3,
    title: "创业 · 人才配置的第一次落子",
    kind: "branch",
    context:
      "你作为创始人开始重组团队。公司最依赖的人正控制核心客户，但管理能力不足。",
    stake: "你要在依赖与组织健康之间做第一次取舍。",
    options: [
      {
        label: "把核心客户拆成可复制的客户体系",
        summary: "不让客户只属于一个人，先建立关键客户管理流程。",
        quality: "expert",
        effects: { structure: 3, deploy: 2 },
        resources: { energy: -7, trust: 5, influence: 5 },
        feedback: "你没有直接开人，而是让组织不再被单个明星绑架。",
        theory: "德鲁克：用人之所长，同时让成果可复制。"
      },
      {
        label: "继续依赖明星员工",
        summary: "先保业绩，等公司稳定后再处理结构问题。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -5, trust: 2, influence: -1 },
        feedback: "短期业绩稳定，但组织对人的依赖正在加深。",
        theory: "《韩非子》：明主之道，使智者尽其虑。"
      },
      {
        label: "立刻架空明星员工",
        summary: "用新人接管客户，防止权力失控。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -7, trust: -7, influence: 1 },
        feedback: "你削弱了个人依赖，但客户流失风险在交接期爆发。",
        theory: "《孙子兵法》：善战者，先为不可胜。"
      }
    ]
  },
  {
    id: "c3b-highPotential",
    chapterId: 3,
    title: "高潜 · 人才配置的第一次落子",
    kind: "branch",
    context:
      "你作为高潜骨干参与人才盘点。部门负责人希望你给结论，但所有人都在等你说出谁该被留下。",
    stake: "你要给出不偏私、又能被组织接受的判断。",
    options: [
      {
        label: "用岗位成果模型公开评估",
        summary: "先让所有人都看到评估标准，再给出人选建议。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -6, trust: 6, influence: 5 },
        feedback: "你没有制造派系，而是让组织开始用共同标准讨论人。",
        theory: "《人物志》：观其外而知其内，察其行而辨其品。"
      },
      {
        label: "先私下给部门负责人结论",
        summary: "避免公开得罪人，让负责人决定是否采纳。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 2, influence: 2 },
        feedback: "你保护了自己，但结论缺少公开依据，容易被推翻。",
        theory: "《权经》：揣为上，事次之。"
      },
      {
        label: "公开点出能力不足的人",
        summary: "用数据直接说明谁不适合当前岗位。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -5, trust: -6, influence: 2 },
        feedback: "你指出了事实，却让被点名者成为靶子，讨论开始转向人身。",
        theory: "《论语》：君子成人之美，不成人之恶。"
      }
    ]
  },
  {
    id: "c4b-parachute",
    chapterId: 4,
    title: "空降 · 阻力面前的第一次同盟",
    kind: "branch",
    context:
      "你作为空降管理者推动新流程，运营负责人公开反对。你没有压制，而是决定把谁拉进共同责任。",
    stake: "你要让反对者从阻力变成共同负责人，而不是把他推向更深的对立。",
    options: [
      {
        label: "把反对者变成试点负责人",
        summary: "让他的顾虑成为方案前提，并让他负责试点结果。",
        quality: "expert",
        effects: { mobilize: 3, communication: 2 },
        resources: { energy: -7, trust: 8, influence: 6 },
        feedback: "你让最有能力反对的人开始为结果负责，变革第一次有了共同所有权。",
        theory: "《孙子兵法》：上下同欲者胜。"
      },
      {
        label: "先私下争取他的支持",
        summary: "避免公开对抗，先谈条件再宣布。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "他暂时支持你，但团队其他人并不清楚你们的交易。",
        theory: "《权经》：揣为上，事次之。"
      },
      {
        label: "用高层授权强制推进",
        summary: "不等待共识，用 CEO 背书让流程先落地。",
        quality: "risk",
        effects: { authority: 3 },
        resources: { energy: -5, trust: -7, influence: 4 },
        feedback: "流程落地了，但运营团队开始用沉默抵抗你。",
        theory: "《孙子兵法》：令之以文，齐之以武，但不可偏废。"
      }
    ]
  },
  {
    id: "c4b-founder",
    chapterId: 4,
    title: "创业 · 阻力面前的第一次同盟",
    kind: "branch",
    context:
      "你作为创始人推动产品方向变化，联合创始人公开反对。团队分成两派，都在等你表态。",
    stake: "你要让反对意见变成产品验证的一部分，而不是内部分裂。",
    options: [
      {
        label: "把双方观点变成可验证实验",
        summary: "不让团队站队，用两周实验验证两条路径。",
        quality: "expert",
        effects: { structure: 3, mobilize: 2 },
        resources: { energy: -7, trust: 7, influence: 5 },
        feedback: "你把创始人之间的争论变成了组织学习，团队重新开始合作。",
        theory: "《实践论》：从实践中找规律。"
      },
      {
        label: "按自己的判断直接定方向",
        summary: "承担创始人责任，用权力结束争论。",
        quality: "partial",
        effects: { authority: 2, execution: 1 },
        resources: { energy: -5, trust: -4, influence: 3 },
        feedback: "方向定了，但联合创始人的不认同仍会持续影响执行。",
        theory: "《权经》：权惟用，不为大也。"
      },
      {
        label: "让董事会介入仲裁",
        summary: "把内部争议交给外部裁决。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -4, trust: -6, influence: -3 },
        feedback: "你避免了亲自得罪人，却让团队看到创始团队无法自治。",
        theory: "《韩非子》：明主之道，使智者尽其虑。"
      }
    ]
  },
  {
    id: "c4b-highPotential",
    chapterId: 4,
    title: "高潜 · 阻力面前的第一次同盟",
    kind: "branch",
    context:
      "你作为高潜骨干提出的方案被资深负责人反对。你没有职位权力，但方案里确实存在一个关键漏洞。",
    stake: "你要让反对者愿意和你一起改方案，而不是坚持对错。",
    options: [
      {
        label: "把反对者的漏洞变成方案修订项",
        summary: "公开承认缺口，请他提供专业补充。",
        quality: "expert",
        effects: { communication: 3, structure: 2 },
        resources: { energy: -6, trust: 8, influence: 5 },
        feedback: "你把最强反对者变成了最强协作者，方案反而更扎实。",
        theory: "《论语》：君子求诸己，小人求诸人。"
      },
      {
        label: "先争取更高层支持",
        summary: "绕过反对者，用上级推动方案通过。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: -5, influence: 3 },
        feedback: "方案暂时通过了，但资深负责人不会再主动帮助你。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "坚持原方案，指出对方误解",
        summary: "先证明自己没错，再讨论改进。",
        quality: "risk",
        effects: { authority: 1 },
        resources: { energy: -4, trust: -6, influence: -2 },
        feedback: "你证明了观点，却把讨论变成谁对谁错，协作入口关闭了。",
        theory: "《人物志》：审其变而见其性。"
      }
    ]
  },
  {
    id: "c5b-parachute",
    chapterId: 5,
    title: "空降 · 目标落地的第一次拆解",
    kind: "branch",
    context:
      "你作为空降管理者拿到收入翻倍目标，团队开始点头但没人知道明天做什么。",
    stake: "你要把口号变成每个团队都能检查的关键结果。",
    options: [
      {
        label: "用关键结果倒排行动和责任人",
        summary: "把目标拆成三个可验证结果，并让每个人认领。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -7, trust: 5, influence: 6 },
        feedback: "目标第一次变成可检查的作战图，团队不再只点头。",
        theory: "德鲁克：把资源集中在真正重要的少数任务上。"
      },
      {
        label: "先让各部门自报目标",
        summary: "尊重现有汇报体系，只做汇总。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -5, trust: 3, influence: 1 },
        feedback: "各部门目标很快互相冲突，你只能不断协调。",
        theory: "《韩非子》：使事不相干，使士不兼官。"
      },
      {
        label: "直接给每个部门下指标",
        summary: "用目标压力推动执行，避免讨论拖延。",
        quality: "risk",
        effects: { authority: 2, execution: 1 },
        resources: { energy: -5, trust: -5, influence: 3 },
        feedback: "数字被下达了，但团队开始寻找最容易完成的解释。",
        theory: "《孙子兵法》：上下同欲者胜。"
      }
    ]
  },
  {
    id: "c5b-founder",
    chapterId: 5,
    title: "创业 · 目标落地的第一次拆解",
    kind: "branch",
    context:
      "你作为创始人面对增长目标，产品、销售、研发各有优先级。团队需要你把目标变成共同节奏。",
    stake: "你要让三个部门围绕同一个可验证结果行动。",
    options: [
      {
        label: "锁定一个可回款的关键结果",
        summary: "让所有部门围绕“本季度回款”定义各自动作。",
        quality: "expert",
        effects: { execution: 3, structure: 2 },
        resources: { energy: -7, trust: 5, influence: 5 },
        feedback: "不同部门第一次用同一个结果语言协作。",
        theory: "《卓有成效的管理者》：要事优先。"
      },
      {
        label: "让三个部门分别定目标",
        summary: "减少创始人干预，让部门自主。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -5, trust: 3, influence: 1 },
        feedback: "部门目标各自合理，但合在一起并不支持增长。",
        theory: "《韩非子》：明主之道，使智者尽其虑。"
      },
      {
        label: "用投资人压力强推目标",
        summary: "让团队知道目标不能谈，只能执行。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -5, trust: -6, influence: 2 },
        feedback: "团队开始执行，但不再愿意暴露真实风险。",
        theory: "《孙子兵法》：令之以文，齐之以武。"
      }
    ]
  },
  {
    id: "c5b-highPotential",
    chapterId: 5,
    title: "高潜 · 目标落地的第一次拆解",
    kind: "branch",
    context:
      "你作为高潜骨干被要求带领跨部门小组完成季度目标，但没有人真正向你汇报。",
    stake: "你要用目标管理代替行政命令，让成员愿意协作。",
    options: [
      {
        label: "建立共同看板和轮流主持节奏",
        summary: "让每个成员承担一个公开可见的关键结果。",
        quality: "expert",
        effects: { communication: 3, structure: 2 },
        resources: { energy: -6, trust: 7, influence: 5 },
        feedback: "你让项目变成共同所有，而不是你一个人的任务。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "先争取部门负责人支持",
        summary: "让负责人认可目标，再推动成员执行。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 2, influence: 2 },
        feedback: "负责人支持了，但成员仍然只向原部门汇报。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "直接发布目标清单",
        summary: "用清晰指令让各部门配合。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -5, trust: -5, influence: 2 },
        feedback: "清单发出去了，但被各部门当作别人的项目。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "c6b-parachute",
    chapterId: 6,
    title: "空降 · 权力边界的第一次固化",
    kind: "branch",
    context:
      "你作为空降管理者发现有人绕过你决策。你没有选择公开对抗，而是准备用制度重新定义边界。",
    stake: "你要让“重大决策进入闭环”成为组织默认规则。",
    options: [
      {
        label: "建立联签和变更留痕机制",
        summary: "用流程让绕过你变成不合规，而不是个人冲突。",
        quality: "expert",
        effects: { authority: 3, structure: 2 },
        resources: { energy: -7, trust: 2, influence: 6 },
        feedback: "你让权力边界从个人态度变成组织规则，冲突被流程吸收。",
        theory: "《韩非子》：法度既立，虽庸主可治。"
      },
      {
        label: "直接找越级者谈话",
        summary: "用一次明确谈话让对方知道边界。",
        quality: "partial",
        effects: { authority: 2, communication: 1 },
        resources: { energy: -5, trust: -2, influence: 3 },
        feedback: "对方暂时收敛了，但没有制度约束，下一次会换个方式绕过。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "先让越级者承担一次失败",
        summary: "等他出错后再处理，用事实证明你的边界。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: -5, influence: -2 },
        feedback: "你可能等到了失败，但组织也承担了本可避免的损失。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "c6b-founder",
    chapterId: 6,
    title: "创业 · 权力边界的第一次固化",
    kind: "branch",
    context:
      "你作为创始人发现合伙人绕过你直接决策。你名义上是 CEO，实际决策正在被架空。",
    stake: "你要重建决策机制，而不是让公司进入公开摊牌。",
    options: [
      {
        label: "把重大决策纳入董事会机制",
        summary: "用治理结构保护决策权，而不是靠个人对抗。",
        quality: "expert",
        effects: { structure: 3, authority: 2 },
        resources: { energy: -6, trust: 3, influence: 6 },
        feedback: "你让权力边界回到治理规则，合伙人无法再靠私人关系绕过你。",
        theory: "《韩非子》：法、术、势并用。"
      },
      {
        label: "与合伙人签订权责协议",
        summary: "明确各自的决策范围，避免继续模糊。",
        quality: "partial",
        effects: { communication: 2, strategy: 1 },
        resources: { energy: -5, trust: 2, influence: 3 },
        feedback: "权责变清晰了，但执行时仍缺少强制检查。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "用 CEO 身份公开重申边界",
        summary: "让团队知道所有决策必须经过你。",
        quality: "risk",
        effects: { authority: 3 },
        resources: { energy: -5, trust: -7, influence: 2 },
        feedback: "你夺回了表面权力，但合伙人开始在公司外寻找盟友。",
        theory: "《孙子兵法》：令之以文，齐之以武。"
      }
    ]
  },
  {
    id: "c6b-highPotential",
    chapterId: 6,
    title: "高潜 · 权力边界的第一次固化",
    kind: "branch",
    context:
      "你作为高潜骨干的项目被更高层直接指挥，关键决定绕过了你，但结果仍要你负责。",
    stake: "你要守住项目主导权，又不和高层正面冲突。",
    options: [
      {
        label: "用项目章程固定决策与变更规则",
        summary: "让所有关键变更进入统一流程，保护项目一致性。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -6, trust: 4, influence: 5 },
        feedback: "你没有争夺头衔，而是让项目本身有了可执行的决策规则。",
        theory: "《韩非子》：使事不相干，使士不兼官。"
      },
      {
        label: "私下向更高层解释风险",
        summary: "用风险说明让高层愿意听你的判断。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 2, influence: 2 },
        feedback: "高层暂时接受了，但绕过行为没有变成制度约束。",
        theory: "《权经》：揣为上，事次之。"
      },
      {
        label: "拒绝为未经你确认的决策负责",
        summary: "公开划清责任边界，防止自己被架空。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -5, trust: -6, influence: -3 },
        feedback: "你守住了责任边界，却被视为不配合高层。",
        theory: "《论语》：君子求诸己，小人求诸人。"
      }
    ]
  },
  {
    id: "c7b-parachute",
    chapterId: 7,
    title: "空降 · 组织能力的第一次沉淀",
    kind: "branch",
    context:
      "你作为空降管理者发现很多判断只存在你脑子里。你一离开，团队就回到老路。",
    stake: "你要让组织开始离开你也能运行。",
    options: [
      {
        label: "把高频决策做成检查清单",
        summary: "让团队在关键节点使用可复用的判断流程。",
        quality: "expert",
        effects: { stability: 3, structure: 2 },
        resources: { energy: -7, trust: 4, influence: 6 },
        feedback: "你开始把个人经验产品化，组织第一次不再依赖你的反应速度。",
        theory: "毛泽东《党委会的工作方法》：制度建党，不依赖个人。"
      },
      {
        label: "只培养一个核心代理人",
        summary: "把关键经验传给最信任的人。",
        quality: "partial",
        effects: { deploy: 2, strategy: 1 },
        resources: { energy: -5, trust: 4, influence: 2 },
        feedback: "你降低了短期风险，却把组织能力绑定在另一个人身上。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "保持个人判断优势",
        summary: "不公开方法，让自己不可替代。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -4, trust: -5, influence: -5 },
        feedback: "你保住了位置，却让组织无法放大你的价值。",
        theory: "《贞观政要》：善始慎终，创业难守成更难。"
      }
    ]
  },
  {
    id: "c7b-founder",
    chapterId: 7,
    title: "创业 · 组织能力的第一次沉淀",
    kind: "branch",
    context:
      "你作为创始人发现公司所有关键决策都要经过你，你生病一天业务就停一半。",
    stake: "你要把创始人经验变成可复制的组织流程。",
    options: [
      {
        label: "把关键决策写成经营手册",
        summary: "让核心团队使用同一套判断框架。",
        quality: "expert",
        effects: { stability: 3, structure: 2 },
        resources: { energy: -7, trust: 5, influence: 6 },
        feedback: "你开始把创始人直觉制度化，公司第一次有了“不依赖你也能决策”的路径。",
        theory: "德鲁克：把个人贡献转化为组织能力。"
      },
      {
        label: "只带一个联合创始人",
        summary: "把关键经验传给一人，保证重大决策不失控。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "公司不再只依赖你，但开始依赖另一个个人。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "继续亲自掌控所有决策",
        summary: "保持创始人控制力，防止执行走样。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -8, trust: -2, influence: -2 },
        feedback: "公司稳定在你手里，但增长被你的精力锁死。",
        theory: "《贞观政要》：善始慎终。"
      }
    ]
  },
  {
    id: "c7b-highPotential",
    chapterId: 7,
    title: "高潜 · 组织能力的第一次沉淀",
    kind: "branch",
    context:
      "你作为高潜骨干的项目高度依赖你个人的沟通网络。你一休假，项目就停滞。",
    stake: "你要把个人关系变成团队流程。",
    options: [
      {
        label: "把关键沟通节点做成协作地图",
        summary: "让团队知道关键人、时间节点和交接责任。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -6, trust: 6, influence: 5 },
        feedback: "你把自己的网络变成了团队资产，项目第一次可以在你离开时继续运行。",
        theory: "《韩非子》：使事不相干，使士不兼官。"
      },
      {
        label: "让一位同事替代你对接",
        summary: "把关系转给最信任的同事，减少交接成本。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "替代者接手了，但组织仍依赖个人关系而非机制。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "不公开关系网络",
        summary: "保持自己在项目中的不可替代性。",
        quality: "risk",
        effects: { authority: 1 },
        resources: { energy: -3, trust: -5, influence: -4 },
        feedback: "你保住了影响力，却让项目变得脆弱。",
        theory: "《贞观政要》：善始慎终。"
      }
    ]
  },
  {
    id: "c8b-parachute",
    chapterId: 8,
    title: "空降 · 危机中的第一次隔离",
    kind: "branch",
    context:
      "你作为空降管理者遭遇现金流危机。财务只给了 48 小时，团队开始恐慌。",
    stake: "你要在信息不全时先隔离风险，再寻找机会。",
    options: [
      {
        label: "先建危机作战室，分三条线处理",
        summary: "隔离风险、回款、融资三条线同时推进。",
        quality: "expert",
        effects: { structure: 3, execution: 2, recovery: 1 },
        resources: { energy: -7, trust: 6, influence: 6 },
        feedback: "你没有让恐慌扩散，而是把危机拆成可管理的任务。",
        theory: "《矛盾论》：抓住主要矛盾，其他问题才能迎刃而解。"
      },
      {
        label: "先公开现金流缺口",
        summary: "用透明度换取团队信任，共同想办法。",
        quality: "partial",
        effects: { communication: 2, mobilize: 2 },
        resources: { energy: -6, trust: 4, influence: 2 },
        feedback: "团队开始行动，但恐慌和离职风险也被同步放大。",
        theory: "《孙子兵法》：上下同欲者胜。"
      },
      {
        label: "先让高层垫资",
        summary: "把问题交给更有资源的人。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: -3, influence: -4 },
        feedback: "你可能拿到了钱，却把主导权也交给了别人。",
        theory: "《权经》：权乃人授，授为大焉。"
      }
    ]
  },
  {
    id: "c8b-founder",
    chapterId: 8,
    title: "创业 · 危机中的第一次隔离",
    kind: "branch",
    context:
      "你作为创始人遭遇最大客户暂停付款。账上现金只够一个月，团队开始猜测公司要完。",
    stake: "你要同时解决现金流和客户关系，而不是只处理一个。",
    options: [
      {
        label: "先隔离客户问题，再盘点回款",
        summary: "把客户争议和账期问题分开，找出最快回款路径。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -7, trust: 5, influence: 6 },
        feedback: "你把危机拆成两条线，团队第一次看到现金流可以恢复的路径。",
        theory: "《实践论》：从感性材料上升到理性认识。"
      },
      {
        label: "全员一起砍成本",
        summary: "立即削减一切非必要支出，保住现金。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -6, trust: 2, influence: 2 },
        feedback: "成本降了，但团队也看到了你对未来的不安全感。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      },
      {
        label: "只盯最大客户道歉",
        summary: "把所有精力放在挽回客户上。",
        quality: "risk",
        effects: { communication: 2 },
        resources: { energy: -8, trust: 1, influence: 1 },
        feedback: "客户可能回来，但其他现金流风险没有被隔离。",
        theory: "《孙子兵法》：先为不可胜。"
      }
    ]
  },
  {
    id: "c8b-highPotential",
    chapterId: 8,
    title: "高潜 · 危机中的第一次隔离",
    kind: "branch",
    context:
      "你作为高潜骨干负责的项目被砍预算，团队和供应商同时向你要答案。",
    stake: "你要在资源收缩时保护核心交付。",
    options: [
      {
        label: "重新定义最小可行交付",
        summary: "先保住客户最需要的核心结果，再讨论扩展。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -6, trust: 5, influence: 5 },
        feedback: "你没有让项目塌掉，而是让团队清楚知道什么必须保住。",
        theory: "德鲁克：要事优先。"
      },
      {
        label: "先向更高层争取预算",
        summary: "用项目重要性说服组织恢复资源。",
        quality: "partial",
        effects: { strategy: 2 },
        resources: { energy: -5, trust: 1, influence: 2 },
        feedback: "你可能争取到资源，但团队仍在等待答案。",
        theory: "《权经》：携为上，功次之。"
      },
      {
        label: "暂停交付，等待新预算",
        summary: "避免在资源不足时承诺交付。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -3, trust: -5, influence: -4 },
        feedback: "你保护了团队，却让客户重新评估项目价值。",
        theory: "《论语》：信而后劳其民。"
      }
    ]
  },
  {
    id: "c9b-parachute",
    chapterId: 9,
    title: "空降 · 成业前的最后一次选择",
    kind: "branch",
    context:
      "你作为空降管理者已证明能力。CEO 想让你进入更高层，但你知道离开会留下交接断层。",
    stake: "你要让成功在离开后延续，而不是只属于你个人。",
    options: [
      {
        label: "完成交接后再上升",
        summary: "把接班人、知识库、风险预案全部落地。",
        quality: "expert",
        effects: { stability: 3, deploy: 2 },
        resources: { energy: -7, trust: 8, influence: 8 },
        feedback: "你让组织知道你离开后依然能运行，晋升反而变得更安全。",
        theory: "《贞观政要》：善始慎终。"
      },
      {
        label: "先抓住晋升机会",
        summary: "不等待完美交接，先进入更高平台。",
        quality: "partial",
        effects: { authority: 2, execution: 2 },
        resources: { energy: -5, trust: -4, influence: 5 },
        feedback: "你抓住了机会，但组织可能因交接断层退回原样。",
        theory: "《孙子兵法》：将能而君不御者胜。"
      },
      {
        label: "拒绝晋升留在原地",
        summary: "继续掌控你最熟悉的战场。",
        quality: "risk",
        effects: { stability: 2, recovery: 1 },
        resources: { energy: -3, trust: -2, influence: -6 },
        feedback: "你保住了安全区，却限制了组织的人才流动。",
        theory: "《权经》：权惟用，不为大也。"
      }
    ]
  },
  {
    id: "c9b-founder",
    chapterId: 9,
    title: "创业 · 成业前的最后一次选择",
    kind: "branch",
    context:
      "你作为创始人公司终于稳定，投资人想让你去做更大平台，但你担心创始团队会失控。",
    stake: "你要完成个人与组织的权力交接。",
    options: [
      {
        label: "建立创始团队决策机制",
        summary: "让方向、资源和风险由机制承接，而不是你一人。",
        quality: "expert",
        effects: { stability: 3, strategy: 2 },
        resources: { energy: -7, trust: 7, influence: 7 },
        feedback: "你把创始人控制权变成了团队治理，公司开始不依赖你也能决策。",
        theory: "毛泽东《党委会的工作方法》：民主集中制。"
      },
      {
        label: "先培养一位 CEO",
        summary: "把权力交给一个可信的人，自己保留方向。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -6, trust: 3, influence: 3 },
        feedback: "你减轻了管理负担，但公司仍依赖一个人做关键判断。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "继续亲自掌控公司",
        summary: "避免放权风险，保持创始人主导。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -7, trust: -2, influence: -2 },
        feedback: "公司稳定在你手里，但增长被你的精力锁死。",
        theory: "《贞观政要》：创业难，守成更难。"
      }
    ]
  },
  {
    id: "c9b-highPotential",
    chapterId: 9,
    title: "高潜 · 成业前的最后一次选择",
    kind: "branch",
    context:
      "你即将晋升，但接替你的人还未完全准备好，项目也正处在关键节点。",
    stake: "你要安全完成交接，同时让组织看到你能承担更大责任。",
    options: [
      {
        label: "把关键决策做成交接手册",
        summary: "让接替者能通过手册理解判断依据和风险清单。",
        quality: "expert",
        effects: { stability: 3, deploy: 2 },
        resources: { energy: -6, trust: 7, influence: 6 },
        feedback: "你不仅完成了交接，还让组织第一次拥有了可传承的判断能力。",
        theory: "毛泽东《党委会的工作方法》：制度建党。"
      },
      {
        label: "只带接替者做一遍关键项目",
        summary: "用实践交接代替文档。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -6, trust: 3, influence: 2 },
        feedback: "接替者学到了做法，但组织仍缺少可复用的判断规则。",
        theory: "《权经》：授能干者，授忠诚者。"
      },
      {
        label: "先完成晋升，交接交给他人",
        summary: "不拖慢个人机会，让新负责人处理交接。",
        quality: "risk",
        effects: { authority: 1 },
        resources: { energy: -4, trust: -5, influence: -3 },
        feedback: "你抓住了机会，却让项目在交接期承受风险。",
        theory: "《贞观政要》：善始慎终。"
      }
    ]
  },
  {
    id: "r1",
    chapterId: 2,
    title: "电梯偶遇",
    kind: "side",
    context:
      "你在电梯里遇到 CEO。他只给你一句话的时间，问你对新组织的第一个判断是什么。",
    stake: "你的一句话会影响他对你的第一印象。",
    options: [
      {
        label: "给一个具体判断，而不是空表态",
        summary: "说出你观察到的关键矛盾，并点出下一步动作。",
        quality: "expert",
        effects: { insight: 2, communication: 2 },
        resources: { energy: -3, trust: 4, influence: 5 },
        feedback: "CEO 记住的不是你的态度，而是你能看见问题并准备行动。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "先表达决心",
        summary: "让 CEO 看到你有信心解决问题。",
        quality: "partial",
        effects: { authority: 2 },
        resources: { energy: -2, trust: 2, influence: 2 },
        feedback: "他看到了你的信心，但没有看到具体判断。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "等电梯结束再说",
        summary: "不在公开场合谈组织问题，避免风险。",
        quality: "risk",
        effects: { strategy: 1 },
        resources: { energy: -2, trust: -1, influence: -3 },
        feedback: "谨慎保护了信息，却可能让 CEO 觉得你还没有准备。",
        theory: "《韩非子》：事以密成，语以泄败。"
      }
    ]
  },
  {
    id: "r2",
    chapterId: 3,
    title: "报销单异常",
    kind: "side",
    context:
      "你偶然看到一张金额异常大的报销单，签名是核心骨干，用途栏被涂改过。",
    stake: "你需要在没有完整证据时决定是否追查。",
    options: [
      {
        label: "先核流程和用途，再决定是否谈话",
        summary: "先看审批链、合同和交付物，形成事实基础。",
        quality: "expert",
        effects: { structure: 3, insight: 1 },
        resources: { energy: -5, trust: 2, influence: 3 },
        feedback: "你没有让直觉变成指控，而是先把事实链闭合。",
        theory: "《实践论》：从感性材料上升到理性认识。"
      },
      {
        label: "直接约谈核实",
        summary: "给本人解释机会，避免暗中猜疑。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -4, trust: 3, influence: 1 },
        feedback: "直接沟通减少了猜疑，但你可能还没掌握足够细节。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      },
      {
        label: "暂时装作没看见",
        summary: "避免破坏团队关系，等更多证据出现。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -2, trust: -2, influence: -2 },
        feedback: "你避开了冲突，但也可能让不合规行为继续发生。",
        theory: "《资治通鉴》：不塞隙穴，则暴雨疾风必坏。"
      }
    ]
  },
  {
    id: "r3",
    chapterId: 5,
    title: "客户深夜来电",
    kind: "side",
    context:
      "晚上 11 点，关键客户打电话说下周要看一个你们尚未准备的功能演示。",
    stake: "你要决定如何回应客户的临时要求。",
    options: [
      {
        label: "先确认真实需求，再承诺时间",
        summary: "问清客户想看什么决策场景，再给出可验证交付。",
        quality: "expert",
        effects: { communication: 3, execution: 1 },
        resources: { energy: -4, trust: 5, influence: 4 },
        feedback: "你没有盲目答应，也没有让客户失望，而是重新定义了演示目标。",
        theory: "德鲁克：管理者的成果是贡献，不是忙碌。"
      },
      {
        label: "立即答应并组织加班",
        summary: "先让客户安心，再让团队赶制演示。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -8, trust: 2, influence: 2 },
        feedback: "客户安心了，但团队被临时承诺拖入疲劳。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      },
      {
        label: "先拒绝，再约时间",
        summary: "强调时间不足，希望客户改期。",
        quality: "risk",
        effects: { authority: 1 },
        resources: { energy: -2, trust: -4, influence: -3 },
        feedback: "你保护了团队，却可能让关键客户重新评估合作关系。",
        theory: "《论语》：信而后劳其民。"
      }
    ]
  },
  {
    id: "r4",
    chapterId: 6,
    title: "办公区流言",
    kind: "side",
    context:
      "你路过茶水间，听见有人在传你要大规模裁员。消息源头不明，但已经开始影响团队。",
    stake: "你需要在真相和情绪之间做出回应。",
    options: [
      {
        label: "用公开信息澄清，并解释决策原则",
        summary: "不点名字，但明确组织现在真正在做什么。",
        quality: "expert",
        effects: { communication: 3, mobilize: 2 },
        resources: { energy: -5, trust: 6, influence: 5 },
        feedback: "你没有追查传话人，而是用透明信息切断了恐慌。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "让直属主管分别安抚",
        summary: "避免公开回应，让管理层私下解释。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -4, trust: 2, influence: 2 },
        feedback: "团队暂时稳定，但不同主管说法不一，信息开始失真。",
        theory: "《韩非子》：明主之道，使智者尽其虑。"
      },
      {
        label: "不回应，让流言自然过去",
        summary: "认为越回应越容易强化传闻。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -2, trust: -5, influence: -3 },
        feedback: "流言没有自动消失，反而在沉默中变得更加可信。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "r5",
    chapterId: 8,
    title: "复盘会被问难",
    kind: "side",
    context:
      "季度复盘会上，一位资深负责人当面问：你的变革到底带来了什么？现场安静下来。",
    stake: "你的回答会成为团队判断你领导力的样本。",
    options: [
      {
        label: "用数据回应，同时承认未完成项",
        summary: "给出可验证的成果，也坦诚还有哪些没做好。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -6, trust: 6, influence: 5 },
        feedback: "你既没有防御，也没有空谈，团队开始接受复杂真实的结果。",
        theory: "《实践论》：错误常常是正确的先导。"
      },
      {
        label: "把问题转给团队代表回答",
        summary: "让一线负责人说明实际变化，避免自我辩护。",
        quality: "partial",
        effects: { deploy: 2 },
        resources: { energy: -4, trust: 2, influence: 2 },
        feedback: "你展示了团队能力，但资深负责人可能觉得你在回避。",
        theory: "《权经》：权惟用，不为大也。"
      },
      {
        label: "现场反击提问者",
        summary: "强调对方也没有带来成果。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -4, trust: -6, influence: -2 },
        feedback: "你赢得了场面，却输掉了复盘会最重要的信任。",
        theory: "《孙子兵法》：致人而不致于人，但不能以伤人为目的。"
      }
    ]
  },
  {
    id: "r6",
    chapterId: 9,
    title: "离职面谈",
    kind: "side",
    context:
      "一位你曾重点培养的骨干提出离职。他说不是薪资问题，而是觉得自己的成长已经到头。",
    stake: "你的回应可能决定他是离开还是重新投入。",
    options: [
      {
        label: "帮他规划下一步挑战",
        summary: "不急着挽留，而是先确认他想要的成长到底是什么。",
        quality: "expert",
        effects: { deploy: 3, communication: 2 },
        resources: { energy: -5, trust: 7, influence: 4 },
        feedback: "你把人看得比留住人更重要，他反而开始考虑留下。",
        theory: "德鲁克：用人之所长，让人才持续成长。"
      },
      {
        label: "用新项目留住他",
        summary: "立即给他更有挑战的岗位和资源。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -4, trust: 3, influence: 2 },
        feedback: "他暂时留了下来，但下一次成长瓶颈会更快出现。",
        theory: "《贞观政要》：用非其才，必难致治。"
      },
      {
        label: "直接批准离职",
        summary: "尊重选择，不增加挽留成本。",
        quality: "risk",
        effects: { recovery: 2 },
        resources: { energy: -3, trust: -3, influence: -3 },
        feedback: "你没有制造阻力，但也可能错过了一个本可重新激活的高潜人才。",
        theory: "《人物志》：审其变而见其性。"
      }
    ]
  },
  {
    id: "r7",
    chapterId: 2,
    title: "会议室的临时提问",
    kind: "side",
    context:
      "高层会议上，你被临时要求解释一项你还没完全掌握的数据。现场有人低头看手机，有人开始小声议论。",
    stake: "你需要在信息不全时既不说谎，也不丢掌控感。",
    options: [
      {
        label: "先讲已知事实，再公开补数据时限",
        summary: "明确区分“已确认”和“待核实”，并给一个可验证时间。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -5, trust: 5, influence: 5 },
        feedback: "你没有假装全知，也没有失控，高层开始信任你的信息边界。",
        theory: "《实践论》：从感性材料上升到理性认识，不能跳过事实。"
      },
      {
        label: "先给一个看似肯定的答案",
        summary: "用直觉先回应，避免显得准备不足。",
        quality: "partial",
        effects: { authority: 2 },
        resources: { energy: -3, trust: -3, influence: 2 },
        feedback: "会议暂时过去了，但数据被证伪时，你的可信度会被双倍消耗。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "现场反问提问者数据来源",
        summary: "把问题抛回给提问者，转移压力。",
        quality: "risk",
        effects: { strategy: 2 },
        resources: { energy: -4, trust: -5, influence: -2 },
        feedback: "你暂时避开了提问，但也让其他人看到你缺乏数据准备。",
        theory: "《权经》：揣为上，事次之。"
      }
    ]
  },
  {
    id: "r8",
    chapterId: 4,
    title: "新人越权答复客户",
    kind: "side",
    context:
      "一位新人当着客户的面承诺了团队尚未确认的交付时间。客户已经开始按这个时间排期。",
    stake: "你要在保护新人和守住承诺之间做选择。",
    options: [
      {
        label: "先确认交付可行性，再带新人一起对齐",
        summary: "先核实内部是否真能做到，再决定如何调整客户预期。",
        quality: "expert",
        effects: { deploy: 3, structure: 1 },
        resources: { energy: -6, trust: 5, influence: 5 },
        feedback: "你没有在客户面前否定新人，也没有让承诺失控，团队学会了如何处理越权。",
        theory: "《韩非子·用人》：使事不相干，使士不兼官。"
      },
      {
        label: "当场纠正新人的承诺",
        summary: "在客户面前明确说这个时间不能确认。",
        quality: "partial",
        effects: { authority: 2, communication: 1 },
        resources: { energy: -4, trust: -5, influence: 3 },
        feedback: "客户看到了你的严谨，但新人在客户面前失去了信任。",
        theory: "《论语》：君子信而后劳其民。"
      },
      {
        label: "先按新人的承诺执行",
        summary: "不推翻承诺，用加班把时间追回来。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -10, trust: -2, influence: 1 },
        feedback: "这次承诺可能保住了，但团队为越权承诺支付了高昂精力。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      }
    ]
  },
  {
    id: "r9",
    chapterId: 7,
    title: "项目延期前的沉默",
    kind: "side",
    context:
      "关键项目大概率延期，但团队还没人向你正式汇报。你已经从侧面听到了消息。",
    stake: "你选择等待正式汇报，还是主动触发风险沟通。",
    options: [
      {
        label: "主动召集一次风险复盘",
        summary: "不等正式汇报，先让团队把风险摆到桌面上。",
        quality: "expert",
        effects: { mobilize: 3, structure: 2 },
        resources: { energy: -6, trust: 6, influence: 4 },
        feedback: "你打断了“报喜不报忧”的默认规则，延期风险开始被真实管理。",
        theory: "《孙子兵法》：上下同欲者胜。"
      },
      {
        label: "先私下问项目负责人",
        summary: "避免公开制造压力，先了解真实原因。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -4, trust: 2, influence: 2 },
        feedback: "你了解了真相，但团队其他成员仍不知道风险正在升级。",
        theory: "《韩非子》：事以密成，语以泄败。"
      },
      {
        label: "继续等待正式汇报",
        summary: "尊重汇报链路，不越级介入。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -2, trust: -3, influence: -3 },
        feedback: "你遵守了流程，却让延期风险在沉默中继续扩大。",
        theory: "《资治通鉴》：不塞隙穴，则暴雨疾风必坏。"
      }
    ]
  },
  {
    id: "r10",
    chapterId: 5,
    title: "客户要私下回扣",
    kind: "random",
    context:
      "一位关键客户私下提出，如果价格再降 5%，他可以私下给你个人感谢费。这个提议没有任何书面记录。",
    stake: "你需要在短期业绩和个人底线之间做出选择。",
    options: [
      {
        label: "明确拒绝，并提出合规优惠方案",
        summary: "守住底线，同时给出一个可公开的商务方案。",
        quality: "expert",
        effects: { authority: 3, structure: 2 },
        resources: { energy: -5, trust: 5, influence: 4 },
        feedback: "你拒绝了灰色空间，但保住了长期合作与组织安全。",
        theory: "《论语》：君子爱财，取之有道。"
      },
      {
        label: "先拖住，再让商务负责人处理",
        summary: "不直接表态，把问题转给专业团队。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -4, trust: 2, influence: 2 },
        feedback: "你避免了直接冲突，但客户可能把沉默当成默许。",
        theory: "《权经》：权惟用，不为大也。"
      },
      {
        label: "接受私下安排保订单",
        summary: "先保住业绩，再想办法处理风险。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -4, trust: -8, influence: 2 },
        feedback: "订单暂时保住了，但组织风险已经转移到你个人身上。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      }
    ]
  },
  {
    id: "r11",
    chapterId: 3,
    title: "老员工公开质疑新人",
    kind: "random",
    context:
      "周会上，一位老员工公开说新来的高潜员工是“关系户”，新人脸色很难看，其他人开始附和。",
    stake: "你的一句话会决定团队是否允许公开羞辱。",
    options: [
      {
        label: "叫停质疑，重新用事实评价",
        summary: "不点名批评，把讨论拉回业绩与行为证据。",
        quality: "expert",
        effects: { mobilize: 3, communication: 2 },
        resources: { energy: -5, trust: 7, influence: 5 },
        feedback: "你保护了新人，也教会老员工用证据而非身份评价人。",
        theory: "《人物志》：观其外而知其内，察其行而辨其品。"
      },
      {
        label: "私下再处理老员工",
        summary: "不公开打断，避免会议失控。",
        quality: "partial",
        effects: { authority: 2 },
        resources: { energy: -4, trust: -3, influence: 2 },
        feedback: "场面没失控，但新人已经公开受伤，下一次更难开口。",
        theory: "《论语》：君子成人之美，不成人之恶。"
      },
      {
        label: "让新人当场证明自己",
        summary: "要求新人用业绩回应质疑。",
        quality: "risk",
        effects: { execution: 2 },
        resources: { energy: -4, trust: -5, influence: -2 },
        feedback: "新人被逼到证明自己的位置，团队开始把公开羞辱当成正常管理。",
        theory: "《孙子兵法》：上下同欲者胜。"
      }
    ]
  },
  {
    id: "r12",
    chapterId: 8,
    title: "投资人要求裁员",
    kind: "random",
    context:
      "投资人明确要求你裁掉一个部门来降低成本，否则暂缓下一轮投资。你知道这个部门里有三个关键人才。",
    stake: "你要在生存压力和组织长期能力之间做判断。",
    options: [
      {
        label: "重新测算成本结构，提出替代方案",
        summary: "不直接接受裁员，先找出真正浪费的部分。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -7, trust: 5, influence: 6 },
        feedback: "你没有用短期裁员掩盖真实问题，投资人开始看到你的经营判断。",
        theory: "《卓有成效的管理者》：把资源集中在真正重要的任务上。"
      },
      {
        label: "先裁掉部分岗位回应投资人",
        summary: "用行动证明你愿意降本，保住下一轮融资。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -6, trust: -6, influence: 3 },
        feedback: "融资暂时保住了，但组织开始担心你是谁都能砍的人。",
        theory: "《权经》：权惟用，不为大也。"
      },
      {
        label: "拒绝裁员并准备放弃融资",
        summary: "坚持长期能力，不向投资人妥协。",
        quality: "risk",
        effects: { authority: 2, recovery: 1 },
        resources: { energy: -5, trust: 2, influence: -5 },
        feedback: "你守住了组织价值，但现金流风险可能压垮整个公司。",
        theory: "《孙子兵法》：善战者，先为不可胜。"
      }
    ]
  },
  {
    id: "r13",
    chapterId: 5,
    title: "预算突然被砍",
    kind: "random",
    context:
      "你负责的项目预算在季度中段被砍掉 30%，没有任何提前预警。团队已经按原计划投入了三周。",
    stake: "你要在资源收缩时重新定义交付范围。",
    options: [
      {
        label: "重排范围并明确不可砍项",
        summary: "用关键结果反推必须保留的部分，主动汇报取舍。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -6, trust: 4, influence: 5 },
        feedback: "你没有被动接受砍预算，而是让高层看到你如何管理取舍。",
        theory: "德鲁克：把资源集中在真正重要的少数任务上。"
      },
      {
        label: "先按原计划做，再补预算",
        summary: "暂时不改变范围，期望业绩能换回预算。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -8, trust: -2, influence: 1 },
        feedback: "团队继续冲刺，但资源缺口会很快变成交付风险。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "直接暂停项目",
        summary: "以预算不足为由暂停，避免仓促交付。",
        quality: "risk",
        effects: { authority: 1 },
        resources: { energy: -4, trust: -5, influence: -4 },
        feedback: "你避免了乱做，但高层可能认为你缺少在约束下推进的能力。",
        theory: "《权经》：权惟用，不为大也。"
      }
    ]
  },
  {
    id: "r14",
    chapterId: 2,
    title: "有人打小报告",
    kind: "random",
    context:
      "你得知有人向 CEO 汇报说你在会议上“打压不同意见”。你并没有打压，但确有两次打断了发言。",
    stake: "你要处理的是真相，还是别人感受到的真相。",
    options: [
      {
        label: "主动向 CEO 澄清事实",
        summary: "不带指责地说明会议场景，并承认表达方式可改进。",
        quality: "expert",
        effects: { communication: 3, authority: 1 },
        resources: { energy: -5, trust: 5, influence: 5 },
        feedback: "你没有追查告密者，而是直接消除了信息差。",
        theory: "毛泽东《党委会的工作方法》：互通情报，取得共同语言。"
      },
      {
        label: "找会议参与者核实",
        summary: "先确认当时真实发生了什么，再决定是否回应。",
        quality: "partial",
        effects: { structure: 2 },
        resources: { energy: -6, trust: 2, influence: 2 },
        feedback: "你掌握了事实，但 CEO 可能已经形成了初步判断。",
        theory: "《实践论》：从感性材料上升到理性认识。"
      },
      {
        label: "忽略谣言，继续做好事",
        summary: "认为只要结果好，误解会自然消失。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -3, trust: -3, influence: -3 },
        feedback: "误解不会自动消失，反而会在沉默中变成默认结论。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "r15",
    chapterId: 4,
    title: "客户要你的个人手机号",
    kind: "random",
    context:
      "关键客户在会议上当众向你要个人手机号，说“以后有事直接找你”。你不想绕开团队，也不想让客户失望。",
    stake: "你的回应会决定客户如何看待你们组织的协作边界。",
    options: [
      {
        label: "提供专属支持群，不提供私人号码",
        summary: "给客户更直接的响应入口，同时保留组织边界。",
        quality: "expert",
        effects: { communication: 3, authority: 1 },
        resources: { energy: -4, trust: 6, influence: 5 },
        feedback: "客户得到了便利，团队也没有被绕开，边界反而更清晰。",
        theory: "《韩非子》：使事不相干，使士不兼官。"
      },
      {
        label: "当场给他号码",
        summary: "先满足客户，私下再说明哪些事找谁。",
        quality: "partial",
        effects: { communication: 2 },
        resources: { energy: -5, trust: 3, influence: -2 },
        feedback: "客户满意了，但团队开始不确定谁才是真正的接口。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "拒绝并强调流程",
        summary: "明确所有问题必须通过团队接口。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -3, trust: -5, influence: -3 },
        feedback: "你守住了流程，却可能让客户觉得你不够重视。",
        theory: "《论语》：君子信而后劳其民。"
      }
    ]
  },
  {
    id: "r16",
    chapterId: 6,
    title: "新流程没人执行",
    kind: "random",
    context:
      "你花了两周设计的新流程已经发布，但两周后实际使用率不足 20%，也没有人正式反对。",
    stake: "你需要找到“没人反对但没人执行”的真正原因。",
    options: [
      {
        label: "访谈一线执行者找卡点",
        summary: "不追责，先找出流程与真实工作之间的冲突。",
        quality: "expert",
        effects: { insight: 3, structure: 2 },
        resources: { energy: -6, trust: 6, influence: 4 },
        feedback: "你发现流程缺少两个关键节点，而不是团队不愿执行。",
        theory: "《实践论》：从实践中找规律。"
      },
      {
        label: "增加强制检查节点",
        summary: "用系统卡点保证流程必须被执行。",
        quality: "partial",
        effects: { authority: 2, execution: 1 },
        resources: { energy: -5, trust: -3, influence: 3 },
        feedback: "执行率上升了，但团队开始用绕过系统的方式完成工作。",
        theory: "《韩非子》：法度既立，虽庸主可治。"
      },
      {
        label: "再发一次全员通知",
        summary: "强调新流程的重要性，要求各部门重视。",
        quality: "risk",
        effects: { communication: 1 },
        resources: { energy: -3, trust: -2, influence: -2 },
        feedback: "通知越多，团队越觉得这是形式主义。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "r17",
    chapterId: 7,
    title: "核心员工要转岗",
    kind: "random",
    context:
      "你最重要的项目骨干申请转岗到另一个部门，理由是想接触新业务。你知道他离开会让项目延期。",
    stake: "你要留住的是人，还是让他成长。",
    options: [
      {
        label: "为他设计内部成长路径",
        summary: "在项目内给他新的判断空间，满足成长需求。",
        quality: "expert",
        effects: { deploy: 3, communication: 2 },
        resources: { energy: -6, trust: 7, influence: 5 },
        feedback: "你把他想离开的动机转成了组织可用的成长设计。",
        theory: "德鲁克：用人之所长，让人才持续成长。"
      },
      {
        label: "用晋升挽留他",
        summary: "先给职位和薪资，让他继续留任。",
        quality: "partial",
        effects: { authority: 2 },
        resources: { energy: -5, trust: 3, influence: 2 },
        feedback: "他暂时留下了，但下次遇到成长瓶颈会更难处理。",
        theory: "《贞观政要》：用非其才，必难致治。"
      },
      {
        label: "立即批准转岗",
        summary: "尊重选择，尽快启动交接。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -3, trust: -4, influence: -3 },
        feedback: "你避免了拉扯，但项目延期风险没有提前化解。",
        theory: "《人物志》：审其变而见其性。"
      }
    ]
  },
  {
    id: "r18",
    chapterId: 8,
    title: "媒体负面报道",
    kind: "random",
    context:
      "一家媒体发布了关于你公司的负面报道，内容有失实之处，但已经开始影响客户信心。",
    stake: "你要决定是否回应、如何回应、让谁回应。",
    options: [
      {
        label: "先内部核实，再统一回应",
        summary: "不急于反驳，先确认哪些事实是真的。",
        quality: "expert",
        effects: { structure: 3, communication: 2 },
        resources: { energy: -7, trust: 5, influence: 6 },
        feedback: "你没有让危机被情绪放大，而是用事实重新建立控制。",
        theory: "《实践论》：从感性材料上升到理性认识。"
      },
      {
        label: "立即发布官方澄清",
        summary: "快速否认失实内容，防止客户误解。",
        quality: "partial",
        effects: { authority: 2 },
        resources: { energy: -5, trust: -3, influence: 3 },
        feedback: "回应很快，但如果内部还有未核实的问题，会被进一步放大。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "保持沉默，等热度过去",
        summary: "不回应媒体报道，让事件自然降温。",
        quality: "risk",
        effects: { recovery: 1 },
        resources: { energy: -3, trust: -5, influence: -5 },
        feedback: "沉默让失实内容看起来更像真相，客户开始主动询问。",
        theory: "《论语》：不患人之不己知，患不知人也。"
      }
    ]
  },
  {
    id: "r19",
    chapterId: 3,
    title: "供应商要求提前付款",
    kind: "random",
    context:
      "一个关键供应商突然要求把账期从 60 天缩到 30 天，否则暂停供货。你怀疑对方听到了一些公司传闻。",
    stake: "你要在现金流与供应链稳定之间做判断。",
    options: [
      {
        label: "核实付款能力和替代供应商",
        summary: "先掌握财务与备选方案，再决定是否让步。",
        quality: "expert",
        effects: { structure: 3, execution: 2 },
        resources: { energy: -6, trust: 3, influence: 5 },
        feedback: "你没有被要挟，也没有忽视风险，供应链主动权回到你手里。",
        theory: "《孙子兵法》：先为不可胜，以待敌之可胜。"
      },
      {
        label: "接受提前付款保供应",
        summary: "先满足供应商要求，避免生产中断。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -5, trust: 2, influence: -2 },
        feedback: "供应保住了，但其他供应商可能开始提出同样要求。",
        theory: "《权经》：权惟用，不为大也。"
      },
      {
        label: "拒绝让步，寻找新供应商",
        summary: "坚持原账期，宁可更换供应商。",
        quality: "risk",
        effects: { authority: 2 },
        resources: { energy: -7, trust: -4, influence: 1 },
        feedback: "你守住了账期，但切换供应商的时间和风险可能更大。",
        theory: "《孙子兵法》：善战者，求之于势。"
      }
    ]
  },
  {
    id: "r20",
    chapterId: 9,
    title: "CEO 临时要你接手新业务",
    kind: "random",
    context:
      "CEO 临时要求你接手一个高风险新业务，同时不减少你现有职责。你刚完成一次重要的交接。",
    stake: "你要在承接新机会与守住现有成果之间做选择。",
    options: [
      {
        label: "先确认新业务边界和退出条件",
        summary: "不拒绝机会，但把资源、授权和止损标准谈清楚。",
        quality: "expert",
        effects: { strategy: 3, authority: 2 },
        resources: { energy: -7, trust: 6, influence: 6 },
        feedback: "你没有简单接受，也没有拒绝，而是让新业务变成可管理的任务。",
        theory: "《权经》：权乃人授，授为大焉。"
      },
      {
        label: "立即接受并全力投入",
        summary: "先接住机会，再调整现有工作。",
        quality: "partial",
        effects: { execution: 2 },
        resources: { energy: -9, trust: 3, influence: 3 },
        feedback: "你展示了担当，但现有职责可能开始出现风险。",
        theory: "《孙子兵法》：兵贵胜，不贵久。"
      },
      {
        label: "拒绝接手",
        summary: "明确说明精力已满，要求只保留现有职责。",
        quality: "risk",
        effects: { recovery: 2 },
        resources: { energy: -3, trust: -6, influence: -4 },
        feedback: "你保护了自己，但高层可能认为你缺乏承担更大责任的意愿。",
        theory: "《论语》：君子求诸己，小人求诸人。"
      }
    ]
  }
];

export const RANDOM_EVENT_IDS = [
  "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10",
  "r11", "r12", "r13", "r14", "r15", "r16", "r17", "r18", "r19", "r20"
];
for (const id of RANDOM_EVENT_IDS) {
  const node = STORY_NODES.find((item) => item.id === id);
  if (node) node.kind = "random";
}

export const RANDOM_EVENT_META: Record<string, { weight: number; chapterId: number }> = {
  r1: { weight: 3, chapterId: 2 },
  r2: { weight: 3, chapterId: 3 },
  r3: { weight: 4, chapterId: 5 },
  r4: { weight: 3, chapterId: 6 },
  r5: { weight: 4, chapterId: 8 },
  r6: { weight: 5, chapterId: 9 },
  r7: { weight: 3, chapterId: 2 },
  r8: { weight: 4, chapterId: 4 },
  r9: { weight: 4, chapterId: 7 },
  r10: { weight: 4, chapterId: 5 },
  r11: { weight: 3, chapterId: 3 },
  r12: { weight: 5, chapterId: 8 },
  r13: { weight: 4, chapterId: 5 },
  r14: { weight: 3, chapterId: 2 },
  r15: { weight: 4, chapterId: 4 },
  r16: { weight: 4, chapterId: 6 },
  r17: { weight: 4, chapterId: 7 },
  r18: { weight: 5, chapterId: 8 },
  r19: { weight: 4, chapterId: 3 },
  r20: { weight: 5, chapterId: 9 }
};

function randomEventCategory(eventId: string): "expert" | "risk" | "partial" {
  const expertEvents = new Set(["r2", "r7", "r15", "r18", "r20"]);
  const riskEvents = new Set(["r3", "r5", "r12", "r17", "r19"]);
  if (expertEvents.has(eventId)) return "expert";
  if (riskEvents.has(eventId)) return "risk";
  return "partial";
}

/** 决策风格偏好：让随机事件派发受前序选择影响（轻量剧情分叉）。 */
export function randomEventAffinity(
  eventId: string,
  ratios: { expert: number; risk: number; partial: number }
): number {
  return ratios[randomEventCategory(eventId)];
}

export function nextRandomEvent(save: {
  completedRandomEvents: string[];
  unlockedChapters: number[];
  decisionHistory?: Array<{ nodeId: string; quality: OptionQuality }>;
  routePath?: Record<number, "expert" | "risk" | "partial">;
}): string | undefined {
  const eligible = RANDOM_EVENT_IDS.filter((id) => {
    const meta = RANDOM_EVENT_META[id];
    return (
      meta &&
      !save.completedRandomEvents.includes(id) &&
      save.unlockedChapters.includes(meta.chapterId)
    );
  });
  if (eligible.length === 0) return undefined;
  const totalWeight = eligible.reduce(
    (sum, id) => sum + weightedEventWeight(id, save),
    0
  );
  let roll = Math.random() * totalWeight;
  for (const id of eligible) {
    roll -= weightedEventWeight(id, save);
    if (roll <= 0) return id;
  }
  return eligible[0];
}

function weightedEventWeight(
  id: string,
  save: {
    completedRandomEvents: string[];
    unlockedChapters: number[];
    decisionHistory?: Array<{ nodeId: string; quality: OptionQuality }>;
    routePath?: Record<number, "expert" | "risk" | "partial">;
  }
): number {
  const history = save.decisionHistory ?? [];
  const total = Math.max(1, history.length);
  const expert = history.filter((record) => record.quality === "expert").length / total;
  const risk = history.filter((record) => record.quality === "risk").length / total;
  const partial = history.filter((record) => record.quality === "partial").length / total;
  const route = Object.values(save.routePath ?? {}).at(-1) ?? "";
  const routeBoost = randomEventCategory(id) === route ? 0.9 : 0;
  const affinity = Math.max(
    randomEventAffinity(id, { expert, risk, partial }),
    routeBoost
  );
  return RANDOM_EVENT_META[id].weight * (0.8 + affinity * 0.7);
}

export function getChapter(id: number): ChapterDef {
  const chapter = CHAPTERS.find((item) => item.id === id);
  if (!chapter) {
    throw new Error(`Missing chapter ${id}`);
  }
  return chapter;
}

export function getNode(id: string): StoryNode {
  const node = STORY_NODES.find((item) => item.id === id);
  if (!node) {
    throw new Error(`Missing story node ${id}`);
  }
  return node;
}

export function nodesForChapter(chapterId: number): StoryNode[] {
  const chapter = getChapter(chapterId);
  return chapter.nodeIds.map(getNode);
}

export function sideNodesForChapter(chapterId: number): StoryNode[] {
  return STORY_NODES.filter(
    (node) => node.kind === "side" && node.chapterId === chapterId
  );
}

export const NODE_INTEL: Record<string, string[]> = {
  c1n1: [
    "前任留下的预算表里有 20% 外包费用去向不明",
    "行政主管清楚每个部门真正说了算的人是谁",
    "CEO 只给了 90 天，但尚未公开支持你"
  ],
  c1n2: [
    "财务经理上周刚提交过一份自相矛盾的支出说明",
    "外包供应商与销售副总存在私人往来",
    "这份合同在系统里的审批流程被人为跳过"
  ],
  c2n1: [
    "CEO 正在观望你是否会主动争取资源",
    "临时上级愿意支持你，但不想承担风险",
    "团队最怕的不是授权缺失，而是方向反复"
  ],
  c2n2: [
    "运营负责人提前一天拿到了会议议题",
    "沉默的老员工曾是前任的副手",
    "有人已经在私下流传你准备裁员"
  ],
  c3n1: [
    "老员工掌握核心客户，但客户只听他一个人的",
    "年轻骨干连续三次在关键节点交付出色",
    "HR 暗示组织希望借此机会清理历史包袱"
  ],
  c3n2: [
    "年轻骨干曾经独立处理过同类事故",
    "老员工多次在评审时推翻他的方案",
    "项目日报显示 80% 的阻塞都来自等待确认"
  ],
  c4n1: [
    "运营负责人的团队最近刚被新流程削权",
    "他的顾虑里有三个真实存在的交付风险",
    "CEO 曾公开支持过流程变革，但没有明确点名"
  ],
  c4n2: [
    "客户项目停滞的真实原因是三部门各自有一套验收标准",
    "研发负责人愿意配合，但不愿替销售背责",
    "产品部已经在私下做了一套替代方案"
  ],
  c5n1: [
    "收入翻倍目标里，60% 来自三个尚未签约的大客户",
    "现有团队只有 40% 的人清楚自己的关键结果",
    "财务建议先锁住现金流，再谈增长"
  ],
  c5n2: [
    "缺口最大的一笔订单仍在等待客户法务确认",
    "团队平均每天有两个小时耗在低价值会议",
    "一个被搁置的小项目预计能在两周内快速回款"
  ],
  c6n1: [
    "CFO 与销售副总共同主导了最近三次投资决策",
    "你的批示在系统里会被标记为“参考意见”",
    "财务团队有人愿意把真实流程数据交给你"
  ],
  c6n2: [
    "这位下属在上一家公司也有越级汇报记录",
    "CEO 最近询问过你两次关于他能力的问题",
    "团队其他成员已经开始模仿他的汇报方式"
  ],
  c7n1: [
    "老将的团队流失率连续两季低于公司平均",
    "年轻人在跨部门项目里获得过最高好评",
    "公司下一阶段需要同时守住存量业务和开辟新业务"
  ],
  c7n2: [
    "你出差时，团队通常要等三天才能做出一项常规决策",
    "上一任负责人留下过一套纸质制度，但没人更新",
    "有人私下把“听你的”当成团队成熟的表现"
  ],
  c8n1: [
    "最大客户暂停付款的原因是内部财务审查，而不是不满",
    "公司账上还有三笔未催收的应收账款",
    "银行愿意提供短期过桥资金，但要求下周前确认"
  ],
  c8n2: [
    "客户流失前三个月已经连续投诉交付响应速度",
    "明星销售带走的客户名单里还有两个高危客户",
    "服务团队上周刚提交过一份改进方案但未获批"
  ],
  c9n1: [
    "CEO 希望你先完成一个季度陪跑再进入更高层",
    "接班人目前只完成了 60% 的关键交接项",
    "核心客户明确表示信任你个人超过信任公司"
  ],
  c9n2: [
    "创新项目已经验证了市场需求，但单位经济模型未跑通",
    "团队里支持继续的人掌握了关键客户关系",
    "公司现金流可以再支撑九个月高风险投入"
  ],
  s1: [
    "客户羞辱发生后，这位员工已经连续三次避开了团队复盘",
    "他昨天刚提交过一份高质量的改进方案"
  ],
  s2: [
    "管培生方案里包含一个被老团队忽略的真实场景",
    "他的直属导师正在观察你会如何处理公开质疑"
  ],
  s3: [
    "提案客户最看重的是决策质量，而不是响应速度",
    "你明早要见的客户曾在凌晨收到过竞争对手的方案"
  ],
  s4: [
    "客户今天真正想确认的是你们是否还值得继续信任",
    "销售负责人已经私下承诺过交付日期，但团队并未确认"
  ],
  s5: [
    "数据错误只影响演示模块中的两张报表",
    "客户周一真正想看的是决策逻辑，而不是完整功能"
  ],
  s6: [
    "提出辞职的人并不是最失望的人，而是最沉默的人",
    "团队上周已经提交过一份风险预警，但没有被重视"
  ],
  s7: [
    "越级汇报发生前，这位下属已经在周报里连续两次提出同类风险",
    "CEO 关注的是信息是否透明，而不是谁先汇报"
  ],
  s8: [
    "这位负责人过去的方案确实有两项被流程卡住过",
    "投资人对新合作的态度取决于是否有人愿意承担风险"
  ],
  s9: [
    "最近三次关键决策都依赖你个人确认后才会启动",
    "接替者已经完成了一轮基础流程学习，但缺少真实案例演练"
  ],
  "c1b-parachute": [
    "行政主管愿意合作，但不想公开站队",
    "财务经理更在意专业证据"
  ],
  "c1b-founder": [
    "团队需要看到业务动作，而不只是新的会议",
    "48 小时内可验证的现金流动作只有三个"
  ],
  "c1b-highPotential": [
    "各部门愿意认领自己提出的动作",
    "直接下发清单会让他们退回本位"
  ],
  "c2b-parachute": [
    "CEO 正在等待一个不需要他兜底的小胜利",
    "组织里有一个停滞项目可以快速重启"
  ],
  "c2b-founder": [
    "现金流缺口来自两个逾期客户",
    "团队里有人已经准备好一份回款清单"
  ],
  "c2b-highPotential": [
    "各部门最缺的不是方案，而是共同验收标准",
    "财务愿意提供数据，但不想承担最终决策责任"
  ],
  "c3b-parachute": [
    "HR 已经准备好一份岗位成果模板",
    "核心客户负责人正在同时接触外部机会"
  ],
  "c3b-founder": [
    "明星员工上周拒绝了一次新客户分工",
    "销售后台已经有半年客户接触记录"
  ],
  "c3b-highPotential": [
    "部门负责人真正想保护的人是自己的旧下属",
    "另一名候选人在两个关键项目中有完整证据"
  ],
  "c4b-parachute": [
    "运营负责人之前曾被空降管理者公开否过一次",
    "他的团队已经私下准备了替代方案"
  ],
  "c4b-founder": [
    "联合创始人反对的不是方向，而是被排除在决策外",
    "两条路径所需的资源并不冲突"
  ],
  "c4b-highPotential": [
    "资深负责人的反对里包含一个真实交付风险",
    "他手上有一套现成的数据可以验证新方案"
  ],
  "c5b-parachute": [
    "收入缺口里 60% 来自三个未签约大客户",
    "财务手里有一份可回款订单清单"
  ],
  "c5b-founder": [
    "产品部已经在私下做新功能，但销售不知情",
    "现有客户里有两个愿意提前付款"
  ],
  "c5b-highPotential": [
    "各部门都担心目标变成自己部门独自承担",
    "有一张现成的项目看板模板可以复用"
  ],
  "c6b-parachute": [
    "系统里已经有一个可用的审批流模板",
    "CFO 愿意支持联签，但不想公开表态"
  ],
  "c6b-founder": [
    "合伙人最近两次绕过的都是同一类决策",
    "董事会章程里已经预留了联签条款"
  ],
  "c6b-highPotential": [
    "高层直接指挥的内容集中在两个交付节点",
    "项目章程尚未被正式发布"
  ],
  "c7b-parachute": [
    "团队里已经有人开始模仿你的口头决策",
    "系统里有一套未被启用的审批检查清单"
  ],
  "c7b-founder": [
    "核心团队经常等你确认后才敢行动",
    "过去三个月的高频决策可以被归类成五种"
  ],
  "c7b-highPotential": [
    "项目关键人只认可你的口头确认",
    "有一份会议记录模板可以升级为协作地图"
  ],
  "c8b-parachute": [
    "现金流缺口里有一笔可快速催收的应收账款",
    "财务团队已经准备好三套融资方案"
  ],
  "c8b-founder": [
    "最大客户暂停付款是因为内部审计，不是不满",
    "账上还有两笔未催收的应收账款"
  ],
  "c8b-highPotential": [
    "预算被砍的部门里有一个可合并项目",
    "客户最关心的交付模块已经完成 80%"
  ],
  "c9b-parachute": [
    "接班人已经完成 60% 的关键交接项",
    "CEO 愿意等待一个季度陪跑"
  ],
  "c9b-founder": [
    "投资人更看重治理结构，而不是个人能力",
    "创始团队里已有两人具备跨部门决策经验"
  ],
  "c9b-highPotential": [
    "接替者已经独立处理过两次关键危机",
    "项目手册只覆盖了流程，没有覆盖判断依据"
  ],
  r1: [
    "CEO 最近最担心的是组织是否开始失去方向",
    "他给你一句话的机会，其实是在测试你是否已经进入状态"
  ],
  r2: [
    "报销审批链里有人刻意跳过了常规检查",
    "这笔报销与最近一个新供应商有关"
  ],
  r3: [
    "客户真正想确认的是你们的演示能否支持他们内部决策",
    "现有功能中已经有一个可用的替代场景"
  ],
  r4: [
    "流言来源与最近一次高管会议有关",
    "最焦虑的是没有直属主管的基层员工"
  ],
  r5: [
    "资深负责人手里有一组真实数据可以验证你的说法",
    "团队更想听到的是你会如何修正，而不是如何辩护"
  ],
  r6: [
    "这位骨干最近两次主动承担了超出岗位的任务",
    "他真正在意的不是职位，而是有没有更大的判断空间"
  ],
  r7: [
    "提问者手上其实也只有一份旧版数据",
    "高层真正想看你如何管理信息边界"
  ],
  r8: [
    "新人的承诺背后是销售负责人私下的催促",
    "客户真正在意的是交付机制是否透明"
  ],
  r9: [
    "项目负责人已经连续三次调整内部计划",
    "团队担心报风险会被视为能力不足"
  ],
  r10: [
    "这位客户过去两年换过三家供应商",
    "他更在意的是长期供应稳定性，而不是这次价格"
  ],
  r11: [
    "老员工曾经有过一次类似冲突记录",
    "新人上周提交的方案里包含一个关键数据错误"
  ],
  r12: [
    "投资人真正担心的是现金流模型，不是某个部门",
    "被要求裁掉的部门里有三个客户关系核心节点"
  ],
  r13: [
    "预算被砍与上一季度交付延期有关",
    "团队里有两个项目可以低成本合并"
  ],
  r14: [
    "CEO 听到的版本来自一位未参加会议的人",
    "你两次打断发言的对象恰好在客户现场"
  ],
  r15: [
    "客户真正担心的是响应速度，而不是私人关系",
    "团队里已经有人负责他所在区域的日常支持"
  ],
  r16: [
    "新流程在系统里需要三次手工录入",
    "一线主管没有收到任何培训"
  ],
  r17: [
    "这位骨干想要的新业务其实可以拆成项目内子任务",
    "转岗申请已经提交到 HR，正式流程尚未启动"
  ],
  r18: [
    "报道中有一个数据来自你们公开的旧版本年报",
    "客户服务热线已经收到十多个相关咨询"
  ],
  r19: [
    "供应商听到了公司资金链的传闻，但来源不明确",
    "采购部上周刚完成两个替代供应商评估"
  ],
  r20: [
    "CEO 更想看到你如何管理边界，而不是简单接受",
    "新业务有一半资源可以来自现有团队冗余"
  ]
};

export interface RoleNodeVariant {
  title?: string;
  context?: string;
  stake?: string;
}

export const ROLE_NODE_VARIANTS: Record<
  string,
  Partial<Record<RoleId, RoleNodeVariant>>
> = {
  c1n1: {
    parachute: {
      context:
        "你刚空降接任事业部负责人，团队还不知道你会带来什么，前任的人正在观察你会不会动他们。",
      stake: "先摸清谁真正掌握信息，还是先证明你能赢？"
    },
    founder: {
      context:
        "你是创始人，团队刚扩张到 30 人，创始团队开始出现流程混乱，但没人愿意承认问题。",
      stake: "你需要在没有职业经理人的情况下建立第一套管理秩序。"
    },
    highPotential: {
      context:
        "你作为高潜骨干被 CEO 点名牵头一个新项目，但没有正式任命，各部门只是给出“配合”的口头承诺。",
      stake: "你必须用专业和关系让项目真正运转起来。"
    }
  },
  c1n2: {
    parachute: {
      context:
        "空降第三周，你发现一笔外包费用去向不明，行政主管无意间给了你一条线索，但财务团队还没准备好配合。",
      stake: "在信任未建立时，你如何验证这条线索？"
    },
    founder: {
      context:
        "你发现合伙人使用的一笔外包费缺少合同，项目没交付，但这位合伙人掌握着主要客户关系。",
      stake: "你要在保护现金流和维持合伙人信任之间做判断。"
    },
    highPotential: {
      context:
        "你协助财务做预算审计时发现异常支出，但直接汇报会得罪一位跨部门负责人。",
      stake: "你如何用非正式影响力推动事实被看见？"
    }
  },
  c2n1: {
    parachute: {
      context:
        "组织架构调整后你的直属上级突然调走，授权悬空，CEO 说“先干起来，授权再谈”。",
      stake: "你要先争取资源，还是先用成果换授权？"
    },
    founder: {
      context:
        "投资人说下个月才会到账，但团队已经需要采购、招人，你没有任何正式授权文件。",
      stake: "你要先证明项目能跑，还是先逼投资人明确承诺？"
    },
    highPotential: {
      context:
        "你被授权推进一个创新项目，但没有预算和人手，所有支持都只是口头承诺。",
      stake: "你要先做出小胜利，还是先向上要明确权力？"
    }
  },
  c2n2: {
    parachute: {
      context:
        "你召开第一次全员会，团队怀疑你要裁员，有人当面问尖锐问题，有人沉默。",
      stake: "你如何用一场会建立第一波信任？"
    },
    founder: {
      context:
        "你第一次召集全员会，老员工质疑你过度扩张，新员工担心公司方向不清楚。",
      stake: "你如何在混乱中找到共同目标？"
    },
    highPotential: {
      context:
        "你作为项目牵头人第一次召集跨部门会议，但每个部门都在谈自己的 KPI。",
      stake: "你如何让会议从立场争吵变成共同方案？"
    }
  },
  c3n1: {
    parachute: {
      context:
        "你接管团队后要提交精简名单，有人能力强但关系存疑，有人平庸但掌握客户。",
      stake: "你要用人岗匹配决定去留，还是用忠诚度决定去留？"
    },
    founder: {
      context:
        "你发现团队里最能打的人开始掌控核心客户，公司人才结构过度依赖某几个人。",
      stake: "你要重组关键岗位，还是继续依赖少数明星？"
    },
    highPotential: {
      context:
        "你被邀请参与人才盘点，部门负责人希望你能给出不偏袒任何人的判断。",
      stake: "你如何在组织政治中坚持专业判断？"
    }
  },
  c3n2: {
    parachute: {
      context:
        "项目连续出问题，团队习惯把问题推给你，你发现一位年轻骨干能独立解决大部分问题。",
      stake: "你要继续当救火队长，还是真正授权？"
    },
    founder: {
      context:
        "公司订单一多，你发现自己成了唯一能解决问题的人，连办公室网络都要你修。",
      stake: "你要继续亲自把关，还是把责任还回去？"
    },
    highPotential: {
      context:
        "你发现一个初级同事能独立解决问题，但他总在等你确认，因为跨部门都把他当成传话筒。",
      stake: "你要替他扛责任，还是帮他建立自主决策空间？"
    }
  },
  c4n1: {
    parachute: {
      context:
        "你推动新流程，资历深厚的运营负责人公开反对，他的顾虑确实存在。",
      stake: "你要压制反对，还是把反对者变成方案负责人？"
    },
    founder: {
      context:
        "你想改变产品方向，但联合创始人公开反对，他认为现有客户会流失。",
      stake: "你要用数据说服，还是用创始人权力强推？"
    },
    highPotential: {
      context:
        "你提出的新流程被资深负责人反对，你没有职位权力，但方案确实有漏洞。",
      stake: "你要如何让反对者愿意和你一起修改方案？"
    }
  },
  c4n2: {
    parachute: {
      context:
        "产品、销售、研发三部门互相推责，一个客户项目停了十天，CEO 让你牵头解决。",
      stake: "你要如何跨越没有直属权力的部门墙？"
    },
    founder: {
      context:
        "你的创业团队开始出现部门墙，产品怪销售乱承诺，销售怪产品不交付。",
      stake: "你要如何用目标而不是命令重新组织协作？"
    },
    highPotential: {
      context:
        "跨部门项目陷入僵局，你既不是产品负责人也不是销售负责人，但所有人都等你给方案。",
      stake: "你要如何在没有指挥权的情况下推动行动？"
    }
  },
  c5n1: {
    parachute: {
      context:
        "公司给你定下收入翻倍目标，但团队只会点头，没人知道明天该做什么。",
      stake: "你要如何把口号拆成可执行的关键结果？"
    },
    founder: {
      context:
        "投资人给你定下增长目标，但产品、销售和研发各有各的优先级。",
      stake: "你要如何让团队围绕同一个目标排兵布阵？"
    },
    highPotential: {
      context:
        "你被要求带领跨部门小组完成季度目标，但没有人真正向你汇报。",
      stake: "你要如何用目标管理代替行政命令？"
    }
  },
  c5n2: {
    parachute: {
      context:
        "季度还有十五天，目标缺口 30%，团队已经连续加班，士气下降。",
      stake: "你要如何在不透支团队的情况下完成冲刺？"
    },
    founder: {
      context:
        "现金流只能再撑一个月，产品还没跑通收入，团队已经在超负荷工作。",
      stake: "你要如何重新排优先级，保住最关键的现金流？"
    },
    highPotential: {
      context:
        "项目交付日临近，关键成员被抽走，剩余团队已经连续加班。",
      stake: "你要如何向更高层要资源，而不是简单加码？"
    }
  },
  c6n1: {
    parachute: {
      context:
        "你发现 CFO 和销售副总绕过你直接决策，你的批示在系统中只是“参考意见”。",
      stake: "你要如何用制度重新划定权力边界？"
    },
    founder: {
      context:
        "合伙人开始绕过你直接决策，你发现自己名义上是 CEO，实际上被架空。",
      stake: "你要如何重建决策机制，而不是公开摊牌？"
    },
    highPotential: {
      context:
        "你的项目被更高层直接指挥，关键决定都绕过了你，但你还要为结果负责。",
      stake: "你要如何守住项目主导权？"
    }
  },
  c6n2: {
    parachute: {
      context:
        "核心下属开始越级汇报，并在 CEO 面前曲解你的决策，团队都看在眼里。",
      stake: "你要如何处理越级汇报而不显得心胸狭窄？"
    },
    founder: {
      context:
        "一个资深员工开始绕过你直接找投资人，投资人开始质疑你的管理能力。",
      stake: "你要如何同时守住内部纪律和投资人信任？"
    },
    highPotential: {
      context:
        "你的项目成员开始跳过你向部门负责人汇报，部门负责人开始自行决定项目方向。",
      stake: "你要如何用机制保护项目的一致性？"
    }
  },
  c7n1: {
    parachute: {
      context:
        "公司准备让你晋升，要求你提名接班人：一个能力强但和你不够亲近，一个忠诚但能力待提升。",
      stake: "你要选能力，还是选延续性？"
    },
    founder: {
      context:
        "你准备培养一个联合创始人接班，但候选人在业务能力和团队信任之间有明显差异。",
      stake: "你要如何建立不依赖任何个人的梯队？"
    },
    highPotential: {
      context:
        "你被要求推荐下一任项目负责人，候选人包括能力强的竞争者和关系好的同事。",
      stake: "你要如何给出不偏私但又能被组织接受的建议？"
    }
  },
  c7n2: {
    parachute: {
      context:
        "你发现很多好经验只存在你脑子里，你一离开，团队就回到老路。",
      stake: "你要如何把个人判断变成组织能力？"
    },
    founder: {
      context:
        "公司所有关键决策都要经过你，你生病一天业务就停一半。",
      stake: "你要如何把创始人经验制度化和产品化？"
    },
    highPotential: {
      context:
        "你负责的项目高度依赖你个人的沟通网络，你一休假项目就停滞。",
      stake: "你要如何把个人关系变成团队流程？"
    }
  },
  c8n1: {
    parachute: {
      context:
        "财务告诉你下月现金流只够发 60% 工资，最大客户突然暂停付款。",
      stake: "你要如何在 48 小时内稳住局面？"
    },
    founder: {
      context:
        "你的最大客户突然暂停付款，账面现金只够活一个月，投资还没到账。",
      stake: "你要如何同时解决现金流和客户关系？"
    },
    highPotential: {
      context:
        "你负责的关键项目被砍预算，团队和供应商同时向你要答案。",
      stake: "你要如何在资源被抽走时保护核心交付？"
    }
  },
  c8n2: {
    parachute: {
      context:
        "明星销售带着核心客户跳槽，客户说“我们不是被挖走的，是被服务拖走的”。",
      stake: "你要如何同时处理客户流失、团队信心和系统漏洞？"
    },
    founder: {
      context:
        "你的核心销售带着最大客户离职，留下的客户也开始质疑服务能力。",
      stake: "你要如何防止单个关键人成为公司命脉？"
    },
    highPotential: {
      context:
        "项目关键成员跳槽，客户开始要求换人，团队担心项目会失败。",
      stake: "你要如何重建客户信任并防止知识断层？"
    }
  },
  c9n1: {
    parachute: {
      context:
        "你的改革成功了，CEO 想让你进入更高层，但你知道离开会留下交接断层。",
      stake: "你要如何让成功在离开后延续？"
    },
    founder: {
      context:
        "公司终于稳定下来，投资人想让你去做更大平台，但你担心创始团队会失控。",
      stake: "你要如何完成个人与组织的权力交接？"
    },
    highPotential: {
      context:
        "你即将晋升，但接替你的人还没有完全准备好，项目也正处在关键节点。",
      stake: "你要如何安全地完成交接？"
    }
  },
  c9n2: {
    parachute: {
      context:
        "你离开前要决定是否继续投入一条高毛利但高风险的创新业务。",
      stake: "你要留给组织一个结论，还是一套决策方法？"
    },
    founder: {
      context:
        "你准备寻找第二增长曲线，但新业务烧钱已久，团队还想再坚持半年。",
      stake: "你要如何定义继续投入还是止损的检查点？"
    },
    highPotential: {
      context:
        "你负责的新项目已经烧钱很久，团队想继续，但组织开始要求你给出终局判断。",
      stake: "你要如何用结构思考替团队建立决策标准？"
    }
  }
};

export function getNodeForRole(
  role: RoleId,
  nodeId: string
): StoryNode {
  const base = getNode(nodeId);
  const variant = ROLE_NODE_VARIANTS[nodeId]?.[role];
  if (!variant) {
    return base;
  }
  const chapter = getChapter(base.chapterId);
  const options = base.options.map((option, index) => {
    const set = ROLE_OPTION_SETS[role][option.quality];
    const variantIndex =
      (stringHash(`${nodeId}-${role}-${index}`) + index) % set.length;
    const view = set[variantIndex];
    return {
      ...option,
      label: view.label,
      summary: `${view.summary} 本章重点是「${chapter.title}」，你还需要判断：${base.stake}`,
      feedback:
        base.kind === "main"
          ? `${view.feedback} 判断依据：${option.feedback}`
          : view.feedback,
      theory: option.theory
    };
  });
  return {
    ...base,
    title: variant.title ?? base.title,
    context: variant.context ?? base.context,
    stake: variant.stake ?? base.stake,
    options
  };
}

function stringHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 997;
  }
  return hash;
}

const BRANCH_TEMPLATES: Record<
  number,
  { title: string; context: string; stake: string }
> = {
  2: {
    title: "授权真空下的第一选择",
    context:
      "你在授权不完整时已经迈出第一步。现在团队正看着你会把第一份资源、第一个承诺投到哪里。",
    stake: "你要用一次行动证明：即使在授权真空里，你也能建立可预期的判断。"
  },
  3: {
    title: "人才配置的第一次落子",
    context:
      "你开始重组关键岗位。每个人都在猜自己是否安全，你的第一个人事动作会被当成未来规则。",
    stake: "你要让组织看到：人才判断的标准不是亲疏，而是未来成果。"
  },
  4: {
    title: "阻力面前的第一次同盟",
    context:
      "反对声开始出现。你没有选择压制，而是需要决定：让谁进入共同责任，又让谁保持监督。",
    stake: "你要把阻力转成同盟，而不是把反对者变成更深的敌人。"
  },
  5: {
    title: "目标落地的第一次拆解",
    context:
      "大目标已经摆在桌上。团队等待的不是又一次动员，而是第一份能被检查的关键结果。",
    stake: "你要把口号变成每天可验收的行动，并让每个人知道自己的那部分。"
  },
  6: {
    title: "权力边界的第一次固化",
    context:
      "有人开始绕过你决策。你要用制度重新定义边界，而不是只靠一次谈话。",
    stake: "你要让组织形成“重大决策必须进入闭环”的默认规则。"
  },
  7: {
    title: "组织能力的第一次沉淀",
    context:
      "你的个人判断正在支撑关键业务。你需要决定：哪些经验必须变成流程，哪些留给个人。",
    stake: "你要让组织开始离开你也能运行，而不是继续依赖你的反应速度。"
  },
  8: {
    title: "危机中的第一次隔离",
    context:
      "危机已经出现。你必须在信息不全时决定：先保护什么，先放弃什么，先让谁行动。",
    stake: "你要用最快速度缩小风险范围，同时不让团队陷入恐慌。"
  },
  9: {
    title: "成业前的最后一次选择",
    context:
      "你已经证明了能力，现在要证明系统。你留下的最后一个决策，会成为组织未来的判断模板。",
    stake: "你要让组织记住的不是你的答案，而是你决策时使用的方法。"
  }
};

const ROLE_IDS: RoleId[] = ["parachute", "founder", "highPotential"];
const BRANCH_QUALITIES: OptionQuality[] = ["expert", "partial", "risk"];

function buildBranchNodes(): void {
  for (const chapter of CHAPTERS) {
    if (chapter.id === 1) {
      continue;
    }
    const template = BRANCH_TEMPLATES[chapter.id];
    const entry = STORY_NODES.find((node) => node.id === `c${chapter.id}n1`);
    if (entry?.options[0]) {
      entry.options[0].branchTo = {
        parachute: `c${chapter.id}b-parachute`,
        founder: `c${chapter.id}b-founder`,
        highPotential: `c${chapter.id}b-highPotential`
      };
    }
    for (const role of ROLE_IDS) {
      const id = `c${chapter.id}b-${role}`;
      if (STORY_NODES.some((node) => node.id === id)) {
        continue;
      }
      STORY_NODES.push({
        id,
        chapterId: chapter.id,
        title: `${roleName(role)} · ${template.title}`,
        kind: "branch",
        context: `${template.context} ${roleLens(role)}`,
        stake: template.stake,
        options: BRANCH_QUALITIES.map((quality, index) => {
          const view = ROLE_OPTION_SETS[role][quality][index % 3];
          const effects: Partial<Record<AbilityId, number>> =
            quality === "expert"
              ? { [chapter.focus[0]]: 3, [chapter.focus[1]]: 1 }
              : quality === "partial"
                ? { [chapter.focus[0]]: 2 }
                : { recovery: 2 };
          return {
            label: view.label,
            summary: view.summary,
            quality,
            effects,
            resources:
              quality === "expert"
                ? { energy: -6, trust: 7, influence: 5 }
                : quality === "partial"
                  ? { energy: -6, trust: 2, influence: 2 }
                  : { energy: -7, trust: -5, influence: -2 },
            feedback: view.feedback,
            theory: CHAPTER_REFLECTIONS[chapter.id]
          };
        })
      });
      NODE_INTEL[id] = [
        chapter.title,
        chapter.subtitle,
        ROLE_OPTION_SETS[role].expert[0].summary
      ];
    }
  }
}

function roleName(role: RoleId): string {
  return role === "parachute"
    ? "空降"
    : role === "founder"
      ? "创业"
      : "高潜";
}

function roleLens(role: RoleId): string {
  return role === "parachute"
    ? "你更关注权力结构与可信度。"
    : role === "founder"
      ? "你更关注现金流与可验证结果。"
      : "你更关注横向共识与影响力。";
}

buildBranchNodes();

export function duelNodes(count: number, seed: number): StoryNode[] {
  const candidates = STORY_NODES.filter((node) => node.kind === "main");
  const shifted = candidates.map((node, index) => ({
    node,
    score: (index * 17 + seed * 31 + node.id.length * 7) % 997
  }));
  shifted.sort((a, b) => a.score - b.score);
  return shifted.slice(0, Math.min(count, shifted.length)).map((item) => item.node);
}
