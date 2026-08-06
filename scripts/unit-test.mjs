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
import { ACHIEVEMENTS } from "../src/core/achievements.ts";
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
  applyStoryChoice,
  computeSaveHash,
  migrateSave,
  resolveCloudConflict,
  scoreQuality
} from "../src/core/game.ts";

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
  const expected = Math.max(0, Math.min(100, beforeResources[resource] + (delta || 0)));
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
  for (const [resource, delta] of Object.entries(res)) {
    const d = delta || 0;
    const expectNormal = Math.max(0, Math.min(100, beforeN[resource] + d));
    const expectHard =
      d < 0
        ? Math.max(0, Math.min(100, beforeH[resource] + Math.round(d * 1.4)))
        : Math.max(0, Math.min(100, beforeH[resource] + Math.round(d * 0.7)));
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

console.log("PASS unit test");
