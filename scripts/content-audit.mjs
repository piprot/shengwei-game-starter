import {
  CHAPTERS,
  CHAPTER_REFLECTIONS,
  NODE_INTEL,
  ROLE_NODE_VARIANTS,
  STORY_NODES
} from "../src/core/story.ts";
import {
  ABILITIES,
  ABILITY_ORDER,
  ROLES
} from "../src/core/abilities.ts";
import { ASSESSMENT_QUESTIONS } from "../src/core/assessment.ts";
import { ACHIEVEMENTS } from "../src/core/achievements.ts";

const mainNodes = STORY_NODES.filter((node) => node.kind === "main");
const sideNodes = STORY_NODES.filter((node) => node.kind === "side");

const problems = [];

if (CHAPTERS.length !== 9) {
  problems.push("chapter count must be 9");
}
for (const chapter of CHAPTERS) {
  if (!CHAPTER_REFLECTIONS[chapter.id]) {
    problems.push(`chapter ${chapter.id} missing reflection`);
  }
}
if (mainNodes.length !== 18) {
  problems.push(`main nodes must be 18, got ${mainNodes.length}`);
}
if (sideNodes.length < 3) {
  problems.push(`side nodes must be at least 3, got ${sideNodes.length}`);
}

for (const node of STORY_NODES) {
  if (node.options.length !== 3) {
    problems.push(`${node.id} must have exactly 3 options`);
  }
  if (!NODE_INTEL[node.id]?.length) {
    problems.push(`${node.id} missing intel`);
  }
  for (const option of node.options) {
    if (!option.label || !option.summary || !option.feedback || !option.theory) {
      problems.push(`${node.id} option is incomplete`);
    }
    if (Object.keys(option.effects).length === 0) {
      problems.push(`${node.id} option has no ability effects`);
    }
  }
}

for (const node of mainNodes) {
  const variants = ROLE_NODE_VARIANTS[node.id];
  if (!variants) {
    problems.push(`${node.id} missing role variants`);
    continue;
  }
  for (const role of Object.keys(ROLES)) {
    if (!variants[role]?.context || !variants[role]?.stake) {
      problems.push(`${node.id} missing ${role} variant text`);
    }
  }
}

for (const id of ABILITY_ORDER) {
  const ability = ABILITIES[id];
  if (ability.subSkills.length < 4) {
    problems.push(`${id} must have at least 4 sub-skills`);
  }
  if (!ability.trainingPath) {
    problems.push(`${id} missing training path`);
  }
}

for (const role of Object.values(ROLES)) {
  if (!role.objective || !role.lens || role.focusAbilities.length < 4) {
    problems.push(`${role.id} role objective/lens/focus is incomplete`);
  }
}

if (ASSESSMENT_QUESTIONS.length !== 10) {
  problems.push("assessment must contain exactly 10 questions");
}
for (const question of ASSESSMENT_QUESTIONS) {
  if (question.options.length !== 3) {
    problems.push(`${question.id} must have exactly 3 options`);
  }
}

if (ACHIEVEMENTS.length < 10) {
  problems.push("achievements must contain at least 10 entries");
}

if (problems.length > 0) {
  console.error("CONTENT AUDIT FAILED");
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      chapters: CHAPTERS.length,
      mainNodes: mainNodes.length,
      sideNodes: sideNodes.length,
      options: STORY_NODES.reduce((sum, node) => sum + node.options.length, 0),
      intelEntries: Object.keys(NODE_INTEL).length,
      roleVariantNodes: Object.keys(ROLE_NODE_VARIANTS).length,
      abilities: ABILITY_ORDER.length,
      subSkills: ABILITY_ORDER.reduce(
        (sum, id) => sum + ABILITIES[id].subSkills.length,
        0
      )
    },
    null,
    2
  )
);
console.log("PASS content audit");
