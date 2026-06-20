import React, { useState } from 'react';

interface AeoModuleProps {
    data: any;
}

export default function AeoModule({ data }: AeoModuleProps) {
    const [activeTab, setActiveTab] = useState('score');
    
    // Fake AEO data generation based on branch health
    const aeoScore = Math.min(98, Math.round((data.health_score * 0.8) + (data.metrics.google_reviews > 500 ? 15 : 5)));
    const targetKeywords = data.trend_keywords?.slice(0, 4) || [{word: 'Temiz', count: 12}, {word: 'Hızlı', count: 8}, {word: 'Kahve', count: 24}];
    const consistencyScore = 85;

    return (
        <div className="animate-fade-in relative max-w-7xl mx-auto p-6 md:p-10 pt-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 bg-purple-900/5 dark:bg-purple-900/20 p-6 rounded-3xl backdrop-blur-md border border-purple-500/20 shadow-lg">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="text-purple-600 dark:text-purple-400">🧠</span> Yapay Zeka Optimizasyonu (AEO)
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        {data.branch_name} şubesinin ChatGPT, Claude ve Gemini gibi motorlarda önerilme ihtimali.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl backdrop-blur-sm border border-slate-200 dark:border-white/5 overflow-x-auto custom-scrollbar relative z-10">
                <button onClick={() => setActiveTab('score')} className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'score' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>AEO Skoru</button>
                <button onClick={() => setActiveTab('simulator')} className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'simulator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>🤖 LLM Simülatörü</button>
                <button onClick={() => setActiveTab('keywords')} className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'keywords' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Hedef Kelimeler</button>
                <button onClick={() => setActiveTab('data')} className={`px-5 py-2.5 rounded-xl font-bold transition whitespace-nowrap ${activeTab === 'data' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Veri Tutarlılığı</button>
            </div>

            {/* Content Area */}
            <div className="relative z-10">
                
                {/* TAB 1: AEO SCORE */}
                {activeTab === 'score' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                            <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-700 flex items-center justify-center relative shadow-inner mb-6">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" strokeWidth="16" className="text-purple-500" strokeDasharray={`${aeoScore * 2.64} 1000`} />
                                </svg>
                                <div className="text-5xl font-black text-slate-900 dark:text-white drop-shadow-md">%{aeoScore}</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Görünürlük Seviyesi: {aeoScore > 80 ? 'Mükemmel' : 'Geliştirilebilir'}</h3>
                            <p className="text-sm text-slate-500 mt-2">Bu skor, mekanınızın arama motorları yerine yapay zeka tarafından kullanıcılara önerilme ihtimalini gösterir.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-4">Etki Eden Faktörler</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-1"><span className="text-slate-700 dark:text-slate-300">Yorum Hacmi & Güncellik</span><span className="text-emerald-500">%90</span></div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width: '90%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-1"><span className="text-slate-700 dark:text-slate-300">Spesifik Anahtar Kelime Yoğunluğu</span><span className="text-yellow-500">%65</span></div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-yellow-500 rounded-full" style={{width: '65%'}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm font-medium mb-1"><span className="text-slate-700 dark:text-slate-300">Platformlar Arası Veri Tutarlılığı</span><span className="text-blue-500">%85</span></div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: '85%'}}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: LLM SIMULATOR */}
                {activeTab === 'simulator' && (
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px] animate-fade-in">
                        <div className="bg-blue-600 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 text-xl shadow-inner">AI</div>
                            <div>
                                <h3 className="text-white font-bold">GPT-4 Turbo Simülatörü</h3>
                                <p className="text-blue-200 text-xs">Şu anki verilere göre yapay zekanın yanıtı</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex-shrink-0"></div>
                                <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-slate-800 dark:text-slate-200 text-sm">
                                    Bana {data.address ? data.address.split(',')[0] : 'bu bölgede'} kahve içebileceğim, sessiz ve çalışmaya uygun en iyi mekanı önerir misin?
                                </div>
                            </div>
                            <div className="flex gap-4 items-start flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                                <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-2xl rounded-tr-none max-w-[80%] text-slate-800 dark:text-slate-200 text-sm border border-blue-200 dark:border-blue-800/50 shadow-sm leading-relaxed">
                                    <p className="mb-2">Kesinlikle! O bölgede çalışmak için sana <strong>{data.branch_name}</strong> şubesini önerebilirim.</p>
                                    <p className="mb-2">Google yorumlarına göre bu mekanın öne çıkan özellikleri şunlar:</p>
                                    <ul className="list-disc pl-5 mb-2 space-y-1">
                                        <li>{aeoScore > 80 ? 'Genel olarak çok yüksek müşteri memnuniyetine sahip.' : 'Kahveleri genel olarak beğeniliyor.'}</li>
                                        <li>Yorumlarda sıkça <strong>"{targetKeywords[0]?.word || 'Temiz'}"</strong> ve <strong>"{targetKeywords[1]?.word || 'Hızlı'}"</strong> kelimeleri geçiyor.</li>
                                    </ul>
                                    <p className="text-xs opacity-70 mt-3 pt-2 border-t border-blue-200 dark:border-blue-800">(Not: Bu yanıt, FrancEye algoritmasının mevcut Google verilerinize dayanarak oluşturduğu tahmini LLM çıktısıdır.)</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-white/10">
                            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl px-4 py-3 text-slate-500 text-sm italic">
                                Simülasyon sadece okuma amaçlıdır...
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: KEYWORDS */}
                {activeTab === 'keywords' && (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl animate-fade-in">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="text-emerald-500">🎯</span> Hedef Kelime Aşılama (Keyword Seeding)
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Müşterilerinizi yönlendirerek yapay zeka veritabanlarına girmesini istediğiniz özellikler.</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-bold transition">Yeni Kelime Ekle</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hedeflenen Kelime</div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white mb-4">"Hızlı İnternet"</div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '25%'}}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Son 30 günde: 12 kez geçti</span>
                                    <span>Hedef: 50</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hedeflenen Kelime</div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white mb-4">"Güler Yüzlü"</div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Son 30 günde: 38 kez geçti</span>
                                    <span>Hedef: 50</span>
                                </div>
                            </div>

                            <div className="bg-purple-500/10 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-500/20 transition">
                                <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-2xl mb-3">+</div>
                                <h4 className="font-bold text-purple-700 dark:text-purple-400">Yeni Kampanya</h4>
                                <p className="text-xs text-purple-600/70 dark:text-purple-300/70 mt-1">Müşterilerinize kahve yanında karekod sunarak spesifik yorum isteyin.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: DATA CONSISTENCY */}
                {activeTab === 'data' && (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl animate-fade-in">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="text-orange-500">🌐</span> Dijital Ayak İzi Tutarlılığı
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Yapay zekalar farklı kaynaklardaki verilerinizin birbiriyle tutarlı olmasını bekler.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">✓</div>
                                    <div>
                                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Çalışma Saatleri</h4>
                                        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Google, Foursquare ve Web Sitesi birbiriyle tam uyumlu.</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-emerald-600 hover:underline">Detay</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">!</div>
                                    <div>
                                        <h4 className="font-bold text-red-800 dark:text-red-400">Dijital Menü Linki</h4>
                                        <p className="text-xs text-red-700/70 dark:text-red-400/70">TripAdvisor'da menü linki bulunamadı. Bu durum AI önerilerini zayıflatır.</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold shadow-sm">Linki Güncelle</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">✓</div>
                                    <div>
                                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Telefon Numarası</h4>
                                        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Tüm dijital platformlarda doğru numara (0850 ***) tanımlı.</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-emerald-600 hover:underline">Detay</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
