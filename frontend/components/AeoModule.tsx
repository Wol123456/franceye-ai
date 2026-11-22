'use client';
import React, { useState } from 'react';

interface AeoModuleProps { data: any; }

const Tab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 text-[13px] font-semibold rounded-md transition-all whitespace-nowrap"
        style={{
            background: active ? 'var(--fe-navy)' : 'transparent',
            color: active ? '#fff' : 'var(--fe-text-muted)',
        }}
    >
        {label}
    </button>
);

const ProgressBar = ({ value, color = 'var(--fe-navy)' }: { value: number; color?: string }) => (
    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--fe-border)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
);

export default function AeoModule({ data }: AeoModuleProps) {
    const [activeTab, setActiveTab] = useState('score');
    const [customKeywords, setCustomKeywords] = useState<{ word: string; count: number; target: number }[]>([]);
    const [newKw, setNewKw] = useState('');
    const [showKwInput, setShowKwInput] = useState(false);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl fe-card flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fe-navy)' }}>
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L14 18H10l-1.7-3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/>
                        <path d="M10 22h4"/><path d="M12 18v4"/>
                    </svg>
                </div>
                <h2 className="fe-section-title mb-1">Yapay Zeka Görünürlüğü (AEO)</h2>
                <p style={{ color: 'var(--fe-text-muted)' }} className="max-w-sm text-sm">
                    Bu modülü görmek için sol panelden bir şube seçin ve analiz edin.
                </p>
            </div>
        );
    }

    const aeoScore = Math.min(98, Math.round(((data.health_score || 0) * 0.8) + ((data.metrics?.google_reviews || 0) > 500 ? 15 : 5)));
    const targetKeywords = data.trend_keywords?.slice(0, 4) || [{ word: 'Temiz', count: 12 }, { word: 'Hızlı', count: 8 }];

    const handleAddKeyword = () => {
        if (newKw.trim()) {
            setCustomKeywords([...customKeywords, { word: newKw.trim(), count: 0, target: 50 }]);
            setNewKw('');
            setShowKwInput(false);
        }
    };

    const scoreColor = aeoScore >= 80 ? '#16A34A' : aeoScore >= 60 ? '#D97706' : '#DC2626';
    const scoreLabel = aeoScore >= 80 ? 'Mükemmel' : aeoScore >= 60 ? 'Orta' : 'Düşük';

    const TABS = [
        { key: 'score', label: 'AEO Skoru' },
        { key: 'simulator', label: 'LLM Simülatörü' },
        { key: 'keywords', label: 'Hedef Kelimeler' },
        { key: 'data', label: 'Veri Tutarlılığı' },
    ];

    return (
        <div className="animate-fade-in p-6 space-y-5">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="fe-page-title">Yapay Zeka Optimizasyonu (AEO)</h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>
                        {data.branch_name} · ChatGPT, Claude ve Gemini'de önerilme ihtimali
                    </p>
                </div>
                <span className="fe-badge fe-badge-navy text-[12px] px-3 py-1">Beta</span>
            </div>

            {/* Tab Bar */}
            <div className="fe-card p-1 flex gap-0.5 overflow-x-auto w-fit">
                {TABS.map(t => <Tab key={t.key} label={t.label} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />)}
            </div>

            {/* ── TAB: SCORE ── */}
            {activeTab === 'score' && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 animate-fade-in">
                    {/* Score Gauge */}
                    <div className="md:col-span-2 fe-card p-6 flex flex-col items-center justify-center text-center">
                        <div className="relative w-36 h-36 mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--fe-border)" strokeWidth="3" />
                                <circle
                                    cx="18" cy="18" r="15.9" fill="none"
                                    stroke={scoreColor} strokeWidth="3"
                                    strokeDasharray={`${aeoScore} 100`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 1s ease' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black" style={{ color: scoreColor }}>{aeoScore}</span>
                                <span className="text-[11px] font-semibold" style={{ color: 'var(--fe-text-muted)' }}>/ 100</span>
                            </div>
                        </div>
                        <div className="font-bold text-base">{scoreLabel} Görünürlük</div>
                        <p className="text-xs mt-1" style={{ color: 'var(--fe-text-muted)' }}>
                            Yapay zeka motorlarında önerilme puanı
                        </p>
                    </div>

                    {/* Factors */}
                    <div className="md:col-span-3 fe-card p-6 space-y-4">
                        <h3 className="fe-section-title text-base">Etki Eden Faktörler</h3>
                        {[
                            { label: 'Yorum Hacmi & Güncellik', value: 90, color: '#16A34A' },
                            { label: 'Anahtar Kelime Yoğunluğu', value: 65, color: '#D97706' },
                            { label: 'Platform Veri Tutarlılığı', value: 85, color: 'var(--fe-navy)' },
                            { label: 'Görsel İçerik Zenginliği', value: 50, color: '#DC2626' },
                        ].map(f => (
                            <div key={f.label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span style={{ color: 'var(--fe-text)' }}>{f.label}</span>
                                    <span className="font-semibold" style={{ color: f.color }}>%{f.value}</span>
                                </div>
                                <ProgressBar value={f.value} color={f.color} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAB: SIMULATOR ── */}
            {activeTab === 'simulator' && (
                <div className="fe-card overflow-hidden animate-fade-in" style={{ height: 480 }}>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ background: 'var(--fe-navy)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>AI</div>
                        <div>
                            <div className="font-semibold text-white text-sm">GPT-4 Simülatörü</div>
                            <div className="text-[11px]" style={{ color: 'rgba(191,208,232,0.7)' }}>Mevcut verilerinize göre tahmini yanıt</div>
                        </div>
                        <span className="ml-auto fe-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#BFD0E8', fontSize: 10 }}>Salt Okunur</span>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-5 space-y-5 overflow-y-auto" style={{ height: 'calc(100% - 100px)', background: 'var(--fe-surface-2)' }}>
                        <div className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'var(--fe-border)' }} />
                            <div className="fe-card px-4 py-3 text-sm max-w-sm" style={{ background: 'var(--fe-surface)' }}>
                                {data.address ? data.address.split(',')[0] : 'Bu bölgede'} çalışmak için sessiz bir kafe önerir misin?
                            </div>
                        </div>
                        <div className="flex gap-3 items-start flex-row-reverse">
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'var(--fe-navy)' }}>AI</div>
                            <div className="fe-card px-4 py-3 text-sm max-w-sm leading-relaxed" style={{ borderColor: 'rgba(30,58,95,0.2)', background: 'var(--fe-surface)' }}>
                                <p className="mb-2">Evet! <strong>{data.branch_name}</strong> şubesini önerebilirim.</p>
                                <ul className="space-y-1 list-disc pl-4" style={{ color: 'var(--fe-text-muted)' }}>
                                    <li>{aeoScore > 80 ? 'Yüksek müşteri memnuniyeti' : 'Genel olarak beğenilen mekan'}</li>
                                    <li>Yorumlarda sık geçen: <strong>"{targetKeywords[0]?.word}"</strong>, <strong>"{targetKeywords[1]?.word}"</strong></li>
                                </ul>
                                <p className="text-[10px] mt-3 pt-2 border-t" style={{ color: 'var(--fe-text-faint)', borderColor: 'var(--fe-border)' }}>
                                    Bu yanıt FrancEye algoritmasının mevcut Google verilerinize dayanarak ürettiği tahminidir.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Input */}
                    <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--fe-border)', background: 'var(--fe-surface)' }}>
                        <div className="fe-input text-sm italic" style={{ color: 'var(--fe-text-faint)', cursor: 'default', background: 'var(--fe-surface-2)' }}>
                            Simülasyon yalnızca okuma amaçlıdır...
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB: KEYWORDS ── */}
            {activeTab === 'keywords' && (
                <div className="fe-card p-6 animate-fade-in space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="fe-section-title text-base">Hedef Kelime Aşılama</h3>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>Yapay zeka veritabanlarına girmesini istediğiniz özellikler.</p>
                        </div>
                        <button
                            onClick={() => setShowKwInput(true)}
                            className="fe-btn-ghost text-sm flex items-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Yeni Kelime Ekle
                        </button>
                    </div>

                    {showKwInput && (
                        <div className="flex gap-2 items-center">
                            <input
                                className="fe-input text-sm"
                                placeholder='Örn: Bebek Dostu, Hızlı Wi-Fi...'
                                value={newKw}
                                onChange={e => setNewKw(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddKeyword()}
                                autoFocus
                            />
                            <button onClick={handleAddKeyword} className="fe-btn-primary text-sm whitespace-nowrap">Ekle</button>
                            <button onClick={() => setShowKwInput(false)} className="fe-btn-ghost text-sm">İptal</button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { word: 'Hızlı İnternet', count: 12, target: 50 },
                            { word: 'Güler Yüzlü', count: 38, target: 50 },
                            ...customKeywords,
                        ].map((kw, i) => (
                            <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: 'var(--fe-surface-2)', border: '1px solid var(--fe-border)' }}>
                                <div>
                                    <div className="fe-label mb-1">{i < 2 ? 'Hedef Kelime' : 'Yeni Kampanya'}</div>
                                    <div className="font-bold text-base">"{kw.word}"</div>
                                </div>
                                <ProgressBar value={Math.min(100, (kw.count / kw.target) * 100)} />
                                <div className="flex justify-between text-xs" style={{ color: 'var(--fe-text-muted)' }}>
                                    <span>{kw.count} kez geçti</span>
                                    <span>Hedef: {kw.target}</span>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowKwInput(true)}
                            className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all min-h-[120px]"
                            style={{ border: '1.5px dashed var(--fe-border-2)', color: 'var(--fe-text-faint)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--fe-navy)'; (e.currentTarget as HTMLElement).style.color = 'var(--fe-navy)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--fe-border-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--fe-text-faint)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            <span className="text-xs font-semibold">Kampanya Ekle</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── TAB: DATA ── */}
            {activeTab === 'data' && (
                <div className="fe-card p-6 animate-fade-in space-y-4">
                    <div>
                        <h3 className="fe-section-title text-base">Dijital Ayak İzi Tutarlılığı</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>
                            Yapay zekalar farklı kaynaklardaki verilerinizin tutarlı olmasını bekler.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            { status: 'ok', title: 'Çalışma Saatleri', desc: 'Google, Foursquare ve Web Sitesi birbiriyle tam uyumlu.', action: 'Detay' },
                            { status: 'error', title: 'Dijital Menü Linki', desc: "TripAdvisor'da menü linki bulunamadı. Bu durum AI önerilerini zayıflatır.", action: 'Güncelle' },
                            { status: 'ok', title: 'Telefon Numarası', desc: 'Tüm dijital platformlarda doğru numara tanımlı.', action: 'Detay' },
                            { status: 'warning', title: 'İşletme Fotoğrafları', desc: 'Fotoğrafların büyük kısmı 2 yıldan eski. Güncel görsel eklemeniz önerilir.', action: 'Güncelle' },
                        ].map((item, i) => {
                            const colors = {
                                ok: { bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.2)', dot: '#16A34A', text: '#15803D' },
                                error: { bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', dot: '#DC2626', text: '#DC2626' },
                                warning: { bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)', dot: '#D97706', text: '#B45309' },
                            }[item.status] || {};
                            return (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
                                        <div>
                                            <div className="font-semibold text-sm">{item.title}</div>
                                            <div className="text-xs mt-0.5" style={{ color: 'var(--fe-text-muted)' }}>{item.desc}</div>
                                        </div>
                                    </div>
                                    <button className="text-xs font-semibold ml-4 whitespace-nowrap" style={{ color: colors.text }}>{item.action}</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
