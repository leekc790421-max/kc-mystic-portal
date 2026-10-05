import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PAYMENT_CHANNELS, getExchangeRate, formatTWD, formatUSD, ORDER_STATUS, ORDER_STATUS_LABELS } from '../utils/payment';

const BASE_PRICE_TWD = 1888;

export default function PaymentCTA() {
  const { isPaid, user, createOrder, getUserOrders } = useAuth();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    getExchangeRate().then(setExchangeRate);
  }, []);

  useEffect(() => {
    if (user) {
      setUserOrders(getUserOrders());
    }
  }, [user, isPaid]);

  const priceTWD = BASE_PRICE_TWD;
  const priceUSD = exchangeRate ? (priceTWD / exchangeRate) : null;

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    if (channel.id === 'C') {
      // Payoneer - open in new tab
      window.open(channel.link, '_blank');
      setShowReceiptModal(true);
    } else {
      setShowReceiptModal(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!receiptPreview) {
      alert('請上傳水單圖片');
      return;
    }

    setSubmitting(true);
    try {
      const result = createOrder(
        selectedChannel.id,
        priceTWD,
        priceUSD,
        receiptPreview
      );
      setOrderResult(result);
      setUserOrders(getUserOrders());
      
      if (result.status === ORDER_STATUS.APPROVED) {
        setTimeout(() => {
          setShowReceiptModal(false);
          setShowPayModal(false);
        }, 2000);
      }
    } catch (error) {
      alert('提交失敗，請稍後再試');
    }
    setSubmitting(false);
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
            <div className="mb-6">
              <p className="font-[family-name:var(--font-accent)] text-4xl text-mystic-gold mb-2">
                {formatTWD(priceTWD)}
              </p>
              {priceUSD && (
                <p className="text-sm text-gray-400 mb-1">
                  ≈ {formatUSD(priceUSD)} (即時匯率)
                </p>
              )}
              {exchangeRate && (
                <p className="text-xs text-gray-500">
                  USD/TWD: {exchangeRate.toFixed(2)}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2">單次買斷・永久解鎖</p>
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
              立即解鎖 {formatTWD(priceTWD)}
            </button>

            <p className="text-xs text-gray-500 mt-4">
              匯款後上傳水單 → AI 初審 → 管理者放行 → 自動解鎖
            </p>

            {/* User Orders */}
            {user && userOrders.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">你的訂單</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {userOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="glass p-3 text-left flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-300">{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString('zh-TW')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === ORDER_STATUS.APPROVED ? 'bg-green-500/20 text-green-400' :
                        order.status === ORDER_STATUS.REJECTED ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        {/* Payment Channel Selection Modal */}
        <AnimatePresence>
          {showPayModal && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPayModal(false)} />
              <motion.div className="relative glass-strong p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
                <button onClick={() => setShowPayModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-2">選擇付款方式</h3>
                <p className="text-xs text-gray-400 mb-6">
                  金額：{formatTWD(priceTWD)} {priceUSD && `≈ ${formatUSD(priceUSD)}`}
                </p>

                <div className="space-y-4">
                  {Object.values(PAYMENT_CHANNELS).map(channel => (
                    <div key={channel.id} className="glass p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm text-mystic-gold-light font-bold">{channel.label}</p>
                          <p className="text-xs text-gray-400">{channel.name}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          {channel.currency}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{channel.description}</p>

                      {channel.id === 'A' && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>銀行代碼：{channel.bankCode}</p>
                          <p>帳號：{channel.account}</p>
                          <p className="text-mystic-violet">戶名：KC Mystic Portal</p>
                        </div>
                      )}

                      {channel.id === 'B' && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>SWIFT：{channel.swift}</p>
                          <p>分行代碼：{channel.branchCode}</p>
                          <p>帳號：{channel.account}</p>
                          <p>銀行：{channel.bankName}</p>
                          <p className="text-gray-500 text-[10px]">{channel.address}</p>
                        </div>
                      )}

                      {channel.id === 'C' && (
                        <div className="text-xs text-gray-400">
                          <p>點擊下方按鈕前往 Payoneer 付款</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleChannelSelect(channel)}
                        className="mt-3 w-full py-2 rounded-lg bg-mystic-violet/20 text-mystic-violet text-sm hover:bg-mystic-violet/30 transition-all"
                      >
                        {channel.id === 'C' ? '前往 Payoneer' : '選擇此方式'}
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center">
                  匯款後請上傳水單，AI 將自動初審，管理者確認後立即解鎖
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Receipt Upload Modal */}
        <AnimatePresence>
          {showReceiptModal && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !submitting && setShowReceiptModal(false)} />
              <motion.div className="relative glass-strong p-6 sm:p-8 max-w-md w-full"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
                <button onClick={() => !submitting && setShowReceiptModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                
                <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-2">上傳水單</h3>
                <p className="text-xs text-gray-400 mb-4">
                  通道：{selectedChannel?.name} | 金額：{formatTWD(priceTWD)}
                </p>

                {orderResult ? (
                  <div className="text-center py-4">
                    {orderResult.status === ORDER_STATUS.APPROVED ? (
                      <>
                        <span className="text-5xl block mb-4">✓</span>
                        <p className="text-mystic-gold text-lg mb-2">AI 初審通過！</p>
                        <p className="text-sm text-gray-400">報告已自動解鎖</p>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl block mb-4">📋</span>
                        <p className="text-mystic-gold text-lg mb-2">水單已提交</p>
                        <p className="text-sm text-gray-400 mb-4">訂單編號：{orderResult.orderId}</p>
                        <p className="text-xs text-gray-500">
                          AI 初審中，管理者確認後將自動解鎖。請至「你的訂單」查看狀態。
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-300 mb-2">上傳水單圖片</label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-mystic-gold/50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label htmlFor="receipt-upload" className="cursor-pointer">
                          {receiptPreview ? (
                            <img src={receiptPreview} alt="Receipt" className="max-h-40 mx-auto rounded" />
                          ) : (
                            <>
                              <span className="text-3xl block mb-2">📄</span>
                              <p className="text-sm text-gray-400">點擊上傳水單圖片</p>
                              <p className="text-xs text-gray-500 mt-1">支援 JPG、PNG，最大 5MB</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="glass p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-2">匯款資訊：</p>
                      {selectedChannel?.id === 'A' && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>銀行：樂天國際商業銀行 ({selectedChannel.bankCode})</p>
                          <p>帳號：{selectedChannel.account}</p>
                          <p>金額：{formatTWD(priceTWD)}</p>
                        </div>
                      )}
                      {selectedChannel?.id === 'B' && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>銀行：臺灣銀行松山分行</p>
                          <p>SWIFT：{selectedChannel.swift}</p>
                          <p>帳號：{selectedChannel.account}</p>
                          <p>金額：{formatUSD(priceUSD)}</p>
                        </div>
                      )}
                      {selectedChannel?.id === 'C' && (
                        <div className="text-xs text-gray-400">
                          <p>Payoneer 付款金額：{formatUSD(priceUSD)}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSubmitReceipt}
                      disabled={!receiptPreview || submitting}
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-mystic-gold to-mystic-gold-light text-mystic-bg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-mystic-gold/20 transition-all"
                    >
                      {submitting ? '提交中...' : '提交水單'}
                    </button>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      提交後 AI 將自動初審，管理者確認後解鎖
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
