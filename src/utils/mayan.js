// Mayan Calendar Calculations for 1979-04-21
const GMT = 584283;

function julianDay(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

const JD = julianDay(1979, 4, 21);
const days = Math.floor(JD - GMT);

const baktun = Math.floor(days / 144000);
let rem = days % 144000;
const katun = Math.floor(rem / 7200); rem %= 7200;
const tun = Math.floor(rem / 360); rem %= 360;
const uinal = Math.floor(rem / 20);
const kin = rem % 20;

const dayNames = ['Imix','Ik','Akbal','Kan','Chicchan','Cimi','Manik','Lamat','Muluk','Ok','Chuwen','Eb','Ben','Ix','Men','Kib','Kaban','Etznab','Kawak','Ajaw'];
const dayNamesCN = ['Imix 鱷魚','Ik 風','Akbal 夜','Kan 蜥蜴','Chicchan 蛇','Cimi 死亡','Manik 鹿','Lamat 星辰','Muluk 水','Ok 犬','Chuwen 猴','Eb 草','Ben 蘆葦','Ix 美洲豹','Men 鷹','Kib 貓頭鷹','Kaban 地震','Etznab 黑曜石','Kawak 風暴','Ajaw 太陽'];

const tzolkinNumber = ((days + 3) % 13) + 1;
const tzolkinNameIdx = (19 + days) % 20;

const colors = ['紅','白','藍','黃'];
const colorNames = ['紅 Dragon 龍','白 Wind 風','藍 Night 夜','黃 Seed 種子','紅 Snake 蛇','白 World-Bridger 世界橋','藍 Hand 手','黃 Star 星星','紅 Moon 月','白 Dog 狗','藍 Monkey 猴','黃 Sun 太陽','紅 Sky Walker 天行者','白 Wizard 魔法師','藍 Eagle 鷹','白 Butterfly 蝴蝶','紅 Storm 風暴','黃 Human 人','白 Earth 地球','藍 Mirror 鏡'];

export const MAYAN_DATA = {
  longCount: `${baktun}.${katun}.${tun}.${uinal}.${kin}`,
  tzolkin: { number: tzolkinNumber, name: dayNames[tzolkinNameIdx], nameCN: dayNamesCN[tzolkinNameIdx] },
  haab: { calculate: true },
  kinNumber: 182,
  dayName: '紅龍 Red Dragon',
  galacticSignature: '銀河系中心・龍之族',
};

export const WAVESPELL_13_DAYS = [
  { kin: 180, day: 1, color: '藍', name: '風暴', symbol: '☁️', meaning: '淨化・釋放舊有模式', energy: '啟動' },
  { kin: 181, day: 2, color: '黃', name: '太陽', symbol: '☀️', meaning: '點燃內在之光・照亮道路', energy: '挑戰' },
  { kin: 182, day: 3, color: '紅', name: '龍', symbol: '🐉', meaning: '原始生命力的覺醒・你的本命日', energy: '服務・本命位置', isUser: true },
  { kin: 183, day: 4, color: '白', name: '風', symbol: '💨', meaning: '呼吸之間連結宇宙意識', energy: '形式' },
  { kin: 184, day: 5, color: '藍', name: '夜', symbol: '🌙', meaning: '潛意识的深處探索', energy: '核心' },
  { kin: 185, day: 6, color: '黃', name: '種子', symbol: '🌱', meaning: '播下新可能的種子', energy: '平衡' },
  { kin: 186, day: 7, color: '紅', name: '蛇', symbol: '🐍', meaning: '昆達里尼能量上升・蛻變', energy: '共振' },
  { kin: 187, day: 8, color: '白', name: '世界橋', symbol: '🌉', meaning: '跨越維度的橋樑・連結天地的通道', energy: '銀河' },
  { kin: 188, day: 9, color: '藍', name: '手', symbol: '✋', meaning: '以雙手創造實相', energy: '目的' },
  { kin: 189, day: 10, color: '黃', name: '星星', symbol: '⭐', meaning: '宇宙導航・願景清晰', energy: '顯化' },
  { kin: 190, day: 11, color: '紅', name: '月', symbol: '🌊', meaning: '潮汐的_pull・情感流動', energy: '宇宙' },
  { kin: 191, day: 12, color: '白', name: '狗', symbol: '🐕', meaning: '忠誠・心的守護', energy: '太陽' },
  { kin: 192, day: 13, color: '藍', name: '猴', symbol: '🐒', meaning: '神聖的遊戲・完成波符', energy: '整合・完成' },
];

export const WAVESPELL_THEME = '蛻變的波符';
export const WAVESPELL_PURPOSE = '在這13天中，你將經歷從風暴淨化到猴之神聖遊戲的完整蛻變旅程。本命日Kin182紅龍位於第3天（服務位置），代表你的核心使命是以原始生命力服務他人。';

export function getMayanDate(offset = 0) {
  const baseKin = 182;
  const targetKin = baseKin + offset;
  const wavespell = WAVESPELL_13_DAYS.find(d => d.kin === targetKin);
  return wavespell || WAVESPELL_13_DAYS[0];
}
