import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHART_DATA, SIGN_SYMBOLS } from '../utils/astrology';

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  const chartSummary = [
    { label: '太陽', value: `${CHART_DATA.sun.sign} ${CHART_DATA.sun.degree}`, detail: `第${CHART_DATA.sun.house}宮`, symbol: SIGN_SYMBOLS[CHART_DATA.sun.sign] },
    { label: '月亮', value: `${CHART_DATA.moon.sign} ${CHART_DATA.moon.degree}`, detail: `第${CHART_DATA.moon.house}宮`, symbol: SIGN_SYMBOLS[CHART_DATA.moon.sign] },
    { label: '上升', value: CHART_DATA.ascendant.degree, detail: CHART_DATA.ascendant.sign, symbol: SIGN_SYMBOLS[CHART_DATA.ascendant.sign] },
    { label: '中天', value: CHART_DATA.midheaven.degree, detail: CHART_DATA.midheaven.sign, symbol: SIGN_SYMBOLS[CHART_DATA.midheaven.sign] },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(45,27,105,0.4) 0%, rgba(26,10,46,0.9) 50%, #1a0a2e 100%)',
      }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-6xl text-mystic-gold mb-4 tracking-wider">
            KC Mystic Portal
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-2">1979.04.21 子時 ・ 沙鹿 ・ 雙系統命盤</p>
          <p className="font-[family-name:var(--font-accent)] text-2xl sm:text-3xl text-mystic-violet mb-12">
            上升摩羯 16.61° 的務實神秘學
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto cursor-pointer"
          style={{ width: 220, height: 220 }}
          onClick={() => setShowModal(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="crystal-float crystal-glow rounded-full relative"
            style={{
              width: 200, height: 200, margin: '0 auto',
              background: 'radial-gradient(circle at 35% 35%, rgba(123,47,247,0.3), rgba(79,195,247,0.15) 40%, rgba(212,175,55,0.1) 60%, rgba(26,10,46,0.8))',
              border: '1px solid rgba(212,175,55,0.3)',
            }}>
            <div className="absolute inset-4 rounded-full spin-slow" style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(212,175,55,0.15), transparent, rgba(123,47,247,0.15), transparent)',
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">♉</span>
            </div>
            <div className="absolute top-6 left-8 w-8 h-4 rounded-full bg-white/20 blur-sm rotate-[-30deg]" />
          </div>
          <p className="text-xs text-gray-500 mt-4">點擊水晶球查看命盤</p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {chartSummary.map((item, i) => (
            <div key={i} className="glass px-4 py-3 text-center min-w-[120px]">
              <span className="text-2xl block mb-1">{item.symbol}</span>
              <span className="text-xs text-gray-500">{item.label}</span>
              <p className="text-sm text-mystic-gold-light">{item.value}</p>
              <p className="text-xs text-gray-400">{item.detail}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative glass-strong p-6 sm:p-8 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-mystic-gold mb-6">命盤概覽</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(CHART_DATA).map(([key, planet]) => (
                  <div key={key} className="glass p-3 text-left">
                    <span className="text-lg">{SIGN_SYMBOLS[planet.sign]}</span>
                    <p className="text-xs text-gray-400">{planet.label}</p>
                    <p className="text-sm text-mystic-gold-light">{planet.degree}</p>
                    {planet.house && <p className="text-xs text-gray-500">第{planet.house}宮</p>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">1979-04-21 23:00 沙鹿, 台中 (24.24°N, 120.53°E)</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
