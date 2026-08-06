import {
  ABILITIES,
  ABILITY_ORDER,
  ROLES,
  RESOURCE_NAMES,
  abilityLevel,
  rankForTotal,
  totalAbilityLevels
} from "../core/abilities";
import {
  ACHIEVEMENTS,
  isAchievementUnlocked,
  unlockedCount
} from "../core/achievements";
import {
  DuelEngine,
  duelSeed,
  recommendedTraining
} from "../core/duel";
import {
  activateProfile,
  applyStoryChoice,
  buildAiProfile,
  buildDuelProfile,
  chapterStarCount,
  createProfile,
  decisionProfile,
  importSaveJson,
  isChapterComplete,
  isNodeComplete,
  loadSave,
  optionQualityLabel,
  profileSummary,
  recordDuelResult,
  resetSave,
  saveState
} from "../core/game";
import {
  CHAPTERS,
  CHAPTER_REFLECTIONS,
  NODE_INTEL,
  RANDOM_EVENT_IDS,
  nextRandomEvent,
  SIDE_QUEST_ARCS,
  getChapter,
  getNode,
  getNodeForRole,
  sideNodesForChapter
} from "../core/story";
import type {
  AbilityId,
  ChapterDef,
  ChoiceOutcome,
  OptionQuality,
  PlayerProfile,
  ResourceKey,
  RoleId,
  SaveState,
  StoryNode,
  StoryOption
} from "../core/types";
import { ManualRtcPeer, type RtcMessage } from "../net/rtc";
import { RoomClient, type RoomServerMessage } from "../net/roomClient";
import { GameAudio } from "../audio";
import {
  ASSESSMENT_QUESTIONS,
  certificationLevel
} from "../core/assessment";
import { NPCS, npcRelation } from "../core/npcs";
import { dailyChallenges } from "../core/challenges";
import { ROLE_OPTION_SETS } from "../core/roleOptions";
import { uiString, type Language } from "../core/i18n";
import { renderAbilityRadar } from "./charts";
import { renderPowerBoard } from "./art";

type View =
  | "menu"
  | "profile"
  | "assessment"
  | "assessmentResult"
  | "achievements"
  | "relations"
  | "map"
  | "story"
  | "chapterTransition"
  | "ability"
  | "report"
  | "duelLobby"
  | "duel";

type DuelMode = "ai" | "local" | "remote";

export class AdaptiveGameApp {
  private root: HTMLElement;
  private audio = new GameAudio();
  private muted = localStorage.getItem("adaptive-ascent-muted") === "1";
  private language: Language =
    localStorage.getItem("adaptive-ascent-lang") === "en" ? "en" : "zh";
  private save: SaveState;
  private view: View = "menu";
  private pendingRole: RoleId = "highPotential";
  private pendingProfile?: PlayerProfile;
  private assessmentStep = 0;
  private assessmentAnswers: number[] = [];
  private selectedChapter = 1;
  private storyNodeId?: string;
  private storyHintRevealed = false;
  private pendingBranchNodeId?: string;
  private pendingChapterTransition?: number;
  private lastOutcome?: ChoiceOutcome;
  private lastOutcomeNodeId?: string;
  private duelMode: DuelMode = "ai";
  private duelRounds = 3;
  private duelEngine?: DuelEngine;
  private hotSeatTurn: 0 | 1 = 0;
  private localPassed = false;
  private remotePeer?: ManualRtcPeer;
  private remotePlayerIndex: 0 | 1 = 0;
  private remoteOpponentName = "等待对手";
  private remoteOpponentReady = false;
  private remoteOpponentAbilities: Record<AbilityId, number> = {
    insight: 2,
    deploy: 2,
    mobilize: 2,
    strategy: 2,
    authority: 2,
    stability: 2,
    recovery: 2,
    execution: 2,
    structure: 2,
    communication: 2
  };
  private remoteOpponentResources = {
    energy: 75,
    trust: 55,
    influence: 45,
    capital: 40
  } as Record<ResourceKey, number>;
  private remoteInviteCode = "";
  private remoteAnswerCode = "";
  private remoteStatus = "尚未建立连接";
  private duelRecorded = false;
  private roomClient?: RoomClient;
  private cloudToken = localStorage.getItem("adaptive-ascent-cloud-token") || "";
  private cloudStatus = "未连接云端";
  private cloudEntries: Array<{ name: string; role: string; score: number }> = [];
  private pendingCloudAction: "sync" | "load" | "match" = "sync";
  private usingCloudMatch = false;
  private cloudConflict = false;
  private cloudRemoteSave?: SaveState;

  constructor(root: HTMLElement) {
    this.root = root;
    document.documentElement.lang = this.language;
    this.audio.setMuted(this.muted);
    this.save = loadSave();
    this.restoreFromHash();
    this.root.addEventListener("click", (event) => this.handleClick(event));
    this.root.addEventListener("submit", (event) => this.handleSubmit(event));
    this.root.addEventListener("change", (event) => this.handleChange(event));
    this.show("menu");
  }

  private restoreFromHash(): void {
    const match = location.hash.match(/^#save=(.+)$/);
    if (!match) {
      return;
    }
    try {
      const encoded = match[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = encoded.padEnd(
        encoded.length + ((4 - (encoded.length % 4)) % 4),
        "="
      );
      const json = decodeURIComponent(atob(padded));
      this.save = importSaveJson(json);
      history.replaceState(null, "", location.pathname);
    } catch {
      history.replaceState(null, "", location.pathname);
    }
  }

  show(view: View): void {
    this.view = view;
    this.render();
  }

  private t(key: Parameters<typeof uiString>[1]): string {
    return uiString(this.language, key);
  }

  private render(): void {
    switch (this.view) {
      case "menu":
        this.renderMenu();
        break;
      case "profile":
        this.renderProfile();
        break;
      case "assessment":
        this.renderAssessment();
        break;
      case "assessmentResult":
        this.renderAssessmentResult();
        break;
      case "achievements":
        this.renderAchievements();
        break;
      case "relations":
        this.renderRelations();
        break;
      case "map":
        this.renderMap();
        break;
      case "story":
        this.renderStory();
        break;
      case "chapterTransition":
        this.renderChapterTransition();
        break;
      case "ability":
        this.renderAbility();
        break;
      case "report":
        this.renderReport();
        break;
      case "duelLobby":
        this.renderDuelLobby();
        break;
      case "duel":
        this.renderDuel();
        break;
    }
  }

  private renderMenu(): void {
    const summary = profileSummary(this.save);
    const started = this.save.profileCreated;
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">${this.t("brand")}</div>
        <button class="link sound-toggle" data-action="toggle-sound">${this.muted ? this.t("soundOff") : this.t("soundOn")}</button>
        <button class="link language-toggle" data-action="toggle-language">${this.t("language")}</button>
        <div class="topbar-meta">
          <span>${started ? this.save.profile.name : "未建档"}</span>
          <span>${summary.rank.name}</span>
        </div>
      </header>
      <main class="menu-shell">
        <section class="hero-strip">
          <div class="hero-copy">
            <p class="eyebrow">自适应领导力情境游戏</p>
            <h1>${started ? this.t("menuContinue") : this.t("menuTitle")}</h1>
            <p>基于《权经》九章架构、Heifetz 自适应领导力与情境高尔夫方法，通过主线剧情、支线任务和 1v1 对决，训练识人、用人、驭人、谋权、掌权、固权与自我进化能力。</p>
            <div class="hero-actions">
              <button class="primary" data-action="${started ? "open-map" : "open-profile"}">${started ? this.t("menuContinue") : this.t("createProfile")}</button>
              <button data-action="open-duel">${this.t("enterDuel")}</button>
            </div>
          </div>
          <div class="rank-panel">
            <span class="rank-name">${summary.rank.name}</span>
            <strong>${summary.total}</strong>
            <span class="rank-caption">综合能力值</span>
            <div class="rank-meter"><i style="width:${Math.min(100, (summary.total / 60) * 100)}%"></i></div>
            <p>已通关 ${summary.chapterCount} / 9 章</p>
          </div>
        </section>
        <section class="scene-art">
          <canvas class="power-board" id="power-board" aria-label="权力关系沙盘示意图"></canvas>
          <div class="scene-caption">
            <strong>权力关系沙盘</strong>
            <span>每一次选择，都在重新绘制你与关键人物之间的连接。</span>
          </div>
        </section>
        <section class="menu-grid">
          <button class="menu-card" data-action="open-map">
            <span class="card-index">01</span>
            <h2>${this.t("mainQuest")}</h2>
            <p>九章权力架构，18 个真实职场情境，每一次选择都在改变你的能力图谱。</p>
          </button>
          <button class="menu-card" data-action="open-duel">
            <span class="card-index">02</span>
            <h2>${this.t("duel")}</h2>
            <p>AI 陪练、本地双人或远程对战，用情境高尔夫基准判断谁更能应对复杂局势。</p>
          </button>
          <button class="menu-card" data-action="open-ability">
            <span class="card-index">03</span>
            <h2>${this.t("ability")}</h2>
            <p>十项能力、五级段位、经典理论支撑，随时查看你的优势、短板和成长路径。</p>
          </button>
          <button class="menu-card" data-action="open-report">
            <span class="card-index">04</span>
            <h2>${this.t("report")}</h2>
            <p>从游戏表现反推训练建议，把决策反馈迁移回真实工作。</p>
          </button>
          <button class="menu-card" data-action="open-achievements">
            <span class="card-index">05</span>
            <h2>${this.t("achievements")}</h2>
            <p>追踪章节、支线、测评、1v1 与能力段位的完成进度。</p>
          </button>
          <button class="menu-card" data-action="open-relations">
            <span class="card-index">06</span>
            <h2>${this.t("relations")}</h2>
            <p>查看主线与支线中结识的关键人物，以及关系是否已经转化为组织能力。</p>
          </button>
        </section>
      </main>
    `;
    const powerBoard = this.root.querySelector<HTMLCanvasElement>("#power-board");
    if (powerBoard) {
      renderPowerBoard(powerBoard, this.save.playCount + 7);
    }
  }

  private renderProfile(): void {
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
      </header>
      <main class="narrow-shell">
        <section class="panel profile-panel">
          <p class="eyebrow">建立领导力档案</p>
          <h1>选择你的初始身份</h1>
          <p class="muted">身份决定起点资源与初始能力，不决定最终上限。</p>
          <form class="profile-form" data-form="profile">
            <label class="field">
              <span>你的名字</span>
              <input name="playerName" maxlength="12" placeholder="例如：林远" value="${escapeAttr(this.save.profile.name === "你" ? "" : this.save.profile.name)}" />
            </label>
            <div class="role-grid">
              ${(Object.values(ROLES) as Array<(typeof ROLES)[RoleId]>)
                .map(
                  (role) => `
                    <button type="button" class="role-card ${this.pendingRole === role.id ? "selected" : ""}" data-action="select-role" data-role="${role.id}">
                      <span class="role-name">${role.name}</span>
                      <span class="role-desc">${role.description}</span>
                      <span class="role-start">起点：${role.startingResources.energy} 精力 / ${role.startingResources.trust} 信任</span>
                    </button>
                  `
                )
                .join("")}
            </div>
            <button class="primary" data-action="create-profile">开启征程</button>
          </form>
        </section>
      </main>
    `;
  }

  private renderAssessment(): void {
    if (!this.pendingProfile) {
      this.show("profile");
      return;
    }
    const question = ASSESSMENT_QUESTIONS[this.assessmentStep];
    const selected = this.assessmentAnswers[this.assessmentStep];
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-profile">返回建档</button>
        <button class="link sound-toggle" data-action="toggle-sound">${this.muted ? "声音：关" : "声音：开"}</button>
      </header>
      <main class="assessment-shell">
        <section class="assessment-panel">
          <div class="assessment-progress">
            <span>能力基线测评</span>
            <small>${this.assessmentStep + 1} / ${ASSESSMENT_QUESTIONS.length}</small>
          </div>
          <div class="assessment-bar"><i style="width:${((this.assessmentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100}%"></i></div>
          <h1>${escapeHtml(question.prompt)}</h1>
          <p class="muted">${ABILITIES[question.abilityId].name} · ${ABILITIES[question.abilityId].tagline}</p>
          <div class="assessment-art">
            <canvas id="assessment-art" aria-label="能力基线图"></canvas>
          </div>
          <div class="assessment-options">
            ${question.options
              .map(
                (option, index) => `
                  <button class="assessment-option ${selected === index ? "selected" : ""}" data-action="assessment-option" data-option="${index}">
                    ${escapeHtml(option.label)}
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="assessment-actions">
            <button data-action="assessment-prev" ${this.assessmentStep === 0 ? "disabled" : ""}>上一题</button>
            ${
              this.assessmentStep === ASSESSMENT_QUESTIONS.length - 1
                ? `<button class="primary" data-action="assessment-submit">生成能力档案</button>`
                : `<button class="primary" data-action="assessment-next">下一题</button>`
            }
            <button class="link" data-action="assessment-skip">跳过测评</button>
          </div>
        </section>
      </main>
    `;
    const assessmentArt =
      this.root.querySelector<HTMLCanvasElement>("#assessment-art");
    if (assessmentArt) {
      renderPowerBoard(
        assessmentArt,
        this.assessmentStep * 17 + 3,
        "能力基线图",
        `${ROLES[this.pendingProfile.role].shortName} · 十项能力倾向`
      );
    }
  }

  private renderAssessmentResult(): void {
    const summary = profileSummary(this.save);
    const cert = certificationLevel(this.save);
    const training = recommendedTraining(
      this.save.profile.abilities,
      this.save.profile.role
    );
    const strengths = ABILITY_ORDER.slice()
      .sort(
        (a, b) =>
          abilityLevel(this.save.profile.abilities[b]) -
          abilityLevel(this.save.profile.abilities[a])
      )
      .slice(0, 3);
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link sound-toggle" data-action="toggle-sound">${this.muted ? "声音：关" : "声音：开"}</button>
      </header>
      <main class="assessment-result-shell">
        <section class="assessment-result-hero">
          <div>
            <p class="eyebrow">能力基线报告</p>
            <h1>${ROLES[this.save.profile.role].name} · ${summary.rank.name}</h1>
            <p class="muted">综合能力值 ${summary.total}，角色重点与测评倾向已经写入初始档案。</p>
          </div>
          <canvas class="radar" id="assessment-result-radar"></canvas>
        </section>
        <section class="result-columns">
          <div class="report-panel">
            <h2>优势能力</h2>
            ${strengths
              .map(
                (id) => `
                  <div class="strength-row">
                    <span style="--dot:${ABILITIES[id].color}"></span>
                    <strong>${ABILITIES[id].name} Lv.${abilityLevel(this.save.profile.abilities[id])}</strong>
                    <small>${ABILITIES[id].tagline}</small>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="report-panel">
            <h2>建议训练</h2>
            ${training
              .map(
                (id) => `
                  <div class="training-item compact">
                    <span style="--dot:${ABILITIES[id].color}"></span>
                    <strong>${ABILITIES[id].name}</strong>
                    <p>${ABILITIES[id].trainingPath}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
        <section class="baseline-detail">
          <h2>能力基线明细</h2>
          <div class="baseline-list">
            ${ABILITY_ORDER.map((id) => {
              const level = abilityLevel(this.save.profile.abilities[id]);
              const grade = level >= 3 ? "A" : level === 2 ? "B" : "C";
              return `
                <div class="baseline-row">
                  <span style="--dot:${ABILITIES[id].color}"></span>
                  <strong>${ABILITIES[id].name}</strong>
                  <em>Lv.${level}</em>
                  <small>${grade} 级</small>
                </div>
              `;
            }).join("")}
          </div>
          <p class="cert-note">
            认证状态：${cert.level}（${cert.score} / 60）${cert.next}
          </p>
        </section>
        <section class="role-start-panel">
          <h2>本角色开局建议</h2>
          <p>${ROLES[this.save.profile.role].objective}</p>
          <button class="primary" data-action="start-campaign">进入主线</button>
        </section>
      </main>
    `;
    const radar =
      this.root.querySelector<HTMLCanvasElement>("#assessment-result-radar");
    if (radar) {
      renderAbilityRadar(radar, this.save.profile.abilities);
    }
  }

  private renderAchievements(): void {
    const unlocked = unlockedCount(this.save);
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
      </header>
      <main class="achievement-shell">
        <section class="achievement-hero">
          <div>
            <p class="eyebrow">成就墙</p>
            <h1>${unlocked} / ${ACHIEVEMENTS.length} 已解锁</h1>
            <p class="muted">完成章节、支线、测评、1v1 与能力段位，解锁全部成就。</p>
          </div>
          <div class="achievement-progress"><i style="width:${(unlocked / ACHIEVEMENTS.length) * 100}%"></i></div>
        </section>
        <section class="achievement-grid">
          ${ACHIEVEMENTS.map((achievement) => {
            const done = isAchievementUnlocked(this.save, achievement.id);
            return `
              <div class="achievement-card ${done ? "unlocked" : "locked"}">
                <span class="achievement-icon">${achievement.icon}</span>
                <div>
                  <h2>${achievement.name}</h2>
                  <p>${achievement.description}</p>
                </div>
                <small>${done ? "已解锁" : "未解锁"}</small>
              </div>
            `;
          }).join("")}
        </section>
      </main>
    `;
  }

  private renderRelations(): void {
    const related = NPCS.filter(
      (npc) => npcRelation(this.save, npc).status !== "尚未接触"
    ).length;
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
      </header>
      <main class="relation-shell">
        <section class="relation-hero">
          <div>
            <p class="eyebrow">人物关系图</p>
            <h1>${related} / ${NPCS.length} 人已进入你的关系网络</h1>
            <p class="muted">支线中真正面对过的 NPC，会从线索变成可延续的组织关系。</p>
          </div>
        </section>
        <section class="relation-grid">
          ${NPCS.map((npc) => {
            const relation = npcRelation(this.save, npc);
            return `
              <div class="npc-card ${relation.status === "已建立关系" ? "trusted" : relation.status === "存在线索" ? "known" : "hidden"}">
                <span class="npc-avatar">${npc.name.slice(0, 1)}</span>
                <div>
                  <h2>${npc.name}</h2>
                  <small>${npc.title}</small>
                  <p>${npc.description}</p>
                </div>
                <span class="npc-status">${relation.status}</span>
                <em>${relation.note}</em>
              </div>
            `;
          }).join("")}
        </section>
      </main>
    `;
  }

  private renderMap(): void {
    const summary = profileSummary(this.save);
    const chapter = getChapter(this.selectedChapter);
    const mainNodes = chapter.nodeIds.map(getNode);
    const chapterDone = isChapterComplete(this.save, chapter.id);
    const availableRandom = nextRandomEvent(this.save);
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
        <div class="topbar-meta">
          <span>${this.save.profile.name}</span>
          <span>${summary.rank.name}</span>
        </div>
      </header>
      <main class="map-shell">
        <section class="map-head">
          <div>
            <p class="eyebrow">主线征途</p>
            <h1>九章权力架构</h1>
            <p class="muted">通关章节解锁下一章。支线任务不会解锁章节，但会补充精力和信任。</p>
          </div>
          <div class="resource-strip">
            ${this.resourceChips(this.save.profile)}
          </div>
        </section>
        <section class="chapter-track">
          ${CHAPTERS.map((item) => this.chapterBadge(item)).join("")}
        </section>
        <section class="map-body">
          <div class="chapter-detail">
            <div class="chapter-title">
              <span class="chapter-code">第 ${chapter.code} 章</span>
              <h2>${chapter.title}</h2>
              <p>${chapter.subtitle}</p>
            </div>
            <div class="node-list">
              ${mainNodes.map((node) => this.nodeRow(node)).join("")}
            </div>
            ${
              chapterDone
                ? `
                  <section class="chapter-reflection">
                    <h3>本章复盘</h3>
                    <p>${escapeHtml(CHAPTER_REFLECTIONS[chapter.id] ?? "")}</p>
                  </section>
                `
                : ""
            }
            <section class="quest-board">
              <h3>支线剧情弧</h3>
              <p class="muted">支线需要连续完成前置节点，才能解锁下一段情节。</p>
              ${SIDE_QUEST_ARCS.map((arc) => this.questArcMarkup(arc)).join("")}
            </section>
          </div>
          <aside class="map-side">
            <div class="mini-panel role-objective">
              <h3>本角色目标</h3>
              <p>${ROLES[this.save.profile.role].objective}</p>
            </div>
            <div class="challenge-panel">
              <h3>当日行动任务</h3>
              ${dailyChallenges(this.save)
                .map(
                  (challenge) => `
                    <div class="challenge-row ${challenge.done ? "done" : ""}">
                      <div>
                        <strong>${escapeHtml(challenge.title)}</strong>
                        <span>${challenge.current} / ${challenge.target}</span>
                        <p>${escapeHtml(challenge.description)}</p>
                      </div>
                      ${
                        challenge.done && !this.save.claimedChallenges.includes(challenge.id)
                          ? `<button data-action="claim-challenge" data-challenge="${challenge.id}">领取 +${challenge.reward}</button>`
                          : this.save.claimedChallenges.includes(challenge.id)
                            ? `<small>已领取</small>`
                            : `<small>进行中</small>`
                      }
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="random-event-panel">
              <h3>随机事件</h3>
              ${
                availableRandom
                  ? `
                    <p>今天出现了一个意料之外的情境，可能影响团队对你的判断。</p>
                    <button data-action="open-node" data-node="${availableRandom}">处理随机事件</button>
                  `
                  : "<p class=\"muted\">你已处理完当前随机事件。</p>"
              }
            </div>
            <div class="mini-panel">
              <h3>当前进度</h3>
              <strong>${summary.chapterCount} / 9</strong>
              <p>综合能力值 ${summary.total}</p>
            </div>
            <div class="mini-panel">
              <h3>已解锁</h3>
              <p>${this.save.unlockedChapters.map((id) => getChapter(id).title).join("、")}</p>
            </div>
            <button class="primary" data-action="open-report">查看复盘报告</button>
            <button data-action="open-duel">进入 1v1</button>
            <button data-action="open-ability">能力图谱</button>
          </aside>
        </section>
      </main>
    `;
  }

  private renderStory(): void {
    if (!this.storyNodeId) {
      this.show("map");
      return;
    }
    const node = getNodeForRole(this.save.profile.role, this.storyNodeId);
    const chapter = getChapter(node.chapterId);
    const showingOutcome = this.lastOutcomeNodeId === node.id && this.lastOutcome;
    const showOnboarding = this.save.playCount === 0 && !showingOutcome;
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <div class="topbar-meta">${this.resourceChips(this.save.profile)}</div>
      </header>
      <main class="story-shell">
        <button class="link back-link" data-action="open-map">返回主线地图</button>
        <section class="story-art">
          <canvas id="story-art" aria-label="当前情境的局势示意图"></canvas>
        </section>
        <section class="story-layout">
          <section class="story-narrative">
            <section class="scenario-panel">
              <div class="scenario-meta">
                <span>第 ${chapter.code} 章 · ${chapter.title}</span>
                <span>${node.kind === "side" ? "支线任务" : node.kind === "branch" ? "角色分岔" : node.kind === "random" ? "随机事件" : "主线情境"}</span>
              </div>
              <h1>${node.title}</h1>
              ${
                showOnboarding
                  ? `
                    <div class="onboarding-tip">
                      <strong>首局引导</strong>
                      <p>1. 先看情报线索，再判断关键关系。</p>
                      <p>2. 每个选择都有专家基准，但好选择不一定是最冒险的。</p>
                      <p>3. 选择会影响能力、资源、NPC 关系与最终结局。</p>
                    </div>
                  `
                  : ""
              }
              <div class="role-lens">
                <strong>${ROLES[this.save.profile.role].name}视角</strong>
                <p>${escapeHtml(ROLES[this.save.profile.role].lens)}</p>
              </div>
              <p class="scenario-context">${escapeHtml(node.context)}</p>
              <div class="stake">
                <strong>当前考验</strong>
                <p>${escapeHtml(node.stake)}</p>
              </div>
            </section>
          </section>
          <aside class="story-side">
            <section class="intel-panel">
              <div class="intel-head">
                <span>情报线索</span>
                <small>先看线索，再做判断</small>
              </div>
              <div class="intel-list">
                ${(NODE_INTEL[node.id] ?? []).map((clue) => `<p>${escapeHtml(clue)}</p>`).join("")}
              </div>
            </section>
            <section class="decision-panel">
              ${
                showingOutcome && this.lastOutcome
                  ? this.outcomeMarkup(this.lastOutcome)
                  : `
                    <div class="hint-controls">
                      <button data-action="toggle-hint">${this.storyHintRevealed ? "收起教练提示" : "查看教练提示"}</button>
                      ${
                        this.storyHintRevealed
                          ? `<p class="coach-hint">${escapeHtml(this.adaptiveHint(node))}</p>`
                          : ""
                      }
                    </div>
                    <div class="option-list">
                      ${node.options
                        .map(
                          (option, index) => `
                            <button class="option-card" data-action="choose-option" data-option="${index}">
                              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                              <span class="option-body">
                                <strong>${escapeHtml(option.label)}</strong>
                                <em>${escapeHtml(option.summary)}</em>
                                <small class="role-move">${this.roleMove(option.quality)}</small>
                              </span>
                            </button>
                          `
                        )
                        .join("")}
                    </div>
                  `
              }
            </section>
          </aside>
        </section>
      </main>
    `;
    const storyArt = this.root.querySelector<HTMLCanvasElement>("#story-art");
    if (storyArt) {
      renderPowerBoard(storyArt, node.id.length * 11 + node.chapterId * 13);
    }
  }

  private renderChapterTransition(): void {
    if (!this.pendingChapterTransition) {
      this.show("map");
      return;
    }
    const chapter = getChapter(this.pendingChapterTransition);
    const next = chapter.id < CHAPTERS.length ? CHAPTERS[chapter.id] : undefined;
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">${this.t("brand")}</div>
        <button class="link sound-toggle" data-action="toggle-sound">${this.muted ? this.t("soundOff") : this.t("soundOn")}</button>
        <button class="link language-toggle" data-action="toggle-language">${this.t("language")}</button>
      </header>
      <main class="transition-shell">
        <section class="transition-panel">
          <p class="eyebrow">第 ${chapter.code} 章完成</p>
          <h1>${chapter.title}</h1>
          <p class="transition-summary">${escapeHtml(CHAPTER_REFLECTIONS[chapter.id] ?? "")}</p>
          ${
            next
              ? `
                <div class="next-chapter">
                  <span>下一章</span>
                  <strong>第 ${next.code} 章 · ${next.title}</strong>
                  <p>${next.subtitle}</p>
                </div>
              `
              : `
                <div class="next-chapter">
                  <span>主线完成</span>
                  <strong>九章权力架构已全部走完</strong>
                  <p>查看复盘报告与角色结局。</p>
                </div>
              `
          }
          <button class="primary" data-action="continue-transition-map">继续主线</button>
        </section>
      </main>
    `;
  }

  private renderAbility(): void {
    const summary = profileSummary(this.save);
    const training = recommendedTraining(
      this.save.profile.abilities,
      this.save.profile.role
    );
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
      </header>
      <main class="ability-shell">
        <section class="ability-head">
          <div>
            <p class="eyebrow">能力图谱</p>
            <h1>${summary.rank.name}</h1>
            <p class="muted">综合能力值 ${summary.total}，下一段位需要 ${this.nextRankNeed(summary.total)} 点。</p>
            <div class="role-focus">
              <strong>${ROLES[this.save.profile.role].name}重点</strong>
              <div>
                ${ROLES[this.save.profile.role].focusAbilities
                  .map(
                    (id) => `
                      <span style="--dot:${ABILITIES[id].color}">${ABILITIES[id].name}</span>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </div>
          <canvas class="radar" id="ability-radar"></canvas>
          <button class="primary" data-action="open-report">查看复盘报告</button>
        </section>
        <section class="ability-grid">
          ${ABILITY_ORDER.map((id) => this.abilityCard(id)).join("")}
        </section>
        <section class="training-panel">
          <h2>建议训练方向</h2>
          <div class="training-list">
            ${training
              .map(
                (id) => `
                  <div class="training-item">
                    <span style="--dot:${ABILITIES[id].color}"></span>
                    <strong>${ABILITIES[id].name}</strong>
                    <p>${ABILITIES[id].tagline}</p>
                    <small>${ABILITIES[id].trainingPath}</small>
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
      </main>
    `;
    const canvas = this.root.querySelector<HTMLCanvasElement>("#ability-radar");
    if (canvas) {
      renderAbilityRadar(canvas, this.save.profile.abilities);
    }
  }

  private renderReport(): void {
    const summary = profileSummary(this.save);
    const decision = decisionProfile(this.save);
    const cert = certificationLevel(this.save);
    const strengths = ABILITY_ORDER.filter(
      (id) => abilityLevel(this.save.profile.abilities[id]) >= 4
    );
    const gaps = recommendedTraining(
      this.save.profile.abilities,
      this.save.profile.role
    );
    const chapterReports = CHAPTERS.map((chapter) => {
      const record = this.save.chapterRecords.find(
        (item) => item.chapterId === chapter.id
      );
      return {
        chapter,
        stars: record ? chapterStarCount(record.stars) : 0,
        done: Boolean(record && record.completedNodeIds.length >= 2)
      };
    });
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
        <button class="link sound-toggle" data-action="toggle-sound">${this.muted ? "声音：关" : "声音：开"}</button>
      </header>
      <main class="report-shell">
        <section class="report-hero">
          <div>
            <p class="eyebrow">复盘报告</p>
            <h1>${this.save.profile.name} 的领导力轨迹</h1>
            <p class="muted">段位：${summary.rank.name} · 综合能力值：${summary.total} · 主线 ${summary.chapterCount}/9</p>
          </div>
          <div class="duel-stats">
            <span><strong>${this.save.duelWins}</strong> 胜</span>
            <span><strong>${this.save.duelLosses}</strong> 负</span>
            <span><strong>${this.save.masteryPoints}</strong> 修炼点</span>
          </div>
          <div class="identity-badge">
            <span>决策画像</span>
            <strong>${ROLES[this.save.profile.role].shortName} · ${decision.identity}</strong>
          </div>
          <div class="certification-badge ${cert.passed ? "passed" : ""}">
            <span>能力认证</span>
            <strong>${cert.passed ? `认证通过 · ${cert.level}` : `未认证 · ${cert.next}`}</strong>
          </div>
          <button data-action="reset-profile">重置档案</button>
          <button data-action="export-save">导出存档</button>
          <button data-action="export-report">导出报告</button>
          <button data-action="copy-save-link">复制存档链接</button>
          <button data-action="cloud-sync">云端同步</button>
          <button data-action="cloud-load">云端载入</button>
          <button data-action="cloud-leaderboard">云端排行</button>
          <span class="cloud-status" role="status" aria-live="polite">${this.cloudStatus}</span>
          ${
            this.cloudConflict
              ? `
                <div class="cloud-conflict">
                  <p>检测到本地与云端进度不一致，请选择保留哪一份。</p>
                  <button data-action="cloud-use-remote">使用云端存档</button>
                  <button data-action="cloud-force-local">仍要上传本地</button>
                </div>
              `
              : ""
          }
          <label class="file-button">
            导入存档
            <input type="file" data-import-save accept="application/json" hidden />
          </label>
        </section>
        <section class="stat-tiles">
          <div class="stat-tile">
            <strong>${decision.counts.expert}</strong>
            <span>专家级决策</span>
          </div>
          <div class="stat-tile">
            <strong>${decision.counts.partial}</strong>
            <span>部分有效</span>
          </div>
          <div class="stat-tile">
            <strong>${decision.counts.risk}</strong>
            <span>高风险应对</span>
          </div>
          <div class="stat-tile">
            <strong>${decision.totalScore}</strong>
            <span>决策总分</span>
          </div>
          <div class="stat-tile">
            <strong>${this.save.completedRandomEvents.length}</strong>
            <span>随机事件</span>
          </div>
        </section>
        ${
          this.cloudEntries.length
            ? `
              <section class="cloud-leaderboard">
                <h2>云端排行榜</h2>
                <div class="cloud-leaderboard-list">
                  ${this.cloudEntries
                    .slice(0, 10)
                    .map(
                      (entry, index) => `
                        <div class="cloud-rank-row">
                          <span>${index + 1}</span>
                          <strong>${escapeHtml(entry.name)}</strong>
                          <em>${ROLES[entry.role as RoleId]?.shortName ?? entry.role}</em>
                          <small>${entry.score}</small>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              </section>
            `
            : ""
        }
        <section class="duel-history">
          <h2>近期对决</h2>
          ${
            this.save.duelHistory.length === 0
              ? '<p class="muted">还没有对决记录，进入 1v1 后会自动保存。</p>'
              : `
                <div class="duel-history-list">
                  ${this.save.duelHistory
                    .slice(-5)
                    .reverse()
                    .map(
                      (entry) => `
                        <div class="duel-history-row ${entry.won ? "won" : "lost"}">
                          <span>${entry.won ? "胜" : "负"}</span>
                          <strong>${escapeHtml(entry.opponentName)}</strong>
                          <em>${entry.playerScore} : ${entry.opponentScore}</em>
                          <small>${new Date(entry.timestamp).toLocaleDateString()}</small>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
          }
        </section>
        <section class="report-grid">
          <div class="report-panel">
            <h2>优势能力</h2>
            ${
              strengths.length
                ? strengths
                    .map(
                      (id) => `
                        <div class="strength-row">
                          <span style="--dot:${ABILITIES[id].color}"></span>
                          <strong>${ABILITIES[id].name}</strong>
                          <small>${ABILITIES[id].tagline}</small>
                        </div>
                      `
                    )
                    .join("")
                : "<p class=\"muted\">继续推进主线，先让能力进入第四段位。</p>"
            }
          </div>
          <div class="report-panel">
            <h2>建议训练</h2>
            ${gaps
              .map(
                (id) => `
                  <div class="training-item compact">
                    <span style="--dot:${ABILITIES[id].color}"></span>
                    <strong>${ABILITIES[id].name}</strong>
                    <p>${ABILITIES[id].tagline}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
        <section class="chapter-report">
          <h2>章节表现</h2>
          <div class="chapter-report-list">
            ${chapterReports
              .map(
                (item) => `
                  <div class="chapter-report-row">
                    <span>${item.chapter.code}</span>
                    <strong>${item.chapter.title}</strong>
                    <div class="stars">${"★".repeat(item.stars)}${"☆".repeat(3 - item.stars)}</div>
                    <small>${item.done ? "已完成" : "未完成"}</small>
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
        ${this.endingMarkup()}
      </main>
    `;
  }

  private endingMarkup(): string {
    if (!isChapterComplete(this.save, 9)) {
      return `
        <section class="ending-panel locked">
          <h2>${ROLES[this.save.profile.role].name}结局</h2>
          <p class="muted">完成第九章后解锁专属结局。</p>
        </section>
      `;
    }
    const role = this.save.profile.role;
    const decision = decisionProfile(this.save);
    const endings: Record<RoleId, string> = {
      parachute:
        "你证明了自己不仅能空降，还能把陌生组织变成稳定系统。你离开时，权力已经回到制度、梯队与共识里，而不是停留在你个人身上。",
      founder:
        "你把创业直觉变成了可复制的组织方法，公司开始不依赖你一个人做所有决定。你保留了对方向的敏感，也建立了能接住增长的团队。",
      highPotential:
        "你没有职位权力，却建立了横跨部门的影响力网络。你最终被组织需要，不是因为头衔，而是因为你让所有人更清楚该往哪里走。"
    };
    let style: "expert" | "risk" | "partial" | "balanced" = "balanced";
    if (decision.counts.expert >= 8) {
      style = "expert";
    } else if (decision.counts.risk >= 5) {
      style = "risk";
    } else if (decision.counts.partial >= 8) {
      style = "partial";
    }
    const styleLabels = {
      expert: "精准决策",
      risk: "高压破局",
      partial: "渐进推进",
      balanced: "平衡演进"
    };
    const styleEndings = {
      expert:
        "你以精准判断著称，团队开始使用你沉淀的检查清单做决策，组织获得了可复制的判断力。",
      risk:
        "你敢于在压力下押注，组织因此学会在不确定中快速行动，但也留下了需要持续修复的风险。",
      partial:
        "你选择渐进推进，组织在低震荡中完成了变革，只是节奏比想象中更慢，留下了更多调整空间。",
      balanced:
        "你在激进与保守之间保持了平衡，组织最终获得了一种可解释的稳定，也保留了继续进化的弹性。"
    };
    const arcLegacy: Record<string, string> = {
      trust_rebuild:
        "你救下的个体后来成了组织中最敢表达真实问题的人，这份信任成为变革最深的根基。",
      resilience:
        "你在危机中建立的复盘机制，让团队在离开你之后仍能自己修复错误，执行系统真正脱离了个人依赖。"
    };
    const legacy = SIDE_QUEST_ARCS.filter((arc) =>
      arc.nodes.every((nodeId) =>
        this.save.completedSideQuests.includes(nodeId)
      )
    )
      .map((arc) => arcLegacy[arc.id])
      .filter(Boolean)
      .join(" ");
    const randomLegacy =
      this.save.completedRandomEvents.length >= 5
        ? "你处理过的那些临时情境，最终成为了团队判断力的隐性训练。"
        : "";
    return `
      <section class="ending-panel">
        <h2>${ROLES[role].name} · ${styleLabels[style]}结局</h2>
        <p>${endings[role]} ${styleEndings[style]} ${legacy} ${randomLegacy}</p>
      </section>
    `;
  }

  private renderDuelLobby(): void {
    const summary = profileSummary(this.save);
    this.root.innerHTML = `
      <header class="topbar">
        <div class="brand">权变之路</div>
        <button class="link" data-action="open-menu">返回主页</button>
      </header>
      <main class="duel-lobby">
        <section class="duel-hero">
          <p class="eyebrow">1v1 情境对决</p>
          <h1>谁能在复杂局势中做出更好的判断？</h1>
          <p class="muted">每一回合都使用真实职场切片，选择会被专家基准评分。远程模式通过 WebRTC 点对点连接，无需服务器。</p>
          <div class="mode-switch">
            <button class="${this.duelMode === "ai" ? "active" : ""}" data-action="set-duel-mode" data-mode="ai">AI 陪练</button>
            <button class="${this.duelMode === "local" ? "active" : ""}" data-action="set-duel-mode" data-mode="local">本地双人</button>
            <button class="${this.duelMode === "remote" ? "active" : ""}" data-action="set-duel-mode" data-mode="remote">远程对战</button>
          </div>
        </section>
        <section class="lobby-panel">
          <div class="lobby-row">
            <label class="field">
              <span>回合数</span>
              <select data-select="rounds">
                <option value="3" ${this.duelRounds === 3 ? "selected" : ""}>3 回合</option>
                <option value="5" ${this.duelRounds === 5 ? "selected" : ""}>5 回合</option>
                <option value="7" ${this.duelRounds === 7 ? "selected" : ""}>7 回合</option>
              </select>
            </label>
            <span class="muted">当前档案：${this.save.profile.name} · ${summary.rank.name}</span>
          </div>
          ${
            this.duelMode === "ai"
              ? `
                <div class="mode-note">
                  <h2>AI 陪练</h2>
                  <p>系统会根据每道情境的专家基准和你的能力水平生成对手，并基于你的专家判断率动态调整难度。适合持续训练决策质量。</p>
                  <button class="primary" data-action="start-ai-duel">开始对战</button>
                </div>
              `
              : this.duelMode === "local"
                ? `
                  <div class="mode-note">
                    <h2>本地双人</h2>
                    <p>同一台设备轮流选择，玩家一完成后把设备交给玩家二。适合课堂、教练工作坊与双人复盘。</p>
                    <button class="primary" data-action="start-local-duel">开始对战</button>
                  </div>
                `
                : this.remoteLobbyMarkup()
          }
        </section>
      </main>
    `;
  }

  private remoteLobbyMarkup(): string {
    return `
      <div class="remote-lobby">
        <div class="remote-create">
          <h2>创建房间</h2>
          <p>生成邀请码后发给对手，对手会返回一个应答码。</p>
          <button class="primary" data-action="create-remote">生成邀请码</button>
          ${
            this.remoteInviteCode
              ? `
                <textarea readonly rows="4" data-copy-target>${escapeHtml(this.remoteInviteCode)}</textarea>
                <button data-action="copy-invite">复制邀请码</button>
              `
              : ""
          }
        </div>
        <div class="remote-join">
          <h2>加入房间</h2>
          <p>粘贴对方邀请码，生成应答码后发回给创建方。</p>
          <textarea rows="4" placeholder="粘贴对方邀请码" data-remote-input></textarea>
          <button data-action="join-remote">生成应答码</button>
          ${
            this.remoteAnswerCode
              ? `
                <textarea readonly rows="4">${escapeHtml(this.remoteAnswerCode)}</textarea>
                <button data-action="copy-answer">复制应答码</button>
              `
              : ""
          }
        </div>
        <div class="remote-finish">
          <h2>完成连接</h2>
          <p>创建方粘贴对手应答码，然后点击完成连接。</p>
          <textarea rows="4" placeholder="粘贴对方应答码" data-answer-input></textarea>
          <button class="primary" data-action="finish-remote">完成连接</button>
          <p class="status-text">${this.remoteStatus}</p>
        </div>
        <div class="remote-match">
          <h2>云端自动匹配</h2>
          <p>连接服务端后自动匹配对手，不需要手动交换邀请码。需先部署或本地运行房间服务器。</p>
          <button class="primary" data-action="cloud-match">开始匹配</button>
          <p class="status-text">${this.cloudStatus}</p>
        </div>
      </div>
    `;
  }

  private renderDuel(): void {
    const engine = this.duelEngine;
    if (!engine) {
      this.root.innerHTML = `
        <main class="duel-waiting">
          <h1>${this.remoteStatus}</h1>
          <p>等待对手加入。请保持页面打开。</p>
        </main>
      `;
      return;
    }

    if (engine.finished) {
      if (!this.duelRecorded) {
        this.duelRecorded = true;
        if (this.duelMode === "local") {
          this.audio.round();
        } else {
          const humanWon =
            (this.duelMode === "ai" && engine.winnerIndex === 0) ||
            (this.duelMode === "remote" &&
              engine.winnerIndex === this.remotePlayerIndex);
          if (humanWon) {
            this.audio.win();
          } else {
            this.audio.lose();
          }
          const delta = Math.abs(engine.scores[0] - engine.scores[1]);
          const playerIndex =
            this.duelMode === "remote" ? this.remotePlayerIndex : 0;
          const opponentIndex = playerIndex === 0 ? 1 : 0;
          recordDuelResult(
            this.save,
            humanWon,
            playerIndex === 0,
            delta,
            engine.players[opponentIndex].name,
            engine.scores[playerIndex],
            engine.scores[opponentIndex]
          );
        }
      }
      const result = engine.toResult();
      this.root.innerHTML = `
        <main class="duel-result">
          <section class="result-hero">
            <p class="eyebrow">对决结束</p>
            <h1>${escapeHtml(result.winnerName)} 获胜</h1>
            <div class="result-scores">
              <span>${engine.players[0].name} <strong>${result.scores[0]}</strong></span>
              <span>${engine.players[1].name} <strong>${result.scores[1]}</strong></span>
            </div>
            <button class="primary" data-action="open-duel-lobby">返回大厅</button>
            <button data-action="open-map">继续主线</button>
          </section>
        </main>
      `;
      return;
    }

    const node = engine.node;
    const lastResult = engine.roundResults[engine.currentRound - 1];
    const roundKey = `${engine.currentRound}-${engine.picks[0] ?? ""}-${engine.picks[1] ?? ""}`;
    this.root.innerHTML = `
      <header class="topbar duel-top">
        <div class="brand">1v1 对决</div>
        <div class="duel-score">
          <span style="--dot:${engine.players[0].color}"><strong>${engine.players[0].name}</strong> ${engine.scores[0]}</span>
          <span>第 ${Math.min(engine.currentRound + 1, engine.roundCount)} / ${engine.roundCount} 回合</span>
          <span style="--dot:${engine.players[1].color}"><strong>${engine.players[1].name}</strong> ${engine.scores[1]}</span>
        </div>
      </header>
      <main class="duel-shell" data-round-key="${roundKey}">
        ${
          lastResult
            ? `
              <section class="round-result">
                <span>上一回合</span>
                <strong>${escapeHtml(lastResult.node.title)}</strong>
                <p>${engine.players[0].name} ${lastResult.points[0]} 分 · ${engine.players[1].name} ${lastResult.points[1]} 分</p>
              </section>
            `
            : ""
        }
        <section class="duel-scenario">
          <div class="scenario-meta">
            <span>回合 ${engine.currentRound + 1}</span>
            <span>${node.title}</span>
          </div>
          <h1>${escapeHtml(node.context)}</h1>
          <div class="stake"><strong>考验</strong><p>${escapeHtml(node.stake)}</p></div>
        </section>
        <section class="duel-players">
          ${this.playerPanel(0)}
          <div class="versus">VS</div>
          ${this.playerPanel(1)}
        </section>
        <section class="duel-options">
          ${node.options
            .map(
              (option, index) => `
                <button class="option-card ${this.optionState(index)}" data-action="duel-pick" data-option="${index}" ${this.duelPickEnabled(index) ? "" : "disabled"}>
                  <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                  <span class="option-body">
                    <strong>${escapeHtml(option.label)}</strong>
                    <em>${escapeHtml(option.summary)}</em>
                  </span>
                </button>
              `
            )
            .join("")}
        </section>
        ${
          this.duelMode === "local" && this.localPassed && this.hotSeatTurn === 1
            ? `<div class="pass-note">现在轮到玩家二，请移交设备。</div>`
            : ""
        }
        ${
          this.duelMode === "local" &&
          this.hotSeatTurn === 1 &&
          !this.localPassed &&
          this.duelEngine?.picks[0] !== null
            ? `<button class="primary pass-button" data-action="pass-local">传递给玩家二</button>`
            : ""
        }
      </main>
    `;
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const actionTarget = target.closest<HTMLElement>("[data-action]");
    if (!actionTarget) {
      return;
    }
    const action = actionTarget.dataset.action;
    if (!action) {
      return;
    }
    this.audio.ensure();

    switch (action) {
      case "open-node": {
        const nodeId = actionTarget.dataset.node;
        if (nodeId) {
          this.audio.ui();
          this.storyNodeId = nodeId;
          this.storyHintRevealed = false;
          this.pendingBranchNodeId = undefined;
          this.pendingChapterTransition = undefined;
          this.lastOutcome = undefined;
          this.lastOutcomeNodeId = undefined;
          this.show("story");
        }
        break;
      }
      case "select-chapter": {
        const chapterId = Number(actionTarget.dataset.chapter);
        if (this.save.unlockedChapters.includes(chapterId)) {
          this.audio.ui();
          this.selectedChapter = chapterId;
          this.renderMap();
        }
        break;
      }
      case "select-role":
        this.audio.ui();
        this.pendingRole = (actionTarget.dataset.role as RoleId) ?? "highPotential";
        this.renderProfile();
        break;
      case "open-menu":
        this.audio.ui();
        this.show("menu");
        break;
      case "open-profile":
        this.audio.ui();
        this.show("profile");
        break;
      case "open-map":
        this.audio.ui();
        this.selectedChapter =
          this.save.unlockedChapters[this.save.unlockedChapters.length - 1] ?? 1;
        this.show("map");
        break;
      case "open-ability":
        this.audio.ui();
        this.show("ability");
        break;
      case "open-report":
        this.audio.ui();
        this.show("report");
        break;
      case "open-achievements":
        this.audio.ui();
        this.show("achievements");
        break;
      case "open-relations":
        this.audio.ui();
        this.show("relations");
        break;
      case "export-save":
        this.exportSave();
        break;
      case "export-report":
        this.exportReport();
        break;
      case "copy-save-link":
        this.copySaveLink(actionTarget);
        break;
      case "cloud-sync":
        void this.cloudSync();
        break;
      case "cloud-load":
        void this.cloudLoad();
        break;
      case "cloud-leaderboard":
        void this.cloudLeaderboard();
        break;
      case "cloud-use-remote":
        if (this.cloudRemoteSave) {
          try {
            this.save = importSaveJson(JSON.stringify(this.cloudRemoteSave));
            this.cloudConflict = false;
            this.cloudStatus = "已使用云端存档";
            this.audio.expert();
            this.show("report");
          } catch {
            this.cloudStatus = "云端存档无法解析";
            this.cloudConflict = false;
            this.renderReport();
          }
        }
        break;
      case "cloud-force-local":
        if (this.roomClient && this.cloudToken) {
          this.cloudConflict = false;
          this.roomClient.cloudSave(this.cloudToken, this.save);
          this.cloudStatus = "正在上传本地存档";
          this.renderReport();
        }
        break;
      case "cloud-match":
        void this.cloudMatch();
        break;
      case "toggle-sound":
        this.muted = !this.muted;
        localStorage.setItem("adaptive-ascent-muted", this.muted ? "1" : "0");
        this.audio.setMuted(this.muted);
        this.render();
        break;
      case "toggle-language":
        this.language = this.language === "zh" ? "en" : "zh";
        localStorage.setItem("adaptive-ascent-lang", this.language);
        document.documentElement.lang = this.language;
        this.audio.ui();
        this.render();
        break;
      case "reset-profile":
        if (window.confirm("确定要清空当前档案和所有进度吗？")) {
          this.save = resetSave();
          this.pendingRole = "highPotential";
          this.show("profile");
        }
        break;
      case "open-duel":
        this.audio.ui();
        this.show("duelLobby");
        break;
      case "open-duel-lobby":
        this.audio.ui();
        this.cleanupRemote();
        this.show("duelLobby");
        break;
      case "create-profile":
        this.createProfileFromForm();
        break;
      case "assessment-option":
        this.assessmentAnswers[this.assessmentStep] = Number(
          actionTarget.dataset.option
        );
        this.audio.ui();
        this.renderAssessment();
        break;
      case "assessment-next":
        this.assessmentAnswers[this.assessmentStep] ??= 0;
        this.assessmentStep = Math.min(
          ASSESSMENT_QUESTIONS.length - 1,
          this.assessmentStep + 1
        );
        this.audio.ui();
        this.renderAssessment();
        break;
      case "assessment-prev":
        this.assessmentStep = Math.max(0, this.assessmentStep - 1);
        this.audio.ui();
        this.renderAssessment();
        break;
      case "assessment-submit":
        this.assessmentAnswers[this.assessmentStep] ??= 0;
        this.finishProfile(true);
        break;
      case "assessment-skip":
        this.finishProfile(false);
        break;
      case "start-campaign":
        this.audio.ui();
        this.show("map");
        break;
      case "claim-challenge": {
        const challengeId = actionTarget.dataset.challenge ?? "";
        if (!this.save.claimedChallenges.includes(challengeId)) {
          const reward =
            dailyChallenges(this.save).find(
              (challenge) => challenge.id === challengeId
            )?.reward ?? 3;
          this.save.claimedChallenges.push(challengeId);
          this.save.masteryPoints += reward;
          saveState(this.save);
          this.audio.expert();
          this.renderMap();
        }
        break;
      }
      case "toggle-hint":
        this.storyHintRevealed = !this.storyHintRevealed;
        this.audio.ui();
        this.renderStory();
        break;
      case "choose-option":
        this.chooseStoryOption(actionTarget);
        break;
      case "continue-story":
        this.lastOutcome = undefined;
        this.lastOutcomeNodeId = undefined;
        this.pendingBranchNodeId = undefined;
        this.pendingChapterTransition = undefined;
        this.show("map");
        break;
      case "continue-transition":
        if (this.pendingChapterTransition) {
          this.audio.ui();
          this.show("chapterTransition");
        }
        break;
      case "continue-transition-map": {
        const completed = this.pendingChapterTransition;
        this.pendingChapterTransition = undefined;
        this.lastOutcome = undefined;
        this.lastOutcomeNodeId = undefined;
        if (completed && completed < CHAPTERS.length) {
          this.selectedChapter = completed + 1;
        }
        this.audio.ui();
        this.show("map");
        break;
      }
      case "continue-branch": {
        const branchId = this.pendingBranchNodeId;
        if (branchId) {
          this.storyNodeId = branchId;
          this.storyHintRevealed = false;
          this.pendingBranchNodeId = undefined;
          this.lastOutcome = undefined;
          this.lastOutcomeNodeId = undefined;
          this.audio.ui();
          this.show("story");
        }
        break;
      }
      case "set-duel-mode":
        this.duelMode = (actionTarget.dataset.mode as DuelMode) ?? "ai";
        this.renderDuelLobby();
        break;
      case "start-ai-duel":
        this.startAiDuel();
        break;
      case "start-local-duel":
        this.startLocalDuel();
        break;
      case "create-remote":
        void this.createRemote();
        break;
      case "join-remote":
        void this.joinRemote();
        break;
      case "finish-remote":
        void this.finishRemote();
        break;
      case "copy-invite":
        this.copyText(actionTarget, "copy-target");
        break;
      case "copy-answer":
        this.copyText(actionTarget, "copy-target");
        break;
      case "duel-pick":
        this.duelPick(actionTarget);
        break;
      case "pass-local":
        this.localPassed = true;
        this.hotSeatTurn = 1;
        this.renderDuel();
        break;
      case "reset-profile":
        if (window.confirm("确定要清空当前档案和所有进度吗？")) {
          this.save = resetSave();
          this.show("profile");
        }
        break;
    }
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form.dataset.form === "profile") {
      this.createProfileFromForm();
    }
  }

  private handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.dataset.select === "rounds") {
      this.duelRounds = Number(target.value) || 3;
    }
    if (target.dataset.importSave && target instanceof HTMLInputElement) {
      void this.importSave(target);
    }
  }

  private createProfileFromForm(): void {
    const input = this.root.querySelector<HTMLInputElement>("input[name='playerName']");
    const name = input?.value.trim() || "你";
    const profile = createProfile(name, this.pendingRole);
    this.pendingProfile = profile;
    this.assessmentAnswers = [];
    this.assessmentStep = 0;
    this.show("assessment");
  }

  private finishProfile(applyAssessment: boolean): void {
    if (!this.pendingProfile) {
      this.show("profile");
      return;
    }
    if (applyAssessment) {
      let score = 0;
      ASSESSMENT_QUESTIONS.forEach((question, index) => {
        const answer = this.assessmentAnswers[index] ?? 0;
        const points = question.options[answer].points;
        this.pendingProfile!.abilities[question.abilityId] += points;
        score += points;
      });
      this.save.assessmentScore = score;
      this.save.achievements.push("assessment_done");
      this.save.achievements = [...new Set(this.save.achievements)];
    }
    activateProfile(this.save, this.pendingProfile);
    this.pendingProfile = undefined;
    this.audio.startAmbient();
    this.audio.expert();
    this.selectedChapter = 1;
    this.show("assessmentResult");
  }

  private chooseStoryOption(target: HTMLElement): void {
    if (!this.storyNodeId) {
      return;
    }
    const optionIndex = Number(target.dataset.option);
    const outcome = applyStoryChoice(this.save, this.storyNodeId, optionIndex);
    const roleNode = getNodeForRole(
      this.save.profile.role,
      this.storyNodeId
    );
    outcome.option = roleNode.options[optionIndex];
    this.lastOutcome = outcome;
    this.lastOutcomeNodeId = this.storyNodeId;
    const baseNode = getNode(this.storyNodeId);
    this.pendingChapterTransition =
      baseNode.kind === "main" && isChapterComplete(this.save, baseNode.chapterId)
        ? baseNode.chapterId
        : undefined;
    this.pendingBranchNodeId =
      outcome.option.branchTo?.[this.save.profile.role];
    if (outcome.option.quality === "expert") {
      this.audio.expert();
    } else if (outcome.option.quality === "partial") {
      this.audio.partial();
    } else {
      this.audio.risk();
    }
    this.renderStory();
  }

  private startAiDuel(): void {
    const human = buildDuelProfile(this.save.profile, this.save.profile.name, "#41c7c0");
    const history = this.save.decisionHistory;
    const expertCount = history.filter(
      (record) => record.quality === "expert"
    ).length;
    const expertRatio =
      history.length > 0 ? expertCount / history.length : 0.33;
    const strength = Math.max(
      1,
      Math.min(4, Math.round(expertRatio * 4 + this.save.duelWins * 0.15))
    );
    const ai = buildAiProfile("founder", strength);
    this.audio.ensure();
    this.audio.round();
    this.duelEngine = new DuelEngine(human, ai, this.duelRounds, duelSeed());
    this.duelRecorded = false;
    this.show("duel");
  }

  private startLocalDuel(): void {
    const playerOne = buildDuelProfile(this.save.profile, `${this.save.profile.name} · 玩家一`, "#41c7c0");
    const playerTwo = buildDuelProfile(this.save.profile, "玩家二", "#e9826c");
    this.audio.ensure();
    this.audio.round();
    this.duelEngine = new DuelEngine(playerOne, playerTwo, this.duelRounds, duelSeed());
    this.hotSeatTurn = 0;
    this.localPassed = false;
    this.duelRecorded = false;
    this.show("duel");
  }

  private async createRemote(): Promise<void> {
    this.cleanupRemote();
    const seed = duelSeed();
    this.remoteStatus = "正在生成邀请码，请稍候…";
    this.renderDuelLobby();
    try {
      const { peer, inviteCode } = await ManualRtcPeer.createHost(seed);
      this.remotePeer = peer;
      this.remotePlayerIndex = 0;
      this.remoteInviteCode = inviteCode;
      this.remoteOpponentName = "等待对手";
      this.remoteOpponentReady = false;
      this.remoteStatus = "邀请码已生成，等待对方应答";
      this.bindRemotePeer(peer);
      this.renderDuelLobby();
    } catch (error) {
      this.remoteStatus = error instanceof Error ? error.message : "创建房间失败";
      this.renderDuelLobby();
    }
  }

  private async joinRemote(): Promise<void> {
    const input = this.root.querySelector<HTMLTextAreaElement>("textarea[data-remote-input]");
    const code = input?.value.trim() ?? "";
    if (!code) {
      this.remoteStatus = "请先粘贴邀请码";
      this.renderDuelLobby();
      return;
    }
    this.cleanupRemote();
    this.remoteStatus = "正在解析邀请码并生成应答，请稍候…";
    this.renderDuelLobby();
    try {
      const { peer, answerCode } = await ManualRtcPeer.join(code);
      this.remotePeer = peer;
      this.remotePlayerIndex = 1;
      this.remoteAnswerCode = answerCode;
      this.remoteOpponentName = "等待对手";
      this.remoteOpponentReady = false;
      this.remoteStatus = "应答码已生成，请发送给创建方";
      this.bindRemotePeer(peer);
      this.renderDuelLobby();
    } catch (error) {
      this.remoteStatus = error instanceof Error ? error.message : "加入房间失败";
      this.renderDuelLobby();
    }
  }

  private async finishRemote(): Promise<void> {
    if (!this.remotePeer || this.remotePlayerIndex !== 0) {
      this.remoteStatus = "请先创建房间";
      this.renderDuelLobby();
      return;
    }
    const input = this.root.querySelector<HTMLTextAreaElement>("textarea[data-answer-input]");
    const code = input?.value.trim() ?? "";
    try {
      await this.remotePeer.acceptAnswer(code);
      this.remoteStatus = "连接信息已提交，等待点对点通道建立";
      this.renderDuelLobby();
    } catch (error) {
      this.remoteStatus = error instanceof Error ? error.message : "连接失败";
      this.renderDuelLobby();
    }
  }

  private bindRemotePeer(peer: ManualRtcPeer): void {
    peer.onOpen = () => {
      this.remoteStatus = "通道已建立";
      this.audio.remoteConnected();
      peer.send({
        kind: "hello",
        name: this.save.profile.name,
        role: this.save.profile.role,
        roundCount: this.duelRounds,
        abilities: { ...this.save.profile.abilities },
        resources: { ...this.save.profile.resources }
      });
      this.maybeStartRemoteDuel();
    };
    peer.onStatus = (status) => {
      this.remoteStatus = status;
      if (this.view === "duelLobby") {
        this.renderDuelLobby();
      }
    };
    peer.onMessage = (message) => this.handleRemoteMessage(message);
  }

  private handleRemoteMessage(message: RtcMessage): void {
    if (message.kind === "hello") {
      this.remoteOpponentName = message.name;
      this.remoteOpponentReady = true;
      this.duelRounds = Math.max(1, Number(message.roundCount) || 3);
      this.remoteOpponentAbilities = message.abilities;
      this.remoteOpponentResources = message.resources;
      this.maybeStartRemoteDuel();
      return;
    }
    if (message.kind === "pick" && this.duelEngine && this.remotePeer) {
      const opponentIndex = this.remotePlayerIndex === 0 ? 1 : 0;
      this.duelEngine.pick(opponentIndex, message.optionIndex);
      this.renderDuel();
    }
  }

  private maybeStartRemoteDuel(): void {
    if (!this.remotePeer || !this.remoteOpponentReady || !this.remotePeer.pc.connectionState) {
      return;
    }
    if (this.view !== "duelLobby" && this.view !== "duel") {
      return;
    }
    const opponent = {
      name: this.remoteOpponentName,
      role: "highPotential" as RoleId,
      abilities: { ...this.remoteOpponentAbilities },
      resources: { ...this.remoteOpponentResources },
      color: this.remotePlayerIndex === 0 ? "#e9826c" : "#41c7c0",
      isHuman: true
    };
    const me = buildDuelProfile(this.save.profile, this.save.profile.name, this.remotePlayerIndex === 0 ? "#41c7c0" : "#e9826c");
    this.duelEngine =
      this.remotePlayerIndex === 0
        ? new DuelEngine(me, opponent, this.duelRounds, this.remotePeer.seed)
        : new DuelEngine(opponent, me, this.duelRounds, this.remotePeer.seed);
    this.duelRecorded = false;
    this.show("duel");
  }

  private duelPick(target: HTMLElement): void {
    const engine = this.duelEngine;
    if (!engine) {
      return;
    }
    this.audio.duelPick();
    const optionIndex = Number(target.dataset.option);
    if (this.duelMode === "ai") {
      engine.pick(0, optionIndex);
      window.setTimeout(() => {
        engine.aiPick(1);
        this.renderDuel();
      }, 650);
      this.renderDuel();
      return;
    }
    if (this.duelMode === "local") {
      engine.pick(this.hotSeatTurn, optionIndex);
      if (this.hotSeatTurn === 0 && engine.picks[0] !== null) {
        this.localPassed = false;
        this.hotSeatTurn = 1;
        this.renderDuel();
        return;
      }
      if (engine.picks[0] === null && engine.picks[1] === null) {
        this.hotSeatTurn = 0;
        this.localPassed = false;
      }
      this.renderDuel();
      return;
    }
    if (this.duelMode === "remote") {
      engine.pick(this.remotePlayerIndex, optionIndex);
      if (this.usingCloudMatch && this.roomClient) {
        this.roomClient.pick(optionIndex);
      } else if (this.remotePeer) {
        this.remotePeer.send({ kind: "pick", optionIndex });
      }
      this.renderDuel();
    }
  }

  private playerPanel(index: 0 | 1): string {
    const engine = this.duelEngine;
    if (!engine) {
      return "";
    }
    const player = engine.players[index];
    const picked = engine.picks[index] !== null;
    return `
      <div class="player-panel">
        <span class="player-color" style="--dot:${player.color}"></span>
        <strong>${escapeHtml(player.name)}</strong>
        <small>${picked ? "已作出选择" : "正在思考"}</small>
      </div>
    `;
  }

  private duelPickEnabled(optionIndex: number): boolean {
    if (!this.duelEngine) return false;
    if (this.duelMode === "ai") {
      return this.duelEngine.picks[0] === null;
    }
    if (this.duelMode === "local") {
      if (this.hotSeatTurn === 0) return this.duelEngine.picks[0] === null;
      return this.localPassed && this.duelEngine.picks[1] === null;
    }
    if (this.duelMode === "remote") {
      return this.duelEngine.picks[this.remotePlayerIndex] === null;
    }
    return false;
  }

  private optionState(optionIndex: number): string {
    const engine = this.duelEngine;
    if (!engine) return "";
    if (engine.picks[0] === optionIndex) return "picked p1";
    if (engine.picks[1] === optionIndex) return "picked p2";
    return "";
  }

  private cleanupRemote(): void {
    this.remotePeer?.close();
    this.remotePeer = undefined;
    this.remoteInviteCode = "";
    this.remoteAnswerCode = "";
    this.remoteOpponentReady = false;
    this.remoteStatus = "尚未建立连接";
    this.duelEngine = undefined;
    this.usingCloudMatch = false;
  }

  private exportSave(): void {
    const blob = new Blob([JSON.stringify(this.save, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `权变之路-${this.save.profile.name}-存档.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.audio.ui();
  }

  private exportReport(): void {
    const summary = profileSummary(this.save);
    const decision = decisionProfile(this.save);
    const training = recommendedTraining(
      this.save.profile.abilities,
      this.save.profile.role
    );
    const strengths = ABILITY_ORDER.slice()
      .sort(
        (a, b) =>
          abilityLevel(this.save.profile.abilities[b]) -
          abilityLevel(this.save.profile.abilities[a])
      )
      .slice(0, 3);
    const lines = [
      `# ${this.save.profile.name} 领导力复盘报告`,
      "",
      `角色：${ROLES[this.save.profile.role].name}`,
      `段位：${summary.rank.name}`,
      `综合能力值：${summary.total}`,
      `决策画像：${decision.identity}`,
      "",
      "## 能力现状",
      ...ABILITY_ORDER.map(
        (id) =>
          `- ${ABILITIES[id].name} Lv.${abilityLevel(this.save.profile.abilities[id])}：${ABILITIES[id].tagline}`
      ),
      "",
      "## 优势能力",
      ...strengths.map((id) => `- ${ABILITIES[id].name}：${ABILITIES[id].tagline}`),
      "",
      "## 建议训练",
      ...training.map((id) => `- ${ABILITIES[id].name}：${ABILITIES[id].trainingPath}`),
      "",
      "## 章节表现",
      ...CHAPTERS.map((chapter) => {
        const record = this.save.chapterRecords.find(
          (item) => item.chapterId === chapter.id
        );
        return `- ${chapter.title}：${record && record.completedNodeIds.length >= 2 ? "已完成" : "未完成"}`;
      }),
      "",
      "## 支线剧情弧",
      ...SIDE_QUEST_ARCS.map(
        (arc) =>
          `- ${arc.title}：${arc.nodes.filter((id) => this.save.completedSideQuests.includes(id)).length}/${arc.nodes.length}`
      ),
      "",
      "## 人物关系",
      ...NPCS.map((npc) => {
        const relation = npcRelation(this.save, npc);
        return `- ${npc.name}（${npc.title}）：${relation.status}`;
      }),
      "",
      "## 对决记录",
      `- 胜场：${this.save.duelWins}`,
      `- 负场：${this.save.duelLosses}`,
      `- 随机事件：${this.save.completedRandomEvents.length}`,
      `- 修炼点：${this.save.masteryPoints}`,
      "",
      "## 近期对决",
      ...this.save.duelHistory.slice(-5).map(
        (entry) =>
          `- ${entry.won ? "胜" : "负"} ${entry.opponentName} ${entry.playerScore}:${entry.opponentScore}`
      )
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/markdown;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `权变之路-${this.save.profile.name}-报告.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.audio.ui();
  }

  private copySaveLink(target: HTMLElement): void {
    const json = JSON.stringify(this.save);
    const encoded = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const url = `${location.origin}${location.pathname}#save=${encoded}`;
    void navigator.clipboard?.writeText(url);
    const original = target.textContent;
    target.textContent = "链接已复制";
    window.setTimeout(() => {
      target.textContent = original;
    }, 1400);
    this.audio.ui();
  }

  private async ensureCloudClient(): Promise<RoomClient> {
    if (this.roomClient) {
      return this.roomClient;
    }
    const client = new RoomClient();
    this.roomClient = client;
    client.onMessage = (message) => this.handleCloudMessage(message);
    client.onClose = () => {
      this.cloudStatus = "云端连接已断开";
    };
    await client.connect();
    return client;
  }

  private handleCloudMessage(message: RoomServerMessage): void {
    switch (message.type) {
      case "registered": {
        this.cloudToken = message.token;
        localStorage.setItem("adaptive-ascent-cloud-token", message.token);
        this.cloudStatus = "云端账号已创建";
        this.audio.remoteConnected();
        this.roomClient?.cloudSave(message.token, this.save);
        break;
      }
      case "logged_in": {
        this.cloudStatus = "云端账号已连接";
        this.audio.remoteConnected();
        if (this.pendingCloudAction === "load") {
          const remote = message.account as { save?: SaveState };
          if (remote.save) {
            try {
              this.save = importSaveJson(JSON.stringify(remote.save));
              this.show("report");
            } catch {
              this.cloudStatus = "云端存档无法解析";
            }
          } else {
            this.cloudStatus = "云端暂无存档";
          }
        } else if (this.pendingCloudAction === "sync") {
          const remote = message.account as { save?: SaveState };
          if (
            remote.save &&
            (remote.save.playCount ?? 0) > this.save.playCount
          ) {
            this.cloudStatus = "云端进度较新，已停止覆盖；请使用云端载入";
            this.cloudConflict = true;
            this.cloudRemoteSave = remote.save;
          } else {
            this.cloudConflict = false;
            this.cloudRemoteSave = undefined;
            this.roomClient?.cloudSave(this.cloudToken, this.save);
          }
        }
        break;
      }
      case "save_ok":
        this.cloudStatus = "云端同步成功";
        this.audio.expert();
        break;
      case "leaderboard":
        this.cloudEntries = message.entries;
        this.cloudStatus = "排行榜已刷新";
        this.audio.ui();
        break;
      case "queued":
        this.cloudStatus = "已进入云端匹配队列，等待对手…";
        break;
      case "match_started":
        this.startCloudDuel(
          message.roomId,
          message.playerIndex as 0 | 1,
          message.opponentName || "云端对手"
        );
        break;
      case "pick":
        if (this.duelEngine) {
          const opponentIndex = this.remotePlayerIndex === 0 ? 1 : 0;
          this.duelEngine.pick(opponentIndex, message.optionIndex);
          this.renderDuel();
        }
        break;
      case "opponent_left":
        this.cloudStatus = "对手已离开";
        if (this.view === "duelLobby") this.renderDuelLobby();
        break;
      case "error":
        this.cloudStatus = message.message;
        this.audio.risk();
        break;
      default:
        break;
    }
    if (this.view === "report") {
      this.renderReport();
    }
  }

  private async cloudSync(): Promise<void> {
    this.pendingCloudAction = "sync";
    this.cloudStatus = "正在连接云端…";
    this.renderReport();
    try {
      const client = await this.ensureCloudClient();
      if (this.cloudToken) {
        client.login(this.cloudToken);
      } else {
        client.register(
          this.save.profile.name,
          this.save.profile.role,
          this.save
        );
      }
    } catch (error) {
      this.cloudStatus = error instanceof Error ? error.message : "云端连接失败";
      this.renderReport();
    }
  }

  private async cloudLoad(): Promise<void> {
    if (!this.cloudToken) {
      this.cloudStatus = "请先云端同步生成账号";
      this.renderReport();
      return;
    }
    this.pendingCloudAction = "load";
    this.cloudStatus = "正在从云端载入…";
    this.renderReport();
    try {
      const client = await this.ensureCloudClient();
      client.login(this.cloudToken);
    } catch (error) {
      this.cloudStatus = error instanceof Error ? error.message : "云端载入失败";
      this.renderReport();
    }
  }

  private async cloudLeaderboard(): Promise<void> {
    this.cloudStatus = "正在刷新排行榜…";
    this.renderReport();
    try {
      const client = await this.ensureCloudClient();
      client.leaderboard();
    } catch (error) {
      this.cloudStatus = error instanceof Error ? error.message : "排行榜刷新失败";
      this.renderReport();
    }
  }

  private async cloudMatch(): Promise<void> {
    this.pendingCloudAction = "match";
    this.cloudStatus = "正在连接云端匹配…";
    this.renderDuelLobby();
    try {
      const client = await this.ensureCloudClient();
      client.match(
        this.save.profile.name,
        this.save.profile.role,
        this.save,
        this.duelRounds
      );
    } catch (error) {
      this.cloudStatus = error instanceof Error ? error.message : "云端匹配失败";
      this.renderDuelLobby();
    }
  }

  private startCloudDuel(
    roomId: string,
    playerIndex: 0 | 1,
    opponentName: string
  ): void {
    const me = buildDuelProfile(
      this.save.profile,
      this.save.profile.name,
      playerIndex === 0 ? "#41c7c0" : "#e9826c"
    );
    const opponent = {
      name: opponentName,
      role: "highPotential" as RoleId,
      abilities: {
        insight: 2,
        deploy: 2,
        mobilize: 2,
        strategy: 2,
        authority: 2,
        stability: 2,
        recovery: 2,
        execution: 2,
        structure: 2,
        communication: 2
      } as Record<AbilityId, number>,
      resources: { energy: 75, trust: 55, influence: 45, capital: 40 },
      color: playerIndex === 0 ? "#e9826c" : "#41c7c0",
      isHuman: true
    };
    const seed =
      [...roomId].reduce((sum, char) => sum * 31 + char.charCodeAt(0), 7) %
      100000;
    this.duelEngine =
      playerIndex === 0
        ? new DuelEngine(me, opponent, this.duelRounds, seed)
        : new DuelEngine(opponent, me, this.duelRounds, seed);
    this.remotePlayerIndex = playerIndex;
    this.remoteOpponentName = opponentName;
    this.usingCloudMatch = true;
    this.duelMode = "remote";
    this.duelRecorded = false;
    this.audio.remoteConnected();
    this.show("duel");
  }

  private async importSave(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      this.save = importSaveJson(text);
      this.audio.ensure();
      this.audio.expert();
      this.show("menu");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "导入存档失败");
    } finally {
      input.value = "";
    }
  }

  private copyText(target: HTMLElement, selector: string): void {
    const textarea = target
      .closest<HTMLElement>(".remote-lobby, .remote-create, .remote-join")
      ?.querySelector<HTMLTextAreaElement>(`textarea[${selector}]`);
    const value = textarea?.value;
    if (!value) return;
    void navigator.clipboard?.writeText(value);
    const original = target.textContent;
    target.textContent = "已复制";
    window.setTimeout(() => {
      target.textContent = original;
    }, 1200);
  }

  private chapterBadge(chapter: ChapterDef): string {
    const unlocked = this.save.unlockedChapters.includes(chapter.id);
    const complete = isChapterComplete(this.save, chapter.id);
    const current = this.selectedChapter === chapter.id;
    return `
      <button class="chapter-badge ${unlocked ? "unlocked" : ""} ${complete ? "complete" : ""} ${current ? "current" : ""}" data-action="select-chapter" data-chapter="${chapter.id}">
        <span>${chapter.code}</span>
        <strong>${chapter.title}</strong>
      </button>
    `;
  }

  private questArcMarkup(arc: (typeof SIDE_QUEST_ARCS)[number]): string {
    const doneCount = arc.nodes.filter((id) =>
      isNodeComplete(this.save, id)
    ).length;
    const done = doneCount === arc.nodes.length;
    return `
      <div class="quest-arc ${done ? "complete" : ""}">
        <div class="quest-arc-head">
          <div>
            <strong>${arc.title}</strong>
            <span>${doneCount} / ${arc.nodes.length} 节点</span>
          </div>
          <small>${done ? "已完成" : "进行中"}</small>
        </div>
        <p class="quest-summary">${escapeHtml(arc.summary)}</p>
        <p class="quest-intro">${escapeHtml(arc.intro)}</p>
        <div class="quest-nodes">
          ${arc.nodes
            .map((nodeId, index) => {
              const node = getNode(nodeId);
              const unlocked = this.canEnterSideNode(nodeId);
              const nodeDone = isNodeComplete(this.save, nodeId);
              return `
                <button class="quest-node ${nodeDone ? "done" : ""} ${unlocked ? "" : "locked"}" data-action="open-node" data-node="${nodeId}" ${unlocked ? "" : "disabled"}>
                  <span>${index + 1}</span>
                  <div>
                    <strong>${escapeHtml(node.title)}</strong>
                    <em>${nodeDone ? "已完成" : unlocked ? "可接取" : "前置未解锁"}</em>
                  </div>
                </button>
              `;
            })
            .join("")}
        </div>
        ${done ? `<p class="quest-conclusion">${escapeHtml(arc.conclusion)}</p>` : ""}
      </div>
    `;
  }

  private canEnterSideNode(nodeId: string): boolean {
    const arc = SIDE_QUEST_ARCS.find((item) => item.nodes.includes(nodeId));
    if (!arc) {
      return false;
    }
    const index = arc.nodes.indexOf(nodeId);
    if (index > 0) {
      return isNodeComplete(this.save, arc.nodes[index - 1]);
    }
    const node = getNode(nodeId);
    return getChapter(node.chapterId).nodeIds.some((mainId) =>
      isNodeComplete(this.save, mainId)
    );
  }

  private nodeRow(node: StoryNode): string {
    const done = isNodeComplete(this.save, node.id);
    const chapter = getChapter(node.chapterId);
    return `
      <button class="node-row ${done ? "done" : ""}" data-action="open-node" data-node="${node.id}">
        <span class="node-state">${done ? "✓" : node.kind === "side" ? "支" : chapter.code}</span>
        <span>
          <strong>${escapeHtml(node.title)}</strong>
          <em>${node.kind === "side" ? "支线任务" : "主线情境"}</em>
        </span>
        <small>${done ? "已完成" : "可进入"}</small>
      </button>
    `;
  }

  private resourceChips(profile: PlayerProfile): string {
    return (Object.keys(RESOURCE_NAMES) as ResourceKey[])
      .map(
        (key) => `
          <span class="resource-chip">
            <b>${RESOURCE_NAMES[key]}</b>
            <i>${Math.round(profile.resources[key])}</i>
          </span>
        `
      )
      .join("");
  }

  private abilityCard(id: AbilityId): string {
    const exp = this.save.profile.abilities[id];
    const level = abilityLevel(exp);
    const ability = ABILITIES[id];
    return `
      <div class="ability-card">
        <div class="ability-head">
          <span style="--dot:${ability.color}"></span>
          <div>
            <h3>${ability.name}</h3>
            <small>${ability.code}</small>
          </div>
          <strong>Lv.${level}</strong>
        </div>
        <p>${ability.tagline}</p>
        <div class="ability-bar"><i style="width:${Math.min(100, (level / 6) * 100)}%"></i></div>
        <div class="subskill-list">${ability.subSkills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>
        <p class="training-path">${escapeHtml(ability.trainingPath)}</p>
        <div class="ability-sources">${ability.sources.slice(0, 2).map((source) => `<span>${escapeHtml(source)}</span>`).join("")}</div>
      </div>
    `;
  }

  private adaptiveHint(node: StoryNode): string {
    const relevant = [
      ...new Set(
        node.options.flatMap((option) =>
          Object.keys(option.effects) as AbilityId[]
        )
      )
    ];
    if (relevant.length === 0) {
      return "先看关键关系，再选最可能建立信任的行动。";
    }
    const weakest = relevant.sort(
      (a, b) =>
        abilityLevel(this.save.profile.abilities[a]) -
        abilityLevel(this.save.profile.abilities[b])
    )[0];
    const ability = ABILITIES[weakest];
    return `本局对你的「${ability.name}」要求较高：${ability.tagline} 建议：${ability.trainingPath}`;
  }

  private roleOptionLabel(option: StoryOption, index: number): string {
    return this.roleOptionView(option, index).label;
  }

  private roleOptionSummary(option: StoryOption, index: number): string {
    return this.roleOptionView(option, index).summary;
  }

  private roleOptionFeedback(option: StoryOption, index: number): string {
    return this.roleOptionView(option, index).feedback;
  }

  private roleOptionView(
    option: StoryOption,
    index: number
  ): (typeof ROLE_OPTION_SETS)[RoleId][OptionQuality][number] {
    return ROLE_OPTION_SETS[this.save.profile.role][option.quality][
      index % 3
    ];
  }

  private roleMove(quality: OptionQuality): string {
    const role = this.save.profile.role;
    const label = ROLES[role].shortName;
    if (role === "parachute") {
      return quality === "expert"
        ? `${label}打法：先诊断权力结构，再公开行动`
        : quality === "partial"
          ? `${label}打法：先建立权威，再补关系`
          : `${label}打法：快速立威，不等待共识`;
    }
    if (role === "founder") {
      return quality === "expert"
        ? `${label}打法：先验证现金流，再规模化`
        : quality === "partial"
          ? `${label}打法：先保交付，再谈体系`
          : `${label}打法：用创始人权力强推，快速试错`;
    }
    return quality === "expert"
      ? `${label}打法：先建立横向共识，再推动决策`
      : quality === "partial"
        ? `${label}打法：先争取关键支持，再尝试落地`
        : `${label}打法：越级推动，绕过部门阻力`;
  }

  private outcomeMarkup(outcome: ChoiceOutcome): string {
    const option = outcome.option;
    const transitionId = this.pendingChapterTransition;
    const action = transitionId
      ? "continue-transition"
      : this.pendingBranchNodeId
        ? "continue-branch"
        : "continue-story";
    const actionLabel = transitionId
      ? "查看章节过渡"
      : this.pendingBranchNodeId
        ? "进入角色分岔"
        : "返回地图";
    const streak = this.expertStreak();
    const encouragement =
      option.quality === "expert"
        ? streak >= 2
          ? `连续专家判断 x${streak}，你已经找到自己的判断节奏！`
          : "这一手判断精准，保持这个节奏。"
        : option.quality === "partial"
          ? "方向不错，下一步可以更稳。"
          : "你敢于在高压中行动，这份胆识也是领导力的一部分。";
    return `
      <section class="outcome-panel">
        <span class="quality ${option.quality}">${optionQualityLabel(option.quality)}</span>
        <div class="positive-feedback">${encouragement}</div>
        <h2>${escapeHtml(option.label)}</h2>
        <p>${escapeHtml(option.feedback)}</p>
        <blockquote>${escapeHtml(option.theory)}</blockquote>
        <div class="outcome-effects">
          <span><b>+${outcome.qualityScore}</b> 专家契合分</span>
          ${outcome.gainedAbilityIds.map((id) => `<span><b>+${option.effects[id] ?? 0}</b> ${ABILITIES[id].name}</span>`).join("")}
          ${(Object.keys(outcome.resourceDeltas) as ResourceKey[])
            .filter((key) => outcome.resourceDeltas[key])
            .map(
              (key) => `
                <span class="${(outcome.resourceDeltas[key] ?? 0) < 0 ? "negative" : "positive"}">
                  <b>${formatDelta(outcome.resourceDeltas[key] ?? 0)}</b> ${RESOURCE_NAMES[key]}
                </span>
              `
            )
            .join("")}
        </div>
        <button class="primary" data-action="${action}">${actionLabel}</button>
      </section>
    `;
  }

  private expertStreak(): number {
    let streak = 0;
    for (let i = this.save.decisionHistory.length - 1; i >= 0; i -= 1) {
      if (this.save.decisionHistory[i].quality === "expert") {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }

  private nextRankNeed(total: number): number {
    const ranks = [
      { min: 16 },
      { min: 26 },
      { min: 38 },
      { min: 48 }
    ];
    const next = ranks.find((rank) => total < rank.min);
    return next ? next.min - total : 0;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
