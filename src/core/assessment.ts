import type { AbilityId } from "./types";

export interface AssessmentOption {
  label: string;
  points: number;
}

export interface AssessmentQuestion {
  id: string;
  abilityId: AbilityId;
  prompt: string;
  options: AssessmentOption[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q-insight",
    abilityId: "insight",
    prompt: "接手陌生团队后，你更倾向于怎样判断一个核心骨干是否可信？",
    options: [
      { label: "看他在压力下的行为细节，而不是他怎么说", points: 2 },
      { label: "先看他过去业绩和正式履历", points: 1 },
      { label: "主要看他和谁走得近", points: 0 }
    ]
  },
  {
    id: "q-deploy",
    abilityId: "deploy",
    prompt: "你有一个重要项目需要负责人，你会优先考虑什么？",
    options: [
      { label: "先定义岗位成果，再匹配能力证据", points: 2 },
      { label: "先找忠诚可靠的人，再逐步培养", points: 1 },
      { label: "先找资历最深的人，避免风险", points: 0 }
    ]
  },
  {
    id: "q-mobilize",
    abilityId: "mobilize",
    prompt: "团队公开反对你的新方案时，你的第一反应是什么？",
    options: [
      { label: "把反对者的顾虑变成方案前提", points: 2 },
      { label: "先稳住场面，再私下说服关键人", points: 1 },
      { label: "用决策权直接推进", points: 0 }
    ]
  },
  {
    id: "q-strategy",
    abilityId: "strategy",
    prompt: "你还没有正式授权时，会怎样推动一件重要的事？",
    options: [
      { label: "先做出小胜利，再向上换取授权", points: 2 },
      { label: "先向高层表达诉求，明确权力边界", points: 1 },
      { label: "先观望，等授权落地再说", points: 0 }
    ]
  },
  {
    id: "q-authority",
    abilityId: "authority",
    prompt: "你发现有人绕过你直接决策，你会怎么做？",
    options: [
      { label: "用联签流程重新定义权力边界", points: 2 },
      { label: "直接找对方谈话，明确边界", points: 1 },
      { label: "先不动，等对方出错再处理", points: 0 }
    ]
  },
  {
    id: "q-stability",
    abilityId: "stability",
    prompt: "你要离开当前岗位，最优先交接什么？",
    options: [
      { label: "把高频判断做成清单和决策复盘库", points: 2 },
      { label: "把关键客户和关系介绍给接班人", points: 1 },
      { label: "把重要文档整理好即可", points: 0 }
    ]
  },
  {
    id: "q-recovery",
    abilityId: "recovery",
    prompt: "连续一周高强度工作后，你的精力开始明显下降，你会？",
    options: [
      { label: "主动设恢复边界，把最重要工作放到高能量时段", points: 2 },
      { label: "先靠意志力撑过去，等工作结束再休息", points: 1 },
      { label: "减少睡眠，把时间全部给工作", points: 0 }
    ]
  },
  {
    id: "q-execution",
    abilityId: "execution",
    prompt: "季度目标缺口很大，你会先做什么？",
    options: [
      { label: "拆出关键结果，砍掉低价值事项", points: 2 },
      { label: "让团队集中加班追赶数字", points: 1 },
      { label: "先和上级沟通能否降低目标", points: 0 }
    ]
  },
  {
    id: "q-structure",
    abilityId: "structure",
    prompt: "遇到一个从没做过的问题，你通常怎么开始？",
    options: [
      { label: "先定义问题边界，再拆解关键变量", points: 2 },
      { label: "先找类似案例，复制成功做法", points: 1 },
      { label: "先动手试，遇到问题再调整", points: 0 }
    ]
  },
  {
    id: "q-communication",
    abilityId: "communication",
    prompt: "跨部门会议陷入争执，你会怎样表达？",
    options: [
      { label: "先复述双方诉求，再重新定义共同目标", points: 2 },
      { label: "直接提出我的方案，要求大家配合", points: 1 },
      { label: "先不表态，等会后私下处理", points: 0 }
    ]
  }
];
