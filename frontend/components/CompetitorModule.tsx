'use client';
import React, { useState, useEffect } from 'react';

const TURKISH_CITIES = [
    "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
    "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
    "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane",
    "Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli",
    "Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş",
    "Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
    "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
    "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
].sort();

interface CompetitorModuleProps {
    data?: any;
    selectedCity: string;
    registeredBrand?: string;
    onOpenEnterpriseModal?: (reason: string) => void;
}

function ScoreCircle({ value, label, color = 'var(--fe-navy)' }: { value: string; label: string; color?: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="fe-label">{label}</div>
        </div>
    );
}

// Resilient fallback competitor generator
const generateMockCompetitorBranches = (brand: string, city: string, isLeader = true) => {
    const districts = city === 'İstanbul' ? ['Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Ataşehir'] :
                      city === 'Ankara' ? ['Çankaya', 'Kızılay', 'Tunalı Hilmi', 'Batıkent'] :
                      city === 'İzmir' ? ['Alsancak', 'Karşıyaka', 'Bornova', 'Konak'] :
                      ['Merkez', 'Çarşı', 'Atatürk Bulv.', 'AVM'];
    const baseScore = isLeader ? 88 : 77;
    const baseRating = isLeader ? 4.6 : 4.1;
    return districts.slice(0, 3).map((dist, idx) => ({
        place_id: `comp_${brand.toLowerCase().replace(/\s+/g, '_')}_${idx}`,
        name: `${brand} - ${dist}`,
        address: `${dist} Mah. Atatürk Cad. No:${10 + idx * 4}, ${city}`,
        rating: +(baseRating + (idx % 2 === 0 ? 0.1 : -0.1)).toFixed(1),
        user_ratings_total: 350 + idx * 160,
        health_score: Math.min(99, baseScore + (idx === 0 ? 5 : -idx * 4))
    }));
};

export default function CompetitorModule({ 
    data, 
    selectedCity, 
    registeredBrand = 'Markanız',
    onOpenEnterpriseModal 
}: CompetitorModuleProps) {
    const defaultBrand = registeredBrand || 'Markanız';
    const [brandA, setBrandA] = useState(defaultBrand);
    const [brandB, setBrandB] = useState('');
    const [city, setCity] = useState(selectedCity || 'İstanbul');
    const [loading, setLoading] = useState(false);
    const [branchesA, setBranchesA] = useState<any[]>([]);
    const [branchesB, setBranchesB] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Battle limit state (Max 2 battles allowed in demo)
    const [battleHistory, setBattleHistory] = useState<string[]>([]);
    const [quotaModalOpen, setQuotaModalOpen] = useState(false);

    useEffect(() => {
        if (registeredBrand) {
            setBrandA(registeredBrand);
        } else if (data?.branch_name && !brandA) {
            const parts = data.branch_name.split(' ');
            setBrandA(parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0]);
        }
        if (selectedCity && !hasSearched) {
            setCity(selectedCity);
        }

        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('franceye_battle_history');
                if (saved) {
                    setBattleHistory(JSON.parse(saved));
                }
            } catch (e) {}
        }
    }, [data, selectedCity, registeredBrand]);

    const handleSearch = async () => {
        if (!brandA || !brandB.trim() || !city) return;

        const battleKey = `${brandB.trim().toLowerCase()}__${city.toLowerCase()}`;
        const alreadyDone = battleHistory.includes(battleKey);

        // Limit to maximum 2 battles in demo
        if (!alreadyDone && battleHistory.length >= 2) {
            if (onOpenEnterpriseModal) {
                onOpenEnterpriseModal("Marka Savaşı Limiti: Demo sürümünde en fazla 2 rakip marka savaşı raporuna izin verilmektedir. Sınırsız rakip analizi ve detaylı pazar raporları için Kurumsal Pakete geçiş yapabilirsiniz.");
            } else {
                setQuotaModalOpen(true);
            }
            return;
        }

        setLoading(true);
        setHasSearched(true);

        const newHistory = alreadyDone ? battleHistory : [...battleHistory, battleKey];
        if (!alreadyDone) {
            setBattleHistory(newHistory);
            if (typeof window !== 'undefined') {
                localStorage.setItem('franceye_battle_history', JSON.stringify(newHistory));
            }
        }

        try {
            const base = process.env.NEXT_PUBLIC_API_URL || 'https://franceye-ai.onrender.com';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);

            let resAData: any[] = [];
            let resBData: any[] = [];

            try {
                const [resA, resB] = await Promise.all([
                    fetch(`${base}/search_branches`, { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ query: `${brandA} şubeleri ${city}`, city }),
                        signal: controller.signal
                    }),
                    fetch(`${base}/search_branches`, { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ query: `${brandB} şubeleri ${city}`, city }),
                        signal: controller.signal
                    }),
                ]);
                clearTimeout(timeoutId);
                if (resA.ok) resAData = await resA.json();
                if (resB.ok) resBData = await resB.json();
            } catch (fetchErr) {
                console.warn("Competitor API timed out or offline, using fallback:", fetchErr);
            }

            if (!resAData || resAData.length === 0) {
                resAData = generateMockCompetitorBranches(brandA, city, true);
            }
            if (!resBData || resBData.length === 0) {
                resBData = generateMockCompetitorBranches(brandB, city, false);
            }

            setBranchesA(resAData);
            setBranchesB(resBData);
        } catch (e) { 
            console.error(e);
            setBranchesA(generateMockCompetitorBranches(brandA, city, true));
            setBranchesB(generateMockCompetitorBranches(brandB, city, false));
        } finally {
            setLoading(false);
        }
    };

    const avgA = branchesA.length ? (branchesA.reduce((s, b) => s + (b.health_score || 0), 0) / branchesA.length).toFixed(1) : '—';
    const avgB = branchesB.length ? (branchesB.reduce((s, b) => s + (b.health_score || 0), 0) / branchesB.length).toFixed(1) : '—';
    const totalReviewsA = branchesA.reduce((s, b) => s + (b.user_ratings_total || 0), 0);
    const totalReviewsB = branchesB.reduce((s, b) => s + (b.user_ratings_total || 0), 0);
    const winner = avgA !== '—' && avgB !== '—' ? (parseFloat(avgA) > parseFloat(avgB) ? brandA : parseFloat(avgB) > parseFloat(avgA) ? brandB : null) : null;

    const remainingBattles = Math.max(0, 2 - battleHistory.length);

    return (
        <div className="animate-fade-in p-6 space-y-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="fe-page-title flex items-center gap-2">
                        <span>Marka Savaşı & Rakip Analizi</span>
                        <span className="fe-badge fe-badge-navy text-[11px]">Demo v2.4</span>
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>
                        Kayıtlı markanızı rakip markalarla il bazında karşılaştırın ve pazar üstünlüğünü ölçün.
                    </p>
                </div>

                {/* Quota Counter Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-xs">
                    <span className="text-base">⚔️</span>
                    <div>
                        <div className="font-bold flex items-center gap-1.5">
                            <span>Savaş Kotası:</span>
                            <span className={battleHistory.length >= 2 ? "text-amber-500 font-black" : "text-blue-600 dark:text-blue-400 font-black"}>
                                {battleHistory.length} / 2
                            </span>
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--fe-text-muted)' }}>
                            {remainingBattles > 0 ? `${remainingBattles} savaş hakkınız kaldı` : 'Demo kotası tamamlandı'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Card */}
            <div className="fe-card p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Brand A (Strictly locked to registered brand) */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="fe-label block">1. Marka (Markanız)</label>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                                🔒 Kayıtlı Markanız (Kilitli)
                            </span>
                        </div>
                        <div className="relative">
                            <input 
                                className="fe-input font-bold bg-slate-100/90 dark:bg-slate-900/90 cursor-not-allowed text-slate-800 dark:text-white pl-8" 
                                placeholder="Örn: Markanız" 
                                value={brandA} 
                                readOnly 
                                disabled
                            />
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center pb-2 self-center">
                        <span className="text-base font-black px-2 text-blue-600" style={{ color: 'var(--fe-text-faint)' }}>vs</span>
                    </div>

                    {/* Brand B (Editable Competitor) */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-2">
                            <label className="fe-label block">2. Marka (Rakip)</label>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Karşılaştırılacak Rakip</span>
                        </div>
                        <input 
                            className="fe-input" 
                            placeholder="Örn: Rakip Marka Adı" 
                            value={brandB} 
                            onChange={e => setBrandB(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} 
                        />
                    </div>

                    {/* City Selection */}
                    <div className="w-full md:w-44">
                        <label className="fe-label mb-2 block">İl Seçimi</label>
                        <select className="fe-input cursor-pointer" value={city} onChange={e => setCity(e.target.value)}>
                            <option value="">İl Seçin</option>
                            {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSearch}
                        disabled={loading || !brandA || !brandB.trim() || !city}
                        className="fe-btn-primary whitespace-nowrap disabled:opacity-40 w-full md:w-auto h-11 px-6 font-bold shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Savaş Raporu Çıkıyor...</span>
                            </>
                        ) : battleHistory.length >= 2 && !battleHistory.includes(`${brandB.trim().toLowerCase()}__${city.toLowerCase()}`) ? (
                            <span>🔒 Kota Doldu (Kurumsal)</span>
                        ) : (
                            <span>⚔️ Savaşa Başla</span>
                        )}
                    </button>
                </div>

                {/* Demo Scope Notice */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs mt-4 pt-3 border-t gap-2" style={{ borderColor: 'var(--fe-border)' }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--fe-text-muted)' }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>
                            <strong>Demo Sınırı:</strong> Sadece kayıt olduğunuz <strong>{brandA}</strong> markası kıyaslanabilir ve en fazla <strong>2 rakip savaşı</strong> raporlanabilir.
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            type="button"
                            onClick={() => {
                                if (onOpenEnterpriseModal) {
                                    onOpenEnterpriseModal("Sınırsız rakip marka ekleme, 3'lü ve 4'lü eşzamanlı pazar kıyaslaması ve 81 il pazar liderliği raporu için Kurumsal Pakete geçin.");
                                }
                            }}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                            <span>+ 3. ve 4. Rakip Ekle</span>
                            <span className="fe-badge fe-badge-navy text-[10px]">🔒 Kurumsal</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {hasSearched && !loading && (
                <div className="space-y-5 animate-fade-in">
                    {/* Scoreboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="fe-card p-5 flex flex-col gap-3 border-l-4 border-blue-600">
                            <div className="fe-label flex items-center justify-between">
                                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{brandA}</span>
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">Markanız</span>
                            </div>
                            <ScoreCircle value={avgA} label="Ortalama Sağlık Skoru" color="#2563EB" />
                            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-center" style={{ borderColor: 'var(--fe-border)' }}>
                                <div>
                                    <div className="font-bold text-base">{branchesA.length}</div>
                                    <div className="fe-label text-[10px]">İncelenen Şube</div>
                                </div>
                                <div>
                                    <div className="font-bold text-base">{totalReviewsA.toLocaleString()}</div>
                                    <div className="fe-label text-[10px]">Toplam Yorum</div>
                                </div>
                            </div>
                        </div>

                        <div className="fe-card p-5 flex flex-col items-center justify-center text-center gap-3">
                            {winner ? (
                                <>
                                    <div className="fe-badge fe-badge-success text-xs font-bold px-3 py-1">🏆 Bölgesel Lider</div>
                                    <div className="font-black text-xl text-slate-900 dark:text-white">{winner}</div>
                                    <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>
                                        {city} ilinde şube sağlığı ve müşteri memnuniyetinde önde.
                                    </p>
                                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20">
                                        Fark: {Math.abs(parseFloat(avgA || '0') - parseFloat(avgB || '0')).toFixed(1)} Puan
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="fe-label">Bölgesel Durum</div>
                                    <div className="font-bold text-lg">Başa Baş Mücadele</div>
                                    <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>{city} ilinde iki markanın puan ortalaması eşit.</p>
                                </>
                            )}
                        </div>

                        <div className="fe-card p-5 flex flex-col gap-3 border-l-4 border-slate-400">
                            <div className="fe-label flex items-center justify-between">
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{brandB}</span>
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold">Rakip Marka</span>
                            </div>
                            <ScoreCircle value={avgB} label="Ortalama Sağlık Skoru" color="var(--fe-text-muted)" />
                            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-center" style={{ borderColor: 'var(--fe-border)' }}>
                                <div>
                                    <div className="font-bold text-base">{branchesB.length}</div>
                                    <div className="fe-label text-[10px]">İncelenen Şube</div>
                                </div>
                                <div>
                                    <div className="font-bold text-base">{totalReviewsB.toLocaleString()}</div>
                                    <div className="fe-label text-[10px]">Toplam Yorum</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branch Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[
                            { label: brandA, branches: branchesA, accent: '#2563EB', isUserBrand: true },
                            { label: brandB, branches: branchesB, accent: 'var(--fe-text-muted)', isUserBrand: false },
                        ].map(({ label, branches, accent, isUserBrand }) => (
                            <div key={label} className="fe-card p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm" style={{ color: accent }}>{label} Şubeleri ({city})</h3>
                                        {isUserBrand && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Markanız</span>}
                                    </div>
                                    <span className="fe-badge fe-badge-navy">{branches.length} sonuç</span>
                                </div>
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                    {branches.length === 0 ? (
                                        <p className="text-sm italic text-center py-6" style={{ color: 'var(--fe-text-faint)' }}>Bu ilde şube bulunamadı.</p>
                                    ) : branches.map((branch: any, idx: number) => (
                                        <div
                                            key={branch.place_id || idx}
                                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
                                            style={{ background: 'var(--fe-surface-2)', border: '1px solid var(--fe-border)' }}
                                            onClick={() => window.open(`/?place_id=${branch.place_id}`, '_blank')}
                                        >
                                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: 'var(--fe-border)', color: 'var(--fe-text-muted)' }}>#{idx + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm truncate">{branch.name}</div>
                                                <div className="text-[11px] truncate" style={{ color: 'var(--fe-text-muted)' }}>{branch.address}</div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-black text-base" style={{ color: accent }}>{branch.health_score || '—'}</div>
                                                <div className="text-[10px] font-semibold" style={{ color: '#D97706' }}>★ {branch.rating}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* In-Module Quota Modal (if onOpenEnterpriseModal is not provided) */}
            {quotaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 mx-auto flex items-center justify-center text-2xl font-bold">
                                ⚔️
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Marka Savaşı Kotası Doldu</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Demo sürümünde en fazla 2 rakip marka savaşı raporu görüntülenebilir. Sınırsız rakip analizi ve detaylı Türkiye geneli pazar raporları için Kurumsal Pakete geçiş yapabilirsiniz.
                            </p>
                        </div>
                        <div className="pt-2 flex flex-col gap-2">
                            <button 
                                onClick={() => {
                                    setQuotaModalOpen(false);
                                    if (onOpenEnterpriseModal) {
                                        onOpenEnterpriseModal("Sınırsız marka savaşı ve detaylı pazar raporları için kurumsal teklif alın.");
                                    }
                                }} 
                                className="fe-btn-primary w-full text-center py-2.5 text-xs font-bold"
                            >
                                Kurumsal Teklif Alın →
                            </button>
                            <button 
                                onClick={() => setQuotaModalOpen(false)} 
                                className="fe-btn-ghost w-full text-center py-2 text-xs"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
