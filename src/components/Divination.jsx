import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TRANSITS_2026_2028 } from '../utils/astrology';

const INSIGHTS = [
  { category: '事業', text: '上升摩羯的你在2026年將迎來事業的重大轉折。土星在你的命宮逆行，要求你重新定義成功的定義。' },
  { category: '感情', text: '月亮水瓶在第2宮暗示你的情感需求與價值觀緊密相連。找到能理解你獨特情感語言的伴侶是關鍵。' },
  { category: '靈性', text: '馬雅Kin182紅龍賦予你原始的生命力。在這13天波符中，你的靈性覺醒將加速。' },
  { category: '財富', text: '太陽金牛在第4宮，家庭不動產是主要的財富來源。2027年天王星進入雙子座將帶來新的收入管道。' },
  { category: '健康', text: '火星金牛在第4宮提醒你關注呼吸系統與頸部。定期接觸大自然是最好的療癒。' },
  { category: '流年', text: '2028年木星進入獅子座，你的創造力與自我表達將達到人生高峰。把握這個窗口。' },
];

export default function Divination() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const ballRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!ballRef.current) return;
    const rect = ballRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 30;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height * -30;
    if (!isDragging) setRotation({ x: y, y: x });
  };

  const handleDrag = (e) => {
    const rect = ballRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width * 40;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height * -40;
    setRotation({ x: y, y: x });
  };

  return (
    <section id="divination" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl text-mystic-gold mb-4">
            互動水晶球占卜
          </h2>
          <p className="text-gray-400">拖曳旋轉水晶球，選擇你的提問領域</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <div
              ref={ballRef}
              className="relative cursor-grab active:cursor-grabbing"
              style={{ width: 280, height: 280 }}
              onMouseMove={handleMouseMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => { setIsDragging(false); setRotation({ x: 0, y: 0 }); }}
            >
              <motion.div
                className="w-full h-full rounded-full crystal-glow relative overflow-hidden"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(123,47,247,0.4), rgba(79,195,247,0.2) 40%, rgba(212,175,55,0.1) 60%, rgba(13,5,32,0.9))',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
                animate={{ rotateX: rotation.x, rotateY: rotation.y }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <div className="absolute inset-0 spin-slow" style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(212,175,55,0.1), transparent, rgba(123,47,247,0.1), transparent)',
                }} />
                {/* Zodiac wheel */}
                <div className="absolute inset-6 rounded-full border border-mystic-gold/20 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-mystic-violet/20 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl block">🔮</span>
                      <p className="text-xs text-mystic-gold/60 mt-1">拖曳旋轉</p>
                    </div>
                  </div>
                  {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s, i) => (
                    <span key={i} className="absolute text-sm text-mystic-gold/40" style={{
                      transform: `rotate(${i * 30}deg) translateY(-110px)`,
                    }}>{s}</span>
                  ))}
                </div>
                <div className="absolute top-8 left-10 w-12 h-6 rounded-full bg-white/10 blur-md rotate-[-30deg]" />
              </motion.div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-6">2026-2028 流年指引</h3>
            <div className="grid gap-3">
              {TRANSITS_2026_2028.map((transit, i) => (
                <motion.div
                  key={i}
                  className="glass p-4 cursor-pointer hover:border-mystic-gold/30 transition-all"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedInsight(i)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-mystic-violet bg-mystic-violet/10 px-2 py-0.5 rounded">{transit.period}</span>
                    <span className="text-sm text-mystic-gold-light">{transit.planet}・{transit.sign}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{transit.effect}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-gray-400 mb-3">選擇提問領域：</h4>
              <div className="flex flex-wrap gap-2">
                {INSIGHTS.map((ins, i) => (
                  <button key={i}
                    className="px-3 py-1.5 rounded-full text-xs border transition-all"
                    style={{
                      borderColor: selectedInsight === i ? '#d4af37' : 'rgba(255,255,255,0.1)',
                      background: selectedInsight === i ? 'rgba(212,175,55,0.1)' : 'transparent',
                      color: selectedInsight === i ? '#d4af37' : '#9ca3af',
                    }}
                    onClick={() => setSelectedInsight(i)}
                  >
                    {ins.category}
                  </button>
                ))}
              </div>
              {selectedInsight !== null && (
                <motion.div
                  className="mt-4 glass p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-gray-300 leading-relaxed">{INSIGHTS[selectedInsight].text}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
