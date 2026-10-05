import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PAYMENT_CHANNELS, ORDER_STATUS, ORDER_STATUS_LABELS, formatTWD, formatUSD } from '../utils/payment';

export default function AdminPanel({ isOpen, onClose }) {
  const { user, getAllUsers, getAllOrders, approveOrder, rejectOrder } = useAuth();
  const [tab, setTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (user?.role !== 'admin') return null;

  const users = getAllUsers();
  const orders = getAllOrders();
  const pendingOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.AI_REVIEWING);
  const completedOrders = orders.filter(o => o.status === ORDER_STATUS.APPROVED || o.status === ORDER_STATUS.REJECTED);

  const handleApprove = (orderId) => {
    const result = approveOrder(orderId);
    if (result.success) {
      setSelectedOrder(null);
    }
  };

  const handleReject = (orderId) => {
    const result = rejectOrder(orderId, rejectReason || '水單不符');
    if (result.success) {
      setSelectedOrder(null);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative glass-strong p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>

            <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-6">管理後台</h3>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: 'orders', label: `訂單 (${pendingOrders.length})` },
                { id: 'history', label: '歷史記錄' },
                { id: 'users', label: '用戶' },
                { id: 'settings', label: '設定' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${tab === t.id ? 'bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/40' : 'text-gray-400 border border-white/10 hover:border-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'orders' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">待審核訂單 ({pendingOrders.length})</p>
                {pendingOrders.length === 0 ? (
                  <div className="glass p-6 text-center">
                    <p className="text-sm text-gray-500">暫無待審核訂單</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.map(order => (
                      <OrderCard key={order.id} order={order} onView={() => setSelectedOrder(order)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'history' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">歷史訂單 ({completedOrders.length})</p>
                {completedOrders.length === 0 ? (
                  <div className="glass p-6 text-center">
                    <p className="text-sm text-gray-500">暫無歷史訂單</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedOrders.map(order => (
                      <OrderCard key={order.id} order={order} onView={() => setSelectedOrder(order)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'users' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">共 {users.length} 位用戶</p>
                <div className="space-y-2">
                  {users.map((u, i) => (
                    <div key={i} className="glass p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-200">{u.username}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-mystic-violet/20 text-mystic-violet' : 'bg-white/5 text-gray-400'}`}>
                          {u.role}
                        </span>
                        {u.createdAt && (
                          <span className="text-xs text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString('zh-TW')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="space-y-4">
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">商品定價</p>
                  <p className="text-lg text-mystic-gold">NT$1,888</p>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">收款帳戶</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>通道A：樂天國際銀行 (826) 8120101535981</p>
                    <p>通道B：臺灣銀行松山分行 (BKTWTWTP) 004-064004306448</p>
                    <p>通道C：Payoneer</p>
                  </div>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">AI 審核設定</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>自動通過門檻：AI 分數 ≥ 85</p>
                    <p>人工複核：AI 分數 &lt; 85</p>
                  </div>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">系統狀態</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-400">系統運行正常</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
              {selectedOrder && (
                <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedOrder(null)} />
                  <motion.div className="relative glass-strong p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                    <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                    
                    <h4 className="font-[family-name:var(--font-display)] text-mystic-gold mb-4">訂單詳情</h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <InfoBox label="訂單編號" value={selectedOrder.id} />
                        <InfoBox label="用戶" value={selectedOrder.username} />
                        <InfoBox label="信箱" value={selectedOrder.email} />
                        <InfoBox label="付款通道" value={PAYMENT_CHANNELS[selectedOrder.channel]?.name} />
                        <InfoBox label="金額 (TWD)" value={formatTWD(selectedOrder.amountTWD)} />
                        <InfoBox label="金額 (USD)" value={formatUSD(selectedOrder.amountUSD || 0)} />
                        <InfoBox label="狀態" value={ORDER_STATUS_LABELS[selectedOrder.status]} />
                        <InfoBox label="提交時間" value={new Date(selectedOrder.createdAt).toLocaleString('zh-TW')} />
                      </div>

                      {/* AI Review */}
                      <div className="glass p-4">
                        <p className="text-sm text-mystic-violet mb-2">AI 初審結果</p>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 bg-white/5 rounded-full h-2">
                            <div className="h-full rounded-full bg-gradient-to-r from-mystic-violet to-mystic-gold"
                              style={{ width: `${selectedOrder.aiScore || 0}%` }} />
                          </div>
                          <span className="text-sm text-mystic-gold">{selectedOrder.aiScore || 0}分</span>
                        </div>
                        <p className="text-xs text-gray-400">{selectedOrder.aiNotes || '無 AI 評估'}</p>
                      </div>

                      {/* Receipt Image */}
                      {selectedOrder.receipt && (
                        <div className="glass p-4">
                          <p className="text-sm text-gray-300 mb-2">水單圖片</p>
                          <img src={selectedOrder.receipt} alt="Receipt" className="max-w-full rounded-lg border border-white/10" />
                        </div>
                      )}

                      {/* Review Info */}
                      {selectedOrder.reviewedAt && (
                        <div className="glass p-4">
                          <p className="text-sm text-gray-300 mb-1">審核資訊</p>
                          <p className="text-xs text-gray-400">審核者：{selectedOrder.reviewedBy}</p>
                          <p className="text-xs text-gray-400">
                            審核時間：{new Date(selectedOrder.reviewedAt).toLocaleString('zh-TW')}
                          </p>
                          {selectedOrder.rejectReason && (
                            <p className="text-xs text-red-400 mt-1">拒絕原因：{selectedOrder.rejectReason}</p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {selectedOrder.status !== ORDER_STATUS.APPROVED && selectedOrder.status !== ORDER_STATUS.REJECTED && (
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          <button
                            onClick={() => handleApprove(selectedOrder.id)}
                            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-green-500/20 transition-all"
                          >
                            ✓ 一鍵放行
                          </button>
                          <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-red-500/20 transition-all"
                          >
                            ✕ 拒絕
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reject Reason Modal */}
            <AnimatePresence>
              {showRejectModal && (
                <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="absolute inset-0 bg-black/80" onClick={() => setShowRejectModal(false)} />
                  <motion.div className="relative glass-strong p-6 max-w-sm w-full"
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                    <h4 className="text-mystic-gold mb-4">拒絕原因</h4>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="請說明拒絕原因..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-mystic-gold/50 focus:outline-none resize-none h-24"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setShowRejectModal(false)}
                        className="flex-1 py-2 rounded-full border border-white/20 text-gray-400 text-sm hover:bg-white/5 transition-all"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleReject(selectedOrder.id)}
                        className="flex-1 py-2 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all"
                      >
                        確認拒絕
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OrderCard({ order, onView }) {
  const channel = PAYMENT_CHANNELS[order.channel];
  return (
    <div className="glass p-4 cursor-pointer hover:border-mystic-gold/30 transition-all" onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-gray-200">{order.id}</p>
          <p className="text-xs text-gray-500">{order.username} ({order.email})</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          order.status === ORDER_STATUS.APPROVED ? 'bg-green-500/20 text-green-400' :
          order.status === ORDER_STATUS.REJECTED ? 'bg-red-500/20 text-red-400' :
          order.status === ORDER_STATUS.AI_REVIEWING ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{channel?.name}</span>
        <span>{formatTWD(order.amountTWD)}</span>
      </div>
      {order.aiScore !== null && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-white/5 rounded-full h-1">
            <div className="h-full rounded-full bg-gradient-to-r from-mystic-violet to-mystic-gold"
              style={{ width: `${order.aiScore}%` }} />
          </div>
          <span className="text-xs text-gray-500">AI: {order.aiScore}分</span>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="glass p-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-200 truncate">{value}</p>
    </div>
  );
}
