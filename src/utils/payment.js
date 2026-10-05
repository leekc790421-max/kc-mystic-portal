// Exchange Rate & Payment Utilities
const EXCHANGE_RATE_API = 'https://api.frankfurter.app/latest?from=USD&to=TWD';
const RATE_CACHE_KEY = 'kc_mp_exchange_rate';
const RATE_CACHE_DURATION = 3600000; // 1 hour

export async function getExchangeRate() {
  const cached = localStorage.getItem(RATE_CACHE_KEY);
  if (cached) {
    const { rate, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < RATE_CACHE_DURATION) {
      return rate;
    }
  }

  try {
    const res = await fetch(EXCHANGE_RATE_API);
    const data = await res.json();
    const rate = data.rates.TWD;
    localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
    return rate;
  } catch (error) {
    console.error('Failed to fetch exchange rate, using fallback:', error);
    // Fallback rate (approximate)
    return 32.5;
  }
}

export function formatTWD(amount) {
  return `NT$${Math.round(amount).toLocaleString()}`;
}

export function formatUSD(amount) {
  return `US$${amount.toFixed(2)}`;
}

export const PAYMENT_CHANNELS = {
  A: {
    id: 'A',
    name: '樂天國際商業銀行',
    type: 'domestic',
    label: '國內大額匯款',
    currency: 'TWD',
    bankCode: '826',
    account: '8120101535981',
    bankName: '樂天國際商業銀行',
    description: '適用於台灣國內銀行匯款，免手續費',
  },
  B: {
    id: 'B',
    name: '臺灣銀行松山分行',
    type: 'international',
    label: '海外電匯',
    currency: 'USD',
    swift: 'BKTWTWTP',
    branchCode: '0040646',
    account: '004-064004306448',
    bankName: 'Bank of Taiwan, Songshan Branch',
    address: 'No. 168, Minquan E. Rd., Sec. 5, Taipei City, Taiwan',
    description: '適用於海外銀行電匯，可能產生中間行手續費',
  },
  C: {
    id: 'C',
    name: 'Payoneer',
    type: 'online',
    label: 'Payoneer 快速付款',
    currency: 'USD',
    link: 'https://link.payoneer.com/Token?t=D03837B9300A4A2BA0650B36193A2836&src=mobile',
    description: '國際快速付款，支援信用卡/銀行帳戶',
  },
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  AI_REVIEWING: 'ai_reviewing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '待審核',
  [ORDER_STATUS.AI_REVIEWING]: 'AI 初審中',
  [ORDER_STATUS.APPROVED]: '已通過',
  [ORDER_STATUS.REJECTED]: '已拒絕',
};
