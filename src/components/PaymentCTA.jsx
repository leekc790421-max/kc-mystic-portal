import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const BANK_INFO = [
  { name: '臺灣銀行松山分行', swift: 'BKTWTWTP', code: '0040646', account: '004-064004306448' },
  { name: '樂天國際商業銀行', code: '826', account: '8120101535981' },
];

export default function PaymentCTA() {
  const { isPaid, markPaid, user } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [payMethod, setPayMethod] = useState(null);

  const handleVerify = () => {
    if (verifyCode.length >= 5) {
      markPaid();
      setShowVerifyModal(false);
      setShowPayModal(false);
    }
  };

  const features = [
    '西洋全盤 10 顆行星深度解讀',
    '上升摩羯 16.61° 人格密碼',
    '月亮水瓶第 2 宮情感分析',
    '馬雅 Kin182 紅龍本命日',
    '藍風暴波符 13 天完整指引',
    '2026-2028 流年運勢分析',
    '專屬 PDF 報告下載',
    '一次買斷，永久觀看',
  ];

  return (
    <section id="cta-pay" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl text-mystic-gold mb-4">
            {isPaid ? '已解鎖完整報告' : '開啟你的星際地圖'}
          </h2>
          <p className="text-gray-400">
            {isPaid ? '你已擁有完整的雙系統命盤解讀' : '解鎖完整的西洋×馬雅雙系統命盤解讀'}
          </p>
        </motion.div>

        {!isPaid ? (
          <motion.div
            className="glass-strong p-6 sm:p-10 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <p className="font-[family-name:var(--font-accent)] text-4xl text-mystic-gold mb-2">NT$1,888</p>
              <p className="text-sm text-gray-400">單次買斷・永久解鎖</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8 max-w-lg mx-auto">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-mystic-gold mt-0.5">✦</span>
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPayModal(true)}
              className="px-8 py-3 rounded-full font-bold text-mystic-bg bg-gradient-to-r from-mystic-gold to-mystic-gold-light hover:shadow-lg hover:shadow-mystic-gold/30 transition-all duration-300 pulse-gold"
            >
              立即解鎖 NT$1,888
            </button>

            <p className="text-xs text-gray-500 mt-4">付款後自動解鎖 · 支援銀行轉帳 / Payoneer</p>
          </motion.div>
        ) : (
          <motion.div className="glass-strong p-8 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-5xl block mb-4">🔓</span>
            <h3 className="text-xl text-mystic-gold mb-4">完整報告已解鎖</h3>
            <p className="text-gray-400 mb-6">你可以查看完整的西洋占星與馬雅曆法雙系統解讀。</p>
            <button className="px-6 py-2 rounded-full border border-mystic-gold/40 text-mystic-gold hover:bg-mystic-gold/10 transition-all">
              下載 PDF 報告
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {showPayModal && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPayModal(false)} />
              <motion.div className="relative glass-strong p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
                <button onClick={() => setShowPayModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-6">選擇付款方式</h3>

                <div className="space-y-4">
                  {BANK_INFO.map((bank, i) => (
                    <div key={i} className="glass p-4">
                      <p className="text-sm text-mystic-gold-light font-bold mb-2">{bank.name}</p>
                      {bank.swift && <p className="text-xs text-gray-400">SWIFT: {bank.swift}</p>}
                      <p className="text-xs text-gray-400">代碼: {bank.code}</p>
                      <p className="text-xs text-gray-400">帳號: {bank.account}</p>
                    </div>
                  ))}

                  <div className="glass p-4">
                    <p className="text-sm text-mystic-gold-light font-bold mb-2">Payoneer 快速付款</p>
                    <p className="text-xs text-gray-400 mb-2">透過 Payoneer 國際匯款</p>
                    <a href="https://link.payoneer.com/Token?t=4D0FBCB1CAEE48E48FEACE39662D6BB7&src=mobile"
                      target="_blank" rel="noopener noreferrer"
                      className="inline-block px-4 py-2 rounded-full bg-mystic-violet/20 text-mystic-violet text-sm hover:bg-mystic-violet/30 transition-all">
                      前往 Payoneer
                    </a>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-3">匯款後請填寫後五碼驗證：</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={5}
                        value={verifyCode}
                        onChange={e => setVerifyCode(e.target.value)}
                        placeholder="匯款後五碼"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-mystic-gold/50 focus:outline-none"
                      />
                      <button onClick={handleVerify}
                        disabled={verifyCode.length < 5}
                        className="px-4 py-2 rounded-lg bg-mystic-gold text-mystic-bg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mystic-gold-light transition-all">
                        驗證
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">驗證後將自動解鎖完整報告</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
