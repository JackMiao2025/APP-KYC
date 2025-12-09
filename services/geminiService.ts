
import { GoogleGenAI } from "@google/genai";
import { WebAnalysis, AppAnalysis, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON string from markdown
const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

// Extract sources from grounding metadata
const extractSources = (response: any): GroundingSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .map((chunk: any) => {
      if (chunk.web) {
        return { title: chunk.web.title, url: chunk.web.uri };
      }
      return null;
    })
    .filter((s: any): s is GroundingSource => s !== null);
};

export const analyzeDomain = async (domain: string, lang: 'en' | 'zh' = 'en'): Promise<{ data: WebAnalysis; sources: GroundingSource[] }> => {
  const modelId = "gemini-2.5-flash"; 
  const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese (zh-CN)." : "Respond in English.";

  const prompt = `
    You are an advanced web crawler and competitive intelligence analyst.
    
    Task: Deeply analyze the website: "${domain}".
    ${langInstruction}
    
    Using Google Search, find comprehensive data including contact details, social presence, technical infrastructure.
    
    **CRITICAL ANALYSIS POINTS:**
    1. **China Service & Registration**: 
       - ICP license? Simplified Chinese support? Alipay/WeChat Pay?
       - Can +86 numbers register? Login via WeChat/QQ?
    2. **Corporate Intelligence**:
       - Who are the **Board of Directors** or Key Executives (CEO, CTO, Founders)?
    3. **Payment Gateways**:
       - Does it accept **Stablecoins** (USDT, USDC, DAI) or Cryptocurrency payments directly?

    Return a VALID JSON object (no markdown formatting). Structure:
    {
      "domain": "${domain}",
      "siteName": "Official Name",
      "description": "Concise summary.",
      "mainTopics": ["Topic 1", "Topic 2"],
      "targetAudience": "Who is this for?",
      "sentimentScore": 85, 
      "seoScore": 90,
      "techStack": ["React", "AWS", "Analytics Tools", "CMS"],
      "tags": ["Tag1", "Tag2"],
      "socialLinks": ["twitter.com/...", "linkedin.com/..."],
      "contactInfo": ["support@email.com", "+1-800..."],
      "keyStats": {
        "estimatedTrafficTier": "Low | Medium | High | Very High",
        "contentFrequency": "Daily | Weekly | Monthly | Static"
      },
      "servesChina": true,
      "chinaServiceDetails": "Has ICP license (京ICP备...) and supports Alipay.",
      "chinaAuthAvailable": true,
      "chinaAuthDetails": "Supports +86 SMS verification and WeChat Login.",
      "boardMembers": ["John Doe (CEO)", "Jane Smith (Board Director)"],
      "stablecoinPayment": true,
      "stablecoinDetails": "Accepts USDT via TRC20 and USDC via Ethereum."
    }
    
    Notes:
    - sentimentScore: 0-100 (Brand reputation).
    - seoScore: 0-100 (Technical health).
    - chinaAuthAvailable: true if specifically accessible for CN users (phone/socials).
    - If contact/socials/board members are not found, return empty arrays.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(cleanJsonString(text));
    
    return {
      data: parsedData,
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Gemini Web API Error:", error);
    throw error;
  }
};

export const analyzeApp = async (url: string, lang: 'en' | 'zh' = 'en'): Promise<{ data: AppAnalysis; sources: GroundingSource[] }> => {
  const modelId = "gemini-2.5-flash";
  const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese (zh-CN)." : "Respond in English.";

  const prompt = `
    You are a mobile app market researcher.
    
    Task: Analyze the App Store or Google Play Store URL: "${url}".
    If the user provided a name instead of a URL, search for the most popular app with that name.
    ${langInstruction}

    Find details about availability, categories, metrics.

    **CRITICAL ANALYSIS POINTS:**
    1. **China Service & Registration**: 
       - Available in CN App Stores?
       - Supports +86 registration? WeChat/QQ Login?
    2. **Business Metrics**: Estimate Downloads, Monthly Revenue, and User Demographics.
    3. **Corporate Intelligence**:
       - Who owns the app? Who are the **Board of Directors** or Key Executives of the developer company?
    4. **Payment Gateways**:
       - Does the app support **Stablecoin** (USDT/USDC) payments or wallet integration?

    Return a VALID JSON object (no markdown formatting). Structure:
    {
      "appName": "Name of App",
      "storeUrl": "${url}",
      "platform": "iOS" or "Android" or "Cross-Platform" (infer from URL or search),
      "developer": "Developer Name",
      "category": "Productivity / Game / etc",
      "rating": 4.5,
      "downloads": "10M+ (Estimate if exact not found)",
      "revenue": "$500k/mo (Estimate)",
      "userDemographics": "Primarily Gen Z (18-24), 60% Male",
      "price": "Free / $9.99",
      "countriesAvailable": ["USA", "Japan", "Global", "China" - list top regions],
      "description": "Short description of the app functionality",
      "tags": ["Tag1", "Tag2"],
      "lastUpdated": "e.g., Oct 2023",
      "servesChina": true,
      "chinaServiceDetails": "Available in Apple App Store China.",
      "chinaAuthAvailable": true,
      "chinaAuthDetails": "Allows login via WeChat and supports +86 phone numbers.",
      "boardMembers": ["Developer Name (Indie)"] or ["CEO Name", "Board Member Name"],
      "stablecoinPayment": false,
      "stablecoinDetails": "Uses standard IAP only."
    }

    Note:
    - rating: Number 0.0 to 5.0
    - If servesChina is false, set details to e.g., "Not found in China region stores".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "{}";
    const parsedData = JSON.parse(cleanJsonString(text));

    return {
      data: parsedData,
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Gemini App API Error:", error);
    throw error;
  }
};
