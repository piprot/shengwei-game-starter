import { ABILITY_ORDER } from "../src/core/abilities.ts";
import { STORY_NODES } from "../src/core/story.ts";

const counts = Object.fromEntries(
  ABILITY_ORDER.map((id) => [id, { expert: 0, partial: 0, risk: 0, total: 0 }])
);

for (const node of STORY_NODES) {
  for (const option of node.options) {
    for (const abilityId of Object.keys(option.effects ?? {})) {
      const entry = counts[abilityId];
      if (!entry) continue;
      entry[option.quality] += 1;
      entry.total += 1;
    }
  }
}

const issues = [];
for (const abilityId of ABILITY_ORDER) {
  const entry = counts[abilityId];
  if (entry.total < 6) {
    issues.push(`${abilityId} only appears ${entry.total} times across all nodes`);
  }
  if (entry.expert < 2) {
    issues.push(`${abilityId} only has ${entry.expert} expert appearances`);
  }
}

console.log(JSON.stringify({ counts, issueCount: issues.length, issues }, null, 2));
if (issues.length > 0) {
  process.exitCode = 1;
}
