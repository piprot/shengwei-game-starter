import { ABILITY_ORDER, ROLES, abilityLevel } from "./abilities.ts";
import { duelNodes } from "./story.ts";
import type {
  AbilityId,
  DuelProfile,
  DuelResult,
  RoleId,
  StoryNode
} from "./types.ts";

export class DuelEngine {
  readonly players: [DuelProfile, DuelProfile];
  readonly nodes: StoryNode[];
  readonly roundCount: number;
  currentRound = 0;
  scores: [number, number] = [0, 0];
  picks: [number | null, number | null] = [null, null];
  roundResults: DuelResult["roundResults"] = [];

  constructor(
    playerOne: DuelProfile,
    playerTwo: DuelProfile,
    roundCount: number,
    seed: number
  ) {
    this.players = [playerOne, playerTwo];
    this.roundCount = Math.min(7, Math.max(1, roundCount));
    this.nodes = duelNodes(this.roundCount, seed);
  }

  get node(): StoryNode {
    return this.nodes[this.currentRound];
  }

  pick(playerIndex: 0 | 1, optionIndex: number): void {
    if (this.picks[playerIndex] !== null) {
      return;
    }
    this.picks[playerIndex] = optionIndex;
  }

  resolvePendingRound(): void {
    if (this.picks[0] !== null && this.picks[1] !== null) {
      this.resolveRound();
    }
  }

  aiPick(playerIndex: 0 | 1): number {
    const player = this.players[playerIndex];
    const node = this.node;
    const relevant = node.options.map((option) => {
      const focus = (Object.keys(option.effects) as AbilityId[]).reduce(
        (best, id) => Math.max(best, abilityLevel(player.abilities[id])),
        1
      );
      const quality =
        option.quality === "expert" ? 1 : option.quality === "partial" ? 0.55 : 0.2;
      return (
        quality * (2 + focus) +
        resourceBonus(player) / 40 +
        Math.random() * 0.35
      );
    });
    const bestIndex = relevant.indexOf(Math.max(...relevant));
    this.pick(playerIndex, bestIndex);
    return bestIndex;
  }

  get finished(): boolean {
    return this.currentRound >= this.roundCount;
  }

  get winnerIndex(): 0 | 1 | -1 {
    if (this.scores[0] === this.scores[1]) return -1;
    return this.scores[0] > this.scores[1] ? 0 : 1;
  }

  toResult(): DuelResult {
    return {
      winnerName:
        this.winnerIndex === -1
          ? "平局"
          : this.players[this.winnerIndex].name,
      scores: [...this.scores] as [number, number],
      roundResults: this.roundResults
    };
  }

  private resolveRound(): void {
    const [pickOne, pickTwo] = this.picks as [number, number];
    const points: [number, number] = [
      this.scorePick(0, pickOne),
      this.scorePick(1, pickTwo)
    ];
    this.scores[0] += points[0];
    this.scores[1] += points[1];
    this.roundResults.push({
      node: this.node,
      picks: [pickOne, pickTwo],
      points
    });
    this.currentRound += 1;
    this.picks = [null, null];
  }

  private scorePick(playerIndex: 0 | 1, optionIndex: number): number {
    const option = this.node.options[optionIndex];
    const profile = this.players[playerIndex];
    const relevantLevel = (Object.keys(option.effects) as AbilityId[]).reduce(
      (best, id) => Math.max(best, abilityLevel(profile.abilities[id])),
      1
    );
    const base =
      option.quality === "expert" ? 100 : option.quality === "partial" ? 55 : 20;
    let combo = 0;
    for (let i = this.roundResults.length - 1; i >= 0; i -= 1) {
      const previous = this.roundResults[i];
      const previousOption =
        previous.node.options[previous.picks[playerIndex]];
      if (previousOption.quality === "expert") {
        combo += 1;
      } else {
        break;
      }
    }
    return Math.round(
      base +
        relevantLevel * 4 +
        resourceBonus(profile) +
        Math.min(15, combo * 5)
    );
  }
}

/** 四项资源的综合加成：让 1v1 不再只由精力和能力决定。 */
function resourceBonus(profile: DuelProfile): number {
  return (
    profile.resources.energy / 15 +
    profile.resources.trust / 25 +
    profile.resources.influence / 30 +
    profile.resources.capital / 35
  );
}

export function duelSeed(): number {
  return Math.floor(Math.random() * 100000);
}

export function recommendedTraining(
  abilities: Record<AbilityId, number>,
  role?: RoleId
): AbilityId[] {
  const focus = role ? ROLES[role].focusAbilities : [];
  return ABILITY_ORDER.slice()
    .sort((a, b) => {
      const focusDelta =
        (focus.includes(b) ? 1 : 0) - (focus.includes(a) ? 1 : 0);
      return (
        focusDelta * 10 +
        (abilityLevel(abilities[a]) - abilityLevel(abilities[b]))
      );
    })
    .slice(0, 3);
}
