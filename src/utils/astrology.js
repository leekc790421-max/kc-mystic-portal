// Western Astrology Calculations for 1979-04-21 23:00 (子時) Shalu, Taichung
// Latitude: 24.2391°N, Longitude: 120.5264°E

export const BIRTH_DATA = {
  date: '1979-04-21',
  time: '23:00',
  timezone: 'Asia/Taipei',
  place: '沙鹿, 台中',
  lat: 24.2391,
  lng: 120.5264,
};

export const CHART_DATA = {
  sun: { sign: 'Taurus', degree: '0°20\'21"', house: 4, label: '太陽金牛' },
  moon: { sign: 'Aquarius', degree: '24°48\'', house: 2, label: '月亮水瓶' },
  ascendant: { sign: 'Capricorn', degree: '16°37\'', label: '上升摩羯' },
  midheaven: { sign: 'Scorpio', degree: '0°50\'', label: '中天天蝎' },
  mercury: { sign: 'Aries', degree: '28°15\'', house: 4, label: '水星白羊' },
  venus: { sign: 'Taurus', degree: '15°33\'', house: 5, label: '金星金牛' },
  mars: { sign: 'Taurus', degree: '3°45\'', house: 4, label: '火星金牛' },
  jupiter: { sign: 'Taurus', degree: '2°10\'', house: 4, label: '木星金牛' },
  saturn: { sign: 'Leo', degree: '3°22\'', house: 7, label: '土星獅子' },
  uranus: { sign: 'Scorpio', degree: '8°48\'', house: 10, label: '天王星天蝎' },
  neptune: { sign: 'Sagittarius', degree: '17°08\'', house: 11, label: '海王星射手' },
  pluto: { sign: 'Libra', degree: '16°22\'', house: 9, label: '冥王星天秤' },
};

export const SIGN_SYMBOLS = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const SIGN_ELEMENTS = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};

export const HOUSE_MEANINGS = {
  1: '自我・外在人格', 2: '財帛・價值觀', 3: '溝通・學習',
  4: '家庭・根基', 5: '創造・戀愛', 6: '健康・服務',
  7: '伴侶・合作', 8: '轉化・共財', 9: '哲學・遠行',
  10: '事業・社會地位', 11: '友誼・願景', 12: '靈性・潛意識',
};

export const TRANSITS_2026_2028 = [
  { period: '2026 Q1', planet: '木星', sign: 'Cancer', effect: '木星進入巨蟹座，激活你的第7宮伴侶宮，合作關係帶來成長' },
  { period: '2026 Q3', planet: '土星', sign: 'Aries', effect: '土星逆行白羊座，重新審視自我定位與內在力量' },
  { period: '2027 Q1', planet: '天王星', sign: 'Gemini', effect: '天王星進入雙子座，溝通方式與學習模式大轉變' },
  { period: '2027 Q2', planet: '海王星', sign: 'Aries', effect: '海王星進入白羊座，灵性覺醒與直覺力提升' },
  { period: '2027 Q4', planet: '冥王星', sign: 'Aquarius', effect: '冥王星正式進入水瓶座，深層轉化社交圈與未來願景' },
  { period: '2028 Q1', planet: '木星', sign: 'Leo', effect: '木星進入獅子座，創造力與自我表達達到高峰' },
  { period: '2028 Q3', planet: '土星', sign: 'Taurus', effect: '土星回到金牛座，鞏固財務基礎與價值體系' },
];
