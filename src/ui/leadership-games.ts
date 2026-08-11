import {
  CRISIS_EVENTS,
  LEADERSHIP_GAMES,
  RESOURCE_AREAS,
  RESOURCE_AREA_LABELS,
  TEAM_MEMBERS,
  applyCrisisChoice,
  applyDecisionChessMove,
  applyGameTheoryChoice,
  applyResourceAllocation,
  applyTeamAssignment,
  createCrisisCommand,
  createDecisionChess,
  createGameTheory,
  createResourceAllocation,
  createTeamManagement,
  decisionChessMoves,
  type CrisisCommandState,
  type DecisionChessState,
  type GameTheoryChoice,
  type GameTheoryState,
  type LeadershipGameId,
  type LeadershipGameMode,
  type ResourceArea,
  type ResourceAllocationState,
  type TeamManagementState
} from "../core/leadership-games";

export type { LeadershipGameId } from "../core/leadership-games";

export interface LeadershipGamesCallbacks {
  onBack(): void;
  onReward(gameId: LeadershipGameId, won: boolean, score: number): void;
  onAudio(kind: "ui" | "win" | "lose" | "choose"): void;
}

type AnyGameState =
  | DecisionChessState
  | GameTheoryState
  | ResourceAllocationState
  | TeamManagementState
  | CrisisCommandState;

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export class LeadershipGamesApp {
  private root: HTMLElement;
  private language: "zh" | "en";
  private callbacks: LeadershipGamesCallbacks;
  private currentGameId?: LeadershipGameId;
  private currentMode?: LeadershipGameMode;
  private state?: AnyGameState;
  private rewarded = false;

  constructor(
    language: "zh" | "en",
    callbacks: LeadershipGamesCallbacks
  ) {
    this.language = language;
    this.callbacks = callbacks;
    this.root = document.createElement("div");
  }

  render(container: HTMLElement): void {
    this.root = container;
    container.innerHTML = this.currentGameId
      ? this.renderGame()
      : this.renderIndex();
  }

  handleAction(action: string, target: HTMLElement): void {
    if (action === "lg-home") {
      this.currentGameId = undefined;
      this.currentMode = undefined;
      this.state = undefined;
      this.rewarded = false;
      this.callbacks.onBack();
      return;
    }
    if (action === "lg-back") {
      this.currentGameId = undefined;
      this.currentMode = undefined;
      this.state = undefined;
      this.rewarded = false;
      this.render(this.root);
      return;
    }
    if (action === "lg-start") {
      const gameId = target.dataset.game as LeadershipGameId;
      const mode = target.dataset.mode as LeadershipGameMode;
      this.start(gameId, mode);
      return;
    }
    if (action === "lg-again") {
      if (this.currentGameId && this.currentMode) {
        this.start(this.currentGameId, this.currentMode);
      }
      return;
    }
    if (!this.state) return;

    if (action === "lg-move" && "board" in this.state) {
      const to: [number, number] = [
        Number(target.dataset.row),
        Number(target.dataset.col)
      ];
      this.state = applyDecisionChessMove(this.state as DecisionChessState, to);
      this.finishIfDone();
      this.callbacks.onAudio("choose");
      this.render(this.root);
      return;
    }
    if (action === "lg-choice" && "playerHistory" in this.state) {
      const choice = target.dataset.choice as GameTheoryChoice;
      this.state = applyGameTheoryChoice(this.state as GameTheoryState, choice);
      this.finishIfDone();
      this.callbacks.onAudio("choose");
      this.render(this.root);
      return;
    }
    if (action === "lg-allocate" && "multipliers" in this.state) {
      const allocation: Record<string, number> = {};
      for (const area of RESOURCE_AREAS) {
        const select = this.root.querySelector<HTMLSelectElement>(
          `[data-alloc="${area}"]`
        );
        allocation[area] = Number(select?.value ?? 0);
      }
      this.state = applyResourceAllocation(
        this.state as ResourceAllocationState,
        allocation as ResourceAllocationState["multipliers"]
      );
      this.finishIfDone();
      this.callbacks.onAudio("choose");
      this.render(this.root);
      return;
    }
    if (action === "lg-assign" && "members" in this.state) {
      const memberId = target.dataset.member ?? "";
      const taskId = target.dataset.task ?? "";
      this.state = applyTeamAssignment(
        this.state as TeamManagementState,
        memberId,
        taskId
      );
      this.finishIfDone();
      this.callbacks.onAudio("choose");
      this.render(this.root);
      return;
    }
    if (action === "lg-crisis" && "trust" in this.state) {
      const optionIndex = Number(target.dataset.option);
      this.state = applyCrisisChoice(
        this.state as CrisisCommandState,
        optionIndex
      );
      this.finishIfDone();
      this.callbacks.onAudio("choose");
      this.render(this.root);
    }
  }

  handleAllocationChange(): void {
    const selects = Array.from(
      this.root.querySelectorAll<HTMLSelectElement>("[data-alloc]")
    );
    const total = selects.reduce(
      (sum, select) => sum + (Number(select.value) || 0),
      0
    );
    const totalElement = this.root.querySelector<HTMLElement>(
      "[data-alloc-total]"
    );
    if (totalElement) {
      totalElement.textContent = `${total} / 100`;
    }
    const button = this.root.querySelector<HTMLButtonElement>(
      "[data-action=lg-allocate]"
    );
    if (button) {
      button.disabled = total !== 100;
    }
  }

  private start(gameId: LeadershipGameId, mode: LeadershipGameMode): void {
    this.currentGameId = gameId;
    this.currentMode = mode;
    this.rewarded = false;
    if (gameId === "decision-chess") {
      this.state = createDecisionChess(mode);
    } else if (gameId === "game-theory") {
      this.state = createGameTheory(mode);
    } else if (gameId === "resource-allocation") {
      this.state = createResourceAllocation(mode);
    } else if (gameId === "team-management") {
      this.state = createTeamManagement(mode);
    } else {
      this.state = createCrisisCommand(mode);
    }
    this.callbacks.onAudio("ui");
    this.render(this.root);
  }

  private finishIfDone(): void {
    if (!this.state || !this.currentGameId || this.state.finished || this.rewarded) {
      return;
    }
    const won = this.isWon(this.state);
    const score = this.scoreOf(this.state);
    if (this.currentMode === "battle") {
      this.rewarded = true;
      this.callbacks.onReward(this.currentGameId, won, score);
      this.callbacks.onAudio(won ? "win" : "lose");
    }
  }

  private isWon(state: AnyGameState): boolean {
    if ("winner" in state) return state.winner === "player";
    if ("totalScore" in state) return state.totalScore >= 180;
    if ("score" in state && "members" in state) return state.score >= 60;
    if ("score" in state && "trust" in state) return state.score >= 20;
    return false;
  }

  private scoreOf(state: AnyGameState): number {
    if ("playerScore" in state) return state.playerScore;
    if ("totalScore" in state) return state.totalScore;
    return "score" in state ? state.score : 0;
  }

  private renderIndex(): string {
    const en = this.language === "en";
    return `
      <header class="topbar">
        <div class="brand">${en ? "Ascend" : "升维"}</div>
        <button class="link" data-action="lg-home">${en ? "Map" : "返回地图"}</button>
      </header>
      <main class="lg-shell" aria-label="${en ? "Leadership Game Center" : "领导力游戏中心"}">
        <section class="lg-hero">
          <p class="eyebrow">${en ? "Leadership Game Center" : "领导力游戏中心"}</p>
          <h1>${en ? "Five games, five leadership muscles" : "五个游戏，练五块领导力肌肉"}</h1>
          <p class="muted">${en ? "Each game has Teaching, Training, and Battle modes. Play to learn the logic behind leadership decisions." : "每个游戏都有教学、训练、对战三种模式。边玩边理解领导决策背后的逻辑。"}</p>
        </section>
        <section class="lg-grid">
          ${LEADERSHIP_GAMES.map(
            (game) => `
              <article class="lg-card">
                <p class="eyebrow">${esc(en ? game.en : game.zh)}</p>
                <h2>${esc(en ? game.en : game.zh)}</h2>
                <p>${esc(en ? game.enDesc : game.zhDesc)}</p>
                <blockquote>${esc(en ? game.insightEn : game.insightZh)}</blockquote>
                <div class="lg-modes">
                  <button data-action="lg-start" data-game="${game.id}" data-mode="teach">${en ? "Teach" : "教学"}</button>
                  <button data-action="lg-start" data-game="${game.id}" data-mode="train">${en ? "Train" : "训练"}</button>
                  <button class="primary" data-action="lg-start" data-game="${game.id}" data-mode="battle">${en ? "Battle" : "对战"}</button>
                </div>
              </article>
            `
          ).join("")}
        </section>
      </main>
    `;
  }

  private renderGame(): string {
    if (!this.state) return this.renderIndex();
    if (this.currentGameId === "decision-chess") {
      return this.renderDecisionChess(this.state as DecisionChessState);
    }
    if (this.currentGameId === "game-theory") {
      return this.renderGameTheory(this.state as GameTheoryState);
    }
    if (this.currentGameId === "resource-allocation") {
      return this.renderResourceAllocation(
        this.state as ResourceAllocationState
      );
    }
    if (this.currentGameId === "team-management") {
      return this.renderTeamManagement(this.state as TeamManagementState);
    }
    return this.renderCrisisCommand(this.state as CrisisCommandState);
  }

  private gameHeader(
    title: string,
    roundText: string,
    scoreText: string
  ): string {
    const en = this.language === "en";
    return `
      <header class="topbar">
        <div class="brand">${en ? "Ascend" : "升维"}</div>
        <button class="link" data-action="lg-back">${en ? "Games" : "游戏列表"}</button>
        <div class="topbar-meta"><span>${esc(roundText)}</span><span>${esc(scoreText)}</span></div>
      </header>
      <main class="lg-shell">
        <section class="lg-hero">
          <p class="eyebrow">${esc(title)}</p>
          <h1>${esc(title)}</h1>
        </section>
    `;
  }

  private renderDecisionChess(state: DecisionChessState): string {
    const en = this.language === "en";
    const moves = state.finished
      ? []
      : decisionChessMoves(state, state.player);
    const moveSet = new Set(moves.map((m) => `${m[0]},${m[1]}`));
    const cells = state.board
      .map((row, r) =>
        row
          .map((value, c) => {
            const isPlayer = state.player[0] === r && state.player[1] === c;
            const isAi = state.ai[0] === r && state.ai[1] === c;
            const isMove = moveSet.has(`${r},${c}`);
            const label = isPlayer
              ? en ? "You" : "你"
              : isAi
                ? "AI"
                : value === 0
                  ? ""
                  : value === 1
                    ? en ? "T" : "信"
                    : value === 2
                      ? en ? "I" : "影"
                      : en ? "R" : "资";
            const cls = `lg-cell ${isPlayer ? "player" : ""} ${isAi ? "ai" : ""} ${isMove ? "move" : ""} ${value > 0 ? "rich" : ""}`;
            return `
              <button class="${cls}" data-action="lg-move" data-row="${r}" data-col="${c}" ${isMove ? "" : "disabled aria-disabled=\"true\""}>
                ${esc(label)}
              </button>
            `;
          })
          .join("")
      )
      .join("");
    const result = state.finished
      ? `<section class="lg-result ${state.winner === "player" ? "win" : "lose"}">
          <h2>${en ? (state.winner === "player" ? "Victory" : state.winner === "ai" ? "Defeat" : "Draw") : state.winner === "player" ? "推演胜利" : state.winner === "ai" ? "推演失利" : "平局"}</h2>
          <p>${en ? `You ${state.playerScore} · AI ${state.aiScore}` : `你 ${state.playerScore} · AI ${state.aiScore}`}</p>
          <div class="lg-actions"><button class="primary" data-action="lg-again">${en ? "Again" : "再来一局"}</button><button data-action="lg-back">${en ? "Games" : "游戏列表"}</button></div>
        </section>`
      : "";
    return `
      ${this.gameHeader(
        en ? "Decision Chess" : "决策棋",
        `${en ? "Round" : "回合"} ${state.round}`,
        `${en ? "Score" : "得分"} ${state.playerScore}`
      )}
      <p class="lg-hint">${en ? "Move toward the goal at the top middle. Collect trust, influence, and resources on the way." : "向棋盘顶部中间的目标前进，沿途收集信任、影响力与组织资源。"}</p>
      ${result}
      <section class="lg-board">${cells}</section>
      </main>
    `;
  }

  private renderGameTheory(state: GameTheoryState): string {
    const en = this.language === "en";
    const last = state.lastPlayerChoice && state.lastAiChoice
      ? `<p class="lg-feedback">${en ? "Last round:" : "上一轮："} ${esc(state.lastPlayerChoice === "cooperate" ? (en ? "Cooperate" : "合作") : (en ? "Compete" : "竞争"))} vs ${esc(state.lastAiChoice === "cooperate" ? (en ? "Cooperate" : "合作") : (en ? "Compete" : "竞争"))}</p>`
      : "";
    const result = state.finished
      ? `<section class="lg-result ${state.winner === "player" ? "win" : "lose"}">
          <h2>${en ? (state.winner === "player" ? "Victory" : state.winner === "ai" ? "Defeat" : "Draw") : state.winner === "player" ? "博弈胜利" : state.winner === "ai" ? "博弈失利" : "平局"}</h2>
          <p>${en ? `You ${state.playerScore} · AI ${state.aiScore}` : `你 ${state.playerScore} · AI ${state.aiScore}`}</p>
          <div class="lg-actions"><button class="primary" data-action="lg-again">${en ? "Again" : "再来一局"}</button><button data-action="lg-back">${en ? "Games" : "游戏列表"}</button></div>
        </section>`
      : "";
    return `
      ${this.gameHeader(
        en ? "Game Theory" : "博弈推演",
        `${en ? "Round" : "回合"} ${state.round}`,
        `${en ? "Score" : "得分"} ${state.playerScore}`
      )}
      <p class="lg-hint">${en ? "Cooperate builds trust; competing can win once but invites retaliation." : "合作积累信任；竞争能赢一次，但会招来报复。"}</p>
      ${last}
      ${result}
      <section class="lg-choices">
        <button data-action="lg-choice" data-choice="cooperate">${en ? "Cooperate" : "合作"}</button>
        <button data-action="lg-choice" data-choice="compete">${en ? "Compete" : "竞争"}</button>
      </section>
      </main>
    `;
  }

  private renderResourceAllocation(state: ResourceAllocationState): string {
    const en = this.language === "en";
    const defaults: Record<ResourceArea, number> = {
      cashflow: 30,
      customer: 30,
      team: 20,
      innovation: 20
    };
    const selects = RESOURCE_AREAS.map(
      (area) => {
        const selectedValue = defaults[area];
        return `
        <label class="lg-field">
          <span>${esc(en ? RESOURCE_AREA_LABELS[area].en : RESOURCE_AREA_LABELS[area].zh)}</span>
          <select data-alloc="${area}">
            ${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
              .map(
                (value) =>
                  `<option value="${value}"${value === selectedValue ? " selected" : ""}>${value}</option>`
              )
              .join("")}
          </select>
        </label>
      `;
      }
    ).join("");
    const last = state.lastRound
      ? `<p class="lg-feedback">${en ? "Last round:" : "上一轮："} ${en ? "Score" : "得分"} ${state.lastRound.score}${state.lastRound.bonus ? ` · ${en ? "Balance bonus +15" : "均衡加成 +15"}` : ""}</p>`
      : "";
    const result = state.finished
      ? `<section class="lg-result win">
          <h2>${en ? "Round Complete" : "本轮完成"}</h2>
          <p>${en ? "Total score" : "总分"} ${state.totalScore}</p>
          <div class="lg-actions"><button class="primary" data-action="lg-again">${en ? "Again" : "再来一局"}</button><button data-action="lg-back">${en ? "Games" : "游戏列表"}</button></div>
        </section>`
      : "";
    return `
      ${this.gameHeader(
        en ? "Resource Allocation" : "资源分配",
        `${en ? "Round" : "回合"} ${state.round}`,
        `${en ? "Score" : "得分"} ${state.totalScore}`
      )}
      <p class="lg-hint">${en ? "Allocate exactly 100 points. Every area adds value; balanced coverage earns a bonus." : "四项合计必须等于 100。每项都有价值，均衡覆盖会获得加成。"}</p>
      <p class="lg-feedback" data-alloc-total aria-live="polite">${en ? "Total 100 / 100" : "合计 100 / 100"}</p>
      ${last}
      ${result}
      <section class="lg-form">${selects}<button data-action="lg-allocate">${en ? "Commit Allocation" : "确认分配"}</button></section>
      </main>
    `;
  }

  private renderTeamManagement(state: TeamManagementState): string {
    const en = this.language === "en";
    const task = state.tasks[state.round - 1];
    const taskMarkup = task
      ? `<section class="lg-task">
          <h2>${esc(en ? task.en : task.zh)}</h2>
          <p class="muted">${en ? "Required skill" : "所需能力"}: ${esc(task.skill)} · ${en ? "Level" : "等级"} ${task.required}</p>
        </section>`
      : "";
    const members = state.members
      .map(
        (member) => `
          <button class="lg-member" data-action="lg-assign" data-member="${member.id}" data-task="${task?.id ?? ""}" ${member.energy <= 0 || !task ? "disabled aria-disabled=\"true\"" : ""}>
            <strong>${esc(en ? member.en : member.zh)}</strong>
            <span>${esc(member.skill)} · ${en ? "Energy" : "精力"} ${member.energy}</span>
          </button>
        `
      )
      .join("");
    const last = state.lastRound
      ? `<p class="lg-feedback">${en ? "Last match" : "上次匹配"} ${state.lastRound.quality}/3 · +${state.lastRound.gained}</p>`
      : "";
    const result = state.finished
      ? `<section class="lg-result win"><h2>${en ? "Round Complete" : "本轮完成"}</h2><p>${en ? "Score" : "得分"} ${state.score}</p><div class="lg-actions"><button class="primary" data-action="lg-again">${en ? "Again" : "再来一局"}</button><button data-action="lg-back">${en ? "Games" : "游戏列表"}</button></div></section>`
      : "";
    return `
      ${this.gameHeader(
        en ? "Team Management" : "团队管理",
        `${en ? "Round" : "回合"} ${state.round}`,
        `${en ? "Score" : "得分"} ${state.score}`
      )}
      <p class="lg-hint">${en ? "Assign the best member to the current task. Matching skill earns more." : "为当前任务选择最合适的成员。能力匹配会获得更高得分。"}</p>
      ${taskMarkup}
      ${last}
      ${result}
      <section class="lg-team">${members}</section>
      </main>
    `;
  }

  private renderCrisisCommand(state: CrisisCommandState): string {
    const en = this.language === "en";
    const event = CRISIS_EVENTS[state.round - 1];
    if (!event) return this.renderIndex();
    const options = event.options
      .map(
        (option, index) => `
          <button class="lg-option" data-action="lg-crisis" data-option="${index}">
            <strong>${esc(en ? option.en : option.zh)}</strong>
            <span>${esc(en ? option.summaryEn : option.summaryZh)}</span>
          </button>
        `
      )
      .join("");
    const last = state.lastRound
      ? `<p class="lg-feedback">${esc(en ? event.options[state.lastRound.optionIndex].feedbackEn : event.options[state.lastRound.optionIndex].feedbackZh)}</p>`
      : "";
    const result = state.finished
      ? `<section class="lg-result win"><h2>${en ? "Round Complete" : "本轮完成"}</h2><p>${en ? "Score" : "得分"} ${state.score}</p><div class="lg-actions"><button class="primary" data-action="lg-again">${en ? "Again" : "再来一局"}</button><button data-action="lg-back">${en ? "Games" : "游戏列表"}</button></div></section>`
      : "";
    return `
      ${this.gameHeader(
        en ? "Crisis Command" : "危机指挥",
        `${en ? "Event" : "事件"} ${state.round}`,
        `${en ? "Score" : "得分"} ${state.score}`
      )}
      <section class="lg-crisis-scene">
        <h2>${esc(en ? event.titleEn : event.titleZh)}</h2>
        <p>${esc(en ? event.sceneEn : event.sceneZh)}</p>
        <blockquote>${esc(en ? event.insightEn : event.insightZh)}</blockquote>
      </section>
      ${last}
      ${result}
      <section class="lg-options">${options}</section>
      </main>
    `;
  }
}
