import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WAVESPELL_13_DAYS, WAVESPELL_THEME, WAVESPELL_PURPOSE } from '../utils/mayan';

const COLOR_MAP = {
  '紅': { bg: '#dc2626', light: '#fca5a5', text: '#fef2f2' },
  '白': { bg: '#e5e7eb', light: '#f9fafb', text: '#1f2937' },
  '藍': { bg: '#2563eb', light: '#93c5fd', text: '#eff6ff' },
  '黃': { bg: '#eab308', light: '#fde68a', text: '#fefce8' },
};

export default function MayanTimeline() {
  const scrollRef = useRef(null);
  const [activeKin, setActiveKin] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const userCard = el.querySelector('[data-user="true"]');
      if (userCard) userCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  return (
    <section id="mayan" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl text-mystic-gold mb-2">
            馬雅波符 13天
          </h2>
          <p className="font-[family-name:var(--font-accent)] text-xl text-mystic-violet mb-2">{WAVESPELL_THEME}</p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">左右拖曳探索 13 天能量旅程 ・ Kin 180 ~ Kin 192</p>
        </motion.div>

        <div className="glass p-4 sm:p-6 mb-8">
          <p className="text-sm text-gray-300 leading-relaxed">{WAVESPELL_PURPOSE}</p>
        </div>

        <div
          ref={scrollRef}
          className="timeline-scroll pb-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex gap-4 min-w-max px-4">
            {WAVESPELL_13_DAYS.map((day, idx) => {
              const colors = COLOR_MAP[day.color];
              const isUser = day.isUser;

              return (
                <motion.div
                  key={day.kin}
                  data-user={isUser}
                  className={`relative flex-shrink-0 rounded-xl p-4 cursor-pointer transition-all duration-300 ${isUser ? 'pulse-gold' : ''}`}
                  style={{
                    width: 160,
                    minHeight: 220,
                    background: isUser
                      ? `linear-gradient(135deg, ${colors.bg}30, ${colors.bg}10)`
                      : 'rgba(255,255,255,0.03)',
                    border: isUser ? `2px solid ${colors.bg}` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isUser ? `0 0 30px ${colors.bg}30` : 'none',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveKin(activeKin === day.kin ? null : day.kin)}
                  whileHover={{ y: -5 }}
                >
                  {isUser && (
                    <div className="absolute -top-2 -right-2 bg-mystic-gold text-mystic-bg text-xs px-2 py-0.5 rounded-full font-bold">
                      你
                    </div>
                  )}

                  <div className="text-center">
                    <span className="text-3xl block mb-2">{day.symbol}</span>
                    <p className="text-xs text-gray-500">Kin {day.kin}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: colors.bg }}>
                      {day.day} {day.color}{day.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{day.energy}</p>
                  </div>

                  {activeKin === day.kin && (
                    <motion.div
                      className="mt-3 pt-3 border-t border-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <p className="text-xs text-gray-300 leading-relaxed">{day.meaning}</p>
                    </motion.div>
                  )}

                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <div className="w-2 h-2 rounded-full mx-auto" style={{ background: colors.bg, opacity: 0.5 }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {Object.entries(COLOR_MAP).map(([color, val]) => (
            <div key={color} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: val.bg }} />
              <span className="text-xs text-gray-400">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
