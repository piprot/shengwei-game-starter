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

if (ASSESSMENT_QUESTIONS.length !== 30) {
  problems.push("assessment must contain exactly 30 questions");
}
for (const question of ASSESSMENT_QUESTIONS) {
  if (question.options.length !== 3) {
    problems.push(`${question.id} must have exactly 3 options`);
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
