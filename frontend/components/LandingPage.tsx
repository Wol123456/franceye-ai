'use client';
import React, { useState } from 'react';

interface LandingPageProps {
    onLaunchDemo: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;
}

export default function LandingPage({ onLaunchDemo, isDarkMode, setIsDarkMode }: LandingPageProps) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', brand: '', branches: '5-20', phone: '', email: '' });
    const [contactSubmitted, setContactSubmitted] = useState(false);

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setContactSubmitted(true);
        setTimeout(() => {
            setIsContactModalOpen(false);
            setContactSubmitted(false);
            setContactForm({ name: '', brand: '', branches: '5-20', phone: '', email: '' });
        }, 3000);
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ background: 'var(--fe-bg)', color: 'var(--fe-text)' }}>
            
            {/* Top Announcement Bar */}
            <div className="py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 border-b" style={{ background: 'var(--fe-navy)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.1)' }}>
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Yeni</span>
                <span>FrancEye AI v2.4 Kurumsal Sürüm Yayında! 81 ilde yapay zeka destekli itibar ve şube denetimi.</span>
                <button 
                    onClick={onLaunchDemo}
                    className="underline ml-2 hover:text-blue-200 transition font-bold"
                >
                    Demoyu İnceleyin →
                </button>
            </div>

            {/* Main Navbar */}
            <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors" style={{ background: 'rgba(21, 32, 51, 0.95)', borderColor: 'var(--fe-border)' }}>
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base text-white shadow-md shadow-blue-900/30" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)' }}>
                            FE
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                                FrancEye <span className="text-blue-400">AI</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Enterprise</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">Franchise & Şube Zeka Platformu</div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-400 transition cursor-pointer">Özellikler</a>
                        <a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-blue-400 transition cursor-pointer">Modüller</a>
                        <a href="#why-us" onClick={(e) => scrollToSection(e, 'why-us')} className="hover:text-blue-400 transition cursor-pointer">Neden FrancEye?</a>
                        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-blue-400 transition cursor-pointer">Paketler</a>
                        <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-blue-400 transition cursor-pointer">S.S.S.</a>
                    </nav>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                            title={isDarkMode ? 'Açık Tema' : 'Koyu Tema'}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="hidden sm:inline-flex fe-btn-ghost text-sm py-2 px-4"
                        >
                            Satışla Görüşün
                        </button>
                        <button
                            onClick={onLaunchDemo}
                            className="fe-btn-primary text-sm py-2 px-5 flex items-center gap-2 shadow-lg shadow-blue-700/20 active:scale-95 transition"
                        >
                            <span>Canlı Demo</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b" style={{ borderColor: 'var(--fe-border)' }}>
                {/* Glow Background */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold shadow-sm" style={{ background: 'var(--fe-surface)', borderColor: 'var(--fe-border)', color: 'var(--fe-text-muted)' }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>81 İl · Google Haritalar Gerçek Zamanlı Veri Entegrasyonu</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto">
                        Franchise Ağınızı <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">Yapay Zeka</span> ile Yönetin, Müşteri Kayıplarını Sıfırlayın.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                        Türkiye genelindeki tüm şubelerinizin Google itibarını, müşteri şikayetlerini ve şube performansını tek ekranda toplayın. Yapay zeka erken uyarı radarıyla krizleri büyümeden çözün, cironuzu koruyun.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={onLaunchDemo}
                            className="w-full sm:w-auto h-14 px-8 text-base font-bold text-white rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)' }}
                        >
                            <span>Canlı Demoyu İncele (Ücretsiz)</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border flex items-center justify-center gap-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            style={{ borderColor: 'var(--fe-border)', color: 'var(--fe-text)' }}
                        >
                            <span>Kurumsal Teklif Alın</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t" style={{ borderColor: 'var(--fe-border)' }}>
                        <div className="p-4">
                            <div className="text-3xl md:text-4xl font-black text-blue-600">81 İl</div>
                            <div className="text-xs uppercase font-bold tracking-wider mt-1" style={{ color: 'var(--fe-text-muted)' }}>Türkiye Kapsamı</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl md:text-4xl font-black text-emerald-600">%98</div>
                            <div className="text-xs uppercase font-bold tracking-wider mt-1" style={{ color: 'var(--fe-text-muted)' }}>Kriz Yakalama Başarısı</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl md:text-4xl font-black text-indigo-600">15 Sn</div>
                            <div className="text-xs uppercase font-bold tracking-wider mt-1" style={{ color: 'var(--fe-text-muted)' }}>Anlık Veri Senkronizasyonu</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl md:text-4xl font-black text-cyan-600">500+</div>
                            <div className="text-xs uppercase font-bold tracking-wider mt-1" style={{ color: 'var(--fe-text-muted)' }}>Taranan Şube Ağı</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem vs Solution Section (Why FrancEye?) */}
            <section id="why-us" className="py-20 border-b" style={{ borderColor: 'var(--fe-border)', background: 'var(--fe-surface-2)' }}>
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <div className="fe-label text-blue-600 font-bold">KÖKLÜ DEĞİŞİM</div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                            Geleneksel Şube Denetimi Öldü. Yapay Zeka Çağı Başladı.
                        </h2>
                        <p className="text-base" style={{ color: 'var(--fe-text-muted)' }}>
                            Ayda ya da yılda bir yapılan gizli müşteri denetimleri, müşterilerinizin Google'da her gün yazdığı gerçekleri yakalayamaz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Old Way */}
                        <div className="p-8 rounded-2xl border bg-red-500/5 border-red-500/20 space-y-5">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-lg">✕</span>
                                <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Geleneksel Denetimler</h3>
                            </div>
                            <ul className="space-y-3.5 text-sm" style={{ color: 'var(--fe-text-muted)' }}>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span>Yılda 1-2 kez yapılan ve yüz binlerce TL harcanan gizli müşteri ziyaretleri.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span>Excel tablolarında unutulan, şube müdürüne ulaştırılması haftalar süren raporlar.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span>Google Haritalar puanı düştüğünde ciro kaybı çoktan gerçekleşmiş olur.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span>Rakiplerinizin o ilde ne kadar öne geçtiğini ölçmek imkansızdır.</span>
                                </li>
                            </ul>
                        </div>

                        {/* New Way - FrancEye AI */}
                        <div className="p-8 rounded-2xl border bg-emerald-500/5 border-emerald-500/20 space-y-5 shadow-lg shadow-emerald-500/5">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">✓</span>
                                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">FrancEye AI ile 365 Gün Otomasyon</h3>
                            </div>
                            <ul className="space-y-3.5 text-sm" style={{ color: 'var(--fe-text-muted)' }}>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>7/24 Kesintisiz Tarama:</strong> Google verilerini anlık çeker, sıfır insan eforu.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>Yapay Zeka Şikayet Radarı:</strong> Temizlik, Personel, Hız ve Fiyat şikayetlerini saniyeler içinde etiketler.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>Erken Uyarı & Trend Alarmı:</strong> Son 6 aydaki düşüş trendini yakalayıp genel merkezi kriz çıkmadan uyarır.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>Tek Tıkla WhatsApp & E-posta:</strong> Sorunlu şubenin müdürüne yapay zekanın hazırladığı eylem planını anında iletir.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features Section */}
            <section id="features" className="py-24 border-b" style={{ borderColor: 'var(--fe-border)', background: 'var(--fe-surface)' }}>
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <div className="fe-label text-blue-600 font-bold">ÖNE ÇIKAN YETENEKLER</div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Franchise Ağınızı Zirvede Tutan Akıllı Özellikler
                        </h2>
                        <p className="text-base" style={{ color: 'var(--fe-text-muted)' }}>
                            Operasyonel riskleri anında yakalayan, müşteri memnuniyetini artıran ve şube performansını maksimize eden yapay zeka araçları.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center text-2xl font-black">
                                🚨
                            </div>
                            <h3 className="text-xl font-bold">Erken Uyarı & Trend Radarı</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Son 6 aydaki puan düşüş eğilimini ve art arda gelen olumsuz yorumları anında fark eder. Kriz büyümeden genel merkeze acil müdahale uyarısı üretir.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl font-black">
                                ⚡
                            </div>
                            <h3 className="text-xl font-bold">Google Maps Canlı Senkronizasyon</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Şubelerinizin gerçek zamanlı puanlarını, kullanıcı yorumlarını, çalışma saatlerini ve koordinatlarını saniyeler içinde çeker; veri girişi gerektirmez.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl font-black">
                                🏷️
                            </div>
                            <h3 className="text-xl font-bold">NLP Destekli Şikayet Ayrıştırma</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Müşteri yorumlarını okur ve yapay zeka ile Temizlik, Personel, Hız ve Fiyat ana başlıklarına otomatik ayırarak hangi şubede neyin aksadığını netleştirir.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-black">
                                📲
                            </div>
                            <h3 className="text-xl font-bold">WhatsApp & E-posta Bildirimleri</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Sorunlu şube tespit edildiğinde yapay zekanın ürettiği özel eylem planını şube müdürüne tek tıkla doğrudan WhatsApp veya e-posta üzerinden iletir.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl font-black">
                                📈
                            </div>
                            <h3 className="text-xl font-bold">12 Aylık Puan ve İtibar Geçmişi</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Her şubenin son 1 yıllık puan gelişimini interaktif grafiklerle raporlar. Mevsimsel düşüşleri veya personel kaynaklı dalgalanmaları görünür kılar.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-7 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 space-y-4" style={{ background: 'var(--fe-surface-2)', borderColor: 'var(--fe-border)' }}>
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center text-2xl font-black">
                                💬
                            </div>
                            <h3 className="text-xl font-bold">Yapay Zeka Yorum Yanıt Asistanı</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Müşteri yorumlarına marka tonunuza uygun 5 yıldızlı profesyonel yanıt taslakları hazırlar; müşteri memnuniyetini anında geri kazandırır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features & Modules Grid */}
            <section id="modules" className="py-24 border-b" style={{ borderColor: 'var(--fe-border)' }}>
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <div className="fe-label text-blue-600 font-bold">GELİŞMİŞ MODÜLLER</div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Kurumsal Franchise Yönetimi İçin Tasarlanmış 4 Güçlü Modül
                        </h2>
                        <p className="text-base" style={{ color: 'var(--fe-text-muted)' }}>
                            Tüm modüller birbiriyle entegre çalışır; genel merkezden şube müdürüne kadar kesintisiz denetim sağlar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Module 1 */}
                        <div className="fe-card p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xl">
                                    🩺
                                </div>
                                <h3 className="text-lg font-bold">Şube Sağlık Skoru™</h3>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                    Salt yıldız puanının ötesine geçin. Yorum hacmi, son 6 aylık trend ve yapay zeka duygu analizini birleştiren 100 üzerinden kurumsal sağlık metriği.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t text-xs font-bold text-blue-600 flex items-center gap-1" style={{ borderColor: 'var(--fe-border)' }}>
                                <span>Algoritmik Ağırlıklandırma</span> →
                            </div>
                        </div>

                        {/* Module 2 */}
                        <div className="fe-card p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-xl">
                                    🧠
                                </div>
                                <h3 className="text-lg font-bold">Yapay Zeka (AEO)</h3>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                    ChatGPT, Google Gemini ve Perplexity gibi yapay zeka motorlarında markanızın müşterilere ne sıklıkla önerildiğini ölçün ve pazar payınızı artırın.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t text-xs font-bold text-purple-600 flex items-center gap-1" style={{ borderColor: 'var(--fe-border)' }}>
                                <span>Answer Engine Visibility</span> →
                            </div>
                        </div>

                        {/* Module 3 */}
                        <div className="fe-card p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xl">
                                    ⚔️
                                </div>
                                <h3 className="text-lg font-bold">Rakip Analizi & Kıyaslama</h3>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                    İki markayı il bazında kafa kafaya kıyaslayın. Hangi bölgede hangi rakibin sizden daha çok yorum aldığını veya puanının yükseldiğini anında görün.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t text-xs font-bold text-amber-600 flex items-center gap-1" style={{ borderColor: 'var(--fe-border)' }}>
                                <span>İl Bazlı Karşılaştırma</span> →
                            </div>
                        </div>

                        {/* Module 4 */}
                        <div className="fe-card p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl">
                                    👥
                                </div>
                                <h3 className="text-lg font-bold">Rehber & Şube Müdürü Masası</h3>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                    Tüm şube müdürlerinin ve bölge koordinatörlerinin iletişim havuzunu yönetin. Şikayet çıktığında doğrudan WhatsApp veya e-posta bildirimini tetikleyin.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t text-xs font-bold text-emerald-600 flex items-center gap-1" style={{ borderColor: 'var(--fe-border)' }}>
                                <span>Otomatik Bildirim Motoru</span> →
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo CTA Banner */}
            <section className="py-20 border-b relative overflow-hidden" style={{ borderColor: 'var(--fe-border)', background: 'linear-gradient(135deg, #152033 0%, #1E3A5F 100%)', color: '#FFFFFF' }}>
                <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                        <span>Canlı Demo Ortamı Hazır</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                        Platformu Gerçek Verilerle Şimdi İnceleyin
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light">
                        Kredi kartı ya da kayıt gerekmez. Demo alanına girerek markanızı veya dilediğiniz bir franchise zincirini test edebilirsiniz.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onLaunchDemo}
                            className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-white text-slate-900 rounded-xl shadow-2xl hover:bg-slate-100 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>Demo Alanına Girin</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        <span className="text-xs text-slate-400">
                            * Demo sürümünde 3 marka incelemesi ve il bazında ilk 3 şube sıralaması aktiftir.
                        </span>
                    </div>
                </div>
            </section>

            {/* Pricing / Enterprise Plans */}
            <section id="pricing" className="py-24 border-b" style={{ borderColor: 'var(--fe-border)' }}>
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <div className="fe-label text-blue-600 font-bold">KURUMSAL LİSANSLAMA</div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            İhtiyacınıza Uygun Esnek Franchise Paketleri
                        </h2>
                        <p className="text-base" style={{ color: 'var(--fe-text-muted)' }}>
                            Şube sayınıza ve operasyonel hacminize göre özel fiyatlandırılır.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Plan 1 */}
                        <div className="fe-card p-8 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="fe-badge fe-badge-navy">Başlangıç Zincir</div>
                                <h3 className="text-2xl font-bold">1 - 5 Şube</h3>
                                <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>Yeni büyüyen butik franchise zincirleri için ideal.</p>
                                <ul className="space-y-3 text-xs pt-4 border-t" style={{ borderColor: 'var(--fe-border)', color: 'var(--fe-text)' }}>
                                    <li className="flex items-center gap-2">✓ 5 Şubeye Kadar Anlık Tarama</li>
                                    <li className="flex items-center gap-2">✓ Algoritmik Sağlık Skoru</li>
                                    <li className="flex items-center gap-2">✓ Temel Müşteri Yorum Analizi</li>
                                    <li className="flex items-center gap-2">✓ Haftalık E-posta Özeti</li>
                                </ul>
                            </div>
                            <button onClick={() => setIsContactModalOpen(true)} className="fe-btn-ghost w-full text-center">Fiyat Teklifi Al</button>
                        </div>

                        {/* Plan 2 - Popular */}
                        <div className="fe-card p-8 flex flex-col justify-between space-y-6 relative border-2 border-blue-600 shadow-xl">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                En Popüler
                            </div>
                            <div className="space-y-4">
                                <div className="fe-badge fe-badge-success">Büyüyen Franchise</div>
                                <h3 className="text-2xl font-bold">6 - 25 Şube</h3>
                                <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>Bölgesel ve ulusal düzeyde genişleyen markalar için.</p>
                                <ul className="space-y-3 text-xs pt-4 border-t" style={{ borderColor: 'var(--fe-border)', color: 'var(--fe-text)' }}>
                                    <li className="flex items-center gap-2 font-bold text-blue-600">✓ Tüm Başlangıç Özellikleri</li>
                                    <li className="flex items-center gap-2">✓ Yapay Zeka Erken Uyarı Radarı</li>
                                    <li className="flex items-center gap-2">✓ İl Bazlı Rakip Analizi Modülü</li>
                                    <li className="flex items-center gap-2">✓ WhatsApp & E-posta Bildirimleri</li>
                                    <li className="flex items-center gap-2">✓ Şube Müdürü Görev Atama</li>
                                </ul>
                            </div>
                            <button onClick={() => setIsContactModalOpen(true)} className="fe-btn-primary w-full text-center shadow-lg shadow-blue-600/30">Hemen Başlayın</button>
                        </div>

                        {/* Plan 3 */}
                        <div className="fe-card p-8 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="fe-badge fe-badge-warning">Kurumsal & Global</div>
                                <h3 className="text-2xl font-bold">25+ Şube</h3>
                                <p className="text-xs" style={{ color: 'var(--fe-text-muted)' }}>Büyük franchise zincirleri ve genel merkez yönetimleri.</p>
                                <ul className="space-y-3 text-xs pt-4 border-t" style={{ borderColor: 'var(--fe-border)', color: 'var(--fe-text)' }}>
                                    <li className="flex items-center gap-2 font-bold text-blue-600">✓ Sınırsız Şube & 81 İl Tam Kapsam</li>
                                    <li className="flex items-center gap-2">✓ AEO Yapay Zeka Arama Optimizasyonu</li>
                                    <li className="flex items-center gap-2">✓ Özel API Entegrasyonu & ERP Köprüsü</li>
                                    <li className="flex items-center gap-2">✓ Özel Müşteri Temsilcisi (SLA)</li>
                                    <li className="flex items-center gap-2">✓ Özel Sunucu & Firebase Altyapısı</li>
                                </ul>
                            </div>
                            <button onClick={() => setIsContactModalOpen(true)} className="fe-btn-ghost w-full text-center">Kurumsal İletişim</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 border-b" style={{ borderColor: 'var(--fe-border)', background: 'var(--fe-surface-2)' }}>
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-2">
                        <div className="fe-label text-blue-600 font-bold">MERAK EDİLENLER</div>
                        <h2 className="text-3xl font-black tracking-tight">Sıkça Sorulan Sorular</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="fe-card p-5 space-y-2">
                            <h4 className="font-bold text-base">Kurulum için şubelerin bir yazılım yüklemesi gerekir mi?</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Hayır. FrancEye AI tamamen bulut tabanlıdır. Google Haritalar API entegrasyonu sayesinde şubelerinize herhangi bir donanım veya yazılım kurmadan anında çalışır.
                            </p>
                        </div>
                        <div className="fe-card p-5 space-y-2">
                            <h4 className="font-bold text-base">Yapay zeka şikayetleri nasıl sınıflandırıyor?</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Gelişmiş doğal dil işleme (NLP) algoritmamız, müşterilerin yazdığı Türkçe ve İngilizce yorumları analiz ederek Temizlik, Personel, Hız ve Fiyat ana başlıklarına otomatik olarak ayrıştırır.
                            </p>
                        </div>
                        <div className="fe-card p-5 space-y-2">
                            <h4 className="font-bold text-base">Demo sürümünde neden sınırlar bulunuyor?</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--fe-text-muted)' }}>
                                Canlı demo ortamında sistem hızını korumak amacıyla 3 marka sorgulaması, il bazında ilk 3 şube listelemesi ve tek rakip karşılaştırması sınırlandırılmıştır. Kurumsal lisans ile sınırsız erişim sağlanır.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t mt-auto" style={{ borderColor: 'var(--fe-border)', background: 'var(--fe-surface)' }}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs" style={{ color: 'var(--fe-text-muted)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">FE</div>
                        <span className="font-bold text-slate-800 dark:text-white text-sm">FrancEye AI</span>
                        <span>© 2026 Tüm Hakları Saklıdır.</span>
                    </div>

                    <div className="flex items-center gap-6 font-semibold">
                        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-500 transition cursor-pointer">Özellikler</a>
                        <a href="#modules" onClick={(e) => scrollToSection(e, 'modules')} className="hover:text-blue-500 transition cursor-pointer">Modüller</a>
                        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-blue-500 transition cursor-pointer">Fiyatlandırma</a>
                        <button onClick={onLaunchDemo} className="text-blue-600 font-bold hover:underline">Canlı Demo</button>
                    </div>
                </div>
            </footer>

            {/* Contact / Sales Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-7 shadow-2xl space-y-5">
                        <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'var(--fe-border)' }}>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kurumsal Satışla Görüşün</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Franchise ağınız için 15 dakika içinde özel teklif hazırlayalım.</p>
                            </div>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        {contactSubmitted ? (
                            <div className="py-8 text-center space-y-3 animate-fade-in">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Talebiniz Alındı!</h4>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto">Kurumsal temsilcimiz en kısa sürede sizinle iletişime geçecektir.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <label className="fe-label mb-1 block">Ad Soyad</label>
                                    <input required type="text" className="fe-input text-xs" placeholder="Adınız Soyadınız" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="fe-label mb-1 block">Marka Adı</label>
                                        <input required type="text" className="fe-input text-xs" placeholder="Örn: Markanız" value={contactForm.brand} onChange={e => setContactForm({ ...contactForm, brand: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="fe-label mb-1 block">Şube Sayısı</label>
                                        <select className="fe-input text-xs" value={contactForm.branches} onChange={e => setContactForm({ ...contactForm, branches: e.target.value })}>
                                            <option value="1-5">1 - 5 Şube</option>
                                            <option value="6-20">6 - 20 Şube</option>
                                            <option value="21-50">21 - 50 Şube</option>
                                            <option value="50+">50+ Şube</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="fe-label mb-1 block">Telefon</label>
                                        <input required type="tel" className="fe-input text-xs" placeholder="05XX XXX XX XX" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="fe-label mb-1 block">E-Posta</label>
                                        <input required type="email" className="fe-input text-xs" placeholder="ornek@sirket.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                                    </div>
                                </div>

                                <button type="submit" className="fe-btn-primary w-full text-center mt-2 py-3 text-sm">
                                    Teklif Talebini Gönder
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
