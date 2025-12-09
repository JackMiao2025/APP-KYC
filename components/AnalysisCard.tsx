
import React from 'react';
import { CrawlResult, WebAnalysis, AppAnalysis } from '../types';
import { ExternalLink, Tag, Activity, Server, Globe, Smartphone, Star, MapPin, Download, User, CheckCircle2, XCircle, UserCheck, UserX, DollarSign, Users, Briefcase, Coins } from 'lucide-react';

interface AnalysisCardProps {
  result: CrawlResult;
  onRemove: (id: string) => void;
  lang: 'en' | 'zh';
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, onRemove, lang }) => {
  const { type, data, sources } = result;

  const labels = {
    servicesChina: lang === 'zh' ? "中国大陆服务支持" : "Services Available in Mainland China",
    noServicesChina: lang === 'zh' ? "未检测到中国大陆服务" : "No Mainland China Service Detected",
    authChina: lang === 'zh' ? "支持中国用户注册/登录" : "China User Registration & Login Supported",
    noAuthChina: lang === 'zh' ? "注册/登录受限或未知" : "Registration/Login Restricted or Unknown",
    siteSummary: lang === 'zh' ? "网站摘要" : "Site Summary",
    tags: lang === 'zh' ? "智能标签" : "Intelligent Tags",
    contact: lang === 'zh' ? "联系方式" : "Contact Info",
    social: lang === 'zh' ? "社交足迹" : "Social Footprint",
    sentiment: lang === 'zh' ? "品牌情感" : "Sentiment",
    seo: lang === 'zh' ? "SEO 健康度" : "SEO Health",
    techStack: lang === 'zh' ? "技术栈" : "Tech Stack",
    description: lang === 'zh' ? "简介" : "Description",
    globalAvailability: lang === 'zh' ? "全球可用性" : "Global Availability",
    rating: lang === 'zh' ? "用户评分" : "Average User Rating",
    downloads: lang === 'zh' ? "下载量" : "Downloads",
    price: lang === 'zh' ? "价格" : "Price",
    lastUpdated: lang === 'zh' ? "最近更新" : "Last Updated",
    revenue: lang === 'zh' ? "预估营收" : "Est. Revenue",
    demographics: lang === 'zh' ? "用户画像" : "Demographics",
    verifiedSources: lang === 'zh' ? "验证来源" : "Verified Sources",
    remove: lang === 'zh' ? "移除" : "Remove",
    webType: lang === 'zh' ? "网站" : "Web",
    appType: lang === 'zh' ? "移动应用" : "Mobile Application",
    none: lang === 'zh' ? "无" : "None detected",
    board: lang === 'zh' ? "公司董事/高管" : "Board & Executives",
    stablecoin: lang === 'zh' ? "稳定币支付支持" : "Stablecoin Payment",
    noStablecoin: lang === 'zh' ? "未检测到稳定币支持" : "No Stablecoin Support",
  };

  const renderChinaStatus = (servesChina: boolean, serviceDetails: string, authAvailable: boolean, authDetails: string) => (
    <div className={`mt-4 rounded-lg border overflow-hidden transition-colors ${servesChina ? 'bg-red-950/10 border-red-900/30' : 'bg-slate-900/50 border-slate-700/50'}`}>
      {/* Service Availability Section */}
      <div className="p-3 flex items-start gap-3">
        <div className={`mt-0.5 ${servesChina ? 'text-red-400' : 'text-slate-500'}`}>
          {servesChina ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </div>
        <div>
          <div className={`text-sm font-semibold ${servesChina ? 'text-red-300' : 'text-slate-400'}`}>
            {servesChina ? labels.servicesChina : labels.noServicesChina}
          </div>
          <div className="text-xs text-slate-500 mt-1 leading-relaxed">
            {serviceDetails}
          </div>
        </div>
      </div>

      {/* Auth / Registration Section */}
      <div className={`px-3 py-2 border-t flex items-start gap-3 ${servesChina ? 'border-red-900/20 bg-red-900/5' : 'border-slate-700/50 bg-slate-900/30'}`}>
          <div className={`mt-0.5 ${authAvailable ? 'text-red-400' : 'text-slate-600'}`}>
             {authAvailable ? <UserCheck size={16} /> : <UserX size={16} />}
          </div>
          <div className="flex-1">
            <div className={`text-xs font-semibold ${authAvailable ? 'text-red-300' : 'text-slate-500'}`}>
                {authAvailable ? labels.authChina : labels.noAuthChina}
            </div>
            {authDetails && (
              <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                {authDetails}
              </div>
            )}
          </div>
      </div>
    </div>
  );

  const renderExtraInfo = (boardMembers: string[], stablecoin: boolean, stableDetails: string) => (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Board Info */}
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <Briefcase size={14} /> {labels.board}
            </h4>
            {boardMembers && boardMembers.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {boardMembers.slice(0, 4).map((m, i) => (
                        <div key={i} className="text-xs text-slate-300 truncate">• {m}</div>
                    ))}
                    {boardMembers.length > 4 && <div className="text-xs text-slate-500 italic">+ {boardMembers.length - 4} more</div>}
                </div>
            ) : (
                <div className="text-xs text-slate-600 italic">{labels.none}</div>
            )}
        </div>

        {/* Stablecoin Info */}
        <div className={`p-3 rounded-lg border ${stablecoin ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-slate-900/50 border-slate-700/50'}`}>
             <h4 className={`text-xs font-semibold mb-2 flex items-center gap-2 ${stablecoin ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Coins size={14} /> {stablecoin ? labels.stablecoin : labels.noStablecoin}
             </h4>
             <div className="text-xs text-slate-500 leading-relaxed">
                {stablecoin ? stableDetails : 'No direct crypto payment methods identified.'}
             </div>
        </div>
    </div>
  );

  const renderWebCard = (d: WebAnalysis) => (
    <>
      <div className="md:col-span-2 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Activity size={16} /> {labels.siteSummary}
          </h4>
          <p className="text-slate-300 leading-relaxed text-sm">{d.description}</p>
        </div>

        {renderChinaStatus(d.servesChina, d.chinaServiceDetails, d.chinaAuthAvailable, d.chinaAuthDetails)}
        
        {renderExtraInfo(d.boardMembers, d.stablecoinPayment, d.stablecoinDetails)}

        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Tag size={16} /> {labels.tags}
          </h4>
          <div className="flex flex-wrap gap-2">
            {d.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-cyan-300">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Contact & Socials */}
        {(d.socialLinks.length > 0 || d.contactInfo.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {d.contactInfo.length > 0 && (
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                 <div className="text-xs text-slate-500 mb-1">{labels.contact}</div>
                 <div className="flex flex-col gap-1">
                   {d.contactInfo.map((c, i) => <div key={i} className="text-xs text-slate-200 truncate">{c}</div>)}
                 </div>
               </div>
             )}
             {d.socialLinks.length > 0 && (
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                 <div className="text-xs text-slate-500 mb-1">{labels.social}</div>
                 <div className="flex flex-col gap-1">
                    {d.socialLinks.map((s, i) => (
                      <a key={i} href={s.startsWith('http') ? s : `https://${s}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate">{s}</a>
                    ))}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>

      <div className="space-y-6 border-l border-slate-700/50 md:pl-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                  className={d.sentimentScore > 70 ? "text-emerald-500" : "text-yellow-500"}
                  strokeDasharray={175}
                  strokeDashoffset={175 - (d.sentimentScore / 100) * 175}
                />
              </svg>
              <span className="absolute text-sm font-bold text-white">{d.sentimentScore}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{labels.sentiment}</div>
          </div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                  className="text-blue-500"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (d.seoScore / 100) * 175}
                />
              </svg>
              <span className="absolute text-sm font-bold text-white">{d.seoScore}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{labels.seo}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Server size={16} /> {labels.techStack}
          </h4>
          <div className="flex flex-col gap-1">
            {d.techStack.length > 0 ? (
              d.techStack.slice(0, 6).map((tech, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  {tech}
                </div>
              ))
            ) : <span className="text-xs text-slate-600 italic">{labels.none}</span>}
          </div>
        </div>
      </div>
    </>
  );

  const renderAppCard = (d: AppAnalysis) => (
    <>
      <div className="md:col-span-2 space-y-6">
        <div className="flex gap-4">
           <div className="w-20 h-20 bg-slate-700 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-500">
             <Smartphone size={32} />
           </div>
           <div>
             <h4 className="text-lg font-semibold text-white">{d.appName}</h4>
             <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
               <User size={14} /> {d.developer}
             </div>
             <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 text-xs rounded border border-blue-700/50">{d.category}</span>
               <span className="text-xs text-slate-500">{d.platform}</span>
             </div>
           </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2">{labels.description}</h4>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{d.description}</p>
        </div>

        {renderChinaStatus(d.servesChina, d.chinaServiceDetails, d.chinaAuthAvailable, d.chinaAuthDetails)}
        
        {renderExtraInfo(d.boardMembers, d.stablecoinPayment, d.stablecoinDetails)}

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin size={14} /> {labels.globalAvailability}
          </h4>
          <div className="flex flex-wrap gap-2">
            {d.countriesAvailable.map((c, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 border-l border-slate-700/50 md:pl-6">
         <div className="text-center py-4 bg-slate-900/30 rounded-lg border border-slate-800">
            <div className="text-4xl font-bold text-white flex items-center justify-center gap-1">
              {d.rating} <Star size={24} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-xs text-slate-500 mt-1">{labels.rating}</div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
              <div className="text-xs text-slate-500 mb-1">{labels.downloads}</div>
              <div className="text-sm font-semibold text-white flex items-center justify-center gap-1">
                <Download size={12} /> {d.downloads}
              </div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
              <div className="text-xs text-slate-500 mb-1">{labels.price}</div>
              <div className="text-sm font-semibold text-emerald-400">{d.price}</div>
            </div>
         </div>

         {/* Revenue & Demographics */}
         <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
               <span className="text-slate-500 flex items-center gap-1"><DollarSign size={12}/> {labels.revenue}</span>
               <span className="text-slate-200">{d.revenue || 'N/A'}</span>
            </div>
             <div className="flex flex-col gap-1 text-xs border-b border-slate-700 pb-2">
               <span className="text-slate-500 flex items-center gap-1"><Users size={12}/> {labels.demographics}</span>
               <span className="text-slate-200">{d.userDemographics || 'N/A'}</span>
            </div>
         </div>
         
         <div>
            <div className="text-xs text-slate-500 mb-1">{labels.lastUpdated}</div>
            <div className="text-sm text-slate-300">{d.lastUpdated}</div>
         </div>

         <div className="flex flex-wrap gap-1 mt-4">
            {d.tags.map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">{t}</span>
            ))}
         </div>
      </div>
    </>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden mb-6 transition-all hover:border-slate-600">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'web' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {type === 'web' ? <Globe size={20} /> : <Smartphone size={20} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {type === 'web' ? (data as WebAnalysis).domain : (data as AppAnalysis).appName}
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {type === 'web' ? (data as WebAnalysis).siteName : labels.appType}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onRemove(result.id)}
          className="text-slate-500 hover:text-red-400 transition-colors p-2 text-sm"
        >
          {labels.remove}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {type === 'web' ? renderWebCard(data as WebAnalysis) : renderAppCard(data as AppAnalysis)}
      </div>

      {sources.length > 0 && (
        <div className="px-6 py-3 bg-slate-950/30 border-t border-slate-700/50">
            <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">{labels.verifiedSources}</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {sources.slice(0, 3).map((source, idx) => (
                <a 
                key={idx}
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={10} /> {source.title}
                </a>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};
