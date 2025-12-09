
export interface WebAnalysis {
  domain: string;
  siteName: string;
  description: string;
  mainTopics: string[];
  targetAudience: string;
  sentimentScore: number; // 0 to 100
  seoScore: number; // Estimated 0 to 100
  techStack: string[];
  tags: string[];
  socialLinks: string[]; // New: Facebook, Twitter, etc.
  contactInfo: string[]; // New: Emails, phones
  keyStats: {
    estimatedTrafficTier: string;
    contentFrequency: string;
  };
  servesChina: boolean; // Checks if available/serving Mainland China
  chinaServiceDetails: string; // Reason/Source (e.g., "Has ICP license", "Supports Alipay")
  chinaAuthAvailable: boolean; // New: Checks if CN users can register/login
  chinaAuthDetails: string; // New: Details (e.g. "+86 support", "WeChat login")
  boardMembers: string[]; // New: Board of Directors / Key Execs
  stablecoinPayment: boolean; // New: Accepts USDT/USDC etc
  stablecoinDetails: string; // New: Details on crypto payments
}

export interface AppAnalysis {
  appName: string;
  storeUrl: string;
  platform: 'iOS' | 'Android' | 'Cross-Platform';
  developer: string;
  category: string;
  rating: number; // 0 to 5
  downloads: string; // e.g. "1M+"
  revenue: string; // New: Estimated revenue e.g. "$500k/mo"
  userDemographics: string; // New: e.g. "Male 60%, 18-25yo"
  price: string;
  countriesAvailable: string[]; // List of countries/regions
  description: string;
  tags: string[];
  lastUpdated: string;
  servesChina: boolean; // New
  chinaServiceDetails: string; // New
  chinaAuthAvailable: boolean; // New
  chinaAuthDetails: string; // New
  boardMembers: string[]; // New
  stablecoinPayment: boolean; // New
  stablecoinDetails: string; // New
}

export type AnalysisType = 'web' | 'app';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface CrawlResult {
  id: string;
  type: AnalysisType;
  timestamp: number;
  data: WebAnalysis | AppAnalysis;
  sources: GroundingSource[];
}

export interface SearchHistoryItem {
  query: string;
  mode: AnalysisType;
  timestamp: number;
}

export enum CrawlStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
