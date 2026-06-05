import React, { useState } from 'react';

interface CompetitorModuleProps {
    data: any; // Our branch
    selectedCity: string;
}

export default function CompetitorModule({ data, selectedCity }: CompetitorModuleProps) {
    const [competitorQuery, setCompetitorQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [competitorData, setCompetitorData] = useState<any>(null);
    const [competitorBranches, setCompetitorBranches] = useState<any[]>([]);

    const handleSearch = async () => {
        if (!competitorQuery) return;
        setLoading(true);
        
        try {
            // 1. En yakın rakip şubeyi bul ve detaylı analiz et (1v1 Karşılaştırma)
            const analyzeRes = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    branch_name: competitorQuery, 
                    location_query: competitorQuery,
                    lat: data?.coords?.lat,
                    lng: data?.coords?.lng
                })
            });

            // 2. İldeki tüm rakip şubeleri bul (Toplu Karşılaştırma)
            const searchRes = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/search_branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: competitorQuery,
                    city: selectedCity 
                })
            });

            const [analyzeResponse, searchResponse] = await Promise.all([analyzeRes, searchRes]);

            if (analyzeResponse.ok) {
                const json = await analyzeResponse.json();
                setCompetitorData(json);
            }

            if (searchResponse.ok) {
                const branchesJson = await searchResponse.json();
                // En yakın şubeyi (zaten 1v1'de var) bu listeden istersen çıkarabiliriz ama kalsın, skorunu orda da görürüz.
                setCompetitorBranches(branchesJson);
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
        <div className="animate-fade-in space-y-8 max-w-7xl mx-auto p-6 md:p-10">
            {/* Arama Kartı */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">⚔️ Rakip Analizi</h2>
                <p className="text-slate-500 mb-6">Kendi şubenizin performansını, en yakınınızdaki rakiple ve o rakibin ildeki tüm şubeleriyle karşılaştırın.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                    <input 
                        type="text" 
                        value={competitorQuery}
                        onChange={e => setCompetitorQuery(e.target.value)}
                        placeholder="Rakip marka adı (Örn: Y Burger)"
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-slate-800 dark:text-white"
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        onClick={handleSearch}
                        disabled={loading || !competitorQuery}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? 'Analiz Ediliyor...' : 'Karşılaştır'}
                    </button>
                </div>
                {selectedCity && (
                    <div className="mt-3 text-sm text-slate-400">
                        Seçili İl Konumu: <span className="font-bold text-slate-600 dark:text-slate-300">{selectedCity}</span>
                    </div>
                )}
            </div>

            {competitorData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Birebir Karşılaştırma (En Yakın Şube) */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            En Yakın Şubeler Karşılaştırması
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bizim Şube */}
                            <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Sizin Şubeniz</div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white pr-16">{data.branch_name}</h3>
                                <p className="text-xs text-slate-500 mb-6 mt-1 h-8 overflow-hidden">{data.address || "Adres detayı bulunamadı."}</p>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-blue-500 shrink-0">
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.health_score}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Google Yorumu: <span className="font-bold text-slate-800 dark:text-white">{data.metrics?.google_reviews || 0}</span></p>
                                        <p className="text-sm text-slate-500">Yapay Zeka Skoru: <span className="font-bold text-blue-600 dark:text-blue-400">{data.health_analysis}</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Kritik Sorunlar</h4>
                                        <ul className="text-sm space-y-1">
                                            {data.critical_alerts?.slice(0, 3).map((a: any, i: number) => (
                                                <li key={i} className="flex gap-2 text-red-500 dark:text-red-400"><span className="shrink-0">•</span> <span className="line-clamp-2">[{a.category}] {a.text}</span></li>
                                            ))}
                                            {(!data.critical_alerts || data.critical_alerts.length === 0) && <li className="text-emerald-500">Kritik sorun bulunmuyor.</li>}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Müşteri Trendleri</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.trend_keywords?.map((k: any, i: number) => (
                                                <span key={i} className={`text-[10px] px-2 py-1 rounded-md border ${k.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                    {k.word} ({k.count})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rakip Şube */}
                            <div className="bg-white dark:bg-slate-900 border-2 border-purple-500 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Rakip</div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white pr-16">{competitorData.branch_name}</h3>
                                <p className="text-xs text-slate-500 mb-6 mt-1 h-8 overflow-hidden">{competitorData.address || "Adres detayı bulunamadı."}</p>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-purple-500 shrink-0">
                                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{competitorData.health_score}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Google Yorumu: <span className="font-bold text-slate-800 dark:text-white">{competitorData.metrics?.google_reviews || 0}</span></p>
                                        <p className="text-sm text-slate-500">Yapay Zeka Skoru: <span className="font-bold text-purple-600 dark:text-purple-400">{competitorData.health_analysis}</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Kritik Sorunlar</h4>
                                        <ul className="text-sm space-y-1">
                                            {competitorData.critical_alerts?.slice(0, 3).map((a: any, i: number) => (
                                                <li key={i} className="flex gap-2 text-red-500 dark:text-red-400"><span className="shrink-0">•</span> <span className="line-clamp-2">[{a.category}] {a.text}</span></li>
                                            ))}
                                            {(!competitorData.critical_alerts || competitorData.critical_alerts.length === 0) && <li className="text-emerald-500">Kritik sorun bulunmuyor.</li>}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Müşteri Trendleri</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {competitorData.trend_keywords?.map((k: any, i: number) => (
                                                <span key={i} className={`text-[10px] px-2 py-1 rounded-md border ${k.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                    {k.word} ({k.count})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* İldeki Diğer Rakip Şubeler */}
                    {competitorBranches && competitorBranches.length > 0 && (
                        <div className="mt-10">
                            <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">İl Genelindeki {competitorQuery} Şubeleri</h3>
                                    <p className="text-sm text-slate-500 mt-1">{selectedCity || 'Seçili İl'} ve çevresindeki tüm rakip şubelerin genel durumu.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {(competitorBranches.reduce((acc, b) => acc + (b.health_score || 0), 0) / competitorBranches.length).toFixed(1)}
                                    </div>
                                    <div className="text-xs text-slate-500">Rakip İl Ortalaması</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {competitorBranches.map((branch: any, idx: number) => (
                                    <div key={branch.place_id || idx} className={`bg-white dark:bg-slate-800 border ${branch.place_id === competitorData.place_id ? 'border-purple-500 shadow-purple-500/20 shadow-lg' : 'border-slate-200 dark:border-slate-700'} p-5 rounded-xl transition hover:border-purple-400 relative overflow-hidden group`}>
                                        
                                        {branch.place_id === competitorData.place_id && (
                                            <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">En Yakın Rakip</div>
                                        )}
                                        
                                        <div className="absolute top-0 left-0 bg-slate-800 dark:bg-slate-700 text-white font-bold px-2 py-0.5 rounded-tl-xl rounded-br-xl shadow-md text-xs">#{idx + 1}</div>

                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 mt-2 text-base line-clamp-1 group-hover:text-purple-500 transition">{branch.name}</h4>
                                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[32px]">{branch.address}</p>

                                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-0.5">Google Puanı</div>
                                                <div className="flex items-center text-yellow-500 gap-1 font-bold text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                    {branch.rating} <span className="text-slate-400 font-normal ml-1">({branch.user_ratings_total})</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500 mb-0.5">Yapay Zeka Skoru</div>
                                                <div className="font-black text-lg text-blue-600 dark:text-blue-400">{branch.health_score || '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
