import { useState } from 'react';
import { motion } from 'framer-motion';

const CARDS = [
  {
    symbol: '♉', name: 'Taurus', cn: '金牛座', color: '#4ade80',
    front: { title: '物質與感官', subtitle: 'The Hierophant' },
    back: {
      title: '金牛座的靈魂密碼',
      lines: [
        '你是大地之母的守護者，在物質世界中尋找神聖。',
        '太陽金牛0°20\' — 牡度開启，金牛能量的純粹起點。',
        '金星金牛15°33\' — 守護星回宮，美學與價值的雙重強化。',
        '你的天賦：將抽象轉化為具體，將靈感落地為現實。',
      ],
    },
  },
  {
    symbol: '♒', name: 'Aquarius', cn: '水瓶座', color: '#60a5fa',
    front: { title: '革新與自由', subtitle: 'The Star' },
    back: {
      title: '水瓶座的靈魂密碼',
      lines: [
        '月亮水瓶24°48\' — 情感在理性與直覺之間擺盪。',
        '你在群體中保持獨立，在連結中守護自由。',
        '第2宮月亮：財務直覺異常敏銳，價值觀與眾不同。',
        '你的天賦：以未來視角解決當下的問題。',
      ],
    },
  },
  {
    symbol: '♑', name: 'Capricorn', cn: '摩羯座', color: '#a78bfa',
    front: { title: '結構與成就', subtitle: 'The World' },
    back: {
      title: '摩羯座的靈魂密碼',
      lines: [
        '上升摩羯16°37\' — 土星守護的外在人格。',
        '你給世界的第一印象：沉穩、可靠、有距離感。',
        '中天天蝎：事業帶有轉化與深度研究的特質。',
        '你的天賦：在時間的長河中建造不朽的結構。',
      ],
    },
  },
];

function Particle({ x, y }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-mystic-gold"
          style={{
            animation: `stardust 0.8s ease-out ${i * 0.05}s forwards`,
            transform: `translate(${(Math.random() - 0.5) * 60}px, 0)`,
          }} />
      ))}
    </div>
  );
}

export default function TarotCards() {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [particles, setParticles] = useState([]);
  const [hoverIdx, setHoverIdx] = useState(-1);

  const handleFlip = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setParticles(prev => [...prev, { id: Date.now(), x, y, idx }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== Date.now())), 1000);
    setFlipped(prev => prev.map((f, i) => i === idx ? !f : f));
  };

  return (
    <section id="cards" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl text-mystic-gold mb-4">
            三重靈魂卡牌
          </h2>
          <p className="text-gray-400">點擊翻轉探索你的靈魂密碼</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          {CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              className={`card-3d cursor-pointer relative ${flipped[idx] ? 'card-flipped' : ''}`}
              style={{ width: 260, height: 380 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(-1)}
              onClick={(e) => handleFlip(idx, e)}
              animate={{
                rotateY: hoverIdx === idx && !flipped[idx] ? 15 : 0,
                rotateX: hoverIdx === idx && !flipped[idx] ? -10 : 0,
                scale: hoverIdx === idx ? 1.05 : 1,
              }}
              style={{
                width: 260, height: 380,
                filter: hoverIdx === idx ? `drop-shadow(0 0 20px ${card.color}40)` : 'none',
                transition: 'filter 0.3s',
              }}
            >
              <div className="card-inner relative w-full h-full">
                {/* Front */}
                <div className="card-front absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #1a0a2e 0%, ${card.color}15 50%, #1a0a2e 100%)`,
                    border: `2px solid ${card.color}40`,
                  }}>
                  <div className="absolute inset-2 rounded-xl" style={{
                    border: `1px solid ${card.color}20`,
                    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))',
                  }}>
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-7xl mb-4" style={{ color: card.color }}>{card.symbol}</span>
                      <h3 className="font-[family-name:var(--font-display)] text-xl text-white mb-1">{card.name}</h3>
                      <p className="text-sm text-gray-400">{card.cn}</p>
                      <div className="mt-4 px-3 py-1 rounded-full text-xs" style={{ background: `${card.color}20`, color: card.color }}>
                        {card.front.subtitle}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{card.front.title}</p>
                    </div>
                  </div>
                  {/* Corner decorations */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: `${card.color}60` }} />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: `${card.color}60` }} />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: `${card.color}60` }} />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: `${card.color}60` }} />
                </div>

                {/* Back */}
                <div className="card-back absolute inset-0 rounded-2xl overflow-hidden p-5"
                  style={{
                    background: `linear-gradient(135deg, #0d0520, ${card.color}10)`,
                    border: `2px solid ${card.color}40`,
                  }}>
                  <h4 className="font-[family-name:var(--font-display)] text-sm text-mystic-gold mb-3">{card.back.title}</h4>
                  <div className="space-y-2">
                    {card.back.lines.map((line, i) => (
                      <p key={i} className="text-xs text-gray-300 leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="text-3xl" style={{ color: card.color }}>{card.symbol}</span>
                  </div>
                </div>
              </div>

              {/* Particles */}
              {particles.filter(p => p.idx === idx).map(p => (
                <Particle key={p.id} x={p.x} y={p.y} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
