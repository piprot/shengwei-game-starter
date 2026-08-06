export type Language = "zh" | "en";

export const UI_STRINGS = {
  zh: {
    brand: "权变之路",
    menuTitle: "在真实职场情境中进化领导力",
    menuContinue: "继续主线",
    createProfile: "创建档案",
    enterDuel: "进入 1v1",
    mainQuest: "主线征途",
    duel: "1v1 对决",
    ability: "能力图谱",
    report: "复盘报告",
    achievements: "成就墙",
    relations: "人物关系图",
    soundOn: "声音：开",
    soundOff: "声音：关",
    language: "EN",
    roleObjective: "本角色目标",
    situation: "当前局势摘要",
    highPressureOn: "开启高压模式",
    highPressureOff: "退出高压模式",
    randomEvent: "随机事件"
  },
  en: {
    brand: "Adaptive Ascent",
    menuTitle: "Grow leadership through real workplace decisions",
    menuContinue: "Continue",
    createProfile: "New Profile",
    enterDuel: "Enter 1v1",
    mainQuest: "Campaign",
    duel: "1v1 Duel",
    ability: "Ability Map",
    report: "Review Report",
    achievements: "Achievements",
    relations: "Relations",
    soundOn: "Sound: On",
    soundOff: "Sound: Off",
    language: "中文",
    roleObjective: "Role Objective",
    situation: "Current Situation",
    highPressureOn: "Enable Pressure Mode",
    highPressureOff: "Exit Pressure Mode",
    randomEvent: "Random Event"
  }
} as const;

export type UiStringKey = keyof typeof UI_STRINGS.zh;

export function uiString(language: Language, key: UiStringKey): string {
  return UI_STRINGS[language][key];
}
