import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: '什麼是西洋占星與馬雅曆法雙系統？',
    a: '結合西方黃道十二宮占星術與中美洲馬雅曆法系統，從兩個維度解讀您的靈魂藍圖。西洋占星分析行星位置與星座能量，馬雅曆法則透過卓爾金曆與長紀曆揭示銀河週期與生命密碼。'
  },
  {
    q: '解鎖完整報告需要多少費用？',
    a: 'NT$1,888 單次買斷，包含西洋全盤10顆行星深度解讀、上升星座密碼、馬雅波符13天完整指引、2026-2028流年分析，以及專屬PDF報告下載。一次付費，永久觀看。'
  },
  {
    q: '付款後多久可以收到報告？',
    a: '線上付款即時解鎖；銀行匯款轉帳於確認入帳後24小時內解鎖。匯款後填寫後五碼驗證碼，系統會自動建立待驗證訂單。'
  },
  {
    q: '支援哪些付款方式？',
    a: '目前支援：(1) 臺灣銀行松山分行匯款 (2) 樂天國際商業銀行匯款 (3) Payoneer 國際快速付款。後續將支援信用卡與 LINE Pay。'
  },
  {
    q: '什麼是上升摩羯16.61°？',
    a: '上升星座代表你給世界的第一印象與外在人格。摩羯16.61°意味著你展現出沉穩、負責、有野心的氣質，由土星守護，帶有時間建設者的能量。這個度数落在摩羯中段，暗示著結構與轉化的雙重特質。'
  },
  {
    q: '馬雅Kin182紅龍代表什麼？',
    a: 'Kin182是你在馬雅卓爾金曆中的本命日。紅龍（Imix）是馬雅神聖曆的第一個符號，代表原始生命力、母性能量、豐盛與保護。作為3紅龍，你帶有創造與滋養的核心能量。'
  },
  {
    q: '報告可以下載嗎？',
    a: '是的，解鎖後可下載完整的PDF報告，包含所有行星分析、馬雅曆法解讀、流年指引，方便離線閱讀或列印。'
  },
  {
    q: '可以退款嗎？',
    a: '由於本產品為數位內容即時解鎖，一經付款即無法退款。建議先瀏覽免費內容確認是否符合需求。如有任何問題，歡迎聯繫客服。'
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="relative py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl text-mystic-gold mb-4">
            常見問題
          </h2>
          <p className="text-gray-400">關於 KC Mystic Portal 的一切</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="glass overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-sm text-gray-200">{faq.q}</span>
                <motion.span
                  className="text-mystic-gold flex-shrink-0 text-lg"
                  animate={{ rotate: openIdx === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
