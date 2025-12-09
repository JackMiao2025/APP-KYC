
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CrawlResult, WebAnalysis, AppAnalysis } from '../types';
import { Filter } from 'lucide-react';

interface ComparisonChartProps {
  results: CrawlResult[];
  lang: 'en' | 'zh';
}

// Helper to parse "1M+", "500k" into numbers
const parseDownloads = (str: string) => {
  if (!str) return 0;
  const clean = str.toLowerCase().replace(/[^0-9.km]/g, '');
  let multiplier = 1;
  if (clean.includes('k')) multiplier = 1000;
  if (clean.includes('m')) multiplier = 1000000;
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num * multiplier;
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ results, lang }) => {
  const [metrics, setMetrics] = useState({
    downloads: true,
    revenue: true,
    demographics: true,
    regions: true
  });

  if (results.length === 0) return null;

  const appResults = results.filter(r => r.type === 'app').map(r => r.data as AppAnalysis);
  
  // Prepare data for Bar Chart (Scores)
  const scoreData = results.map(r => {
    if (r.type === 'web') {
      const d = r.data as WebAnalysis;
      return {
        name: d.domain,
        Score: d.sentimentScore,
        "SEO/Rating": d.seoScore,
        type: 'Web'
      };
    } else {
      const d = r.data as AppAnalysis;
      const normalizedRating = d.rating ? (d.rating / 5) * 100 : 0;
      return {
        name: d.appName,
        Score: normalizedRating, 
        "SEO/Rating": normalizedRating,
        type: 'App'
      };
    }
  });

  // Prepare data for Downloads Chart (Apps only)
  const downloadsData = appResults.map(a => ({
    name: a.appName,
    Downloads: parseDownloads(a.downloads),
    raw: a.downloads
  }));

  const labels = {
    marketStrength: lang === 'zh' ? "市场竞争力对比" : "Market Strength Comparison",
    appPerformance: lang === 'zh' ? "应用表现与下载量" : "App Performance & Downloads",
    detailedMetrics: lang === 'zh' ? "详细指标对比" : "Detailed Metrics Comparison",
    appName: lang === 'zh' ? "应用名称" : "App Name",
    revenue: lang === 'zh' ? "预估营收" : "Est. Revenue",
    demographics: lang === 'zh' ? "用户画像/地区" : "User Demographics",
    regions: lang === 'zh' ? "国家地区" : "Country/Region",
    showMetrics: lang === 'zh' ? "显示指标:" : "Compare:",
    lDownloads: lang === 'zh' ? "下载量" : "Downloads",
    lRevenue: lang === 'zh' ? "营收" : "Revenue",
    lDemographics: lang === 'zh' ? "用户分布" : "User Loc.",
    lRegions: lang === 'zh' ? "可用地区" : "Regions",
  };

  const toggleMetric = (key: keyof typeof metrics) => {
    setMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 mb-8">
      {/* 1. General Score Comparison */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-semibold text-emerald-400 mb-4">{labels.marketStrength}</h3>
        <p className="text-xs text-slate-400 mb-4">{lang === 'zh' ? "注：应用评分已归一化为 0-100" : "Note: Apps are normalized to 0-100 scale"}</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }} 
              />
              <Legend />
              <Bar name="Sentiment / Rating" dataKey="Score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. App Specific Metrics (if any apps exist) */}
      {appResults.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative">
            
            {/* Control Panel */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-slate-700">
               <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                   <Filter size={16} /> {labels.showMetrics}
               </div>
               <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                   <input type="checkbox" checked={metrics.downloads} onChange={() => toggleMetric('downloads')} className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-offset-slate-800" />
                   {labels.lDownloads}
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                   <input type="checkbox" checked={metrics.revenue} onChange={() => toggleMetric('revenue')} className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-offset-slate-800" />
                   {labels.lRevenue}
               </label>
               <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                   <input type="checkbox" checked={metrics.regions} onChange={() => toggleMetric('regions')} className="rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-offset-slate-800" />
                   {labels.lRegions}
               </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white">
                   <input type="checkbox" checked={metrics.demographics} onChange={() => toggleMetric('demographics')} className="rounded border-slate-600 bg-slate-700 text-pink-500 focus:ring-offset-slate-800" />
                   {labels.lDemographics}
               </label>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Downloads Chart (Conditional) */}
                {metrics.downloads && (
                     <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-blue-400 mb-4">{labels.appPerformance}</h3>
                        <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={downloadsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }} 
                                formatter={(value: any, name: any, props: any) => [props.payload.raw, labels.lDownloads]}
                            />
                            <Bar dataKey="Downloads" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Detailed Comparison Table (Dynamic Columns) */}
                <div className={`${metrics.downloads ? 'md:col-span-1' : 'md:col-span-2'} flex flex-col`}>
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">{labels.detailedMetrics}</h3>
                    <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-900/50 text-slate-500">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">{labels.appName}</th>
                            {metrics.revenue && <th className="px-4 py-3">{labels.revenue}</th>}
                            {metrics.regions && <th className="px-4 py-3">{labels.regions}</th>}
                            {metrics.demographics && <th className="px-4 py-3 rounded-tr-lg">{labels.demographics}</th>}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                        {appResults.map((app, idx) => (
                            <tr key={idx} className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 font-medium text-white">{app.appName}</td>
                            
                            {metrics.revenue && (
                                <td className="px-4 py-3 text-emerald-400">{app.revenue || 'N/A'}</td>
                            )}
                            
                            {metrics.regions && (
                                <td className="px-4 py-3 max-w-[150px] truncate" title={app.countriesAvailable.join(', ')}>
                                    {app.countriesAvailable.slice(0, 3).join(', ')}
                                    {app.countriesAvailable.length > 3 && '...'}
                                </td>
                            )}

                            {metrics.demographics && (
                                <td className="px-4 py-3 max-w-[150px] truncate" title={app.userDemographics}>{app.userDemographics || 'N/A'}</td>
                            )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};
