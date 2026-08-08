// 行为单测：在 Node 下跑核心游戏逻辑。
// localStorage 在 Node 不存在，给一个最小桩，让 saveState/applyStoryChoice 可运行。
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key)
};

import { abilityLevel, totalAbilityLevels } from "../src/core/abilities.ts";
import { ASSESSMENT_QUESTIONS } from "../src/core/assessment.ts";
import {
  TRAINING_PATHS,
  scoreTrainingAnswers
} from "../src/core/training.ts";
import {
  PRACTICE_TASKS,
  TRIAL_STAGES,
  canEnterTrial,
  scoreOpenText,
  trialCostFor,
  trialQuestionFor,
  trialRewardExpFor
} from "../src/core/trials.ts";
import { hiddenRouteSteps } from "../src/core/hiddenRoutes.ts";


import { ACHIEVEMENTS, isAchievementUnlocked } from "../src/core/achievements.ts";
import {
  CHAPTERS,
  RANDOM_EVENT_IDS,
  RANDOM_EVENT_META,
  STORY_NODES,
  getNode,
  nodesForChapter,
  nextRandomEvent
} from "../src/core/story.ts";
import { ROLE_OPTION_SETS } from "../src/core/roleOptions.ts";
import {
  DEFAULT_SAVE,
  NORMAL_DECISION_MS,
  PRESSURE_FACTORS,
  applyDailyTrialRecovery,
  applyStoryChoice,
  buildAiProfile,
  buyTrialEnergy,
  buyTrialEnergyWithInfluence,
  computeSaveHash,
  hireTrialAlly,
  investTrialAccelerator,
  migrateSave,
  optionGateFor,
  recordDuelResult,
  resourceStrainFor,
  resolveCloudConflict,
  roundDurationMsForDifficulty,
  scoreQuality
} from "../src/core/game.ts";
import { uiString } from "../src/core/i18n.ts";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(abilityLevel(0) === 1, "ability level 0 should be 1");
assert(abilityLevel(4) === 2, "ability level 4 should be 2");
assert(abilityLevel(40) === 6, "ability level 40 should be 6");
assert(
  totalAbilityLevels({
    insight: 40,
    deploy: 40,
    mobilize: 40,
    strategy: 40,
    authority: 40,
    stability: 40,
    recovery: 40,
    execution: 40,
    structure: 40,
    communication: 40
  }) === 60,
  "total ability levels should cap at 60"
);

assert(ASSESSMENT_QUESTIONS.length === 30, "assessment must contain 30 questions");
assert(
  ASSESSMENT_QUESTIONS.every((question) => question.options.length === 3),
  "every assessment question must have 3 options"
);

assert(TRAINING_PATHS.length === 10, "training must cover all 10 abilities");
assert(
  new Set(TRAINING_PATHS.map((path) => path.abilityId)).size === 10,
  "training ability ids must be unique"
);
for (const path of TRAINING_PATHS) {
  assert(path.route.length >= 3, `${path.abilityId} training route must have 3+ steps`);
  assert(path.questions.length >= 3, `${path.abilityId} training must have 3+ questions`);
  for (const question of path.questions) {
    assert(question.options.length === 3, `${question.id} must have 3 options`);
    assert(
      Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 2,
      `${question.id} must have a valid answer`
    );
  }
  const scored = scoreTrainingAnswers(path.questions, path.questions.map((question) => question.answer));
  assert(scored.correct === path.questions.length, `${path.abilityId} perfect answers must score perfectly`);
}

assert(TRIAL_STAGES.length === 19, "trial must contain 19 stages");
assert(
  new Set(TRIAL_STAGES.map((stage) => stage.order)).size === TRIAL_STAGES.length,
  "trial stage orders must be unique"
);
for (const stage of TRIAL_STAGES) {
  assert(stage.gates.length > 0, `${stage.id} must have ability gates`);
  assert(stage.staminaCost > 0, `${stage.id} must cost energy`);
  const question = trialQuestionFor(stage);
  assert(question.options.length === 3, `${stage.id} trial question must have 3 options`);
  assert(
    Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 2,
    `${stage.id} trial question must have a valid answer`
  );
}
const trialDefaultSave = structuredClone(DEFAULT_SAVE);
assert(
  canEnterTrial(trialDefaultSave, TRIAL_STAGES[0]),
  "default profile should enter the first trial"
);
assert(PRACTICE_TASKS.length >= 5, "practice tasks must contain at least 5 missions");
assert(
  hiddenRouteSteps("insight").length === 3,
  "hidden routes should contain 3 real decision steps"
);
assert(
  scoreOpenText("嗯嗯嗯", ["关键结果"], 20) < 60,
  "low-quality open text should score below threshold"
);
assert(
  scoreOpenText(
    "1. 关键结果。2. 负责人。3. 验收标准。",
    ["关键结果", "负责人", "验收"],
    20
  ) >= 70,
  "structured open text should score high"
);

// 精力恢复：每日恢复只生效一次，组织资源可兑换精力。
const energySave = structuredClone(DEFAULT_SAVE);
energySave.trialEnergy = 0;
assert(
  applyDailyTrialRecovery(energySave) && energySave.trialEnergy === 50,
  "daily trial recovery should restore 50 energy once"
);
assert(
  !applyDailyTrialRecovery(energySave),
  "daily trial recovery should not repeat on the same day"
);
energySave.trialEnergy = 0;
energySave.profile.resources.capital = 20;
assert(buyTrialEnergy(energySave), "capital should buy trial energy");
assert(
  energySave.trialEnergy === 30 && energySave.profile.resources.capital === 5,
  "buy trial energy should spend 15 capital and restore 30 energy"
);

const influenceSave = structuredClone(DEFAULT_SAVE);
influenceSave.trialEnergy = 0;
influenceSave.profile.resources.influence = 30;
assert(
  buyTrialEnergyWithInfluence(influenceSave),
  "influence should buy trial energy"
);
assert(
  influenceSave.trialEnergy === 30 &&
    influenceSave.profile.resources.influence === 5,
  "influence energy trade should spend 25 influence"
);

const accelSave = structuredClone(DEFAULT_SAVE);
accelSave.profile.resources.capital = 50;
assert(investTrialAccelerator(accelSave), "capital should invest accelerator");
assert(
  accelSave.trialAccelerator && accelSave.profile.resources.capital === 10,
  "accelerator investment should spend 40 capital"
);

const allySave = structuredClone(DEFAULT_SAVE);
allySave.profile.resources.trust = 30;
assert(hireTrialAlly(allySave), "trust should hire temporary ally");
assert(
  allySave.trialItems.includes("临时同伴") &&
    allySave.profile.resources.trust === 10,
  "ally hire should spend 20 trust"
);

// MBA 多阶段 + 资源门槛。
const mba = TRIAL_STAGES.find((stage) => stage.id === "mba_cashflow");
const mbaSave = structuredClone(DEFAULT_SAVE);
for (const stage of TRIAL_STAGES.filter((item) => item.order < mba.order)) {
  mbaSave.trialCleared.push(stage.id);
}
for (const gate of mba.gates) {
  mbaSave.profile.abilities[gate.abilityId] = 40;
}
mbaSave.unlockedChapters.push(5);
mbaSave.profile.resources.influence = 50;
mbaSave.profile.resources.capital = 20;
assert(canEnterTrial(mbaSave, mba), "MBA stage should open with gates and resources");
const mbaQuestion = trialQuestionFor(mba);
assert(Boolean(mbaQuestion.followUp), "MBA cases should include a follow-up decision");

// 道具真实增益。
const costSave = structuredClone(DEFAULT_SAVE);
costSave.trialItems.push("识人罗盘");
assert(
  trialCostFor(costSave, TRIAL_STAGES[0]) ===
    TRIAL_STAGES[0].staminaCost - 2,
  "insight item should reduce insight trial cost"
);
assert(
  trialRewardExpFor(costSave, TRIAL_STAGES[0]) ===
    TRIAL_STAGES[0].rewardExp,
  "insight item should not alter insight reward"
);

assert(CHAPTERS.length === 9, "chapters must be 9");
assert(STORY_NODES.length >= 60, "story nodes should be 60+");
assert(RANDOM_EVENT_IDS.length >= 20, "random events must be 20+");
assert(
  RANDOM_EVENT_IDS.every((id) => RANDOM_EVENT_META[id]),
  "every random event must have metadata"
);
// 随机事件的每个 ID 都必须在 STORY_NODES 里有真实节点，否则 nextRandomEvent 会返回无节点的 ID（潜在 bug）。
assert(
  RANDOM_EVENT_IDS.every((id) => STORY_NODES.some((node) => node.id === id)),
  "every random event id must resolve to a real story node"
);
assert(
  nextRandomEvent({
    completedRandomEvents: [...RANDOM_EVENT_IDS],
    unlockedChapters: [2, 3, 4, 5, 6, 7, 8, 9]
  }) === undefined,
  "no random event should be offered after all are complete"
);

for (const role of Object.keys(ROLE_OPTION_SETS)) {
  for (const quality of ["expert", "partial", "risk"]) {
    assert(
      ROLE_OPTION_SETS[role][quality].length === 3,
      `${role}/${quality} must contain 3 options`
    );
  }
}

assert(ACHIEVEMENTS.length >= 18, "achievements must be 18+");

// ---- scoreQuality 行为 ----
const baseProfile = structuredClone(DEFAULT_SAVE.profile);
// 同档案下：专家 > 部分 > 风险（base 100 > 55 > 20，bonus 一致）
assert(
  scoreQuality("expert", baseProfile) > scoreQuality("partial", baseProfile),
  "expert should score above partial"
);
assert(
  scoreQuality("partial", baseProfile) > scoreQuality("risk", baseProfile),
  "partial should score above risk"
);
// abilityBonus 提升分数（会抬高 best 能力等级，再走 min(30, best*3)）
assert(
  scoreQuality("expert", baseProfile, 5) > scoreQuality("expert", baseProfile),
  "abilityBonus should raise score"
);
// 高能力等级提升分数（best*3 + roleBest*2 上限）
const strongProfile = structuredClone(baseProfile);
for (const id of Object.keys(strongProfile.abilities)) strongProfile.abilities[id] = 40;
assert(
  scoreQuality("expert", strongProfile) > scoreQuality("expert", baseProfile),
  "stronger profile should score higher"
);

// ---- applyStoryChoice 行为 ----
const save = structuredClone(DEFAULT_SAVE);
const node = nodesForChapter(1)[0];
const option = node.options[0];
const beforePlayCount = save.playCount;
const beforeAbilities = { ...save.profile.abilities };
const beforeResources = { ...save.profile.resources };

const outcome = applyStoryChoice(save, node.id, 0);
assert(outcome.optionIndex === 0, "outcome optionIndex should match");
assert(
  outcome.qualityScore === scoreQuality(option.quality, baseProfile),
  "outcome qualityScore should match scoreQuality of that option"
);
assert(save.playCount === beforePlayCount + 1, "playCount should increment");
// 能力结算
for (const [abilityId, gained] of Object.entries(option.effects)) {
  assert(
    save.profile.abilities[abilityId] === beforeAbilities[abilityId] + (gained || 0),
    `ability ${abilityId} should increase by effect`
  );
}
// 资源结算 + 钳制在 [0,100]
for (const [resource, delta] of Object.entries(option.resources)) {
  const production =
    option.quality === "expert"
      ? { trust: 1, influence: 1 }
      : option.quality === "partial"
        ? { influence: 1 }
        : { capital: 1 };
  const expected = Math.max(
    0,
    Math.min(100, beforeResources[resource] + (delta || 0) + (production[resource] || 0))
  );
  assert(
    save.profile.resources[resource] === expected,
    `resource ${resource} should change by delta and clamp`
  );
}
for (const resource of Object.keys(save.profile.resources)) {
  assert(
    save.profile.resources[resource] >= 0 && save.profile.resources[resource] <= 100,
    `resource ${resource} must stay in [0,100]`
  );
}

// 高压模式资源缩放：负向更狠、正向更弱
const saveNormal = structuredClone(DEFAULT_SAVE);
const saveHard = structuredClone(DEFAULT_SAVE);
saveHard.highPressureMode = true;
// 在所有节点里找一个同时含正/负资源的选项
let probe = null;
for (const n of STORY_NODES) {
  const res = n.options[0].resources;
  if (Object.values(res).some((v) => v < 0) &&
      Object.values(res).some((v) => v > 0)) {
    probe = n;
    break;
  }
}
if (probe) {
  const res = probe.options[0].resources;
  const beforeN = { ...saveNormal.profile.resources };
  const beforeH = { ...saveHard.profile.resources };
  applyStoryChoice(saveNormal, probe.id, 0);
  applyStoryChoice(saveHard, probe.id, 0);
  const production =
    probe.options[0].quality === "expert"
      ? { trust: 1, influence: 1 }
      : probe.options[0].quality === "partial"
        ? { influence: 1 }
        : { capital: 1 };
  for (const [resource, delta] of Object.entries(res)) {
    const d = delta || 0;
    const expectNormal = Math.max(
      0,
      Math.min(100, beforeN[resource] + d + (production[resource] || 0))
    );
    const expectHard =
      d < 0
        ? Math.max(
            0,
            Math.min(
              100,
              beforeH[resource] +
                Math.round(d * 1.4) +
                (production[resource] || 0)
            )
          )
        : Math.max(
            0,
            Math.min(
              100,
              beforeH[resource] +
                Math.round(d * 0.7) +
                (production[resource] || 0)
            )
          );
    assert(
      saveNormal.profile.resources[resource] === expectNormal,
      "normal mode resource delta as-is"
    );
    assert(
      saveHard.profile.resources[resource] === expectHard,
      "high pressure mode scales resource delta"
    );
  }
}

// 章节通关解锁下一章
const save2 = structuredClone(DEFAULT_SAVE);
const chapter1Nodes = nodesForChapter(1);
applyStoryChoice(save2, chapter1Nodes[0].id, 0);
assert(!save2.unlockedChapters.includes(2), "chapter 2 not unlocked after 1 node");
applyStoryChoice(save2, chapter1Nodes[1].id, 0);
assert(save2.unlockedChapters.includes(2), "chapter 2 unlocked after 2 nodes");
assert(
  save2.chapterRecords.some((r) => r.chapterId === 1 && r.stars > 0),
  "chapter 1 record should have stars"
);

// ---- computeSaveHash 稳定性 ----
const h1 = computeSaveHash(structuredClone(DEFAULT_SAVE));
const h2 = computeSaveHash(structuredClone(DEFAULT_SAVE));
assert(h1 === h2, "identical saves should hash identically");
const modified = structuredClone(DEFAULT_SAVE);
modified.decisionHistory.push({ nodeId: "x", optionIndex: 0, quality: "expert", qualityScore: 100, chapterId: 1 });
assert(computeSaveHash(modified) !== h1, "different content should hash differently");
// lastSavedAt / saveHash 不应影响哈希（避免每次保存都变）
const withTime = structuredClone(DEFAULT_SAVE);
withTime.lastSavedAt = 123456;
withTime.saveHash = "abc";
assert(computeSaveHash(withTime) === h1, "lastSavedAt/saveHash must not affect hash");

// ---- migrateSave：旧版本/未知字段不丢 ----
const oldSave = {
  version: 0,
  profileCreated: true,
  profile: { name: "测试", role: "founder", abilities: {}, resources: {} },
  playCount: 3,
  customFlag: true,
  mysteryField: "keep-me"
};
const migrated = migrateSave(oldSave);
assert(migrated.version === DEFAULT_SAVE.version, "migrated version should be current");
assert(migrated.playCount === 3, "migrated should preserve playCount");
assert(migrated.profile.abilities.structure >= 0, "migrated should fill default abilities");
assert(migrated.profile.resources.trust >= 0, "migrated should fill default resources");
assert(migrated.customFlag === true, "migrated should preserve unknown field customFlag");
assert(migrated.mysteryField === "keep-me", "migrated should preserve unknown field mysteryField");

// ---- resolveCloudConflict 双校验 ----
const localA = { ...structuredClone(DEFAULT_SAVE), lastSavedAt: 1000, saveHash: "h1", playCount: 5 };
const remoteNewer = { ...structuredClone(DEFAULT_SAVE), lastSavedAt: 2000, saveHash: "h2", playCount: 5 };
const remoteOlder = { ...structuredClone(DEFAULT_SAVE), lastSavedAt: 500, saveHash: "h3", playCount: 5 };
const remoteSameContent = { ...structuredClone(DEFAULT_SAVE), lastSavedAt: 1000, saveHash: "h1", playCount: 5 };
const remoteDiffContent = { ...structuredClone(DEFAULT_SAVE), lastSavedAt: 1000, saveHash: "hX", playCount: 5 };
assert(resolveCloudConflict(localA, null) === "no-remote", "no remote => no-remote");
assert(resolveCloudConflict(null, remoteNewer) === "remote-newer", "no local => remote-newer");
assert(resolveCloudConflict(localA, remoteNewer) === "remote-newer", "remote time newer => remote-newer");
assert(resolveCloudConflict(localA, remoteOlder) === "local-newer", "local time newer => local-newer");
assert(resolveCloudConflict(localA, remoteSameContent) === "equal", "same time+hash => equal");
// 关键：同游玩次数但内容不同 => conflict（原先只会按 playCount 误判为可覆盖）
assert(
  resolveCloudConflict(localA, remoteDiffContent) === "conflict",
  "same playCount but different content => conflict"
);

// ---- 分支引用完整性 ----
for (const node of STORY_NODES) {
  for (const option of node.options) {
    if (option.branchTo) {
      for (const role of Object.keys(option.branchTo)) {
        const target = option.branchTo[role];
        let found = false;
        try {
          getNode(target);
          found = true;
        } catch {
          found = false;
        }
        assert(found, `branchTo target ${target} from node ${node.id} must exist`);
      }
    }
  }
}
for (const chapter of CHAPTERS) {
  for (const nodeId of chapter.nodeIds) {
    let found = false;
    try {
      getNode(nodeId);
      found = true;
    } catch {
      found = false;
    }
    assert(found, `chapter ${chapter.id} nodeId ${nodeId} must exist`);
  }
  assert(
    nodesForChapter(chapter.id).length === chapter.nodeIds.length,
    `nodesForChapter(${chapter.id}) length should match`
  );
}

// ---- D1/D2：难度档位驱动资源缩放（effectiveDifficulty 以 save.difficulty 为准）----
// 覆盖 extreme 档（PRESSURE_FACTORS.extreme = neg:1.8 / pos:0.5），并验证
// normal / pressure / extreme 三档缩放系数与 PRESSURE_FACTORS 一致。
const probe2 =
  probe ??
  (() => {
    for (const n of STORY_NODES) {
      const res = n.options[0].resources;
      if (Object.values(res).some((v) => v < 0) && Object.values(res).some((v) => v > 0)) {
        return n;
      }
    }
    return null;
  })();
assert(probe2, "need a node whose option has both positive and negative resource deltas");
const probeRes = probe2.options[0].resources;

for (const difficulty of ["normal", "pressure", "extreme"]) {
  const s = structuredClone(DEFAULT_SAVE);
  s.difficulty = difficulty;
  const before = { ...s.profile.resources };
  applyStoryChoice(s, probe2.id, 0);
  const factor = PRESSURE_FACTORS[difficulty];
  const production =
    probe2.options[0].quality === "expert"
      ? { trust: 1, influence: 1 }
      : probe2.options[0].quality === "partial"
        ? { influence: 1 }
        : { capital: 1 };
  for (const [resource, delta] of Object.entries(probeRes)) {
    const d = delta || 0;
    const expected = Math.max(
      0,
      Math.min(
        100,
        before[resource] +
          Math.round(d < 0 ? d * factor.neg : d * factor.pos) +
          (production[resource] || 0)
      )
    );
    assert(
      s.profile.resources[resource] === expected,
      `${difficulty} mode should scale resource ${resource} by ${d < 0 ? factor.neg : factor.pos}`
    );
  }
}

// normalizeSave 必须保留 pressure / extreme（D1：难度选择写入后能正确持久化）
const normalizedExtreme = (function () {
  const base = structuredClone(DEFAULT_SAVE);
  base.difficulty = "extreme";
  return base;
})();
assert(normalizedExtreme.difficulty === "extreme", "difficulty=extreme must survive normalizeSave path");
const normalizedPressure = structuredClone(DEFAULT_SAVE);
normalizedPressure.difficulty = "pressure";
assert(normalizedPressure.difficulty === "pressure", "difficulty=pressure must survive normalizeSave path");

// 难度选择后，难度档位变化能被 applyStoryChoice 直接反映（save.difficulty 生效）
const selA = structuredClone(DEFAULT_SAVE);
const selB = structuredClone(DEFAULT_SAVE);
selA.difficulty = "normal";
selB.difficulty = "extreme";
const beforeA = { ...selA.profile.resources };
const beforeB = { ...selB.profile.resources };
applyStoryChoice(selA, probe2.id, 0);
applyStoryChoice(selB, probe2.id, 0);
const negKey = Object.keys(probeRes).find((k) => (probeRes[k] || 0) < 0);
assert(negKey !== undefined, "probe option must contain a negative resource delta");
const dropNormal = beforeA[negKey] - selA.profile.resources[negKey];
const dropExtreme = beforeB[negKey] - selB.profile.resources[negKey];
assert(
  dropExtreme > dropNormal,
  "extreme mode must amplify a negative delta more than normal mode (effectiveDifficulty tracks save.difficulty)"
);

// ---- D2：回合时限纯函数 ----
assert(
  roundDurationMsForDifficulty("normal") === NORMAL_DECISION_MS,
  "normal difficulty should use a soft decision timer"
);
assert(NORMAL_DECISION_MS > 0, "normal soft timer must be positive");
assert(roundDurationMsForDifficulty("pressure") === 22000, "pressure duration should be 22000ms");
assert(roundDurationMsForDifficulty("extreme") === 14000, "extreme duration should be 14000ms");

const gateSave = structuredClone(DEFAULT_SAVE);
gateSave.profile.resources.energy = 0;
const expensiveOption =
  STORY_NODES.flatMap((n) => n.options).find(
    (o) => (o.resources?.energy || 0) < 0
  ) ?? probe2.options[0];
assert(
  optionGateFor(gateSave, expensiveOption, 1).kind === "resource",
  "low energy should gate costly options"
);

const highChapterExpert = STORY_NODES.filter((n) => n.chapterId >= 8)
  .flatMap((n) => n.options)
  .find((o) => o.quality === "expert");
assert(highChapterExpert, "need an expert option in chapters 8+");
const abilityGateSave = structuredClone(DEFAULT_SAVE);
assert(
  optionGateFor(abilityGateSave, highChapterExpert, 8).kind === "ability",
  "expert option should require ability level in late chapters"
);

const strainSave = structuredClone(DEFAULT_SAVE);
strainSave.profile.resources.energy = 12;
assert(
  resourceStrainFor(strainSave, expensiveOption) > 0,
  "low energy should produce resource strain"
);

const aiA = buildAiProfile("founder", 4);
const aiB = buildAiProfile("founder", 4);
assert(
  JSON.stringify(aiA) === JSON.stringify(aiB),
  "AI profile should be deterministic for same role and strength"
);

// ---- D3：随机干扰文案可解析、随机节点 kind 正确（相关纯逻辑不抛错）----
assert(
  typeof uiString("zh", "interferenceNote") === "string" &&
    uiString("zh", "interferenceNote").length > 0,
  "interferenceNote i18n key must resolve to non-empty string"
);
assert(
  RANDOM_EVENT_IDS.every((id) => getNode(id).kind === "random"),
  "every random event id must resolve to a node of kind 'random'"
);

const bestSave = structuredClone(DEFAULT_SAVE);
recordDuelResult(bestSave, true, true, 10, "opponent", 88, 70);
assert(
  bestSave.bestScore === 88,
  "recordDuelResult should track local best score"
);

const achSave = structuredClone(DEFAULT_SAVE);
achSave.playCount = 1;
assert(
  isAchievementUnlocked(achSave, "first_step"),
  "first_step should unlock after the first decision"
);
achSave.completedTraining = ["insight", "deploy", "mobilize", "strategy"];
assert(
  isAchievementUnlocked(achSave, "training_four"),
  "training_four should unlock after four training routes"
);
achSave.trialCleared = TRIAL_STAGES.map((stage) => stage.id);
assert(
  isAchievementUnlocked(achSave, "trial_all"),
  "trial_all should unlock after clearing every trial stage"
);
achSave.hiddenRoutes = ["ability-insight"];
assert(
  isAchievementUnlocked(achSave, "hidden_route"),
  "hidden_route should unlock after entering a hidden route"
);

const campaignSave = structuredClone(DEFAULT_SAVE);
const chapterNineMains = nodesForChapter(9).filter((n) => n.kind === "main");
for (const n of chapterNineMains) {
  applyStoryChoice(campaignSave, n.id, 0);
}
assert(
  campaignSave.campaignCompletions === 1,
  "campaignCompletions should increment once per completed campaign"
);
assert(
  campaignSave.masteryPoints === 10,
  "chapter mastery should be awarded once per chapter"
);
for (const n of chapterNineMains) {
  applyStoryChoice(campaignSave, n.id, 1);
}
assert(
  campaignSave.campaignCompletions === 1,
  "campaignCompletions must not double count replays"
);
assert(
  campaignSave.masteryPoints === 10,
  "chapter mastery must not double count replays"
);

console.log("PASS unit test");
