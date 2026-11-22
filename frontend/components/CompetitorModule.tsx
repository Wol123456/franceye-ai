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

interface CompetitorModuleProps { data: any; selectedCity: string; }

function ScoreCircle({ value, label, color = 'var(--fe-navy)' }: { value: string; label: string; color?: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="fe-label">{label}</div>
        </div>
    );
}

export default function CompetitorModule({ data, selectedCity }: CompetitorModuleProps) {
    const [brandA, setBrandA] = useState('');
    const [brandB, setBrandB] = useState('');
    const [city, setCity] = useState('İstanbul');
    const [loading, setLoading] = useState(false);
    const [branchesA, setBranchesA] = useState<any[]>([]);
    const [branchesB, setBranchesB] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (data?.branch_name && !brandA) {
            const parts = data.branch_name.split(' ');
            setBrandA(parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0]);
        }
        if (selectedCity && !hasSearched) setCity(selectedCity);
    }, [data, selectedCity]);

    const handleSearch = async () => {
        if (!brandA || !brandB || !city) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
            const [resA, resB] = await Promise.all([
                fetch(`${base}/search_branches`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: `${brandA} şubeleri ${city}`, city }) }),
                fetch(`${base}/search_branches`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: `${brandB} şubeleri ${city}`, city }) }),
            ]);
            if (resA.ok) setBranchesA(await resA.json());
            if (resB.ok) setBranchesB(await resB.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const avgA = branchesA.length ? (branchesA.reduce((s, b) => s + (b.health_score || 0), 0) / branchesA.length).toFixed(1) : '—';
    const avgB = branchesB.length ? (branchesB.reduce((s, b) => s + (b.health_score || 0), 0) / branchesB.length).toFixed(1) : '—';
    const totalReviewsA = branchesA.reduce((s, b) => s + (b.user_ratings_total || 0), 0);
    const totalReviewsB = branchesB.reduce((s, b) => s + (b.user_ratings_total || 0), 0);
    const winner = avgA !== '—' && avgB !== '—' ? (parseFloat(avgA) > parseFloat(avgB) ? brandA : parseFloat(avgB) > parseFloat(avgA) ? brandB : null) : null;

    return (
        <div className="animate-fade-in p-6 space-y-5">
            {/* Page Header */}
            <div>
                <h1 className="fe-page-title">Rakip Analizi</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>İki markayı il bazında karşılaştırın</p>
            </div>

            {/* Search Card */}
            <div className="fe-card p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="fe-label mb-2 block">1. Marka (Markanız)</label>
                        <input className="fe-input" placeholder="Örn: Markanız" value={brandA} onChange={e => setBrandA(e.target.value)} />
                    </div>
                    <div className="flex items-center pb-2 self-center">
                        <span className="text-sm font-black px-2" style={{ color: 'var(--fe-text-faint)' }}>vs</span>
                    </div>
                    <div className="flex-1">
                        <label className="fe-label mb-2 block">2. Marka (Rakip)</label>
                        <input className="fe-input" placeholder="Örn: 2. Marka" value={brandB} onChange={e => setBrandB(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <div className="w-full md:w-44">
                        <label className="fe-label mb-2 block">İl Seçimi</label>
                        <select className="fe-input" value={city} onChange={e => setCity(e.target.value)}>
                            <option value="">İl Seçin</option>
                            {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !brandA || !brandB || !city}
                        className="fe-btn-primary whitespace-nowrap disabled:opacity-40"
                    >
                        {loading ? 'Analiz ediliyor...' : 'Karşılaştır'}
                    </button>
                </div>

                {/* Demo Scope & Multi-competitor gating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs mt-4 pt-3 border-t gap-2" style={{ borderColor: 'var(--fe-border)' }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--fe-text-muted)' }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span><strong>Demo Kapsamı:</strong> Yalnızca 2. marka (1'e 1 kıyaslama) desteklenir.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-60 cursor-not-allowed">
                        <span>+ 3. ve 4. Rakip Ekle</span>
                        <span className="fe-badge fe-badge-navy text-[10px]">🔒 Kurumsal</span>
                    </div>
                </div>
            </div>

            {/* Results */}
            {hasSearched && !loading && (
                <div className="space-y-5 animate-fade-in">
                    {/* Scoreboard */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="fe-card p-5 flex flex-col gap-3">
                            <div className="fe-label">{brandA}</div>
                            <ScoreCircle value={avgA} label="Ortalama Skor" />
                            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-center" style={{ borderColor: 'var(--fe-border)' }}>
                                <div>
                                    <div className="font-bold text-base">{branchesA.length}</div>
                                    <div className="fe-label text-[10px]">Şube</div>
                                </div>
                                <div>
                                    <div className="font-bold text-base">{totalReviewsA.toLocaleString()}</div>
                                    <div className="fe-label text-[10px]">Yorum</div>
                                </div>
                            </div>
                        </div>

                        <div className="fe-card p-5 flex flex-col items-center justify-center text-center gap-2">
                            {winner ? (
                                <>
                                    <div className="fe-badge fe-badge-success text-xs">Kazanan</div>
                                    <div className="font-black text-lg">{winner}</div>
                                    <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>{city} ilinde daha yüksek müşteri memnuniyeti</p>
                                </>
                            ) : (
                                <>
                                    <div className="fe-label">Bölgesel Durum</div>
                                    <div className="font-bold">Başa Baş</div>
                                </>
                            )}
                        </div>

                        <div className="fe-card p-5 flex flex-col gap-3">
                            <div className="fe-label">{brandB}</div>
                            <ScoreCircle value={avgB} label="Ortalama Skor" color="var(--fe-text-muted)" />
                            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-center" style={{ borderColor: 'var(--fe-border)' }}>
                                <div>
                                    <div className="font-bold text-base">{branchesB.length}</div>
                                    <div className="fe-label text-[10px]">Şube</div>
                                </div>
                                <div>
                                    <div className="font-bold text-base">{totalReviewsB.toLocaleString()}</div>
                                    <div className="fe-label text-[10px]">Yorum</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branch Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {[
                            { label: brandA, branches: branchesA, accent: 'var(--fe-navy)' },
                            { label: brandB, branches: branchesB, accent: 'var(--fe-text-muted)' },
                        ].map(({ label, branches, accent }) => (
                            <div key={label} className="fe-card p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm" style={{ color: accent }}>{label} Şubeleri</h3>
                                    <span className="fe-badge fe-badge-navy">{branches.length} sonuç</span>
                                </div>
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                    {branches.length === 0 ? (
                                        <p className="text-sm italic text-center py-6" style={{ color: 'var(--fe-text-faint)' }}>Bu ilde şube bulunamadı.</p>
                                    ) : branches.map((branch: any, idx: number) => (
                                        <div
                                            key={branch.place_id || idx}
                                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                                            style={{ background: 'var(--fe-surface-2)', border: '1px solid var(--fe-border)' }}
                                            onClick={() => window.open(`/?place_id=${branch.place_id}`, '_blank')}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--fe-navy)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--fe-border)'; }}
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
        </div>
    );
}
