export type TeamRole = "parachute" | "founder" | "highPotential";

export type InfluenceKey = "trust" | "connection" | "strategy" | "succession";

export interface TeamAcademyPractice {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface TeamAcademyLesson {
  id: string;
  titleZh: string;
  titleEn: string;
  scenarioIds: string[];
  scenario: string;
  concept: string;
  formula: string;
  model: string[];
  examples: string[];
  practice: TeamAcademyPractice[];
  homework: string;
  keywords: string[];
  laws: string[];
}

export interface TeamAcademyCourse {
  role: TeamRole;
  titleZh: string;
  titleEn: string;
  summary: string;
  lessons: TeamAcademyLesson[];
}

export interface AcademyScenario {
  id: string;
  role: TeamRole;
  level: number;
  title: string;
  situation: string;
  options: string[];
  best: number;
  feedback: string;
  knowledge: string;
}

export interface TeamAcademyState {
  role: TeamRole;
  dimensions: Record<InfluenceKey, number>;
  completedLessons: string[];
  completedScenarios: string[];
  scenarioScores: Record<string, number>;
  practiceScores: Record<string, number>;
  homeworkScores: Record<string, number>;
  mentorId?: string;
  updatedAt: number;
}

export interface TeamMentor {
  id: string;
  nameZh: string;
  nameEn: string;
  dimension: InfluenceKey;
  skill: string;
}

export const TEAM_MENTORS: TeamMentor[] = [
  { id: "m-trust", nameZh: "稳局顾问", nameEn: "Trust Advisor", dimension: "trust", skill: "把前任变成军师，稳住信任盘面" },
  { id: "m-connection", nameZh: "沟通教练", nameEn: "Connection Coach", dimension: "connection", skill: "把复杂话术拆成可直接使用的场景模板" },
  { id: "m-strategy", nameZh: "方向参谋", nameEn: "Strategy Advisor", dimension: "strategy", skill: "在资源有限时帮你排序取舍和设定航线" },
  { id: "m-succession", nameZh: "梯队导师", nameEn: "Succession Mentor", dimension: "succession", skill: "帮你识别高潜并设计接班培养路径" }
];

export const ACADEMY_COURSES: TeamAcademyCourse[] = [
  {
    role: "parachute",
    titleZh: "空降管理者 · 90天稳盘与梯队建设",
    titleEn: "Parachute Manager · 90-Day Stabilization",
    summary: "对应空降新公司、前任变下属、i人技术背景、上级要求建梯队的场景。",
    lessons: [
      {
        id: "p1",
        titleZh: "第1课：前30天只观察，不动刀",
        titleEn: "Lesson 1: Observe First",
        scenarioIds: ["p1", "p2", "p3", "p4"],
        scenario: "你空降为部门负责人，前任领导成为下属。团队表面配合，但都在观望。上级要求你3个月内把人才梯队建设好。",
        concept: "空降期前30天是信任窗口期。最大的雷区不是业务不熟，而是前任觉得被架空。稳住前任，等于稳住了团队的信息源头。",
        formula: "信任 = 尊重前任 × 公开姿态 × 信息共享",
        model: [
          "1. 私下1对1，真诚说明：我是来补位的，不是来推翻你的。",
          "2. 公开把功劳归给团队，尤其给前任保留专业权威。",
          "3. 前30天只观察、不动刀，先画团队地图。",
          "4. 用固定1对1建立双向反馈通道，而不是靠闲聊。"
        ],
        examples: [
          "例1：会上说「王经理这块比我熟，我先多听他的」，前任从对手变成军师。",
          "例2：你发现团队信息靠口头传递，先记录现状，不急着上工具。"
        ],
        practice: [
          {
            prompt: "空降第一周，前任在会上对团队说「这事以前都是这么做的」。你最好的回应是？",
            options: ["当场纠正并立新规", "公开肯定他的经验，私下再了解背景", "沉默，避免冲突", "直接找上级告状"],
            answer: 1,
            explanation: "公开保留前任的面子，私下获取背景信息，是稳住信任窗口的优先动作。"
          },
          {
            prompt: "前30天里，你最重要的动作是什么？",
            options: ["马上重组团队", "建立关键人物信息地图", "全面推行新制度", "让上级看到你快速改革"],
            answer: 1,
            explanation: "前30天先观察和建立信任地图，动刀太早会触发防御。"
          },
          {
            prompt: "i人管理者建立信任，最稳定的方式是什么？",
            options: ["每天组织团建", "固定30分钟1对1，提前列议题", "用酒局拉近关系", "少说话，让别人猜"],
            answer: 1,
            explanation: "高质沟通比高频沟通更重要，固定1对1是i人友好的杠杆。"
          }
        ],
        homework: "列出本周3件可以授权给前任或骨干的任务，并写出授权边界与检查节点。",
        keywords: ["前任", "信任", "观察", "1对1", "授权"],
        laws: ["根基法则", "影响力法则", "上任第一年"]
      },
      {
        id: "p2",
        titleZh: "第2课：用专业破冰，建立技术威信",
        titleEn: "Lesson 2: Break the Ice with Expertise",
        scenarioIds: ["p5", "p6", "p7", "p8"],
        scenario: "团队对你保持礼貌但不信任。你是技术出身，不擅长人情，但团队确实存在一些长期没人解决的技术债。",
        concept: "管理杠杆率：你最大的产出不是自己做多少，而是帮团队扫清他们搞不定的障碍。技术诊断是i人管理者最自然的破冰方式。",
        formula: "威信 = 技术价值 × 可复现贡献",
        model: [
          "1. 用两周Review团队近半年的代码、方案和项目状态。",
          "2. 找出1-2个真实技术债务或性能瓶颈。",
          "3. 组织一次不带批判的技术复盘会，只讲客观问题。",
          "4. 亲自牵头解决一个问题，把方法沉淀成团队可复用的文档。"
        ],
        examples: [
          "例1：你发现接口性能瓶颈，给出优化方案后团队开始主动找你讨论技术。",
          "例2：你把复盘结论写成手册，后续新成员可以自助查阅。"
        ],
        practice: [
          {
            prompt: "技术Review发现团队踩过同一个坑三次，你首先会怎么做？",
            options: ["在周会上批评团队", "写一篇复盘文档并组织一次专题复盘", "自己偷偷修掉", "等下次再发生再处理"],
            answer: 1,
            explanation: "把问题变成可复现的复盘和工具，是专业威信的最佳来源。"
          },
          {
            prompt: "管理杠杆率的核心是什么？",
            options: ["自己完成最多任务", "用最小投入撬动团队最大产出", "把时间花在审批上", "每天开很多会"],
            answer: 1,
            explanation: "杠杆率关注高价值活动，让团队产出最大化。"
          },
          {
            prompt: "技术复盘会最忌讳什么？",
            options: ["只讲客观问题", "让责任人当场认错", "给出优化方案", "形成行动清单"],
            answer: 1,
            explanation: "复盘要面向系统改进，而不是个人追责。"
          }
        ],
        homework: "写一份你所在团队最常见的技术或流程问题复盘，包含原因、影响和下一步方案。",
        keywords: ["技术", "杠杆", "复盘", "方案", "文档"],
        laws: ["管理杠杆率", "镜像法则", "格鲁夫给经理人的第一课"]
      },
      {
        id: "p3",
        titleZh: "第3课：i人沟通与驱动力",
        titleEn: "Lesson 3: Introvert-Friendly Communication",
        scenarioIds: ["p9", "p10", "p11", "p12"],
        scenario: "团队执行力一般，你觉得大家「推一下动一下」。你性格偏i，不喜欢频繁社交，但需要把指令和激励做到位。",
        concept: "管理不需要高频沟通，需要高质沟通。真正的驱动力不是胡萝卜加大棒，而是自主、专精、目的。",
        formula: "执行力 = 自主 × 专精 × 目的",
        model: [
          "1. 每周固定30分钟1对1，提前列议题，提问多于给答案。",
          "2. 布置工作写Brief，反馈用文档，减少口头信息损耗。",
          "3. 给任务时说明「为什么做、做多久、成功标准是什么」。",
          "4. 对不同成员用不同话术：对新人贴标签激励，对资深者请教式夸奖。"
        ],
        examples: [
          "例1：把「这个交给你了」改成「这个任务交给你，遇到困难随时找我」。",
          "例2：批评用三明治法：先认可、再讲具体问题、最后给支持。"
        ],
        practice: [
          {
            prompt: "下属汇报坏消息时，i人管理者首先应该？",
            options: ["立刻打断并给方案", "把话听完，再问原因和下一步", "先批评再讨论", "让HR处理"],
            answer: 1,
            explanation: "先听完，再把情绪翻译成事实，是高质沟通的起点。"
          },
          {
            prompt: "驱动力3.0的三要素是？",
            options: ["奖金、惩罚、晋升", "自主、专精、目的", "KPI、加班、排名", "资源、权力、关系"],
            answer: 1,
            explanation: "内在驱动力来自掌控感、心流和意义感。"
          },
          {
            prompt: "布置任务时，最能提升执行力的做法是？",
            options: ["只说结论", "给书面Brief并说明目的与标准", "让下属自己猜", "口头说一遍就结束"],
            answer: 1,
            explanation: "书面化+目的化降低信息损耗，也减少i人反复沟通的成本。"
          }
        ],
        homework: "为本周一个真实任务写一份Brief：背景、目标、负责人、检查节点、成功标准。",
        keywords: ["1对1", "自主", "专精", "目的", "Brief"],
        laws: ["驱动力", "不懂说话你怎么带团队", "亲和力法则"]
      },
      {
        id: "p4",
        titleZh: "第4课：梯队建设与接班规划",
        titleEn: "Lesson 4: Talent Pipeline",
        scenarioIds: ["p13", "p14", "p15", "p16"],
        scenario: "上级反复强调要建设人才梯队。你觉得自己离开后团队可能停摆，但你不知道从哪开始培养接班人。",
        concept: "领导者的终极考验，是离开后团队能否运转如常。梯队建设不是选一个人，而是做授权、发展任务和接班规划三个阶梯。",
        formula: "组织可持续 = 授权深度 × 后备人数 × 培养周期",
        model: [
          "1. 列出你本周所有工作，圈出30%可以授权出去。",
          "2. 给2-3个高潜成员完整的端到端小项目，你做节点检查。",
          "3. 画「岗位-候选人-能力差距」表，针对短板派活。",
          "4. 向上汇报时用具体证据：谁独立交付了什么，而不是只说谁不错。"
        ],
        examples: [
          "例1：你授权A负责一个小模块从需求到交付，3个月后A可以独立汇报。",
          "例2：你为每个关键岗位物色2名后备，季度更新培养计划。"
        ],
        practice: [
          {
            prompt: "授权五级阶梯中，高潜成员最适合放到哪一级？",
            options: ["1级：你全权决定", "2级：下属收集信息", "3级：下属给方案你批准", "4级：下属决策后报备"],
            answer: 3,
            explanation: "4级让高潜承担决策并报备，是培养接班人的目标状态。"
          },
          {
            prompt: "向上汇报梯队建设，最有说服力的证据是什么？",
            options: ["我花了很多时间培养人", "A独立交付了Y项目，B带新人完成Z", "我画了九宫格", "我准备了很多课程"],
            answer: 1,
            explanation: "上级要的是具体动作和可验证结果，而不是投入感。"
          },
          {
            prompt: "培养接班人时，如何控制授权风险？",
            options: ["完全不授权", "给他安全失败空间并限定影响范围", "让他自己摸索", "出了问题再撤权"],
            answer: 1,
            explanation: "允许犯错但控制损失，是授权与培养之间的平衡。"
          }
        ],
        homework: "画出你的岗位接班人表：候选人、能力差距、未来三个月补短板的动作。",
        keywords: ["授权", "接班人", "梯队", "培养", "证据"],
        laws: ["接班规划", "授权法则", "传承法则", "哈佛商学院最受欢迎的领导课"]
      },
      {
        id: "p5",
        titleZh: "第5课：绩效与目标管理",
        titleEn: "Lesson 5: Performance and Goals",
        scenarioIds: ["p17", "p18", "p19", "p20"],
        scenario: "上级要快速见效，项目又经常延期，核心成员开始流失。",
        concept: "绩效管理不是打分，而是对齐目标、追踪结果、及时反馈。",
        formula: "绩效 = 明确目标 × 可验证结果 × 及时反馈",
        model: ["1. 把模糊目标翻译成可验证KR。", "2. 主动同步坏消息并带恢复方案。", "3. 用1对1给具体反馈。", "4. 关键人才先了解真实动机再挽留。"],
        examples: ["例1：项目延期时主动同步恢复方案，信任不降反升。", "例2：核心成员想离职，先谈成长路径再谈加薪。"],
        practice: [
          { prompt: "项目确定延期，首先应该？", options: ["隐瞒到最后一刻", "主动同步并给恢复方案", "责怪团队", "要求加班"], answer: 1, explanation: "主动报告坏消息并带方案是建立信任的证据。" },
          { prompt: "绩效反馈最有效的形式是？", options: ["年终打分", "及时具体并落行动", "公开批评", "只夸不批"], answer: 1, explanation: "反馈要具体、及时、可行动。" },
          { prompt: "核心成员离职原因不明时，先做？", options: ["加薪硬留", "了解真实动机", "直接放人", "签竞业"], answer: 1, explanation: "先搞清楚是钱、成长还是信任问题。" }
        ],
        homework: "为一名关键成员写一份30天绩效反馈：事实、差距、下一步行动。",
        keywords: ["目标", "反馈", "延期", "关键成员", "绩效"],
        laws: ["格鲁夫给经理人的第一课", "驱动力", "绩效管理"]
      },
      {
        id: "p6",
        titleZh: "第6课：危机、信任与边界",
        titleEn: "Lesson 6: Crisis, Trust, and Boundaries",
        scenarioIds: ["p21", "p22", "p23", "p24"],
        scenario: "前任消极对抗、有人越级汇报、会议不出结论、目标模糊。",
        concept: "危机时先稳定信任，再用机制修复边界和流程。",
        formula: "稳定 = 信任修复 × 边界对齐 × 流程可见",
        model: ["1. 把对抗者变成信息源。", "2. 先诊断越级动机再对齐边界。", "3. 区分过程会议与决策会议。", "4. 把模糊目标翻译成KR。"],
        examples: ["例1：前任消极，你再次1对1并给发展承诺。", "例2：会议不出结论，你改用任务导向会议。"],
        practice: [
          { prompt: "前任消极配合，最好？", options: ["公开批评", "再1对1给发展承诺", "架空他", "忽略"], answer: 1, explanation: "把前任变成军师比对抗更有效。" },
          { prompt: "有人越级汇报，先做？", options: ["公开警告", "诊断动机再对齐边界", "也越级", "忽略"], answer: 1, explanation: "先看是信任还是流程问题。" },
          { prompt: "会议总不出结论，应？", options: ["继续开会", "区分两类会议", "取消会议", "书面发言"], answer: 1, explanation: "决策会议要控制人数并产出结论。" }
        ],
        homework: "为你最常开的会写一份会议类型和决策产出标准。",
        keywords: ["信任", "边界", "会议", "前任", "目标"],
        laws: ["团队协作的五大障碍", "格鲁夫给经理人的第一课"]
      },
      {
        id: "p7",
        titleZh: "第7课：OKR与驱动力落地",
        titleEn: "Lesson 7: OKR and Motivation",
        scenarioIds: ["p25", "p26", "p27", "p28"],
        scenario: "上级要求推OKR，团队抗拒挑战目标，你又成为决策瓶颈。",
        concept: "OKR先讲为什么，再试点；挑战目标需要安全感；授权能释放你的时间。",
        formula: "落地 = 为什么 × 小步试点 × 授权释放",
        model: ["1. 先讲对齐的价值，不直接要求填表。", "2. 试点小团队验证。", "3. 给挑战目标设定70%成功线。", "4. 列出可授权任务并按阶梯移交。"],
        examples: ["例1：你让一个小组先试OKR，团队看到价值后主动推广。", "例2：你授权30%任务，自己从审批中解放。"],
        practice: [
          { prompt: "团队抗拒OKR，先做？", options: ["要求填表", "先讲为什么再试点", "取消", "让HR推"], answer: 1, explanation: "先讲价值再试点。" },
          { prompt: "挑战目标难完成时？", options: ["降低目标", "说明70%算成功并给安全空间", "强制", "惩罚"], answer: 1, explanation: "挑战需要安全感。" },
          { prompt: "你成为决策瓶颈，首先？", options: ["继续拍板", "列出可授权任务", "减少决策", "让团队猜"], answer: 1, explanation: "先授权30%。" }
        ],
        homework: "写一个试点团队的OKR草稿：目标、3个KR、70%成功线。",
        keywords: ["OKR", "试点", "授权", "目标", "驱动力"],
        laws: ["这就是OKR", "驱动力", "授权法则"]
      },
      {
        id: "p8",
        titleZh: "第8课：梯队建设与接班证据",
        titleEn: "Lesson 8: Pipeline and Succession Evidence",
        scenarioIds: ["p29", "p30", "p31", "p32"],
        scenario: "培养对象成长慢，上级要汇报梯队进展，下属公开质疑你。",
        concept: "梯队建设要诊断瓶颈、用证据汇报、在质疑中保持领导力。",
        formula: "梯队证据 = 诊断 × 培养动作 × 可验证结果",
        model: ["1. 先诊断意愿还是能力问题。", "2. 用具体证据向上汇报。", "3. 邀请质疑者做风险识别者。", "4. 与上级意见不一致时先对齐信息。"],
        examples: ["例1：你说A独立交付了什么，而不是说我在培养人。", "例2：质疑者成为风险识别者，方案执行更稳。"],
        practice: [
          { prompt: "培养对象成长慢，先？", options: ["放弃", "诊断意愿/能力并调整任务", "加琐事", "换人"], answer: 1, explanation: "先诊断再派活补短板。" },
          { prompt: "向上汇报梯队，最有力的是？", options: ["讲投入感", "讲具体结果", "画大饼", "让HR代答"], answer: 1, explanation: "上级要可验证证据。" },
          { prompt: "下属公开质疑你的决定，最好？", options: ["当场反驳", "邀请他做风险识别者", "立即改", "冷处理"], answer: 1, explanation: "倾听而不让步。" }
        ],
        homework: "写一份90天梯队汇报：授权动作、2名培养对象、各自可验证结果。",
        keywords: ["诊断", "证据", "质疑", "梯队", "汇报"],
        laws: ["接班规划", "领导力试炼", "哈佛商学院最受欢迎的领导课"]
      },
      {
        id: "p9",
        titleZh: "第9课：文化转型与传承",
        titleEn: "Lesson 9: Culture and Legacy",
        scenarioIds: ["p33", "p34", "p35", "p36"],
        scenario: "公司文化与你习惯不同，你还要面对团建、绩效评估和离开前的交接。",
        concept: "文化变革先理解再小步调整；i人用高质沟通；交接要可验证。",
        formula: "传承 = 文化相容 × 高质沟通 × 可验证交接",
        model: ["1. 先理解旧文化再小步调整。", "2. 用1对1和书面同步替代高频社交。", "3. 绩效反馈具体并落改善计划。", "4. 确认接班人并做交接演练。"],
        examples: ["例1：你先保留团队习惯再引入新规则，阻力明显变小。", "例2：你培养两位接班人并做交接演练，离开后部门正常运转。"],
        practice: [
          { prompt: "文化不适时？", options: ["强制推行", "先理解再小步调整", "完全融入", "抱怨"], answer: 1, explanation: "文化变革需要节奏。" },
          { prompt: "i人管理者建立连接最稳的是？", options: ["大型团建", "固定1对1和书面同步", "拒绝社交", "让HR负责"], answer: 1, explanation: "高质沟通比高频社交有效。" },
          { prompt: "离开前交接最重要的是？", options: ["留给自己", "确认接班并演练", "口头交代", "让上级指定"], answer: 1, explanation: "交接要可验证。" }
        ],
        homework: "写一份接班人交接清单：岗位、候选人、能力差距、交接演练日期。",
        keywords: ["文化", "沟通", "交接", "接班人", "评估"],
        laws: ["传承法则", "哈佛商学院最受欢迎的领导课", "卓有成效的管理者"]
      }
    ]
  },
  {
    role: "founder",
    titleZh: "创业者 · 从0到1带团队",
    titleEn: "Founder · Build a Team from Zero",
    summary: "对应创业初期资源少、变化快、团队需要被赋能和培养领导者的场景。",
    lessons: [
      {
        id: "f1",
        titleZh: "第1课：盖子法则与影响力",
        titleEn: "Lesson 1: The Lid and Influence",
        scenarioIds: ["f1", "f2", "f3", "f4"],
        scenario: "你刚创业，团队只有3个人。大家觉得你技术强，但不知道未来方向；所有决策都等你拍板，你成了瓶颈。",
        concept: "盖子法则：团队成效被你的领导力上限限制。影响力才是领导力标准，职位和头衔不能代替自愿追随。",
        formula: "团队产出 = 领导力盖子 × 成员潜能",
        model: [
          "1. 先承认自己也有盲区，用学习提升盖子。",
          "2. 把愿景讲成团队共同的航线，而不是你的命令。",
          "3. 用可验证的小胜积累影响力。",
          "4. 关键决策邀请核心成员参与，让目标从我的变成我们的。"
        ],
        examples: [
          "例1：你连续两周开复盘会，团队开始主动提出改进建议。",
          "例2：你公开分享一次自己的失败判断，反而让团队更信任你。"
        ],
        practice: [
          {
            prompt: "盖子法则给创业者的启示是？",
            options: ["团队能力决定一切", "领导力上限限制组织成效", "多招能力强的人即可", "职位越高越有领导力"],
            answer: 1,
            explanation: "盖子法则强调先提升自己，否则再强的团队也被盖子限制。"
          },
          {
            prompt: "影响力最大的来源是？",
            options: ["头衔", "自愿追随", "加班时长", "信息垄断"],
            answer: 1,
            explanation: "领导力的本质是赢得自愿追随的影响力。"
          },
          {
            prompt: "创业初期建立影响力的最快路径？",
            options: ["多发命令", "做一件可验证的小事并让团队看到", "画大饼", "隐藏问题"],
            answer: 1,
            explanation: "小胜积累动势，让团队相信方向可行。"
          }
        ],
        homework: "写下你团队当前最想实现的一个月目标，以及一个本周就能完成的小胜利。",
        keywords: ["盖子", "影响力", "愿景", "小胜", "追随"],
        laws: ["盖子法则", "影响力法则", "动势法则"]
      },
      {
        id: "f2",
        titleZh: "第2课：方向、取舍与OKR",
        titleEn: "Lesson 2: Direction, Trade-off, OKR",
        scenarioIds: ["f5", "f6", "f7", "f8"],
        scenario: "三个方向都想做：新产品、新客户、新渠道。资源和精力有限，团队开始分散，大家都很忙但没产出。",
        concept: "导航法则和优先次序法则：做对的事比做很多事重要。OKR让目标和关键结果对齐，避免瞎忙。",
        formula: "有效产出 = 正确方向 × 聚焦投入",
        model: [
          "1. 复盘过去经验，找出哪些事投入高但回报低。",
          "2. 排序时问：不做哪一件损失最大。",
          "3. 把愿景拆成3-5个要务，再拆成可量化KR。",
          "4. 每周追踪，挑战性目标70%完成率就是成功。"
        ],
        examples: [
          "例1：你砍掉一个低价值渠道，把资源集中到客户留存，月留存提升20%。",
          "例2：你把目标拆成「Q3新增10个付费客户」，而不是「提升用户体验」。"
        ],
        practice: [
          {
            prompt: "资源有限时，优先选择哪个项目？",
            options: ["最轻松的项目", "不做损失最大的项目", "所有人都支持的项目", "最快见效但无长期价值的项目"],
            answer: 1,
            explanation: "用损失最大原则排序，比用兴趣排序更理性。"
          },
          {
            prompt: "OKR里关键结果最重要的要求是？",
            options: ["可量化", "听起来宏大", "容易完成", "由老板决定"],
            answer: 0,
            explanation: "关键结果必须可量化，否则无法追踪和对齐。"
          },
          {
            prompt: "舍得法则在创业中的应用是？",
            options: ["每件事都做一点", "牺牲短期利益换取长期影响力", "只做短期赚钱的事", "停止投入"],
            answer: 1,
            explanation: "先舍后得，长期影响力来自持续投入。"
          }
        ],
        homework: "把团队当前目标拆成3个要务和3个可量化KR，并标出你要放弃的一件事。",
        keywords: ["方向", "优先", "OKR", "KR", "取舍"],
        laws: ["导航法则", "优先次序法则", "舍得法则", "这就是OKR"]
      },
      {
        id: "f3",
        titleZh: "第3课：驱动团队内驱力",
        titleEn: "Lesson 3: Drive Intrinsic Motivation",
        scenarioIds: ["f9", "f10", "f11", "f12"],
        scenario: "团队没激情，给奖金也只是短期刺激。大家觉得在给公司打工，不知道为什么要做这件事。",
        concept: "驱动力3.0：传统奖励和惩罚在削弱内在动机。真正驱动团队的是自主、专精和目的。",
        formula: "绩效 = 目标对齐 × 关键结果 × 追踪",
        model: [
          "1. 让成员参与目标制定，把目标变成我们的。",
          "2. 给「跳一跳够得着」的任务，进入心流。",
          "3. 讲清楚这件事对用户和团队的意义。",
          "4. 用追踪代替控制，让进度可见但不催命。"
        ],
        examples: [
          "例1：你给团队每周半天自由探索时间，两个新想法落地。",
          "例2：你把项目意义讲成「帮客户少加班」，团队主动性明显提升。"
        ],
        practice: [
          {
            prompt: "驱动力3.0里「自主」指什么？",
            options: ["想做什么就做什么", "对工作内容和方式有掌控感", "不用汇报", "自己定工资"],
            answer: 1,
            explanation: "自主是掌控感，不是无边界自由。"
          },
          {
            prompt: "团队长期没激情，最可能缺什么？",
            options: ["更多奖金", "更多惩罚", "意义感和价值感", "更长的工时"],
            answer: 2,
            explanation: "外在激励会衰减，意义感才是长期引擎。"
          },
          {
            prompt: "目标追踪的正确姿势是？",
            options: ["每天盯进度施压", "让进度透明并共同调整", "只看结果不问过程", "让HR统计"],
            answer: 1,
            explanation: "追踪是为了对齐和调整，不是控制。"
          }
        ],
        homework: "为当前最重要项目写一段「为什么重要」的说明，并给团队一个可自主决策的小范围。",
        keywords: ["自主", "专精", "目的", "追踪", "意义"],
        laws: ["驱动力", "动势法则", "增值法则"]
      },
      {
        id: "f4",
        titleZh: "第4课：培养领导者，实现倍增",
        titleEn: "Lesson 4: Grow Leaders, Not Followers",
        scenarioIds: ["f13", "f14", "f15", "f16"],
        scenario: "你想扩张，但每个关键决策都要你亲自拍板。你感觉自己是公司最大的瓶颈，团队没有能独立带项目的负责人。",
        concept: "培养追随者得到相加效果，培养领导者得到倍增效果。授权阶梯帮助你在控制风险的同时让下属成长。",
        formula: "组织成长 = 培养领导者 × 授权成熟度",
        model: [
          "1. 把任务按授权五级阶梯分级，明确每个人当前级别。",
          "2. 给高潜成员完整的小项目，你做节点检查。",
          "3. 允许犯错但限定损失范围。",
          "4. 设定3个月后希望他升到的级别，并持续反馈。"
        ],
        examples: [
          "例1：你把一个新客户项目交给骨干，他只在你要求的关键节点同步。",
          "例2：你培养出第一个项目负责人后，团队扩张速度明显加快。"
        ],
        practice: [
          {
            prompt: "培养追随者与培养领导者的区别是？",
            options: ["没区别", "前者相加，后者倍增", "前者更省钱", "后者只适合大公司"],
            answer: 1,
            explanation: "培养领导者能复制能力，带来指数级增长。"
          },
          {
            prompt: "授权时如何控制风险？",
            options: ["完全不授权", "给安全失败空间并限定影响范围", "等成熟了再授权", "出了问题再撤权"],
            answer: 1,
            explanation: "授权和培养需要可接受的失败边界。"
          },
          {
            prompt: "你想扩张但自己成为瓶颈，优先动作是？",
            options: ["继续自己做所有决策", "培养一个可独立带项目的负责人", "招更多执行者", "减少项目"],
            answer: 1,
            explanation: "培养负责人是突破瓶颈的关键。"
          }
        ],
        homework: "为一名骨干设计3个月成长计划：当前授权级别、目标级别、2个完整项目、检查节点。",
        keywords: ["授权", "倍增", "领导者", "接班人", "培养"],
        laws: ["授权法则", "爆炸性倍增法则", "传承法则", "赋能"]
      },
      {
        id: "f5",
        titleZh: "第5课：融资、危机与士气",
        titleEn: "Lesson 5: Funding, Crisis, and Morale",
        scenarioIds: ["f17", "f18", "f19", "f20"],
        scenario: "融资失败、士气低落、合伙人理念冲突，同时要招第一位高管。",
        concept: "危机时透明沟通、先复盘系统再复盘人，用数据化解理念冲突。",
        formula: "韧性 = 透明 × 系统复盘 × 数据决策",
        model: ["1. 公开事实并一起降本保命。", "2. 先复盘系统再复盘人。", "3. 把理念冲突变成可量化假设。", "4. 招能力互补并明确授权边界的高管。"],
        examples: ["例1：融资失败后你公开现金流并共同砍成本，团队反而更信任你。", "例2：两位合伙人各做一个可验证试点，用结果说话。"],
        practice: [
          { prompt: "融资失败只剩三个月现金流，先？", options: ["隐瞒", "公开事实共同决策", "立刻裁员", "找高利贷"], answer: 1, explanation: "透明沟通和共同决策更稳。" },
          { prompt: "连续失败士气低，先？", options: ["追责", "复盘系统再复盘人", "打鸡血", "忽略"], answer: 1, explanation: "先解决系统问题。" },
          { prompt: "合伙人理念冲突，最好？", options: ["选边站", "做成可量化假设", "让董事会裁决", "各干各的"], answer: 1, explanation: "用数据化解立场。" }
        ],
        homework: "为当前公司写一份90天生存计划：现金流、优先级、一个共同验证假设。",
        keywords: ["融资", "透明", "士气", "复盘", "数据"],
        laws: ["制胜法则", "团队协作的五大障碍", "卓有成效的管理者"]
      },
      {
        id: "f6",
        titleZh: "第6课：组织、协作与裁员",
        titleEn: "Lesson 6: Organization, Collaboration, Downsizing",
        scenarioIds: ["f21", "f22", "f23", "f24"],
        scenario: "老员工排挤新人、跨部门不同步、远程信息缺失，还被要求裁员。",
        concept: "用共同目标打破小团体，用依赖清单和共享意识解决协作，裁员要基于业务优先级。",
        formula: "组织效率 = 共同目标 × 依赖可见 × 优先级决策",
        model: ["1. 重新定义共同目标和分工。", "2. 建立共享目标和依赖清单。", "3. 用异步文档和固定节奏同步远程团队。", "4. 裁员按业务优先级保留关键能力。"],
        examples: ["例1：你列出跨部门依赖清单，资源争夺变成精准协作。", "例2：远程团队用异步文档后，错过信息明显减少。"],
        practice: [
          { prompt: "老员工排挤新人，先？", options: ["偏袒老人", "重新定义共同目标", "开除老人", "让新人忍"], answer: 1, explanation: "用共同目标打破小团体。" },
          { prompt: "跨部门各说各话，先？", options: ["继续开会", "建立共享目标和依赖清单", "CEO拍板", "各做各的"], answer: 1, explanation: "让依赖关系可见。" },
          { prompt: "被迫裁员，按什么决定？", options: ["人情", "业务优先级", "工龄", "随机"], answer: 1, explanation: "裁员要基于组织需要。" }
        ],
        homework: "画一张当前项目的最小依赖清单：需要谁、做什么、每周多少时间。",
        keywords: ["目标", "依赖", "远程", "裁员", "协作"],
        laws: ["赋能", "团队协作的五大障碍"]
      },
      {
        id: "f7",
        titleZh: "第7课：文化、高潜与接班人",
        titleEn: "Lesson 7: Culture, High Potential, Succession",
        scenarioIds: ["f25", "f26", "f27", "f28"],
        scenario: "公司变大后文化稀释，骨干挑战你，你决定培养接班人但担心犯错。",
        concept: "文化要靠可观察行为维护；把挑战变成验证；培养领导者并控制损失。",
        formula: "组织延续 = 行为文化 × 验证机制 × 授权培养",
        model: ["1. 把价值观变成行为标准和复盘项。", "2. 邀请挑战者参与验证并明确边界。", "3. 选2-3名高潜给完整项目。", "4. 授权后允许安全失败并复盘。"],
        examples: ["例1：你把价值观写进周会复盘，团队开始主动对照。", "例2：接班人犯错后你复盘系统而不是收回授权。"],
        practice: [
          { prompt: "文化被稀释，先？", options: ["只靠制度", "把价值观变成行为标准", "不管", "开除"], answer: 1, explanation: "文化靠可观察行为维护。" },
          { prompt: "高潜骨干质疑方向，最好？", options: ["压制", "邀请参与验证", "让他走", "让步"], answer: 1, explanation: "把挑战变成共同验证。" },
          { prompt: "培养接班人犯错后？", options: ["收回授权", "复盘系统继续培养", "公开批评", "让他离职"], answer: 1, explanation: "控制损失并转化为成长。" }
        ],
        homework: "写一份公司价值观行为清单：每条价值观对应2个可观察行为。",
        keywords: ["文化", "价值观", "高潜", "接班人", "验证"],
        laws: ["赋能", "爆炸性倍增法则", "领导力试炼"]
      },
      {
        id: "f8",
        titleZh: "第8课：离开、汇报与新方向",
        titleEn: "Lesson 8: Absence, Reporting, New Directions",
        scenarioIds: ["f29", "f30", "f31", "f32"],
        scenario: "你计划离开一个月、要向董事会汇报、团队提新方向，还遇到短期利益诱惑。",
        concept: "用机制保证离开也能运转；向董事会讲可验证结果；新方向最小验证；舍得长期。",
        formula: "成长决策 = 可逆机制 × 可验证结果 × 长期取舍",
        model: ["1. 提前授权并约定决策边界。", "2. 汇报用具体结果和里程碑。", "3. 新方向用最小验证试跑。", "4. 短期利益先评估长期影响。"],
        examples: ["例1：你离开一个月前写好决策边界，团队独立运转。", "例2：新业务先做一周MVP验证，再决定是否投入。"],
        practice: [
          { prompt: "离开一个月前最该做？", options: ["远程遥控", "提前授权并定边界", "不离开", "让成员自决"], answer: 1, explanation: "用机制保证运转。" },
          { prompt: "向董事会汇报最有效的是？", options: ["讲愿景", "讲可验证结果和里程碑", "画饼", "让CFO代答"], answer: 1, explanation: "董事会要结果。" },
          { prompt: "团队提新方向，最好？", options: ["拒绝", "最小验证", "立刻投入", "让团队决定"], answer: 1, explanation: "用低成本验证代替拍脑袋。" }
        ],
        homework: "为团队一个新想法写一个7天最小验证方案：假设、动作、判断标准。",
        keywords: ["授权", "汇报", "验证", "新方向", "取舍"],
        laws: ["舍得法则", "导航法则", "直觉法则"]
      },
      {
        id: "f9",
        titleZh: "第9课：规模化管理与传承",
        titleEn: "Lesson 9: Scaling and Legacy",
        scenarioIds: ["f33", "f34", "f35", "f36"],
        scenario: "公司50人了，你还在审批每个细节；计划不执行；准备扩张和交班。",
        concept: "规模化管理要靠机制和授权层级；执行偏差来自目标不清晰；扩张靠可复制的管理者；传承要把人和机制一起交出去。",
        formula: "规模化 = 机制授权 × 目标对齐 × 可复制人才 × 传承演练",
        model: ["1. 建立授权层级和例外规则。", "2. 检查目标是否对齐、KR是否可量化。", "3. 培养可独立带队的管理者。", "4. 做传承演练，把人和机制一起交接。"],
        examples: ["例1：你建立授权层级后，审批量下降80%。", "例2：扩张前先培养2名可带队负责人。"],
        practice: [
          { prompt: "50人还审批每个细节，先？", options: ["继续审批", "建立授权层级和例外规则", "全部放权", "招助理"], answer: 1, explanation: "机制代替个人。" },
          { prompt: "计划执行总打折扣，先检查？", options: ["执行力", "目标是否对齐/KR可量化", "换人", "每天催"], answer: 1, explanation: "偏差常来自目标不清。" },
          { prompt: "准备扩张，先培养？", options: ["更多执行者", "可独立带队的管理者", "自己先跑", "外包"], answer: 1, explanation: "扩张靠可复制人才。" }
        ],
        homework: "写一份规模化授权图：层级、例外规则、每个层级的决策边界。",
        keywords: ["授权", "目标", "扩张", "管理者", "传承"],
        laws: ["赋能", "爆炸性倍增法则", "传承法则"]
      }
    ]
  },
  {
    role: "highPotential",
    titleZh: "高潜人才 · 脱颖而出",
    titleEn: "High Potential · Stand Out",
    summary: "对应没有正式管理职位但需要展现管理潜质、积累能见度和影响力的场景。",
    lessons: [
      {
        id: "h1",
        titleZh: "第1课：把打杂做深",
        titleEn: "Lesson 1: Go Deep on Grunt Work",
        scenarioIds: ["h1", "h2", "h3", "h4"],
        scenario: "你以高潜身份入职，经理却给你一个整理历史文档两周的任务。你觉得委屈，但不知道如何展示价值。",
        concept: "高潜的第一个信号：即使在最基础的任务上，也能做出超出预期的深度。不是做完，而是做深。",
        formula: "能见度 = 基础任务 × 附加值",
        model: [
          "1. 高效完成规定动作，不留质量漏洞。",
          "2. 增加一个思考动作：总结关键决策点、经验教训、索引摘要。",
          "3. 把学习过程变成可交付的产出，而不是只留在脑子里。",
          "4. 主动同步给经理，让附加值被看见。"
        ],
        examples: [
          "例1：归档的同时梳理项目关键决策点，做成一页索引摘要给经理。",
          "例2：把维护项目升级为系统优化方案，而不是只修Bug。"
        ],
        practice: [
          {
            prompt: "被分配打杂任务时，高潜最佳做法是？",
            options: ["拒绝并要更好的任务", "高效完成并叠加可交付的思考成果", "慢慢做等机会", "抱怨给同事听"],
            answer: 1,
            explanation: "在基础任务上做出深度，是展示高潜的经典方式。"
          },
          {
            prompt: "「把学习变成可见成果」指的是？",
            options: ["自己默默学习", "产出文档、摘要或改进建议并同步", "发朋友圈", "参加更多培训"],
            answer: 1,
            explanation: "学习要形成可交付产出，才能被组织看见。"
          },
          {
            prompt: "面对非核心项目，最不合适的做法是？",
            options: ["把分内事做到位", "主动梳理优化建议", "直接拒绝", "先做深再做多"],
            answer: 2,
            explanation: "先证明自己能把当前任务做好，再谈更多。"
          }
        ],
        homework: "把你本周最琐碎的任务，改写为包含「做深动作」的交付清单。",
        keywords: ["基础任务", "附加值", "可见", "产出", "做深"],
        laws: ["过程法则", "镜像法则", "高潜36情境"]
      },
      {
        id: "h2",
        titleZh: "第2课：功劳与协作",
        titleEn: "Lesson 2: Credit and Collaboration",
        scenarioIds: ["h5", "h6", "h7", "h8"],
        scenario: "你花两周做的分析被同事在周会上展示，完全没有提你的贡献。你感到被忽略，但不想破坏关系。",
        concept: "高潜要能把功劳竞争转化为成果合作。温和主张贡献，而不是公开抢功或沉默。",
        formula: "影响力 = 成果 × 可被看见 × 合作",
        model: [
          "1. 公开场合不纠正表扬，避免显得计较。",
          "2. 私下找同事，把「我的数据」变成「我们的报告」。",
          "3. 必要时请经理校准认知：用确认代替投诉。",
          "4. 把客户或高层的正反馈转化为下一步资源。"
        ],
        examples: [
          "例1：你主动找同事合并分析，成果被经理看到，双方都受益。",
          "例2：你私下和经理说「想确认是否有误解」，温和主张归属。"
        ],
        practice: [
          {
            prompt: "功劳被截胡时，首先应该？",
            options: ["公开指出", "私下找同事合作或请经理校准", "沉默", "在背后说同事坏话"],
            answer: 1,
            explanation: "先私下、后上级，用合作和校准代替对抗。"
          },
          {
            prompt: "客户当众表扬你，高潜应如何转化？",
            options: ["只收下夸奖", "归功于团队并请求继续深挖", "马上要求加薪", "分享到群里炫耀"],
            answer: 1,
            explanation: "把正反馈转化为资源和更大授权，是高潜的向上管理技巧。"
          },
          {
            prompt: "向经理澄清贡献的最佳表述是？",
            options: ["那个报告是我做的", "我想确认是不是有误解，我提供了一些框架和数据", "同事偷了我的成果", "你们都不尊重我"],
            answer: 1,
            explanation: "用确认代替投诉，让经理校准认知而不是处理情绪。"
          }
        ],
        homework: "写出一次你被忽略贡献的场景，并改写为「合作+确认」的沟通脚本。",
        keywords: ["功劳", "合作", "可见", "确认", "资源"],
        laws: ["亲和力法则", "增值法则", "高潜36情境"]
      },
      {
        id: "h3",
        titleZh: "第3课：向上管理",
        titleEn: "Lesson 3: Manage Up",
        scenarioIds: ["h9", "h10", "h11", "h12"],
        scenario: "你发现经理的方案有重大风险，但团队都在点头。你担心公开指出会让经理难堪。",
        concept: "向上管理不是讨好，而是帮助上级做更好的决策。私下反馈风险、公开支持决策，是黄金法则。",
        formula: "信任 = 判断准确 × 表达时机 × 保留面子",
        model: [
          "1. 先验证判断：确认这是风险还是你想多了。",
          "2. 用假设性语言：我可能想多了，但我担心一个问题。",
          "3. 私下反馈，把情绪翻译成事实和补充分析。",
          "4. 公开场合支持决策，给上级保留尊严。"
        ],
        examples: [
          "例1：你私下告诉经理一个兼容性风险，他调整了方案并感谢你。",
          "例2：会上你支持决策，会后提交一份补充风险分析。"
        ],
        practice: [
          {
            prompt: "发现上级方案有漏洞，最佳时机是？",
            options: ["会议上公开指出", "会后私下用假设性语言反馈", "写邮件抄送所有人", "等出问题再说"],
            answer: 1,
            explanation: "私下+假设性语言，既保留面子又提供价值。"
          },
          {
            prompt: "向上反馈团队不满时，应该？",
            options: ["直接说大家很生气", "把情绪翻译成具体事实和方案", "联合同事施压", "告诉HR"],
            answer: 1,
            explanation: "传递事实和方案，而不是传递情绪。"
          },
          {
            prompt: "向上管理的核心是？",
            options: ["讨好上级", "帮助上级更好决策", "获得特殊资源", "隐藏错误"],
            answer: 1,
            explanation: "让上级决策更完整，是向上管理的价值。"
          }
        ],
        homework: "找一个你近期不同意但已决定的方案，写一段私下反馈脚本：验证、假设性语言、补充分析。",
        keywords: ["私下", "反馈", "风险", "假设", "保留面子"],
        laws: ["接纳法则", "时机法则", "高潜36情境"]
      },
      {
        id: "h4",
        titleZh: "第4课：无职权影响力",
        titleEn: "Lesson 4: Influence Without Authority",
        scenarioIds: ["h13", "h14", "h15", "h16"],
        scenario: "你没有正式头衔，却被要求协调5个同事完成跨职能项目。两位资深同事不太买账，指令总被拖延。",
        concept: "没有权力的负责人靠信息透明和共同承诺推动事情，而不是靠权威。把依赖关系变得可见。",
        formula: "推动力 = 透明信息 × 共同承诺 × 最小依赖",
        model: [
          "1. 启动会上书面确认分工和时间节点，发会议纪要。",
          "2. 把进度和时间线公开，让拖延变成可见风险。",
          "3. 先对齐意愿，再上工具；否则工具会被当成控制。",
          "4. 把跨部门依赖切到最小，只要求对方最关键的配合。"
        ],
        examples: [
          "例1：你把项目计划发全员，任务变成共同承诺而不是你的要求。",
          "例2：你向市场部只要求每周2小时方向确认，而不是大量资源。"
        ],
        practice: [
          {
            prompt: "无职权协调项目，最有效的推动方式是？",
            options: ["找领导压人", "公开同步分工和时间线", "自己把所有活干了", "忽略不配合的人"],
            answer: 1,
            explanation: "透明信息让依赖关系可见，形成共同承诺。"
          },
          {
            prompt: "资深同事不配合时，首先解决什么？",
            options: ["换人", "意愿和关系", "增加工具", "找HR"],
            answer: 1,
            explanation: "先解决意愿，再解决进度工具。"
          },
          {
            prompt: "跨部门资源紧张时，最佳做法是？",
            options: ["要求全部资源", "切出最小依赖项", "等他们有空", "向高层告状"],
            answer: 1,
            explanation: "精确切割依赖，降低合作门槛。"
          }
        ],
        homework: "为你当前协调的项目画一张最小依赖表：需要谁、做什么、每周多少时间、由谁检查。",
        keywords: ["透明", "承诺", "依赖", "意愿", "协调"],
        laws: ["核心圈法则", "制胜法则", "高潜36情境"]
      },
      {
        id: "h5",
        titleZh: "第5课：空降与变化期",
        titleEn: "Lesson 5: New Manager and Change",
        scenarioIds: ["h17", "h18", "h19", "h20"],
        scenario: "新经理空降、你被指定牵头无头衔项目、建议执行不佳、同事获得晋升。",
        concept: "变化期主动建立连接；无头衔靠透明承诺；坏消息主动报告；晋升失利变成改进清单。",
        formula: "变化期优势 = 主动连接 × 透明推动 × 主动报告 × 差距转化",
        model: ["1. 新经理空降先约1对1。", "2. 无头衔项目书面分工并公开同步。", "3. 执行不佳主动报告并给优化方向。", "4. 晋升失利约经理请教差距。"],
        examples: ["例1：新经理空降后你第一个约1对1，成为首批核心圈。", "例2：项目延期你主动同步，反而获得信任。"],
        practice: [
          { prompt: "新经理空降，最好？", options: ["观望", "主动约1对1", "等安排", "找老部下"], answer: 1, explanation: "空降期是信任窗口。" },
          { prompt: "无头衔协调项目靠什么？", options: ["权威", "透明信息和共同承诺", "关系", "运气"], answer: 1, explanation: "透明让依赖可见。" },
          { prompt: "建议执行不佳，先？", options: ["硬撑", "主动报告并给方向", "隐藏", "等被发现"], answer: 1, explanation: "主动报告坏消息是信任证据。" }
        ],
        homework: "写一份当前变化期的30天行动清单：连接、透明、报告、差距补强。",
        keywords: ["空降", "透明", "报告", "晋升", "行动"],
        laws: ["接纳法则", "高潜36情境"]
      },
      {
        id: "h6",
        titleZh: "第6课：带人与跨部门",
        titleEn: "Lesson 6: Mentoring and Cross-Team",
        scenarioIds: ["h21", "h22", "h23", "h24"],
        scenario: "带新人、跨部门抢资源、流程优化被否、信息不足时要做决策。",
        concept: "带人要有可衡量成长；跨部门切最小依赖；变革用最小试点；决策用有边界判断。",
        formula: "协作产出 = 培养证据 × 最小依赖 × 最小验证 × 有条件判断",
        model: ["1. 带新人制定3个月成长计划。", "2. 跨部门只要求最关键配合。", "3. 变革先用自己任务试跑。", "4. 信息不足时给方向并建议小试点。"],
        examples: ["例1：你给新人成长计划，3个月后他独立交付。", "例2：你向市场部只要求每周2小时，协作顺利推进。"],
        practice: [
          { prompt: "带新人最重要的是？", options: ["最低限度", "可衡量的成长计划", "推给别人", "放任"], answer: 1, explanation: "带人价值在于成长结果。" },
          { prompt: "跨部门资源紧张，最好？", options: ["要求全部资源", "切出最小依赖", "等", "找高层"], answer: 1, explanation: "降低协作门槛。" },
          { prompt: "信息不足时决策？", options: ["拒绝", "判断并建议小试点", "拖延", "硬扛"], answer: 1, explanation: "有条件判断加低成本验证。" }
        ],
        homework: "为你的新人写一份90天成长计划：阶段、目标、每周1对1主题。",
        keywords: ["新人", "成长", "依赖", "试点", "判断"],
        laws: ["核心圈法则", "制胜法则", "高潜36情境"]
      },
      {
        id: "h7",
        titleZh: "第7课：自我认知与风险",
        titleEn: "Lesson 7: Self-Awareness and Risk",
        scenarioIds: ["h25", "h26", "h27", "h28"],
        scenario: "对岗位失去热情、高风险项目、超高难度任务、高潜标签被疏远。",
        concept: "坦诚表达兴趣；有边界的冒险；接受任务时管理完成条件；用真实示弱平衡身份。",
        formula: "长期发展 = 坦诚 × 可逆冒险 × 资源请求 × 真实示弱",
        model: ["1. 1对1坦诚表达兴趣变化。", "2. 高风险项目约定时间分配。", "3. 高难度任务提出所需支持。", "4. 复盘会主动分享真实盲区。"],
        examples: ["例1：你坦诚想转产品，经理安排过渡项目。", "例2：你接受高难度任务并请导师，最终交付。"],
        practice: [
          { prompt: "对岗位失去热情，先？", options: ["隐藏", "1对1坦诚", "离职", "抱怨"], answer: 1, explanation: "坦诚让组织帮你调整。" },
          { prompt: "高风险项目怎么参与？", options: ["all in", "约定时间边界", "拒绝", "偷偷参与"], answer: 1, explanation: "有边界的冒险。" },
          { prompt: "高潜被疏远怎么平衡？", options: ["表演失败", "真实分享盲区", "疏远回去", "争辩"], answer: 1, explanation: "真实示弱建立信任。" }
        ],
        homework: "写一份你的职业兴趣与能力清单：想做什么、差距、下季度一个可逆尝试。",
        keywords: ["兴趣", "风险", "资源", "盲区", "示弱"],
        laws: ["过程法则", "制胜法则", "高潜36情境"]
      },
      {
        id: "h8",
        titleZh: "第8课：晋升与可见度",
        titleEn: "Lesson 8: Promotion and Visibility",
        scenarioIds: ["h29", "h30", "h31", "h32"],
        scenario: "晋升需等待、为他人做嫁衣、模糊晋升信号、功劳被冒认。",
        concept: "等待期补证据；支持他人时保持可见度；模糊信号变行动；温和维护归属。",
        formula: "晋升准备 = 差距清单 × 支持可见 × 行动信号 × 归属确认",
        model: ["1. 问清差距并制定半年计划。", "2. 帮他人时争取支持角色。", "3. 模糊信号变成具体行动。", "4. 功劳被冒认先同事后经理。"],
        examples: ["例1：你问清晋升差距后主导跨部门项目，材料更扎实。", "例2：你帮老张汇报时争取数据附录支持角色，高层看到你。"],
        practice: [
          { prompt: "晋升需等待，最好？", options: ["被动等", "问差距并补证据", "离职", "找关系"], answer: 1, explanation: "等待期变成准备期。" },
          { prompt: "为他人做嫁衣时？", options: ["只做事", "争取支持角色可见度", "拒绝", "抢功"], answer: 1, explanation: "支持同时保持可见。" },
          { prompt: "功劳被冒认，先？", options: ["公开说", "私下找同事确认", "沉默", "暗示"], answer: 1, explanation: "温和维护归属。" }
        ],
        homework: "写一份半年晋升准备清单：差距、2个跨部门项目、支持角色安排。",
        keywords: ["晋升", "差距", "可见度", "功劳", "行动"],
        laws: ["增值法则", "高潜36情境"]
      },
      {
        id: "h9",
        titleZh: "第9课：领导力试炼",
        titleEn: "Lesson 9: Leadership Test",
        scenarioIds: ["h33", "h34", "h35", "h36"],
        scenario: "不认可的项目决策、带问题实习生、第一次带团队、资深成员公开质疑。",
        concept: "决策前影响决策；辅导责任与向上沟通平衡；第一次带团队坦诚学习；倾听而不让步。",
        formula: "领导力 = 决策前影响 × 责任边界 × 坦诚学习 × 倾听坚守",
        model: ["1. 决策前私下讨论关键假设。", "2. 带问题实习生同步事实并请求边界。", "3. 第一次带团队坦诚请求反馈。", "4. 公开质疑时邀请对方做风险识别者。"],
        examples: ["例1：你私下提醒方案假设风险，负责人调整方向。", "例2：资深成员质疑后成为风险识别者，方案执行更稳。"],
        practice: [
          { prompt: "不认可项目决策，最好？", options: ["公开反对", "决策前私下讨论", "沉默", "事后写邮件"], answer: 1, explanation: "在决策前影响决策。" },
          { prompt: "带问题实习生，先？", options: ["无限容忍", "同步事实并请求边界", "只报数据", "直接警告"], answer: 1, explanation: "承担责任并向上管理预期。" },
          { prompt: "第一次带团队，最好？", options: ["表演权威", "坦诚请求反馈", "和以前一样", "先不表态"], answer: 1, explanation: "坦诚学习赢得支持。" }
        ],
        homework: "写一份你的第一次带团队90天计划：观察、沟通、边界、反馈机制。",
        keywords: ["决策", "实习生", "坦诚", "质疑", "边界"],
        laws: ["制胜法则", "领导力试炼", "高潜36情境"]
      }
    ]
  }
];

export function createTeamAcademyState(role: TeamRole): TeamAcademyState {
  return {
    role,
    dimensions: { trust: 0, connection: 0, strategy: 0, succession: 0 },
    completedLessons: [],
    completedScenarios: [],
    scenarioScores: {},
    practiceScores: {},
    homeworkScores: {},
    updatedAt: Date.now()
  };
}

export function courseFor(role: TeamRole): TeamAcademyCourse {
  return ACADEMY_COURSES.find((course) => course.role === role) ?? ACADEMY_COURSES[0];
}

export function applyPracticeAnswer(
  state: TeamAcademyState,
  lessonId: string,
  questionIndex: number,
  optionIndex: number
): { state: TeamAcademyState; correct: boolean; gained: number } {
  const lesson = courseFor(state.role).lessons.find((item) => item.id === lessonId);
  const question = lesson?.practice[questionIndex];
  if (!lesson || !question) return { state, correct: false, gained: 0 };
  const correct = question.answer === optionIndex;
  const gained = correct ? 6 : 0;
  const next: TeamAcademyState = {
    ...state,
    practiceScores: {
      ...state.practiceScores,
      [lessonId]: (state.practiceScores[lessonId] ?? 0) + gained
    },
    updatedAt: Date.now()
  };
  return { state: next, correct, gained };
}

export function submitHomework(
  state: TeamAcademyState,
  lessonId: string,
  text: string
): { state: TeamAcademyState; score: number; passed: boolean; missing: string[] } {
  const lesson = courseFor(state.role).lessons.find((item) => item.id === lessonId);
  if (!lesson) return { state, score: 0, passed: false, missing: [] };
  const hit = lesson.keywords.filter((keyword) => text.includes(keyword));
  const score = Math.min(100, Math.round((hit.length / Math.max(1, lesson.keywords.length)) * 100) + 40);
  const passed = score >= 70;
  const missing = lesson.keywords.filter((keyword) => !text.includes(keyword));
  const completed = passed && !state.completedLessons.includes(lessonId)
    ? [...state.completedLessons, lessonId]
    : state.completedLessons;
  const bonus: Record<InfluenceKey, number> = passed
    ? { trust: 3, connection: 2, strategy: 2, succession: 3 }
    : { trust: 0, connection: 0, strategy: 0, succession: 0 };
  const next: TeamAcademyState = {
    ...state,
    completedLessons: completed,
    homeworkScores: { ...state.homeworkScores, [lessonId]: score },
    dimensions: {
      trust: state.dimensions.trust + bonus.trust,
      connection: state.dimensions.connection + bonus.connection,
      strategy: state.dimensions.strategy + bonus.strategy,
      succession: state.dimensions.succession + bonus.succession
    },
    updatedAt: Date.now()
  };
  return { state: next, score, passed, missing };
}

export function recruitMentor(
  state: TeamAcademyState,
  mentorId: string
): TeamAcademyState {
  const mentor = TEAM_MENTORS.find((item) => item.id === mentorId);
  if (!mentor) return state;
  return {
    ...state,
    mentorId,
    dimensions: {
      ...state.dimensions,
      [mentor.dimension]: state.dimensions[mentor.dimension] + 8
    },
    updatedAt: Date.now()
  };
}

const STORAGE_KEY = "adaptive-ascent-team-academy-v1";

export function saveTeamAcademyState(state: TeamAcademyState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadTeamAcademyState(): TeamAcademyState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TeamAcademyState;
    if (!ACADEMY_COURSES.some((course) => course.role === parsed.role)) return null;
    return {
      ...createTeamAcademyState(parsed.role),
      ...parsed,
      dimensions: {
        trust: Number(parsed.dimensions?.trust) || 0,
        connection: Number(parsed.dimensions?.connection) || 0,
        strategy: Number(parsed.dimensions?.strategy) || 0,
        succession: Number(parsed.dimensions?.succession) || 0
      },
      completedScenarios: Array.isArray(parsed.completedScenarios)
        ? parsed.completedScenarios
        : [],
      scenarioScores:
        parsed.scenarioScores && typeof parsed.scenarioScores === "object"
          ? parsed.scenarioScores
          : {}
    };
  } catch {
    return null;
  }
}
