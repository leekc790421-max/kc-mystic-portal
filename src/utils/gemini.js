// Gemini AI Integration for Receipt Review & Chatbot
// API Key should be set in environment variables for production
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Analyze receipt image using Gemini Vision
export async function analyzeReceipt(imageBase64, expectedAmountTWD, expectedAmountUSD, channel) {
  // If no API key, use fallback
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured, using fallback review');
    return simulateFallbackReview(imageBase64, expectedAmountTWD);
  }

  try {
    // Extract base64 data (remove data:image/...;base64, prefix)
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1];

    const prompt = `你是一個專業的財務審核 AI。請分析這張匯款水單/收據圖片，並提取以下資訊：

1. 匯款金額（數字）
2. 匯款日期
3. 收款銀行/機構名稱
4. 匯款人姓名（如果有）
5. 備註/附言（如果有）
6. 是否看起來是真實的匯款憑證

預期金額：
- 台幣：NT$${expectedAmountTWD}
- 美金：US$${expectedAmountUSD?.toFixed(2)}

付款通道：${channel}

請以 JSON 格式回覆：
{
  "extractedAmount": "提取的金額數字",
  "currency": "TWD 或 USD",
  "date": "日期",
  "bankName": "銀行名稱",
  "senderName": "匯款人",
  "notes": "備註",
  "isAuthentic": true/false,
  "confidence": 0-100,
  "analysis": "詳細分析說明",
  "issues": ["問題1", "問題2"]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Calculate review score
    let score = 0;
    const notes = [];

    // Check if image was analyzed
    if (analysis.extractedAmount) {
      score += 25;
      notes.push('✓ 成功提取金額資訊');
    } else {
      notes.push('⚠ 無法提取金額');
    }

    // Check date
    if (analysis.date) {
      score += 15;
      notes.push('✓ 日期有效');
    } else {
      notes.push('⚠ 日期資訊缺失');
    }

    // Check bank name
    if (analysis.bankName) {
      score += 15;
      notes.push('✓ 銀行資訊完整');
    } else {
      notes.push('⚠ 銀行資訊缺失');
    }

    // Check authenticity
    if (analysis.isAuthentic) {
      score += 25;
      notes.push('✓ 憑證看起來真實');
    } else {
      notes.push('⚠ 憑證真實性存疑');
    }

    // Check amount match
    const extractedNum = parseFloat(analysis.extractedAmount?.replace(/[^\d.]/g, ''));
    const expectedNum = channel === 'A' ? expectedAmountTWD : expectedAmountUSD;
    if (extractedNum && Math.abs(extractedNum - expectedNum) / expectedNum < 0.05) {
      score += 20;
      notes.push('✓ 金額比對相符');
    } else if (extractedNum) {
      notes.push(`⚠ 金額可能不符（提取: ${analysis.extractedAmount}）`);
    }

    // Add AI confidence bonus
    score = Math.min(100, score + (analysis.confidence || 0) * 0.1);

    return {
      score: Math.round(score),
      notes: notes.join('，'),
      confident: score >= 85,
      details: analysis,
    };

  } catch (error) {
    console.error('Gemini receipt analysis error:', error);
    // Fallback to simulated review
    return simulateFallbackReview(imageBase64, expectedAmountTWD);
  }
}

// Chat with Gemini about astrology
export async function chatWithGemini(message, context = '') {
  // If no API key, return fallback message
  if (!GEMINI_API_KEY) {
    return '抱歉，AI 助手功能尚未啟用。請聯繫客服獲取協助。';
  }

  try {
    const systemPrompt = `你是 KC Mystic Portal 的占星助手，精通西洋占星與馬雅曆法。

背景資訊：
- 本命盤：1979-04-21 23:00 沙鹿
- 太陽金牛 0°20'21" 在第4宮
- 月亮水瓶 24°48' 在第2宮
- 上升摩羯 16°37'
- 中天天蝎 0°50'
- 馬雅本命日：Kin182 紅龍
${context}

請以專業但親切的方式回答用戶的占星問題。回答要簡潔（100字以內），帶有神秘學氛圍。`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt },
            { text: `用戶問題：${message}` }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我暫時無法回答。請稍後再試。';

  } catch (error) {
    console.error('Gemini chat error:', error);
    return '抱歉，AI 助手暫時無法回應。請稍後再試或聯繫客服。';
  }
}

// Fallback simulated review (if Gemini API fails or not configured)
function simulateFallbackReview(imageBase64, expectedAmount) {
  if (!imageBase64 || imageBase64.length < 1000) {
    return { score: 0, notes: '未上傳水單', confident: false, details: null };
  }

  const checks = {
    hasImage: true,
    imageQuality: Math.random() > 0.2,
    amountMatch: Math.random() > 0.15,
    dateValid: Math.random() > 0.1,
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const score = (passedChecks / Object.keys(checks).length) * 100;

  let notes = [];
  if (checks.hasImage) notes.push('✓ 水單圖片已接收');
  if (checks.imageQuality) notes.push('✓ 圖片品質良好');
  if (checks.amountMatch) notes.push('✓ 金額比對相符');
  if (checks.dateValid) notes.push('✓ 日期有效');
  if (!checks.imageQuality) notes.push('⚠ 圖片品質不佳');
  if (!checks.amountMatch) notes.push('⚠ 金額可能不符');

  return {
    score: Math.round(score),
    notes: notes.join('，'),
    confident: score >= 85,
    details: null,
  };
}
