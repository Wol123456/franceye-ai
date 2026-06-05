import React, { useState } from 'react';

interface CompetitorModuleProps {
    data: any; // Our branch
}

export default function CompetitorModule({ data }: CompetitorModuleProps) {
    const [competitorQuery, setCompetitorQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [competitorData, setCompetitorData] = useState<any>(null);

    const handleSearch = async () => {
        if (!competitorQuery) return;
        setLoading(true);
        try {
            // Quick analyze by branch name directly
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    branch_name: competitorQuery, 
                    location_query: competitorQuery,
                    lat: data?.coords?.lat,
                    lng: data?.coords?.lng
                })
            });
            if (res.ok) {
                const json = await res.json();
                setCompetitorData(json);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    if (!data) {
        return (
            <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
                <div className="text-center py-20 text-slate-500">
                    Lütfen önce ana sayfadan kendi şubenizi analiz edin.
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">⚔️ Rakip Analizi</h2>
                <p className="text-slate-500 mb-6">Kendi şubenizin performansını rakibinizle yan yana karşılaştırın.</p>
                
                <div className="flex gap-4 max-w-2xl">
                    <input 
                        type="text" 
                        value={competitorQuery}
                        onChange={e => setCompetitorQuery(e.target.value)}
                        placeholder="Rakip şube adı (Örn: Kadıköy Y Burger)"
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-slate-800 dark:text-white"
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        onClick={handleSearch}
                        disabled={loading || !competitorQuery}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition disabled:opacity-50"
                    >
                        {loading ? 'Analiz Ediliyor...' : 'Karşılaştır'}
                    </button>
                </div>
            </div>

            {competitorData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Bizim Şube */}
                    <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Sizin Şubeniz</div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 pr-16">{data.branch_name}</h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-blue-500">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.health_score}</span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Google Yorumu: <span className="font-bold text-slate-800 dark:text-white">{data.metrics?.google_reviews || 0}</span></p>
                                <p className="text-sm text-slate-500">Yapay Zeka Skoru: <span className="font-bold text-blue-600 dark:text-blue-400">{data.health_analysis}</span></p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Kritik Sorunlar ({data.critical_alerts?.length || 0})</h4>
                                <ul className="text-sm space-y-1">
                                    {data.critical_alerts?.slice(0, 3).map((a: any, i: number) => (
                                        <li key={i} className="flex gap-2 text-red-500 dark:text-red-400"><span className="shrink-0">•</span> <span>[{a.category}] {a.text.substring(0,60)}...</span></li>
                                    ))}
                                    {(!data.critical_alerts || data.critical_alerts.length === 0) && <li className="text-emerald-500">Kritik sorun bulunmuyor.</li>}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Müşteri Trendleri</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.trend_keywords?.map((k: any, i: number) => (
                                        <span key={i} className={`text-xs px-2 py-1 rounded-md border ${k.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {k.word} ({k.count})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rakip Şube */}
                    <div className="bg-white dark:bg-slate-900 border-2 border-purple-500 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Rakip</div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 pr-16">{competitorData.branch_name}</h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-purple-500">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{competitorData.health_score}</span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Google Yorumu: <span className="font-bold text-slate-800 dark:text-white">{competitorData.metrics?.google_reviews || 0}</span></p>
                                <p className="text-sm text-slate-500">Yapay Zeka Skoru: <span className="font-bold text-purple-600 dark:text-purple-400">{competitorData.health_analysis}</span></p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Kritik Sorunlar ({competitorData.critical_alerts?.length || 0})</h4>
                                <ul className="text-sm space-y-1">
                                    {competitorData.critical_alerts?.slice(0, 3).map((a: any, i: number) => (
                                        <li key={i} className="flex gap-2 text-red-500 dark:text-red-400"><span className="shrink-0">•</span> <span>[{a.category}] {a.text.substring(0,60)}...</span></li>
                                    ))}
                                    {(!competitorData.critical_alerts || competitorData.critical_alerts.length === 0) && <li className="text-emerald-500">Kritik sorun bulunmuyor.</li>}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Müşteri Trendleri</h4>
                                <div className="flex flex-wrap gap-2">
                                    {competitorData.trend_keywords?.map((k: any, i: number) => (
                                        <span key={i} className={`text-xs px-2 py-1 rounded-md border ${k.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {k.word} ({k.count})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
