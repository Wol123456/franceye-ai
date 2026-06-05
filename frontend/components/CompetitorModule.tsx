import React, { useState, useEffect } from 'react';

// --- Constants ---
const TURKISH_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort();

interface CompetitorModuleProps {
    data: any; // Our branch (optional context)
    selectedCity: string;
}

export default function CompetitorModule({ data, selectedCity }: CompetitorModuleProps) {
    const [brandA, setBrandA] = useState('');
    const [brandB, setBrandB] = useState('');
    const [city, setCity] = useState('İstanbul');
    const [loading, setLoading] = useState(false);
    
    const [branchesA, setBranchesA] = useState<any[]>([]);
    const [branchesB, setBranchesB] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Initialize with props if available
    useEffect(() => {
        if (data?.branch_name && !brandA) {
            // İlk 2 kelimeyi alarak varsayılan markayı tahmin et (Örn: "Oses Çiğköfte Kadıköy" -> "Oses Çiğköfte")
            const parts = data.branch_name.split(' ');
            setBrandA(parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0]);
        }
        if (selectedCity && !hasSearched) {
            setCity(selectedCity);
        }
    }, [data, selectedCity, brandA, hasSearched]);

    const handleSearch = async () => {
        if (!brandA || !brandB || !city) return;
        setLoading(true);
        setHasSearched(true);
        
        try {
            const reqA = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/search_branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: `${brandA} şubeleri ${city}`, city: city })
            });

            const reqB = fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/search_branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: `${brandB} şubeleri ${city}`, city: city })
            });

            const [resA, resB] = await Promise.all([reqA, reqB]);

            if (resA.ok) setBranchesA(await resA.json());
            if (resB.ok) setBranchesB(await resB.json());

        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const avgScoreA = branchesA.length ? (branchesA.reduce((acc, b) => acc + (b.health_score || 0), 0) / branchesA.length).toFixed(1) : '0.0';
    const avgScoreB = branchesB.length ? (branchesB.reduce((acc, b) => acc + (b.health_score || 0), 0) / branchesB.length).toFixed(1) : '0.0';
    
    const totalReviewsA = branchesA.reduce((acc, b) => acc + (b.user_ratings_total || 0), 0);
    const totalReviewsB = branchesB.reduce((acc, b) => acc + (b.user_ratings_total || 0), 0);

    return (
        <div className="animate-fade-in space-y-8 max-w-7xl mx-auto p-6 md:p-10">
            {/* Arama Kartı */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">⚔️ Marka Savaşları (İl Bazlı Analiz)</h2>
                <p className="text-slate-500 mb-6">İki farklı markayı ve bir ili seçin. O ildeki tüm şubeleri karşılaştırmalı olarak listeleyelim.</p>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">1. Marka</label>
                        <input 
                            type="text" 
                            value={brandA}
                            onChange={e => setBrandA(e.target.value)}
                            placeholder="Örn: Burger King"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-blue-500/50 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-slate-800 dark:text-white transition"
                        />
                    </div>
                    
                    <div className="flex items-center justify-center pt-6">
                        <span className="text-slate-400 font-bold italic">VS</span>
                    </div>

                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">2. Marka</label>
                        <input 
                            type="text" 
                            value={brandB}
                            onChange={e => setBrandB(e.target.value)}
                            placeholder="Örn: McDonald's"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-purple-500/50 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-slate-800 dark:text-white transition"
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className="md:w-48">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">İl Seçimi</label>
                        <select 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-slate-800 dark:text-white"
                        >
                            <option value="">İl Seçin</option>
                            {TURKISH_CITIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={handleSearch}
                            disabled={loading || !brandA || !brandB || !city}
                            className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold shadow-md transition disabled:opacity-50 hover:scale-105"
                        >
                            {loading ? 'Savaş Başlıyor...' : 'Savaşı Başlat'}
                        </button>
                    </div>
                </div>
            </div>

            {hasSearched && !loading && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Genel Özet Scoreboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Marka A Özet */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2L2 22h20L12 2z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-1 truncate">{brandA}</h3>
                            <p className="text-blue-100 text-sm mb-6">{city} Genel Ortalaması</p>
                            
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-5xl font-black">{avgScoreA}</div>
                                    <div className="text-blue-200 text-xs mt-1 font-medium tracking-wider uppercase">Yapay Zeka Skoru</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold">{branchesA.length} Şube</div>
                                    <div className="text-sm text-blue-200">{totalReviewsA} Yorum</div>
                                </div>
                            </div>
                        </div>

                        {/* Kazanan/Durum */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border-4 border-slate-200 dark:border-slate-700">
                                <span className="text-xl font-black text-slate-400">VS</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Bölgesel Hakimiyet</h4>
                            {parseFloat(avgScoreA) > parseFloat(avgScoreB) ? (
                                <p className="text-sm text-slate-500"><span className="font-bold text-blue-500">{brandA}</span>, {city} ilinde daha yüksek müşteri memnuniyetine sahip.</p>
                            ) : parseFloat(avgScoreB) > parseFloat(avgScoreA) ? (
                                <p className="text-sm text-slate-500"><span className="font-bold text-purple-500">{brandB}</span>, {city} ilinde daha yüksek müşteri memnuniyetine sahip.</p>
                            ) : (
                                <p className="text-sm text-slate-500">İki marka da {city} ilinde başa baş mücadele ediyor.</p>
                            )}
                        </div>

                        {/* Marka B Özet */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="2" y="2" width="20" height="20" rx="4"></rect></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-1 truncate">{brandB}</h3>
                            <p className="text-purple-100 text-sm mb-6">{city} Genel Ortalaması</p>
                            
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-5xl font-black">{avgScoreB}</div>
                                    <div className="text-purple-200 text-xs mt-1 font-medium tracking-wider uppercase">Yapay Zeka Skoru</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold">{branchesB.length} Şube</div>
                                    <div className="text-sm text-purple-200">{totalReviewsB} Yorum</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Şube Listeleri */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Marka A Şubeleri */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between">
                                <span className="text-blue-500">{brandA} Şubeleri</span>
                                <span className="text-slate-400 text-sm font-normal">{branchesA.length} sonuç</span>
                            </h3>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {branchesA.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">Bu ilde şube bulunamadı.</p>
                                ) : (
                                    branchesA.map((branch: any, idx: number) => (
                                        <div key={branch.place_id || idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-between group hover:border-blue-500/50 transition">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-1.5 py-0.5 rounded">#{idx + 1}</span>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{branch.name}</h4>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1">{branch.address}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-black text-blue-600 dark:text-blue-400">{branch.health_score || '-'}</div>
                                                <div className="flex items-center text-yellow-500 gap-0.5 text-[10px] justify-end font-bold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                    {branch.rating} <span className="text-slate-400">({branch.user_ratings_total})</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Marka B Şubeleri */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between">
                                <span className="text-purple-500">{brandB} Şubeleri</span>
                                <span className="text-slate-400 text-sm font-normal">{branchesB.length} sonuç</span>
                            </h3>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {branchesB.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">Bu ilde şube bulunamadı.</p>
                                ) : (
                                    branchesB.map((branch: any, idx: number) => (
                                        <div key={branch.place_id || idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-between group hover:border-purple-500/50 transition">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-black px-1.5 py-0.5 rounded">#{idx + 1}</span>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{branch.name}</h4>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1">{branch.address}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-black text-purple-600 dark:text-purple-400">{branch.health_score || '-'}</div>
                                                <div className="flex items-center text-yellow-500 gap-0.5 text-[10px] justify-end font-bold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                    {branch.rating} <span className="text-slate-400">({branch.user_ratings_total})</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
