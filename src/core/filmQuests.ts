import type { AbilityId, StoryOption } from "./types.ts";
import { ABILITIES } from "./abilities.ts";

export interface FilmQuest {
  id: string;
  titleZh: string;
  titleEn: string;
  region: "cn" | "intl";
  ability: AbilityId;
  sceneZh: string;
  sceneEn: string;
  mirrorZh: string;
  mirrorEn: string;
  quoteZh?: string;
  quoteEn?: string;
  options: FilmQuestOption[];
}

export interface FilmQuestOption {
  zh: StoryOption;
  en: {
    label: string;
    summary: string;
    feedback: string;
  };
}

interface FilmWorkSeed {
  titleZh: string;
  titleEn: string;
  region: "cn" | "intl";
  ability: AbilityId;
  sceneZh: string;
  sceneEn: string;
  mirrorZh: string;
  mirrorEn: string;
  quoteZh?: string;
  quoteEn?: string;
}

const FILM_WORK_SEEDS: FilmWorkSeed[] = [
  {
    titleZh: "雍正王朝",
    titleEn: "Yongzheng Dynasty",
    region: "cn",
    ability: "insight",
    sceneZh: "年羹尧平定西北后居功自傲，朝中一半人夸他能干，一半人提醒他越界。雍正要决定：先赏其功，还是先立规矩。",
    sceneEn: "After Nian Gengyao pacifies the northwest, he grows arrogant. Half the court praises him and half warns about boundary-crossing. Yongzheng must decide whether to reward first or set rules first.",
    mirrorZh: "功劳越大的人越需要被制度看见，而不是被情绪豁免；先想清楚他真正想要什么，再决定用什么方式给。",
    mirrorEn: "The more someone contributes, the more they need to be governed by process rather than emotion. Understand what they truly want before deciding how to reward them.",
    quoteZh: "规矩不能因为一个人有功就为他改写。",
    quoteEn: "Rules should not be rewritten because one person has merit."
  },
  {
    titleZh: "大宅门",
    titleEn: "The Grand Mansion Gate",
    region: "cn",
    ability: "deploy",
    sceneZh: "白家老号要交到下一辈手里，家族里有人懂药、有人懂账、有人只懂人情。掌门人必须在继承前重新排位。",
    sceneEn: "The Bai family business is passing to the next generation. Some heirs know medicine, some know accounts, and some only know people. The leader must reorder roles before succession.",
    mirrorZh: "用人不是选最亲的人，而是把每个人放进最需要他能力的坑。",
    mirrorEn: "Deployment is not about picking the closest person; it is about putting each person into the role that needs their ability."
  },
  {
    titleZh: "亮剑",
    titleEn: "Bright Sword",
    region: "cn",
    ability: "mobilize",
    sceneZh: "独立团装备不足、士气低落，李云龙要用一支杂牌军打赢硬仗。他既不能只喊口号，也不能靠强行命令。",
    sceneEn: "The Independent Regiment lacks equipment and morale. Li Yunlong must win a hard battle with a ragged force, without relying on slogans or force alone.",
    mirrorZh: "让一群不情愿的人一起走，先给他们一个能赢的小目标，再把责任分到每个人手里。",
    mirrorEn: "To move a reluctant group, give them a small winnable goal first, then distribute responsibility into each person's hands."
  },
  {
    titleZh: "大明王朝1566",
    titleEn: "Ming Dynasty 1566",
    region: "cn",
    ability: "strategy",
    sceneZh: "改稻为桑的国策推行到一半，地方官、清流、严党各怀算盘。你需要在各方角力之前先看清楚谁能真正推动结果。",
    sceneEn: "The national policy of converting rice fields to mulberry is halfway through, with local officials, upright scholars, and the Yan faction each pursuing their own interests. You must see who can truly move the outcome before the factions collide.",
    mirrorZh: "权力不是靠职位换来的，而是靠谁能先让别人觉得“跟着他有结果”。",
    mirrorEn: "Power is not exchanged for a title; it comes from being the person others believe will produce results."
  },
  {
    titleZh: "康熙王朝",
    titleEn: "Kangxi Dynasty",
    region: "cn",
    ability: "authority",
    sceneZh: "康熙面对三藩割据，朝堂上撤藩、缓撤、不撤三种声音相持不下。他需要在不破坏制度的前提下夺回决策权。",
    sceneEn: "Facing the Three Feudatories, Kangxi hears three irreconcilable positions: remove them now, delay, or leave them. He must reclaim decision authority without destroying the system.",
    mirrorZh: "决策权不是靠嗓门，而是靠把议题、信息和后果都摆到桌面上，让制度替你把边界守住。",
    mirrorEn: "Decision authority comes not from volume but from putting the issue, information, and consequences on the table so the process guards the boundary."
  },
  {
    titleZh: "水浒传",
    titleEn: "Water Margin",
    region: "cn",
    ability: "deploy",
    sceneZh: "梁山好汉各有一技之长，聚义厅里论功排座次却总有人不服。你需要在“江湖义气”和“组织秩序”之间做出安排。",
    sceneEn: "Every Liangshan hero has a specialty, yet arguments break out whenever ranks are assigned. You must balance brotherhood with organizational order.",
    mirrorZh: "座次不能只看资历，要看谁的能力在哪个战场上最值钱。",
    mirrorEn: "Rank should not follow tenure alone; it should follow whose ability matters most in which battlefield."
  },
  {
    titleZh: "三国演义",
    titleEn: "Romance of the Three Kingdoms",
    region: "cn",
    ability: "strategy",
    sceneZh: "刘备借荆州后，盟友、对手、内部功臣都在盯着这块地盘。他需要在不撕破联盟的情况下守住自己的空间。",
    sceneEn: "After borrowing Jingzhou, Liu Bei faces allies, rivals, and internal contributors all watching the territory. He must keep his position without tearing the alliance apart.",
    mirrorZh: "先建势再要资源：让盟友觉得你值得投入，而不是觉得你在占便宜。",
    mirrorEn: "Build momentum before asking for resources: make allies feel you are worth investing in, not that you are taking advantage."
  },
  {
    titleZh: "红楼梦",
    titleEn: "Dream of the Red Chamber",
    region: "cn",
    ability: "execution",
    sceneZh: "王熙凤协理宁国府，账目混乱、下人怠工、规矩形同虚设。她需要在最短时间里让一整套执行体系重新转起来。",
    sceneEn: "Wang Xifeng takes over the management of the Ningguo Mansion: chaotic accounts, idle servants, and rules that mean nothing. She must restart an entire execution system quickly.",
    mirrorZh: "执行力不是一个人能干，而是把目标、分工、时限和验收标准都写清楚。",
    mirrorEn: "Execution is not about one capable person; it is about clear goals, ownership, deadlines, and acceptance criteria."
  },
  {
    titleZh: "西游记",
    titleEn: "Journey to the West",
    region: "cn",
    ability: "mobilize",
    sceneZh: "取经团队里有人能力极强却不服管，有人忠诚却总闯祸。唐僧需要让四个性格完全不同的人朝着同一个方向走。",
    sceneEn: "The pilgrimage team has a brilliant but rebellious member, a loyal one who causes trouble, and two more with completely different temperaments. Tang Seng must move them all in one direction.",
    mirrorZh: "驭人不是把每个人都变得一样，而是给每个人一个能发挥其特点的位置。",
    mirrorEn: "Leading people is not making everyone the same; it is giving each person a role where their traits can be used well."
  },
  {
    titleZh: "人民的名义",
    titleEn: "In the Name of the People",
    region: "cn",
    ability: "stability",
    sceneZh: "反腐风暴中，组织需要既查处问题，又不能让正常业务停摆。你必须在“抓人”和“稳住队伍”之间找到平衡。",
    sceneEn: "In an anti-corruption campaign, the organization must investigate problems without freezing normal business. You must balance accountability with keeping the team stable.",
    mirrorZh: "制度化的关键不是一次清理，而是让规则在清理之后仍然能保护做事的人。",
    mirrorEn: "Institutional stability is not a single cleanup; it is rules that continue protecting the people who do the work afterward."
  },
  {
    titleZh: "潜伏",
    titleEn: "Lurk",
    region: "cn",
    ability: "communication",
    sceneZh: "余则成在多方监视下传递关键信息，任何一句多说的话都可能暴露身份。他需要在不引起怀疑的前提下完成对齐。",
    sceneEn: "Under multi-party surveillance, Yu Zecheng must pass critical information without a single careless sentence revealing his identity.",
    mirrorZh: "沟通不只是说清楚，还要想清楚谁在听、谁不该听、什么信息必须留到私下。",
    mirrorEn: "Communication is not only clarity; it is knowing who is listening, who should not hear, and which information must wait for privacy."
  },
  {
    titleZh: "闯关东",
    titleEn: "Venture to the Northeast",
    region: "cn",
    ability: "execution",
    sceneZh: "朱开山一家从零开始闯关东，土地、商路、家族都要从头搭建。每一步都必须在资源耗尽前产生可验证的结果。",
    sceneEn: "Zhu Kaishan's family starts from nothing in the Northeast. Land, trade routes, and family structure must all be built before resources run out.",
    mirrorZh: "创业期最怕宏大叙事，要把每一件大事拆成今天就能交付的小事。",
    mirrorEn: "Startups cannot afford grand narratives; break every big thing into small deliverables that can be finished today."
  },
  {
    titleZh: "乔家大院",
    titleEn: "Qiao's Grand Courtyard",
    region: "cn",
    ability: "strategy",
    sceneZh: "乔致庸想开票号，但同行抵制、官府观望、自家资金有限。他需要在对手的包围里找到第一个可以突破的口子。",
    sceneEn: "Qiao Zhiyong wants to open a bank draft business, but rivals resist, officials wait, and capital is limited. He must find the first gap in the encirclement.",
    mirrorZh: "先做一件让所有人看到收益的小事，再谈更大的授权和资源。",
    mirrorEn: "Win a small visible win first, then ask for more authority and resources."
  },
  {
    titleZh: "大秦帝国",
    titleEn: "The Qin Empire",
    region: "cn",
    ability: "stability",
    sceneZh: "商鞅变法触动旧贵族利益，新法要在一夜之间改变几百年的习惯。他需要在推行新制度的同时保证执行者不阳奉阴违。",
    sceneEn: "Shang Yang's reforms challenge old nobles and overturn centuries of habit overnight. He must implement new rules without enforcers merely pretending to comply.",
    mirrorZh: "新制度要能落地，先要让执行者看得见自己的利益，再让反对者付得出代价。",
    mirrorEn: "For new rules to take root, enforcers must see their own benefit and opponents must feel the cost."
  },
  {
    titleZh: "走向共和",
    titleEn: "Towards the Republic",
    region: "cn",
    ability: "structure",
    sceneZh: "洋务派想建现代工业，却面对旧衙门、旧观念和资金缺口。每一项改革都要先拆开“为什么做不成”的结构。",
    sceneEn: "The Self-Strengthening Movement wants modern industry but faces old bureaucracies, old ideas, and funding gaps. Every reform must first decompose why it fails.",
    mirrorZh: "在复杂局面里，先定义清楚阻碍，再列因果链，最后才谈方案。",
    mirrorEn: "In complex situations, define the obstacle clearly, map the causal chain, and only then talk about solutions."
  },
  {
    titleZh: "汉武大帝",
    titleEn: "Emperor Wu of Han",
    region: "cn",
    ability: "deploy",
    sceneZh: "汉武帝要用卫青、霍去病等新人打大仗，老臣们却认为他们资历太浅。他需要赌一把：把关键位置交给能力证据最强的人。",
    sceneEn: "Emperor Wu wants to put young commanders like Wei Qing and Huo Qubing in charge of major campaigns, while elders call them too inexperienced. He must bet on evidence of capability.",
    mirrorZh: "大胆用新人之前，先看他在压力下的真实表现，而不是只看他有没有资历。",
    mirrorEn: "Before boldly trusting newcomers, look at their real performance under pressure rather than their tenure."
  },
  {
    titleZh: "大明风华",
    titleEn: "Ming Dynasty",
    region: "cn",
    ability: "communication",
    sceneZh: "朱棣与朝臣各执一词，一道命令传下去被层层改写。他需要让不同派系的人在同一套语言里对话。",
    sceneEn: "Zhu Di and his ministers hold conflicting views, and every order is rewritten as it passes down. He must make different factions speak in one shared language.",
    mirrorZh: "跨部门对齐的关键不是说服所有人，而是先统一目标、口径和验收标准。",
    mirrorEn: "Aligning across teams is not about persuading everyone; it is aligning goals, wording, and acceptance criteria first."
  },
  {
    titleZh: "清平乐",
    titleEn: "Serenade of Peaceful Joy",
    region: "cn",
    ability: "structure",
    sceneZh: "朝堂议事时，一份奏章牵出三套不同的账本。皇帝需要在纷繁意见中先找出真正要解决的问题。",
    sceneEn: "In court deliberation, one memorial leads to three different ledgers. The emperor must identify the real problem beneath the competing opinions.",
    mirrorZh: "意见越多，越要先回到事实：谁的数据、哪个口径、验证过没有。",
    mirrorEn: "The more opinions, the more you must return to facts: whose data, which definition, and whether it has been verified."
  },
  {
    titleZh: "琅琊榜",
    titleEn: "Nirvana in Fire",
    region: "cn",
    ability: "strategy",
    sceneZh: "梅长苏以病弱之身布局朝堂，每一步都藏着三层后手。他要让对手以为自己在赢，同时把真正的资源握在手里。",
    sceneEn: "Mei Changsu, frail and sick, lays out a court strategy with three layers behind every move. He lets rivals believe they are winning while holding the real resources.",
    mirrorZh: "谋权不是算计所有人，而是先看清局面会往哪里走，再把关键筹码放在别人看不见的地方。",
    mirrorEn: "Strategy is not scheming against everyone; it is seeing where the situation is heading and placing key leverage where others cannot see it."
  },
  {
    titleZh: "白鹿原",
    titleEn: "White Deer Plain",
    region: "cn",
    ability: "mobilize",
    sceneZh: "白嘉轩作为族长要带领全族挺过饥荒和纷争，有人想分家，有人想跑，有人等着看笑话。他必须先稳住人心。",
    sceneEn: "As clan leader, Bai Jiaxuan must lead everyone through famine and conflict. Some want to split, some want to leave, and some wait to mock. He must steady the people first.",
    mirrorZh: "稳人心不是讨好所有人，而是让每个人看到自己在共同方案里的位置。",
    mirrorEn: "Steadying people is not pleasing everyone; it is letting each person see their place in the shared plan."
  },
  {
    titleZh: "都挺好",
    titleEn: "All Is Well",
    region: "cn",
    ability: "recovery",
    sceneZh: "苏明玉一边顶着原生家庭的压力，一边扛着公司业绩。她越是想证明自己，越容易在深夜把情绪带进第二天的会议。",
    sceneEn: "Su Mingyu carries family pressure and company targets at once. The harder she tries to prove herself, the more likely her midnight emotions leak into the next morning's meeting.",
    mirrorZh: "高压之下先区分“谁的问题”和“我的责任”，再决定把精力投到哪里。",
    mirrorEn: "Under pressure, first separate other people's problems from your responsibility, then decide where to invest your energy."
  },
  {
    titleZh: "我的前半生",
    titleEn: "The First Half of My Life",
    region: "cn",
    ability: "communication",
    sceneZh: "咨询项目推进到一半，客户换了大老板，原方案全部作废。你需要在没有完整信息时重新对齐各方的预期。",
    sceneEn: "Halfway through a consulting engagement, the client changes its CEO and the original plan collapses. You must realign expectations without complete information.",
    mirrorZh: "信息不全时先同步“我们现在知道什么、不知道什么”，再谈下一步。",
    mirrorEn: "When information is incomplete, first align on what is known and unknown, then discuss next steps."
  },
  {
    titleZh: "欢乐颂",
    titleEn: "Ode to Joy",
    region: "cn",
    ability: "recovery",
    sceneZh: "五个女生在职场、家庭和感情之间来回切换，有人把加班当勋章，有人把崩溃藏进电梯间。你需要为自己和同伴设计恢复节奏。",
    sceneEn: "Five women juggle work, family, and relationships. One treats overtime as a badge, another hides breakdowns in the elevator. You must design recovery rhythms for yourself and others.",
    mirrorZh: "恢复不是休息，而是把消耗源、恢复源和边界都列出来，主动安排。",
    mirrorEn: "Recovery is not rest; it is actively listing drains, sources of restoration, and boundaries."
  },
  {
    titleZh: "安家",
    titleEn: "Home Story",
    region: "cn",
    ability: "execution",
    sceneZh: "房产中介门店竞争激烈，客户挑剔、房主反复变卦。店长必须在一次次谈判中把“不可能”拆成可执行的步骤。",
    sceneEn: "A real-estate store faces fierce competition, picky clients, and sellers who keep changing their minds. The manager must turn “impossible” into executable steps.",
    mirrorZh: "越是复杂的交付，越要先把关键节点、责任人和验收标准定下来。",
    mirrorEn: "The more complex the delivery, the earlier you must define checkpoints, owners, and acceptance criteria."
  },
  {
    titleZh: "平凡的荣耀",
    titleEn: "The Ordinary Glory",
    region: "cn",
    ability: "structure",
    sceneZh: "投资新人拿到一份漏洞百出的项目材料，前辈们各有判断。他需要先拆清问题，而不是急着证明自己发现了错误。",
    sceneEn: "An investment newcomer receives a flawed project deck while seniors hold different opinions. He must decompose the problem before proving he found the error.",
    mirrorZh: "先定义“这份材料到底要证明什么”，再逐项验证，最后才下结论。",
    mirrorEn: "First define what the material is supposed to prove, verify item by item, and only then draw conclusions."
  },
  {
    titleZh: "底线",
    titleEn: "Bottom Line",
    region: "cn",
    ability: "authority",
    sceneZh: "法官面对舆论、当事人和制度压力，既要坚持程序正义，又要让每个当事人感受到被认真对待。",
    sceneEn: "A judge faces public opinion, litigants, and institutional pressure. She must uphold procedural justice while making every party feel genuinely heard.",
    mirrorZh: "权威来自稳定地守住边界，而不是在压力下摇摆。",
    mirrorEn: "Authority comes from consistently holding boundaries, not from wavering under pressure."
  },
  {
    titleZh: "山海情",
    titleEn: "Minning Town",
    region: "cn",
    ability: "mobilize",
    sceneZh: "扶贫干部要说服整村人搬迁，有人担心没地种，有人舍不得老屋，有人根本不信政策。他需要从最松的一颗钉子开始。",
    sceneEn: "A poverty-alleviation official must persuade an entire village to relocate. Some fear losing farmland, some cling to old homes, and some distrust policy. He must start with the easiest point of resistance.",
    mirrorZh: "大规模动员从一个小而可见的成功开始，让第一批受益者替你说话。",
    mirrorEn: "Large-scale mobilization starts with one small visible success and lets the first beneficiaries speak for you."
  },
  {
    titleZh: "县委大院",
    titleEn: "County Party Committee",
    region: "cn",
    ability: "structure",
    sceneZh: "新县长面对积压的矛盾，每个部门都有一套说法。他需要先建立统一的台账，再决定先解决哪件事。",
    sceneEn: "A new county head faces piled-up conflicts where every department has its own account. He must build a unified record before choosing what to solve first.",
    mirrorZh: "复杂问题先统一事实口径，再排优先级；没有共同台账就没有共同判断。",
    mirrorEn: "For complex problems, unify the factual baseline before prioritizing; without a shared ledger there is no shared judgment."
  },
  {
    titleZh: "大江大河",
    titleEn: "Like a Flowing River",
    region: "cn",
    ability: "execution",
    sceneZh: "国企改革试点要同时面对老工人、新制度和外部的价格压力。厂长必须让改革在每一天都有可检查的进展。",
    sceneEn: "A state-owned enterprise reform pilot faces veteran workers, new rules, and external price pressure. The director must make reform show checkable progress every day.",
    mirrorZh: "改革不是一次表态，而是把目标切成日进度、周节点和可验收结果。",
    mirrorEn: "Reform is not a statement; it is daily progress, weekly checkpoints, and verifiable outcomes."
  },
  {
    titleZh: "鸡毛飞上天",
    titleEn: "Feather Flying Up",
    region: "cn",
    ability: "strategy",
    sceneZh: "义乌小商品市场刚刚起步，同行靠低价抢单，你手里的钱只够赌一个方向。你需要找到别人还没看见的需求。",
    sceneEn: "The Yiwu small-commodity market is just beginning. Rivals compete on price, and your capital only covers one bet. You must find demand no one else has noticed.",
    mirrorZh: "在资源有限时，先选择那个能验证需求、又能带来现金流的窄口。",
    mirrorEn: "With limited resources, choose the narrow opening that validates demand and brings cash flow."
  },
  {
    titleZh: "天道",
    titleEn: "The Way of Heaven",
    region: "cn",
    ability: "insight",
    sceneZh: "丁元英设计了一场商业实验，每一步都像在观察人性。合作方说着最漂亮的话，却做出最利己的选择。",
    sceneEn: "Ding Yuanying designs a business experiment that reads human nature at every step. Partners say beautiful things while making the most self-interested choices.",
    mirrorZh: "看人不要听他说什么，要看他如何分配时间、金钱和风险。",
    mirrorEn: "Judge people not by what they say but by how they allocate time, money, and risk."
  },
  {
    titleZh: "岁月",
    titleEn: "Years",
    region: "cn",
    ability: "recovery",
    sceneZh: "机关新人梁致远在理想与现实之间反复碰壁，身体和心气同时被消耗。他需要重新找到坚持的理由和恢复的方式。",
    sceneEn: "Liang Zhiyuan, a new government employee, keeps colliding with reality. His health and spirit drain together, and he must rediscover his reason to persist and how to recover.",
    mirrorZh: "职业低谷期先保住判断力：睡眠、边界和可以求助的人，都是战略资源。",
    mirrorEn: "In a career low, protect judgment first: sleep, boundaries, and people you can ask for help are strategic resources."
  },
  {
    titleZh: "纸牌屋",
    titleEn: "House of Cards",
    region: "intl",
    ability: "strategy",
    sceneZh: "弗兰克被许诺的职位落空，他没有当场发作，而是开始重新盘点每个人的筹码，准备下一场交易。",
    sceneEn: "Frank is denied the position he was promised. Instead of exploding, he re-inventories everyone's leverage and prepares the next trade.",
    mirrorZh: "被拒绝不是终点，先想清楚对方真正想要什么，再决定下一手怎么打。",
    mirrorEn: "A rejection is not the end. Understand what the other side truly wants before deciding your next move."
  },
  {
    titleZh: "权力的游戏",
    titleEn: "Game of Thrones",
    region: "intl",
    ability: "authority",
    sceneZh: "北境诸侯各自为政，丹妮莉丝带龙归来也要面对“凭什么听你的”这个问题。她需要把力量变成规则，而不是只靠威慑。",
    sceneEn: "The northern lords govern separately. Even Daenerys with her dragons must answer “why should we follow you?” She must turn force into rules rather than fear.",
    mirrorZh: "权力要长期稳定，必须从个人威慑转成大家共同遵守的制度。",
    mirrorEn: "For power to last, it must move from personal intimidation to a system everyone follows."
  },
  {
    titleZh: "穿普拉达的女王",
    titleEn: "The Devil Wears Prada",
    region: "intl",
    ability: "recovery",
    sceneZh: "安迪在米兰达的高压下连轴转，任务越做越多，自我却越来越小。她需要判断：这份工作到底在磨砺她，还是在消耗她。",
    sceneEn: "Andy runs nonstop under Miranda's pressure. The tasks grow while her sense of self shrinks. She must decide whether the job is sharpening or draining her.",
    mirrorZh: "高压环境里要定期问自己：我是在长能力，还是在替别人的焦虑买单。",
    mirrorEn: "In high-pressure environments, ask regularly: am I growing capability, or paying for someone else's anxiety?"
  },
  {
    titleZh: "华尔街",
    titleEn: "Wall Street",
    region: "intl",
    ability: "structure",
    sceneZh: "巴德得到大人物盖柯的赏识，却被要求做一件违背原则的交易。诱惑和代价同时摆在面前，他必须先算清整条因果链。",
    sceneEn: "Bud wins the favor of the great Gordon Gekko but is asked to make a trade that violates his principles. Temptation and cost sit side by side; he must trace the whole chain first.",
    mirrorZh: "越是诱人的机会，越要先把代价、退路和责任写下来，再决定是否上桌。",
    mirrorEn: "The more tempting the opportunity, the more you must write down the cost, exit, and responsibility before taking the seat."
  },
  {
    titleZh: "教父",
    titleEn: "The Godfather",
    region: "intl",
    ability: "deploy",
    sceneZh: "老教父要把家族交给下一代，长子暴躁、次子软弱、三子不愿入局。他需要在临终前完成一次艰难的人事安排。",
    sceneEn: "The old Godfather must hand his family to the next generation: one son too hot-tempered, one too weak, and one unwilling. He must make a difficult succession decision.",
    mirrorZh: "交接不是选“像我的人”，而是选能在下一个时代守住核心能力的人。",
    mirrorEn: "Succession is not choosing the person most like you; it is choosing who can protect core capability in the next era."
  },
  {
    titleZh: "阿甘正传",
    titleEn: "Forrest Gump",
    region: "intl",
    ability: "execution",
    sceneZh: "阿甘没有聪明人的算计，却把每一件小事做到超出预期。从乒乓球到捕虾，他靠的都是“先把眼前这一件做完”。",
    sceneEn: "Forrest has no scheming intelligence, yet he exceeds expectations at every small task. From ping-pong to shrimping, he simply finishes what is in front of him.",
    mirrorZh: "很多大事赢在持续交付，而不是赢在灵光一现。",
    mirrorEn: "Many big wins come from consistent delivery rather than a single flash of insight."
  },
  {
    titleZh: "肖申克的救赎",
    titleEn: "The Shawshank Redemption",
    region: "intl",
    ability: "recovery",
    sceneZh: "安迪被冤入狱，他没有放弃，也没有硬碰硬。他用了二十年时间，把绝望的日子变成一场有耐心的工程。",
    sceneEn: "Andy is wrongly imprisoned. He neither gives up nor fights head-on. Over twenty years, he turns hopeless days into a patient project.",
    mirrorZh: "长期困境里的恢复不是等环境变好，而是每天做一件让未来多一个选项的小事。",
    mirrorEn: "Recovery in long-term difficulty is not waiting for the environment to improve; it is doing one small thing each day that adds a future option."
  },
  {
    titleZh: "十二怒汉",
    titleEn: "12 Angry Men",
    region: "intl",
    ability: "communication",
    sceneZh: "十二位陪审员里只有一个人认为案子存疑，其他人急着定罪。他必须用提问而不是争吵，让每个人重新检查自己的判断。",
    sceneEn: "In the jury room, only one juror doubts the case while others rush to convict. He must use questions, not arguments, to make everyone re-examine their judgment.",
    mirrorZh: "说服一群立场不同的人，先问出他们判断里的漏洞，而不是直接否定他们。",
    mirrorEn: "To persuade people with different positions, first expose the gap in their reasoning with questions rather than dismissing them."
  },
  {
    titleZh: "拯救大兵瑞恩",
    titleEn: "Saving Private Ryan",
    region: "intl",
    ability: "mobilize",
    sceneZh: "米勒上尉奉命带一支小队去救一个人，队员们都认为任务不合理。他需要让这群不情愿的人愿意为任务走到终点。",
    sceneEn: "Captain Miller is ordered to take a squad to save one man. His men all believe the mission is wrong. He must make an unwilling team walk to the end.",
    mirrorZh: "当任务无法被所有人理解时，先把“为什么做”讲透，再谈“怎么做”。",
    mirrorEn: "When a mission cannot be understood by everyone, explain why first, then how."
  },
  {
    titleZh: "至暗时刻",
    titleEn: "Darkest Hour",
    region: "intl",
    ability: "strategy",
    sceneZh: "丘吉尔上任时英国节节败退，内阁里有人主张谈判。他必须在看似必败的局面里，先稳住内部再争取外部。",
    sceneEn: "When Churchill takes office, Britain is losing everywhere and some cabinet members want negotiations. He must steady the inside before winning outside.",
    mirrorZh: "越是至暗时刻，越要先控制内部的恐慌，再用一个清晰的方向争取时间。",
    mirrorEn: "In the darkest hour, first control internal panic, then buy time with one clear direction."
  },
  {
    titleZh: "国王的演讲",
    titleEn: "The King's Speech",
    region: "intl",
    ability: "recovery",
    sceneZh: "乔治六世口吃严重，却要在战争前发表鼓舞全国的演讲。他需要先面对自己的恐惧，才能把话说给所有人听。",
    sceneEn: "King George VI struggles with a severe stammer yet must give a war speech that inspires the nation. He must face his own fear before speaking to everyone.",
    mirrorZh: "表达力不是天赋问题，而是先在安全环境里练习，再逐步面对更大的听众。",
    mirrorEn: "Expression is not a talent issue; practice in a safe setting first, then gradually face bigger audiences."
  },
  {
    titleZh: "社交网络",
    titleEn: "The Social Network",
    region: "intl",
    ability: "execution",
    sceneZh: "扎克伯格在宿舍里做出了一个改变社交的产品，但合作伙伴、资源和速度全都跟不上。他必须在疯狂增长前先把交付体系立起来。",
    sceneEn: "Zuckerberg builds a product that changes social networking from his dorm, but partners, resources, and speed cannot keep up. He must build delivery systems before explosive growth.",
    mirrorZh: "速度是执行的一部分，但不是全部；没有检查节点的速度最终会变成返工。",
    mirrorEn: "Speed is part of execution but not all of it; speed without checkpoints eventually becomes rework."
  },
  {
    titleZh: "乔布斯",
    titleEn: "Jobs",
    region: "intl",
    ability: "mobilize",
    sceneZh: "乔布斯用一句“我们要改变世界”让团队跟随，但也用高压让许多人离开。真正的问题是：愿景能吸引人，什么能留住人。",
    sceneEn: "Jobs moves the team with “we will change the world,” yet his pressure drives many away. The real question is what keeps people beyond the vision.",
    mirrorZh: "愿景负责点燃，制度和成长空间负责让火不灭。",
    mirrorEn: "Vision lights the fire; process and growth keep it burning."
  },
  {
    titleZh: "飞屋环游记",
    titleEn: "Up",
    region: "intl",
    ability: "communication",
    sceneZh: "卡尔用一屋子气球把房子带走，却发现身边多了一个他不想要的小乘客。他需要学会让计划容纳另一个人的需求。",
    sceneEn: "Carl lifts his house with a balloon forest, only to discover an unwanted passenger. He must learn to let his plan accommodate another person's needs.",
    mirrorZh: "好的计划不是一条没有人的路，而是让同行者也能看见自己的位置。",
    mirrorEn: "A good plan is not an empty road; it lets fellow travelers see their own place in it."
  },
  {
    titleZh: "星际穿越",
    titleEn: "Interstellar",
    region: "intl",
    ability: "structure",
    sceneZh: "库珀面对多个可能宜居的星球，燃料只够选择一次。他必须用数据和逻辑排除选项，而不是被情感带走。",
    sceneEn: "Cooper faces several candidate planets with fuel for only one choice. He must use data and logic to eliminate options rather than follow emotion.",
    mirrorZh: "关键决策先列清楚约束条件，再比较方案，最后才允许直觉出场。",
    mirrorEn: "For critical decisions, list constraints first, compare options, and only then let intuition speak."
  },
  {
    titleZh: "蝙蝠侠：黑暗骑士",
    titleEn: "The Dark Knight",
    region: "intl",
    ability: "authority",
    sceneZh: "蝙蝠侠以恐惧维护哥谭秩序，小丑却用一次次选择测试他的底线。他必须决定：守住原则，还是用更坏的手段赢。",
    sceneEn: "Batman keeps Gotham's order through fear, while the Joker tests his limits with a series of choices. He must decide whether to keep principles or win with worse methods.",
    mirrorZh: "守住底线比赢得一时更重要；一旦用坏手段，规则就失去了约束力。",
    mirrorEn: "Holding the line matters more than winning the moment; once you use bad means, the rules lose their power."
  },
  {
    titleZh: "闻香识女人",
    titleEn: "Scent of a Woman",
    region: "intl",
    ability: "communication",
    sceneZh: "查理知道朋友犯了错，却拒绝出卖朋友。盲眼中校弗兰克在全校面前替他说出那句“这就是原则”。",
    sceneEn: "Charlie knows who made the mistake but refuses to inform on his friend. The blind Colonel Slade speaks for him in front of the whole school: this is principle.",
    mirrorZh: "有些沟通不是为了赢，而是为了让正确的原则被大家看见。",
    mirrorEn: "Some communication is not about winning; it is about letting the right principle be seen by everyone."
  },
  {
    titleZh: "当幸福来敲门",
    titleEn: "The Pursuit of Happyness",
    region: "intl",
    ability: "execution",
    sceneZh: "克里斯没有学位、没有资源，还要带着儿子流浪。他能做的只有把每一次打电话、每一次拜访都做到最好。",
    sceneEn: "Chris has no degree, no resources, and a son to care for while homeless. All he can do is make every call and every visit excellent.",
    mirrorZh: "资源越少，越要靠可重复的高质量动作积累机会。",
    mirrorEn: "The fewer resources you have, the more you must accumulate opportunities through repeatable high-quality actions."
  },
  {
    titleZh: "爆裂鼓手",
    titleEn: "Whiplash",
    region: "intl",
    ability: "recovery",
    sceneZh: "安德鲁为了成为顶尖鼓手不断逼近极限，导师的羞辱让他越练越狠。他需要分辨：这是突破，还是在摧毁自己。",
    sceneEn: "Andrew pushes to the edge to become a top drummer while his mentor's abuse makes him practice harder. He must tell whether this is breakthrough or self-destruction.",
    mirrorZh: "高压训练要有一个外部校验：有人替你观察状态，而不是让痛苦本身成为勋章。",
    mirrorEn: "High-pressure training needs external checks: someone who observes your state instead of letting suffering become a badge."
  },
  {
    titleZh: "实习生",
    titleEn: "The Intern",
    region: "intl",
    ability: "communication",
    sceneZh: "七十岁的本成为年轻 CEO 的实习生，他经验丰富却不越位。他靠倾听和补位赢得了原本不想要他的上司的信任。",
    sceneEn: "Seventy-year-old Ben becomes an intern for a young CEO. Experienced but never overstepping, he earns trust through listening and filling gaps.",
    mirrorZh: "影响力不靠资历压人，而靠让对方感到“你在帮我完成目标”。",
    mirrorEn: "Influence does not rely on seniority; it comes from making the other person feel you are helping them reach their goal."
  },
  {
    titleZh: "硅谷",
    titleEn: "Silicon Valley",
    region: "intl",
    ability: "structure",
    sceneZh: "创业公司拿到融资后突然膨胀，理查德发现团队越大，问题越乱。他需要重新定义什么才是公司的核心产品。",
    sceneEn: "After funding, Richard's startup balloons and the chaos grows with it. He must redefine what the company's core product actually is.",
    mirrorZh: "组织变大前先确认核心价值，否则所有资源都会散在“看起来重要”的事情上。",
    mirrorEn: "Before scaling, confirm the core value; otherwise resources scatter across things that only look important."
  },
  {
    titleZh: "副总统",
    titleEn: "Veep",
    region: "intl",
    ability: "authority",
    sceneZh: "塞琳娜作为副总统没有实权，却要面对一次次“表面重要、实际失控”的任务。她需要在夹缝里建立自己的话语权。",
    sceneEn: "Selina, as vice president, has little real power yet faces tasks that look important and always go wrong. She must build influence from the margins.",
    mirrorZh: "没有正式权力时，先掌控信息和议程，再谈掌握结果。",
    mirrorEn: "Without formal power, first control information and agenda, then talk about outcomes."
  },
  {
    titleZh: "广告狂人",
    titleEn: "Mad Men",
    region: "intl",
    ability: "insight",
    sceneZh: "唐·德雷珀最擅长读懂客户没说出口的欲望。一个新客户嘴上说要销量，实际想要的是被尊重的感觉。",
    sceneEn: "Don Draper excels at reading what clients do not say. A new client talks about sales but actually wants to feel respected.",
    mirrorZh: "关键人话里有三层意思：表面需求、真实动机、不能宣之于口的自我。",
    mirrorEn: "Key people speak in layers: surface need, real motive, and a self that cannot be said aloud."
  },
  {
    titleZh: "新闻编辑室",
    titleEn: "The Newsroom",
    region: "intl",
    ability: "communication",
    sceneZh: "新闻编辑室里，主播、制片人和记者对“什么是真相”各执一词。威尔必须在播出前让所有人为同一条标准工作。",
    sceneEn: "In the newsroom, anchors, producers, and reporters disagree about what truth is. Will must align everyone to one standard before airing.",
    mirrorZh: "团队可以有不同的观点，但不能有不同的验收标准。",
    mirrorEn: "A team may hold different opinions, but it cannot hold different acceptance standards."
  },
  {
    titleZh: "白宫风云",
    titleEn: "The West Wing",
    region: "intl",
    ability: "structure",
    sceneZh: "白宫每天要处理无数议题，巴特勒总统靠一套清晰的幕僚流程让每个人知道自己的权责边界。",
    sceneEn: "The White House handles endless issues daily, and President Bartlet keeps everyone aligned through clear staff process and boundaries.",
    mirrorZh: "高复杂度组织靠的不是超人，而是每个人都知道自己的议题、时限和汇报线。",
    mirrorEn: "Highly complex organizations rely not on superhumans but on everyone knowing their issue, deadline, and reporting line."
  },
  {
    titleZh: "傲骨贤妻",
    titleEn: "The Good Wife",
    region: "intl",
    ability: "strategy",
    sceneZh: "艾丽西亚在律师事务所从新人做起，每一步都被人低估。她靠一次次不被看好的案子积累出真正的筹码。",
    sceneEn: "Alicia starts as a new associate at a law firm where everyone underestimates her. She builds real leverage through cases nobody believed in.",
    mirrorZh: "筹码不是谈判时临时要的，而是平时用一件件小事攒出来的。",
    mirrorEn: "Leverage is not demanded at the table; it is accumulated through small matters over time."
  },
  {
    titleZh: "半泽直树",
    titleEn: "Hanzawa Naoki",
    region: "intl",
    ability: "execution",
    sceneZh: "半泽被上司推去背黑锅，他没有急着喊冤，而是先收集证据、计算每一步，再在一击必中的时刻反击。",
    sceneEn: "Hanzawa is pushed to take the blame. Instead of shouting, he gathers evidence, plans each step, and strikes back at the decisive moment.",
    mirrorZh: "受委屈时先别浪费情绪，把事实链、时间线和你真正想要的结果准备好。",
    mirrorEn: "When treated unfairly, do not waste emotion first; prepare the fact chain, timeline, and the result you actually want."
  },
  {
    titleZh: "龙樱",
    titleEn: "Dragon Zakura",
    region: "intl",
    ability: "mobilize",
    sceneZh: "樱木律师要带一群被认定“不可能考上东大”的学生逆袭。他先改变的不是成绩，而是他们对自己能力的定义。",
    sceneEn: "Lawyer Sakuragi leads students labeled “impossible” toward the top university. He first changes not their grades but their definition of their own ability.",
    mirrorZh: "要让团队突破天花板，先让他们相信目标有路径，再给他们看得见的第一个台阶。",
    mirrorEn: "To help a team break its ceiling, first make the path visible, then give them a concrete first step."
  },
  {
    titleZh: "未生",
    titleEn: "Misaeng",
    region: "intl",
    ability: "recovery",
    sceneZh: "围棋天才张格莱进入完全陌生的职场，从复印文件开始。他必须接受“归零”，再一步步重建价值感。",
    sceneEn: "Go prodigy Jang Geu-rae enters a workplace where his talent means nothing and starts with photocopying. He must accept being zero and rebuild a sense of worth step by step.",
    mirrorZh: "转行和低谷期的核心能力，是在不被认可时仍然坚持高质量交付。",
    mirrorEn: "The core capability in career changes and low points is still delivering high quality when unrecognized."
  },
  {
    titleZh: "信号",
    titleEn: "Signal",
    region: "intl",
    ability: "insight",
    sceneZh: "刑警朴海英和过去的刑警通过一部对讲机跨时空合作。他们每一次判断都必须同时信任证据和自己的直觉。",
    sceneEn: "Detective Park Hae-young cooperates across time with a detective from the past. Every judgment must trust both evidence and intuition at once.",
    mirrorZh: "直觉是经验的压缩包，但要先让它接受证据检验，才能变成判断。",
    mirrorEn: "Intuition is compressed experience, but it becomes judgment only after evidence tests it."
  },
  {
    titleZh: "秘密森林",
    titleEn: "Stranger",
    region: "intl",
    ability: "structure",
    sceneZh: "黄始木检察官缺乏情感共情，却靠极其严密的事实拆解，从一团乱麻里找到真正的嫌疑人。",
    sceneEn: "Prosecutor Hwang Shi-mok lacks emotional empathy yet finds the real suspect by rigorously decomposing a tangle of facts.",
    mirrorZh: "情绪越乱，越要回到事实清单：谁、何时、何地、经手了什么、留下了什么记录。",
    mirrorEn: "The messier the emotion, the more you return to the fact list: who, when, where, what they handled, and what records remain."
  },
  {
    titleZh: "继承之战",
    titleEn: "Succession",
    region: "intl",
    ability: "stability",
    sceneZh: "罗伊家族为继承权明争暗斗，公司的长期价值被一次次短期博弈透支。真正的难题不是选谁接班，而是制度能否守住公司。",
    sceneEn: "The Roy family battles over succession while short-term games drain the company's long-term value. The real problem is not who inherits but whether the system protects the company.",
    mirrorZh: "接班设计先想清楚“谁来守住规则”，而不是只回答“谁坐那把椅子”。",
    mirrorEn: "Succession design must first answer who guards the rules, not only who sits in the chair."
  }
];

const EXPERT_LABELS: Record<AbilityId, [string, string]> = {
  insight: ["先重建完整证据链，再判断谁值得托付", "Rebuild the full evidence chain before deciding who to trust"],
  deploy: ["先按岗位成果重新排兵布阵", "Reshape assignments around measurable outcomes"],
  mobilize: ["先把反对者的顾虑写进方案", "Put resistors' concerns into the plan first"],
  strategy: ["先拿小胜建势，再谈更大授权", "Build momentum with small wins before asking for more authority"],
  authority: ["把关键决策纳入制度与联签", "Put critical decisions into process and joint sign-off"],
  stability: ["把高频判断沉淀成流程与梯队", "Turn frequent judgments into process and a talent bench"],
  recovery: ["先恢复精力与判断力，再推进", "Restore energy and judgment before moving forward"],
  execution: ["把方向拆成可验收的三个结果", "Split direction into three verifiable results"],
  structure: ["先把问题定义清楚，再拆因果", "Define the problem before tracing causes"],
  communication: ["先对齐目标，再锁定责任人", "Align goals first, then lock owners"]
};

const PARTIAL_LABELS: Record<AbilityId, [string, string]> = {
  insight: ["先按现有印象推进，边做边观察", "Proceed on current impressions while observing"],
  deploy: ["先维持现有人事，暂不调整", "Keep the current team and adjust later"],
  mobilize: ["先说服一两个人，再带动全队", "Persuade one or two people first"],
  strategy: ["先低调执行，等局面明朗", "Stay quiet and wait for clarity"],
  authority: ["先按惯例行事，暂不变更流程", "Follow convention and keep the process unchanged"],
  stability: ["先维持现状，等风头过去", "Keep the status quo until pressure passes"],
  recovery: ["先硬撑过去，再找时间休息", "Push through first and rest later"],
  execution: ["先按老计划执行，再补检查", "Follow the old plan and add checks later"],
  structure: ["先按经验处理，再回头总结", "Use experience first and summarize later"],
  communication: ["先发邮件同步，不单独沟通", "Sync by email without talking directly"]
};

const RISK_LABELS: Record<AbilityId, [string, string]> = {
  insight: ["当众对质，逼对方交出真相", "Confront publicly to force the truth"],
  deploy: ["直接换掉关键岗位的人", "Replace key people immediately"],
  mobilize: ["公开点名反对者，杀鸡儆猴", "Name the resistor publicly as a warning"],
  strategy: ["绕过上级直接调动资源", "Mobilize resources while bypassing leadership"],
  authority: ["越级推动决策，绕开流程", "Push the decision around the process"],
  stability: ["一次性推翻旧制度", "Tear up the old system in one move"],
  recovery: ["连续加班直到问题解决", "Work through until the problem is solved"],
  execution: ["砍掉所有非核心工作，立即冲刺", "Cut all non-core work and sprint now"],
  structure: ["凭直觉快速定方案", "Pick a plan quickly by instinct"],
  communication: ["在全员会上直接摊牌", "Lay your cards on the table in the all-hands"]
};

const ABILITY_QUOTES_ZH: Record<AbilityId, string> = {
  insight: "看清一个人的动机，比听懂他的话更重要。",
  deploy: "把对的人放进对的坑，比把所有人都留在身边更重要。",
  mobilize: "让一群不情愿的人一起走，先给他们一个能赢的小目标。",
  strategy: "真正的高手不是赢下眼前，而是让下一手更好打。",
  authority: "权力只有被规则接住，才不会变成一个人的独角戏。",
  stability: "你离开之后还能运转的系统，才是你真正留下的能力。",
  recovery: "先恢复判断力，再谈结果；透支不是执行力。",
  execution: "目标不变成可验收的结果，就只是一句漂亮的话。",
  structure: "答案藏在问题被拆开之后。",
  communication: "把话说清楚之前，先让听的人相信你听懂了。"
};

const ABILITY_QUOTES_EN: Record<AbilityId, string> = {
  insight: "Seeing someone's motive matters more than hearing their words.",
  deploy: "Putting the right person in the right role matters more than keeping everyone close.",
  mobilize: "To move a reluctant group, give them a small winnable goal first.",
  strategy: "A true expert does not just win the moment; they make the next move easier.",
  authority: "Power only lasts when rules catch it, instead of becoming one person's solo.",
  stability: "The system that still runs after you leave is the capability you truly left behind.",
  recovery: "Restore judgment before chasing results; burnout is not execution.",
  execution: "A goal that cannot become a verifiable result is just a beautiful sentence.",
  structure: "The answer hides after the problem is decomposed.",
  communication: "Before making yourself clear, let the listener believe you understood them."
};

function buildOptions(work: FilmWorkSeed): FilmQuestOption[] {
  const ability = ABILITIES[work.ability];
  const expertZhLabel = EXPERT_LABELS[work.ability][0];
  const partialZhLabel = PARTIAL_LABELS[work.ability][0];
  const riskZhLabel = RISK_LABELS[work.ability][0];
  const expertEnLabel = EXPERT_LABELS[work.ability][1];
  const partialEnLabel = PARTIAL_LABELS[work.ability][1];
  const riskEnLabel = RISK_LABELS[work.ability][1];
  const secondary: AbilityId = work.ability === "structure" ? "insight" : "structure";

  const expertZh: StoryOption = {
    label: expertZhLabel,
    summary: `${expertZhLabel}；用这部作品的经典片场验证你的判断。`,
    quality: "expert",
    effects: { [work.ability]: 2, [secondary]: 1 },
    resources: { energy: -6, trust: 5, influence: 2 },
    feedback: `你抓住了这部作品真正想教的能力：${ability.name}。规则、证据和节奏都在你这一侧。`,
    theory: ability.sources[0]
  };
  const partialZh: StoryOption = {
    label: partialZhLabel,
    summary: `${partialZhLabel}；先稳住眼前，再回头补证据。`,
    quality: "partial",
    effects: { [work.ability]: 1 },
    resources: { energy: -4, trust: -1, influence: 2 },
    feedback: `你处理了眼前的问题，但经典片场里的核心张力还没有真正打开。`,
    theory: ability.sources[1] ?? ability.sources[0]
  };
  const riskZh: StoryOption = {
    label: riskZhLabel,
    summary: `${riskZhLabel}；用一次冒险换取局面破口。`,
    quality: "risk",
    effects: { [work.ability]: 1, authority: work.ability === "authority" ? 2 : 1 },
    resources: { energy: -9, trust: -6, influence: 4, capital: -2 },
    feedback: `你用强信号推进了局面，也付出了信任和资源的代价。`,
    theory: "《权经》：用权有度，过刚则折。"
  };

  return [
    {
      zh: expertZh,
      en: {
        label: expertEnLabel,
        summary: `${expertEnLabel}. Test your judgment in this classic scene.`,
        feedback: `You captured what this work truly teaches: ${ability.name}. Evidence, rules, and rhythm are on your side.`
      }
    },
    {
      zh: partialZh,
      en: {
        label: partialEnLabel,
        summary: `${partialEnLabel}. Stabilize the visible problem first.`,
        feedback: `You handled the immediate issue, but the core tension in this classic scene remains open.`
      }
    },
    {
      zh: riskZh,
      en: {
        label: riskEnLabel,
        summary: `${riskEnLabel}. Trade a strong signal for a breakthrough.`,
        feedback: `Your strong signal moved the situation but cost trust and resources.`
      }
    }
  ];
}

export const FILM_QUESTS: FilmQuest[] = FILM_WORK_SEEDS.map((seed, index) => ({
  id: `film-${String(index + 1).padStart(3, "0")}`,
  titleZh: seed.titleZh,
  titleEn: seed.titleEn,
  region: seed.region,
  ability: seed.ability,
  sceneZh: seed.sceneZh,
  sceneEn: seed.sceneEn,
  mirrorZh: seed.mirrorZh,
  mirrorEn: seed.mirrorEn,
  quoteZh:
    seed.quoteZh ??
    `${seed.titleZh}的经典启示：${ABILITY_QUOTES_ZH[seed.ability]}`,
  quoteEn:
    seed.quoteEn ??
    `${seed.titleEn} classic lesson: ${ABILITY_QUOTES_EN[seed.ability]}`,
  options: buildOptions(seed)
}));

export const FILM_QUEST_COUNT = FILM_QUESTS.length;

export function filmQuestById(id: string): FilmQuest | undefined {
  return FILM_QUESTS.find((quest) => quest.id === id);
}

export function nextFilmQuest(
  completedIds: string[]
): FilmQuest | undefined {
  const done = new Set(completedIds);
  const pending = FILM_QUESTS.filter((quest) => !done.has(quest.id));
  if (pending.length === 0) return undefined;
  return pending[Math.floor(Math.random() * pending.length)];
}

export function filmQuestRegionLabel(quest: FilmQuest, en: boolean): string {
  if (en) return quest.region === "cn" ? "Chinese Classic" : "International Classic";
  return quest.region === "cn" ? "国内经典" : "国外经典";
}

export function filmQuestAbilityLabel(quest: FilmQuest, en: boolean): string {
  const enNames: Record<AbilityId, string> = {
    insight: "Insight",
    deploy: "Deployment",
    mobilize: "Mobilization",
    strategy: "Strategy",
    authority: "Authority",
    stability: "Stability",
    recovery: "Recovery",
    execution: "Execution",
    structure: "Structure",
    communication: "Communication"
  };
  return en ? enNames[quest.ability] : ABILITIES[quest.ability].name;
}
