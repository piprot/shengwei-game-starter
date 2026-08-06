import type { ChapterDef, RoleId, StoryNode } from "./types";

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
        theory: "《人物志》八观：观察人在不同情境中的取舍，才能看见真实动机。"
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
        effects: { mobilize: 3, communication: 2 },
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
  }
];

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
  return {
    ...base,
    title: variant.title ?? base.title,
    context: variant.context ?? base.context,
    stake: variant.stake ?? base.stake
  };
}

export function duelNodes(count: number, seed: number): StoryNode[] {
  const candidates = STORY_NODES.filter((node) => node.kind === "main");
  const shifted = candidates.map((node, index) => ({
    node,
    score: (index * 17 + seed * 31 + node.id.length * 7) % 997
  }));
  shifted.sort((a, b) => a.score - b.score);
  return shifted.slice(0, Math.min(count, shifted.length)).map((item) => item.node);
}
