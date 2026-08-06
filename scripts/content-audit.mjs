import {
  CHAPTERS,
  CHAPTER_REFLECTIONS,
  NODE_INTEL,
  RANDOM_EVENT_IDS,
  ROLE_NODE_VARIANTS,
  SIDE_QUEST_ARCS,
  STORY_NODES,
  getNodeForRole
} from "../src/core/story.ts";
import {
  ABILITIES,
  ABILITY_ORDER,
  ROLES
} from "../src/core/abilities.ts";
import { ASSESSMENT_QUESTIONS } from "../src/core/assessment.ts";
import { ACHIEVEMENTS } from "../src/core/achievements.ts";
import { NPCS } from "../src/core/npcs.ts";
import { ROLE_OPTION_SETS } from "../src/core/roleOptions.ts";
import {
  ABILITY_EN,
  ABILITY_DETAIL_EN,
  ACHIEVEMENT_EN,
  ASSESSMENT_EN,
  BRANCH_NODE_EN,
  CHAPTER_EN,
  CHAPTER_REFLECTION_EN,
  CHALLENGE_EN,
  MAIN_NODE_EN,
  MAIN_NODE_THEORY_EN,
  NPC_EN,
  RANDOM_NODE_EN,
  RESOURCE_EN,
  ROLE_EN,
  ROLE_OPTION_EN,
  SIDE_ARC_EN,
  SIDE_NODE_EN
} from "../src/core/translations.ts";

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
  if (!CHAPTER_EN[chapter.id]?.title || !CHAPTER_EN[chapter.id]?.subtitle) {
    problems.push(`chapter ${chapter.id} missing English title/subtitle`);
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
    if (option.branchTo) {
      for (const branchId of Object.values(option.branchTo)) {
        if (!STORY_NODES.some((item) => item.id === branchId)) {
          problems.push(`${node.id} option references missing branch ${branchId}`);
        }
      }
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

for (const node of mainNodes) {
  for (const role of ["parachute", "founder", "highPotential"]) {
    const labels = getNodeForRole(role, node.id).options.map(
      (option) => option.label
    );
    if (new Set(labels).size < 3) {
      problems.push(`${node.id}/${role} has duplicate role option labels`);
    }
  }
}

for (const id of ABILITY_ORDER) {
  const ability = ABILITIES[id];
  if (!ABILITY_EN[id]?.name || !ABILITY_EN[id]?.tagline) {
    problems.push(`${id} missing English ability text`);
  }
  if (ability.subSkills.length < 4) {
    problems.push(`${id} must have at least 4 sub-skills`);
  }
  if (!ability.trainingPath) {
    problems.push(`${id} missing training path`);
  }
  const en = ABILITY_DETAIL_EN[id];
  if (
    !en?.subSkills ||
    en.subSkills.length < ability.subSkills.length ||
    !en.trainingPath ||
    !en.sources ||
    en.sources.length < 2
  ) {
    problems.push(`${id} missing English ability detail text`);
  }
}

for (const role of Object.values(ROLES)) {
  if (
    !ROLE_EN[role.id]?.name ||
    !ROLE_EN[role.id]?.lens ||
    !ROLE_EN[role.id]?.objective ||
    !ROLE_EN[role.id]?.description
  ) {
    problems.push(`${role.id} missing English role text`);
  }
  if (!role.objective || !role.lens || role.focusAbilities.length < 4) {
    problems.push(`${role.id} role objective/lens/focus is incomplete`);
  }
}

for (const key of ["energy", "trust", "influence", "capital"]) {
  if (!RESOURCE_EN[key]) {
    problems.push(`resource ${key} missing English label`);
  }
}

for (const node of mainNodes) {
  const en = MAIN_NODE_EN[node.id];
  if (!en?.title || !en?.context || !en?.stake) {
    problems.push(`${node.id} missing English scenario text`);
  }
  if (
    !MAIN_NODE_THEORY_EN[node.id] ||
    MAIN_NODE_THEORY_EN[node.id].length !== node.options.length
  ) {
    problems.push(`${node.id} missing English theory translations`);
  }
}

for (const node of sideNodes) {
  const en = SIDE_NODE_EN[node.id];
  if (!en?.title || !en?.context || !en?.stake || en.intel.length < 2) {
    problems.push(`${node.id} missing English side scenario text`);
  }
  if (
    !en?.options ||
    en.options.length !== node.options.length ||
    en.options.some((item) => !item.label || !item.summary || !item.feedback || !item.theory)
  ) {
    problems.push(`${node.id} missing English side option text`);
  }
}

for (const node of STORY_NODES.filter((item) => item.kind === "branch")) {
  const en = BRANCH_NODE_EN[node.id];
  if (!en?.title || !en?.context || !en?.stake) {
    problems.push(`${node.id} missing English branch scenario text`);
  }
}

for (const node of STORY_NODES.filter((item) => item.kind === "random")) {
  const en = RANDOM_NODE_EN[node.id];
  if (!en?.title || !en?.context || !en?.stake || en.intel.length < 2) {
    problems.push(`${node.id} missing English random event text`);
  }
  if (
    !en?.options ||
    en.options.length !== node.options.length ||
    en.options.some((item) => !item.label || !item.summary || !item.feedback || !item.theory)
  ) {
    problems.push(`${node.id} missing English random event option text`);
  }
}

for (const arc of SIDE_QUEST_ARCS) {
  const en = SIDE_ARC_EN[arc.id];
  if (!en?.title || !en?.summary || !en?.intro || !en?.conclusion) {
    problems.push(`${arc.id} missing English arc text`);
  }
}

for (const npc of NPCS) {
  const en = NPC_EN[npc.id];
  if (!en?.name || !en?.title || !en?.description) {
    problems.push(`${npc.id} missing English NPC text`);
  }
}

for (const achievement of ACHIEVEMENTS) {
  const en = ACHIEVEMENT_EN[achievement.id];
  if (!en?.name || !en?.description) {
    problems.push(`${achievement.id} missing English achievement text`);
  }
}

for (const id of ["expert_3", "side_1", "duel_1", "chapter_1", "rank_20"]) {
  if (!CHALLENGE_EN[id]?.title || !CHALLENGE_EN[id]?.description) {
    problems.push(`${id} missing English challenge text`);
  }
}

for (const chapter of CHAPTERS) {
  if (!CHAPTER_REFLECTION_EN[chapter.id]) {
    problems.push(`chapter ${chapter.id} missing English reflection`);
  }
}

for (const role of ["parachute", "founder", "highPotential"]) {
  for (const quality of ["expert", "partial", "risk"]) {
    const set = ROLE_OPTION_EN[role]?.[quality];
    if (!set || set.length !== 3 || set.some((item) => !item.label || !item.summary || !item.feedback)) {
      problems.push(`${role}/${quality} missing English role option text`);
    }
  }
}

if (ASSESSMENT_QUESTIONS.length !== 30) {
  problems.push("assessment must contain exactly 30 questions");
}
for (const question of ASSESSMENT_QUESTIONS) {
  if (question.options.length !== 3) {
    problems.push(`${question.id} must have exactly 3 options`);
  }
  const en = ASSESSMENT_EN[question.id];
  if (
    !en?.prompt ||
    !en.options ||
    en.options.length !== question.options.length ||
    en.options.some((label) => !label)
  ) {
    problems.push(`${question.id} missing English assessment text`);
  }
}

for (const arc of SIDE_QUEST_ARCS) {
  if (arc.nodes.length < 3) {
    problems.push(`${arc.id} must contain at least 3 nodes`);
  }
  for (const nodeId of arc.nodes) {
    if (!STORY_NODES.some((node) => node.id === nodeId)) {
      problems.push(`${arc.id} references missing node ${nodeId}`);
    }
  }
}

for (const eventId of RANDOM_EVENT_IDS) {
  const eventNode = STORY_NODES.find((node) => node.id === eventId);
  if (!eventNode) {
    problems.push(`random event ${eventId} is missing`);
  } else if (eventNode.kind !== "random") {
    problems.push(`random event ${eventId} must use kind random`);
  }
}

for (const node of STORY_NODES) {
  for (const option of node.options) {
    for (const branchId of Object.values(option.branchTo || {})) {
      const branchNode = STORY_NODES.find((item) => item.id === branchId);
      if (branchNode && branchNode.kind !== "branch") {
        problems.push(`${branchId} must use kind branch`);
      }
    }
  }
}

for (const role of Object.keys(ROLE_OPTION_SETS)) {
  for (const quality of ["expert", "partial", "risk"]) {
    if (ROLE_OPTION_SETS[role][quality].length !== 3) {
      problems.push(`${role}/${quality} role option set must contain 3 options`);
    }
  }
}

if (ACHIEVEMENTS.length < 10) {
  problems.push("achievements must contain at least 10 entries");
}
for (const npc of NPCS) {
  if (!STORY_NODES.some((node) => node.id === npc.nodeId)) {
    problems.push(`${npc.id} references missing node ${npc.nodeId}`);
  }
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
      translatedMainNodes: mainNodes.filter((node) => MAIN_NODE_EN[node.id]).length,
      translatedSideNodes: sideNodes.filter((node) => SIDE_NODE_EN[node.id]).length,
      translatedBranchNodes: STORY_NODES.filter(
        (node) => node.kind === "branch" && BRANCH_NODE_EN[node.id]
      ).length,
      translatedRandomNodes: STORY_NODES.filter(
        (node) => node.kind === "random" && RANDOM_NODE_EN[node.id]
      ).length,
      translatedNpcs: NPCS.filter((npc) => NPC_EN[npc.id]).length,
      translatedAchievements: ACHIEVEMENTS.filter(
        (achievement) => ACHIEVEMENT_EN[achievement.id]
      ).length,
      translatedAssessmentQuestions: ASSESSMENT_QUESTIONS.filter(
        (question) => ASSESSMENT_EN[question.id]
      ).length,
      translatedRoleOptions: Object.keys(ROLE_OPTION_EN).length * 9,
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
