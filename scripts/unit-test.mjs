import { abilityLevel, totalAbilityLevels } from "../src/core/abilities.ts";
import { ASSESSMENT_QUESTIONS } from "../src/core/assessment.ts";
import { ACHIEVEMENTS } from "../src/core/achievements.ts";
import {
  CHAPTERS,
  RANDOM_EVENT_IDS,
  RANDOM_EVENT_META,
  STORY_NODES,
  nextRandomEvent
} from "../src/core/story.ts";
import { ROLE_OPTION_SETS } from "../src/core/roleOptions.ts";

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

console.log("PASS unit test");
