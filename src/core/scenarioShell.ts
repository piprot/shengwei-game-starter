export interface ScenarioShellText {
  zh: string;
  en: string;
  key: string;
}

const INDUSTRIES = [
  { zh: "科技", en: "Tech" },
  { zh: "制造", en: "Manufacturing" },
  { zh: "零售", en: "Retail" },
  { zh: "医疗", en: "Healthcare" },
  { zh: "金融", en: "Finance" },
  { zh: "教育", en: "Education" }
] as const;

const TEAM_SIZES = [10, 50, 200, 500] as const;

const CRISES = [
  { zh: "授权真空", en: "authority vacuum" },
  { zh: "派系斗争", en: "faction rivalry" },
  { zh: "关键人才流失", en: "key talent churn" },
  { zh: "战略转型", en: "strategic shift" },
  { zh: "并购整合", en: "merger integration" },
  { zh: "流程失序", en: "process disorder" },
  { zh: "继任断层", en: "succession gap" },
  { zh: "市场危机", en: "market crisis" },
  { zh: "增长失速", en: "growth stall" }
] as const;

/**
 * 程序化情境外壳：不改 18 个核心情境的决策结构，
 * 只按章节与游玩种子轮换行业/团队规模/危机类型，让重玩时背景保持新鲜。
 */
export function scenarioShellFor(
  chapterId: number,
  seed: number
): ScenarioShellText {
  const safeSeed = Math.abs(Math.floor(seed) || 1);
  const industry =
    INDUSTRIES[Math.floor(safeSeed / 7) % INDUSTRIES.length];
  const teamSize =
    TEAM_SIZES[Math.floor(safeSeed / 31) % TEAM_SIZES.length];
  const crisis =
    CRISES[(chapterId - 1 + Math.floor(safeSeed / 13)) % CRISES.length];
  return {
    zh: `${industry.zh}行业 · ${teamSize} 人团队 · ${crisis.zh}`,
    en: `${industry.en} · ${teamSize}-person team · ${crisis.en}`,
    key: crisis.en
  };
}
