"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DirectoryModule from '../components/DirectoryModule';
import AeoModule from '../components/AeoModule';
import CompetitorModule from '../components/CompetitorModule';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
];

const getMockUnread = (branch: any) => {
    return { positive: 0, negative: 0 };
};

export default function Dashboard() {
    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Search State
    const [branchName, setBranchName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [branches, setBranches] = useState<any[]>([]);

    // View State
    const [view, setView] = useState<'search' | 'dashboard'>('search');
    
    // Live Notification State
    const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Analysis State
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    // Date State
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [currentBranch, setCurrentBranch] = useState<any>(null);

    // Filter & Sort State
    const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>('puan-azalan');
    
    // Logs & Alerts State
    const [sentLogs, setSentLogs] = useState<any[]>([]);
    const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
    const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
    const [ignoredAlerts, setIgnoredAlerts] = useState<number[]>([]);
    const [managerPhone, setManagerPhone] = useState<string>('');

    // Settings Modal State
    const [activeModule, setActiveModule] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [aiResponseModal, setAiResponseModal] = useState<any>(null);

    const generateAiResponse = (review: any) => {
        if (review.rating >= 4) return `Merhaba ${review.author_name},\n\nHarika yorumunuz ve güzel puanınız için çok teşekkür ederiz! Sizlere en iyi hizmeti sunmak için çalışıyoruz. Sizi en kısa sürede tekrar şubemizde ağırlamaktan mutluluk duyarız.\n\nSaygılarımızla,\nŞube Yönetimi`;
        else if (review.rating === 3) return `Merhaba ${review.author_name},\n\nYorumunuz ve geri bildiriminiz için teşekkür ederiz. Deneyiminizi daha iyi hale getirmek için paylaştığınız detayları dikkate alacağız. Bir sonraki ziyaretinizde 5 yıldızlık bir deneyim sunmak dileğiyle.\n\nSaygılarımızla,\nŞube Yönetimi`;
        else return `Merhaba ${review.author_name},\n\nYaşadığınız olumsuz deneyim için çok üzgünüz. Konuyu detaylı olarak araştırmak ve telafi etmek isteriz. Lütfen müşteri ilişkileri hattımızla iletişime geçebilir misiniz? Size yardımcı olmak için elimizden geleni yapacağız.\n\nSaygılarımızla,\nŞube Yönetimi`;
    };
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState<'current' | 'all' | 'admin'>('current');
    const [allPhones, setAllPhones] = useState<any[]>([]);
    const [admins, setAdmins] = useState<any[]>([]);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', photo: '', receive_emails: false });
    const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

    // Reviews Modal State
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAllPhones = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/all_phones`);
            if (res.ok) setAllPhones(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const openSettings = async () => {
        setIsSettingsOpen(true);
        setActiveSettingsTab('current');
        try {
            fetchAllPhones();

            const pRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (pRes.ok) setAdmins(await pRes.json());
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddNewAdmin = () => {
        setEditingAdminId(null);
        setNewAdmin({ name: '', email: '', phone: '', photo: '', receive_emails: false });
        setIsAdminFormOpen(true);
    };

    const saveAdmin = async () => {
        if (!newAdmin.name || !newAdmin.phone) {
            alert("İsim ve telefon zorunludur.");
            return;
        }
        try {
            if (editingAdminId) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins/${editingAdminId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAdmin)
                });
                if (res.ok) {
                    const data = await res.json();
                    setAdmins(admins.map(a => a.id === editingAdminId ? data.admin : a));
                    setNewAdmin({ name: '', email: '', phone: '', photo: '', receive_emails: false });
                    setEditingAdminId(null);
                    setIsAdminFormOpen(false);
                    alert("Yönetici güncellendi!");
                }
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAdmin)
                });
                if (res.ok) {
                    const data = await res.json();
                    setAdmins([...admins, data.admin]);
                    setNewAdmin({ name: '', email: '', phone: '', photo: '', receive_emails: false });
                    setIsAdminFormOpen(false);
                    alert("Yönetici eklendi!");
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteAdmin = async (id: string) => {
        if (!confirm("Yöneticiyi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAdmins(admins.filter(a => a.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleAlert = (idx: number) => {
        setExpandedAlerts(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    // --- Derived Data ---
    const filteredBranches = branches
        .filter(b => b.rating >= minScoreFilter)
        .sort((a, b) => {
             if (sortOrder === 'puan-azalan') return b.rating - a.rating;
             if (sortOrder === 'puan-artan') return a.rating - b.rating;
             if (sortOrder === 'yorum-azalan') return b.user_ratings_total - a.user_ratings_total;
             return 0;
        });

    // --- Actions ---

    const searchBranches = async () => {
        if (!selectedCity) {
            alert("Lütfen önce bir şehir seçiniz.");
            return;
        }
        setLoading(true);
        try {
            // "şubeleri" ekleyerek Google'ın sadece genel merkezi değil, tüm bayileri/şubeleri getirmesini sağlıyoruz.
            const query = `${branchName} şubeleri ${selectedCity}`;
            console.log("Searching:", query);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/search_branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, city: selectedCity })
            });

            if (!res.ok) throw new Error("Arama başarısız");
            const results = await res.json();
            setBranches(results);
            setView('search'); // Ensure we are in search view

        } catch (err) {
            alert("Arama hatası. Backend çalışıyor mu?");
            console.error(err);
        }
        setLoading(false);
    };

    const analyzeBranch = async (branchData: any, dateOverride?: string) => {
        setLoading(true);

        // Save contextual branch data
        if (branchData) {
            setCurrentBranch(branchData);
        } else {
            branchData = currentBranch;
        }

        if (!branchData) {
            setLoading(false);
            return;
        }

        const targetDate = dateOverride || selectedDate;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    branch_name: branchData.name,
                    location_query: branchData.name + " " + branchData.address,
                    place_id: branchData.place_id,
                    target_date: targetDate
                })
            });
            if (!res.ok) throw new Error("Analiz servisine ulaşılamadı");
            const result = await res.json();
            setData(result);
            setManagerPhone(result.manager_phone || '');
            setView('dashboard'); // Switch to dashboard
            fetchLogs(); // Fetch logs for this branch
        } catch (err) {
            alert("Analiz hatası.");
            console.error(err);
        }
        setLoading(false);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        // If we are already viewing a dashboard, refresh data immediately
        if (view === 'dashboard' && currentBranch) {
            analyzeBranch(null, newDate);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-emerald-400";
        if (score >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    // Formatting Helper for Day
    const getDayName = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { weekday: 'long' });
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/complaint_logs`);
            if (res.ok) {
                const logs = await res.json();
                setSentLogs(logs);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const logAlert = async (type: string, msg: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/log_complaint`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    branch_name: data.branch_name,
                    message: msg,
                    type: type,
                    date: new Date().toLocaleString('tr-TR')
                })
            });
            fetchLogs();
        } catch(e) {
            console.error(e);
        }
    };

    const handleSendSelected = () => {
        if (selectedAlerts.length === 0) {
            alert("Lütfen önce iletilecek yorumları seçin.");
            return;
        }
        
        let waUrl = "https://wa.me/";
        if (managerPhone && managerPhone.trim() !== "") {
            const cleanPhone = managerPhone.replace(/\D/g, '');
            if (cleanPhone) waUrl += cleanPhone;
        }
        
        const selectedTexts = selectedAlerts.map(idx => `• ${data.critical_alerts[idx].text}`).join("\n\n");
        const waText = `🚨 *FrancEye AI Acil Durum Raporu* 🚨\n\n*Şube:* ${data.branch_name}\n*İletilen Şikayetler:*\n${selectedTexts}`;
        
        logAlert('WhatsApp', `${selectedAlerts.length} adet şikayet müdüre iletildi.`);
        window.open(`${waUrl}?text=${encodeURIComponent(waText)}`, '_blank');
        setSelectedAlerts([]);
    };

    const handleIgnoreSelected = () => {
        if (selectedAlerts.length === 0) {
            alert("Lütfen önce yoksayılacak yorumları seçin.");
            return;
        }
        
        setIgnoredAlerts(prev => [...prev, ...selectedAlerts]);
        logAlert('Sistem', `${selectedAlerts.length} adet şikayet yönetici tarafından yoksayıldı.`);
        setSelectedAlerts([]);
    };

    const activeAlerts = data?.critical_alerts 
        ? data.critical_alerts.map((a: any, idx: number) => ({ ...a, originalIdx: idx })).filter((a: any) => !ignoredAlerts.includes(a.originalIdx))
        : [];

    // URL Parameter Auto-Analysis Effect
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const place_id = params.get('place_id');
            const name = params.get('name');
            const address = params.get('address');
            
            if (place_id && name) {
                // Remove params so it doesn't loop if user navigates back to search
                window.history.replaceState({}, document.title, window.location.pathname);
                analyzeBranch({ place_id, name, address });
            }
        }
    }, []);

    // Live Notification Effect
    React.useEffect(() => {
        if (view !== 'search' || branches.length === 0) {
            setLiveNotifications([]);
            return;
        }
        
        const filtered = branches.filter(b => {
            const cityMatch = selectedCity ? (b.address && b.address.includes(selectedCity)) : true;
            return cityMatch;
        });

        const branchesWithUnread = filtered.filter(b => {
            const u = getMockUnread(b);
            return u.positive > 0 || u.negative > 0;
        });

        if (branchesWithUnread.length === 0) return;

        let idx = 0;
        setLiveNotifications([]); // reset

        const interval = setInterval(() => {
            if (idx < branchesWithUnread.length) {
                const branchToAdd = branchesWithUnread[idx];
                setLiveNotifications(prev => {
                    // Prevent duplicates
                    if (prev.find(p => p.place_id === branchToAdd.place_id)) return prev;
                    return [branchToAdd, ...prev].slice(0, 6); // Keep last 6
                });
                idx++;
            } else {
                clearInterval(interval);
            }
        }, 1200);

        return () => clearInterval(interval);
    }, [branches, selectedCity, view]);

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
                
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" 
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                
                <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 z-50 md:z-0 flex-shrink-0 h-full`}>
                    <Sidebar 
                        activeModule={activeModule}
                        setActiveModule={(m) => { setActiveModule(m); setIsSidebarOpen(false); }}
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                        setView={(v) => { setView(v); setIsSidebarOpen(false); }}
                        onDirectoryClick={() => { setActiveModule('directory'); fetchAllPhones(); fetchAdmins(); setIsSidebarOpen(false); }}
                    />
                </div>
                <main className="flex-1 overflow-y-auto relative w-full">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-6 md:pt-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-300 dark:border-white/10 pb-8">
                    <div className="flex flex-row items-center justify-between w-full md:w-auto">
                        <div className="cursor-pointer flex items-center gap-4" onClick={() => setView('search')}>
                            <img 
                                src="/logo.png" 
                                alt="FrancEye AI Logo" 
                                className="h-12 md:h-16 w-auto bg-white p-1 rounded-xl object-contain drop-shadow-md" 
                            />
                            <div>
                                <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                                    FrancEye AI
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 md:mt-2 text-xs md:text-lg font-light hidden md:block">
                                    Yapay Zeka Destekli Şube Sağlık ve İtibar Takibi
                                </p>
                            </div>
                        </div>

                        {/* Hamburger Menu for Mobile */}
                        <button 
                            className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Sağ Üst Menü (Tema, Ana Sayfa, Ayarlar & Bildirimler) */}
                    <div className="mt-4 md:mt-0 flex flex-wrap items-center justify-start md:justify-end gap-2 md:gap-3 z-30 relative w-full md:w-auto">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-lg transition border border-slate-300 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button onClick={() => setView('search')} className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition border border-slate-300 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Ana Sayfa
                        </button>

                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                                className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition border border-slate-300 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                Bildirimler
                                {liveNotifications.length > 0 && (
                                    <span className="bg-red-500 text-slate-900 dark:text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                                        {liveNotifications.length}
                                    </span>
                                )}
                            </button>

                            {isNotificationsOpen && liveNotifications.length > 0 && (
                                <div className="absolute right-0 top-full mt-3 w-72 md:w-80 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Yeni Yorumlar</h4>
                                        <span className="text-xs text-slate-600 dark:text-slate-400">{liveNotifications.length} Şube</span>
                                    </div>
                                    <div className="overflow-y-auto custom-scrollbar p-2 space-y-2">
                                        {liveNotifications.map(branch => {
                                            const unread = getMockUnread(branch);
                                            return (
                                                <div 
                                                    key={branch.place_id} 
                                                    className="bg-white/80 dark:bg-slate-800/50 hover:bg-white dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:border-slate-700 p-3 rounded-xl cursor-pointer transition flex flex-col gap-1.5"
                                                    onClick={() => {
                                                        analyzeBranch(branch);
                                                        setIsNotificationsOpen(false);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight pr-2">{branch.name}</span>
                                                        <span className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">Az önce</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {unread.positive > 0 && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">+{unread.positive} Olumlu</span>}
                                                        {unread.negative > 0 && <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded-md border border-red-500/20">+{unread.negative} Kritik</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {isNotificationsOpen && liveNotifications.length === 0 && (
                                <div className="absolute right-0 top-full mt-3 w-64 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-6 text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="text-slate-500 text-sm">Yeni bildirim yok.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>
            <div className="relative z-10">

                    <div style={{ display: activeModule === 'dashboard' ? 'block' : 'none' }}>



            <div className="relative max-w-7xl mx-auto p-6 md:p-10 pt-6 space-y-10">



                {/* --- SEARCH BAR (Always Visible) --- */}
                <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1 border border-slate-300 dark:border-white/10 shadow-2xl z-20 relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                        {/* Brand Input */}
                        <div className="md:col-span-5 p-2">
                            <label className="text-xs text-slate-600 dark:text-slate-400 ml-1 mb-1 block font-semibold uppercase tracking-wider">Marka Adı</label>
                            <input
                                type="text"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                placeholder="Örn: Kahve Dünyası"
                                className="w-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* City Dropdown */}
                        <div className="md:col-span-4 p-2">
                            <label className="text-xs text-slate-600 dark:text-slate-400 ml-1 mb-1 block font-semibold uppercase tracking-wider">Şehir Seçimi</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-slate-900 dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="" disabled hidden>İl Seçiniz</option>
                                {TURKISH_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-3 p-2 flex items-end">
                            <button
                                onClick={searchBranches}
                                disabled={loading}
                                className="w-full h-[50px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-slate-900 dark:text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading && view === 'search' ? (
                                    <span className="animate-pulse">Aranıyor...</span>
                                ) : (
                                    <span>Şubeleri Bul</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- HERO SECTION (When Empty) --- */}
                {view === 'search' && branches.length === 0 && (
                    <div className="mt-16 text-center space-y-12 animate-fade-in pb-20">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                                İtibarınızı <span className="text-emerald-400">Yapay Zeka</span> ile Yönetin
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                                Şubelerinizin dijital performansını saniyeler içinde analiz edin, müşteri şikayetlerini kategorize edin ve potansiyel krizleri yapay zeka destekli erken uyarı sistemiyle önleyin.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-8 rounded-3xl hover:bg-white dark:bg-slate-800/70 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="text-5xl mb-6">⚡</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Gerçek Zamanlı Analiz</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Tüm Google Haritalar verilerini anlık olarak çeker ve şubelerinizin gerçek performansını saniyeler içinde raporlar.</p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-8 rounded-3xl hover:bg-white dark:bg-slate-800/70 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="text-5xl mb-6">🧠</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Yapay Zeka Ayrıştırma</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Müşteri yorumlarını okur ve Temizlik, Personel, Fiyat gibi kategorilere otomatik olarak ayırarak sorunun kaynağını bulur.</p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-8 rounded-3xl hover:bg-white dark:bg-slate-800/70 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="text-5xl mb-6">🚨</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Kritik Uyarı Sistemi</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Düşüş trendlerini ve kırmızı çizgiyi aşan şikayetleri tespit edip tek tıkla şube müdürüne WhatsApp üzerinden iletir.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RESULTS SECTION --- */}
                {view === 'search' && branches.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        
                        {/* Filtreleme ve Sıralama Çubuğu */}
                        <div className="bg-white/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Sonuçlar ({filteredBranches.length})</h2>
                            
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase">Puan Filtresi:</label>
                                    <select 
                                        value={minScoreFilter} 
                                        onChange={e => setMinScoreFilter(Number(e.target.value))}
                                        className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value={0}>Tümü</option>
                                        <option value={4.0}>4.0 ve Üzeri</option>
                                        <option value={4.5}>4.5 ve Üzeri</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase">Sıralama:</label>
                                    <select 
                                        value={sortOrder} 
                                        onChange={e => setSortOrder(e.target.value)}
                                        className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                    >
                                        <option value="puan-azalan">Puan (Yüksekten Düşüğe)</option>
                                        <option value="puan-artan">Puan (Düşükten Yükseğe)</option>
                                        <option value="yorum-azalan">Yorum Sayısı (Çoktan Aza)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBranches.map((branch) => {
                                const unread = getMockUnread(branch);
                                return (
                                <div key={branch.place_id} className="bg-white/80 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 p-6 rounded-2xl transition hover:bg-slate-50/60 dark:bg-slate-800/60 group cursor-pointer relative" onClick={() => analyzeBranch(branch)}>
                                    
                                    {/* Leaderboard Badge */}
                                    <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-tl-2xl rounded-br-2xl shadow-md z-10 text-sm">#{filteredBranches.indexOf(branch) + 1}</div>

                                    {/* Bildirim Balonları */}
                                    {(unread.positive > 0 || unread.negative > 0) && (
                                        <div className="absolute -top-3 -right-3 flex gap-1.5 z-10">
                                            {unread.negative > 0 && (
                                                <div className="bg-red-500 text-slate-900 dark:text-white text-[11px] font-extrabold w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 border-[3px] border-slate-900 animate-bounce" style={{ animationDuration: '2s' }} title={`${unread.negative} Yeni Olumsuz Yorum`}>
                                                    {unread.negative}
                                                </div>
                                            )}
                                            {unread.positive > 0 && (
                                                <div className="bg-emerald-500 text-slate-900 dark:text-white text-[11px] font-extrabold w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 border-[3px] border-slate-900 animate-bounce" style={{ animationDuration: '2.5s' }} title={`${unread.positive} Yeni Olumlu Yorum`}>
                                                    {unread.positive}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:text-blue-400 transition mb-2 pr-4">{branch.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{branch.address}</p>

                                    <div className="flex items-center gap-4 text-sm font-mono">
                                        <div className="flex items-center text-yellow-400 gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            <span className="font-bold">{branch.rating}</span>
                                        </div>
                                        <div className="text-slate-500 border-r border-slate-300 dark:border-slate-700 pr-4">
                                            ({branch.user_ratings_total} Yorum)
                                        </div>
                                        {branch.health_score && (
                                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                <span className="font-bold">Skor: {branch.health_score}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button className="mt-4 w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 rounded-lg text-sm font-semibold transition text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:text-white">
                                        Analize Git →
                                    </button>
                                </div>
                            )})}
                        </div>
                    </div>
                )}

                {/* --- VIEW: SEARCH ANALYZING --- */}
                {loading && view === 'dashboard' && (
                    <div className="text-center py-20">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Veriler Analiz Ediliyor...</h2>
                        <p className="text-slate-600 dark:text-slate-400">Yorumlar, trafik verileri ve sağlık skoru hesaplanıyor.</p>
                    </div>
                )}

                {/* --- VIEW: DASHBOARD --- */}
                {view === 'dashboard' && data && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                        
                        {/* Kritik Uyarılar */}
                        {data.critical_alerts && data.critical_alerts.length > 0 && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-5 shadow-lg shadow-red-500/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 z-20 relative">
                                    <h3 className="text-red-400 font-bold flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                        AI Destekli Kritik Şube Uyarıları
                                    </h3>
                                    
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Action Buttons */}
                                        <button onClick={handleSendSelected} className="flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] px-3 py-1.5 rounded-lg text-xs font-bold transition border border-[#25D366]/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            Seçilenleri İlet {selectedAlerts.length > 0 && `(${selectedAlerts.length})`}
                                        </button>
                                        <button onClick={handleIgnoreSelected} className="flex items-center gap-1.5 bg-slate-500/20 hover:bg-slate-500/40 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-slate-500/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                            Yoksay
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 mt-2">
                                    {activeAlerts.length > 0 ? (
                                        activeAlerts.map((alert: any) => {
                                            const idx = alert.originalIdx;
                                            const isExpanded = expandedAlerts.includes(idx);
                                            const isSelected = selectedAlerts.includes(idx);
                                            return (
                                            <div key={idx} onClick={() => toggleAlert(idx)} className={`bg-red-950/40 border p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition group relative ${isSelected ? 'border-red-400 bg-red-900/60' : 'border-red-500/30 hover:bg-red-900/40'}`}>
                                                
                                                {/* Checkbox */}
                                                <div className="absolute top-2 right-2 z-30">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (e.target.checked) setSelectedAlerts([...selectedAlerts, idx]);
                                                            else setSelectedAlerts(selectedAlerts.filter(i => i !== idx));
                                                        }}
                                                        className="w-4 h-4 cursor-pointer accent-red-500"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center mb-1 pr-6">
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[10px] font-bold uppercase text-red-300 bg-red-500/20 px-2 py-0.5 rounded-md">{alert.category}</span>
                                                        {alert.time && <span className="text-[10px] text-red-400/50">{alert.time}</span>}
                                                    </div>
                                                    <span className="text-[10px] text-red-400/70">{alert.author}</span>
                                                </div>
                                                <p className={`text-sm text-red-100 italic transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                    "{alert.text}"
                                                </p>
                                                {!isExpanded && alert.text && alert.text.length > 70 && (
                                                    <span className="text-[10px] text-red-400/40 text-right mt-1 group-hover:text-red-400/80 transition">Tümünü oku...</span>
                                                )}
                                            </div>
                                        )})
                                    ) : (
                                        <div className="col-span-full text-center text-sm text-red-300 py-4 opacity-70">
                                            Kritik uyarı bulunamadı veya tümü yoksayıldı.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* PREMIUM 12-COLUMN DASHBOARD LAYOUT */}
                        
                        {/* Başlık / Geri Dön */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm">
                            <div className="space-y-1 w-full md:w-auto">
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                                    {data.branch_name}
                                </h2>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    {data.address || "Adres bilgisi yükleniyor..."}
                                </p>
                            </div>
                            <button onClick={() => setView('search')} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-2 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                Listeye Dön
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                            
                            {/* === TOP ROW === */}
                            
                            {/* 1. Health Score (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-slate-300 dark:border-white/10 shadow-xl relative overflow-hidden group flex flex-col justify-center min-h-[250px] transition hover:shadow-2xl hover:-translate-y-1">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-current opacity-10 blur-3xl rounded-full ${getScoreColor(data.health_score)}`}></div>

                                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Şube Sağlık Skoru</h3>
                                <div className="flex items-center justify-between z-10">
                                    <span className={`text-7xl font-bold tracking-tighter ${getScoreColor(data.health_score)} drop-shadow-lg`}>
                                        {data.health_score}
                                    </span>
                                    <div className="text-right">
                                        <div className={`text-xl font-bold ${getScoreColor(data.health_score)}`}>
                                            {data.health_analysis}
                                        </div>
                                        <div className="text-slate-500 text-sm">Genel Durum</div>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 h-3 rounded-full mt-6 overflow-hidden z-10 shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(data.health_score).replace('text-', 'bg-')}`}
                                        style={{ width: `${data.health_score}%` }}
                                    />
                                </div>
                                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed z-10">
                                    Puan (%60), Yorum Hacmi (%20), Yapay Zeka Duygu Analizi (%20)
                                </div>
                            </div>

                            {/* 2. Platform Puanı (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:border-white/10 shadow-xl flex flex-col justify-between min-h-[250px] transition hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>
                                <div>
                                    <div className="flex items-center justify-between mb-2 text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            <span className="text-xs font-bold uppercase tracking-wider">Google Puanı</span>
                                        </div>
                                        <span className="text-xs font-bold bg-slate-200/80 dark:bg-slate-700/80 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 shadow-inner border border-slate-300/50 dark:border-slate-600/50">
                                            {data.metrics.google_reviews.toLocaleString()} Yorum
                                        </span>
                                    </div>
                                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-yellow-400 transition mb-4 flex items-end gap-2 drop-shadow-sm">
                                        <span>{data.ratings[0].score}</span> 
                                        <span className="text-slate-500 text-lg font-normal mb-1">/ 5.0</span>
                                    </div>
                                    
                                    <div className="space-y-2 mt-2">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = data.rating_distribution?.[star] || 0;
                                            const maxCount = Math.max(...Object.values(data.rating_distribution || { "5": 1 }) as number[]) || 1;
                                            const pct = (count / maxCount) * 100;
                                            
                                            return (
                                                <div key={star} className="flex items-center gap-2 text-xs">
                                                    <div className="flex items-center gap-1 w-10 text-slate-600 dark:text-slate-400 font-bold">
                                                        <span>{star}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                    </div>
                                                    <div className="flex-1 h-2 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden shadow-inner">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out" 
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Harita (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-0 border border-slate-300 dark:border-white/10 shadow-xl min-h-[250px] relative overflow-hidden group transition hover:shadow-2xl hover:-translate-y-1">
                                <h3 className="absolute top-5 left-5 text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    Şube Konumu
                                </h3>
                                <a 
                                    href={data.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.branch_name)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 z-0 opacity-80 hover:opacity-100 transition duration-500 block cursor-pointer"
                                >
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0, filter: 'contrast(1.1) brightness(0.9)', pointerEvents: 'none' }}
                                        src={`https://maps.google.com/maps?q=${data.coords.lat},${data.coords.lng}&z=16&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </a>
                                <div className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-end pointer-events-none">
                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] font-mono px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-lg">
                                        Lat: {data.coords.lat?.toFixed(4)}<br/>Lng: {data.coords.lng?.toFixed(4)}
                                    </div>
                                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg pointer-events-auto cursor-pointer hover:bg-blue-500 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </div>
                                </div>
                            </div>

                            {/* === MIDDLE ROW === */}

                            {/* 4. Trend Analizi (Span 8) */}
                            <div className="col-span-1 md:col-span-8 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:border-white/10 shadow-xl h-[320px] relative flex flex-col transition hover:shadow-2xl">
                                <h3 className="text-slate-800 dark:text-white font-bold mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                    Son 1 Yıl Trend Analizi
                                </h3>
                                <div className="flex-1 w-full relative -ml-4">
                                    {data.score_history && data.score_history.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.score_history}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                                                <YAxis domain={[1, 5]} hide />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#090A0E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                                                />
                                                <Line type="monotone" dataKey="score" name="Skor" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, fill: '#3b82f6', strokeWidth: 3, stroke: '#ffffff' }} activeDot={{ r: 8, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">Trend verisi yükleniyor...</div>
                                    )}
                                </div>
                            </div>

                            {/* 5. Kelime Bulutu (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-xl h-[320px] overflow-y-auto custom-scrollbar flex flex-col transition hover:shadow-2xl">
                                <h3 className="text-slate-800 dark:text-white font-bold mb-5 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    AI Müşteri Trendleri
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {data.trend_keywords && data.trend_keywords.length > 0 ? (
                                        data.trend_keywords.map((kw: any, i: number) => (
                                            <span key={i} className={`font-extrabold px-4 py-2 rounded-xl border shadow-sm transition hover:scale-105 cursor-default ${kw.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'}`} style={{ fontSize: `${Math.max(0.85, 0.85 + (kw.count * 0.04))}rem` }}>
                                                {kw.word} <span className="opacity-60 text-xs ml-1">({kw.count})</span>
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm italic">Yeterli trend verisi bulunamadı.</p>
                                    )}
                                </div>
                            </div>

                            {/* === BOTTOM ROW === */}

                            {/* 6. AI Aksiyon Planı (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-md rounded-3xl p-6 border border-purple-500/20 shadow-xl h-[400px] overflow-y-auto custom-scrollbar relative flex flex-col group transition hover:shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
                                <h3 className="text-slate-900 dark:text-white font-bold mb-5 flex items-center gap-2 relative z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 drop-shadow-md"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                                    AI Yönetim Planı
                                </h3>
                                <ul className="space-y-4 relative z-10">
                                    {data.action_plan && data.action_plan.length > 0 ? (
                                        data.action_plan.map((plan: any, i: number) => (
                                            <li key={i} className="flex gap-3 items-start bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white/20 dark:border-slate-700/50 shadow-sm hover:border-purple-500/30 transition">
                                                <input type="checkbox" className="mt-0.5 w-5 h-5 accent-purple-600 rounded-md cursor-pointer shrink-0" />
                                                <span className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{plan.task}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                            <p className="text-sm">Tüm standartlar harika görünüyor.</p>
                                        </div>
                                    )}
                                </ul>
                            </div>

                            {/* 7. Son Yorumlar (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:border-white/10 transition shadow-xl h-[400px] overflow-y-auto custom-scrollbar flex flex-col relative">
                                <div className="flex items-center justify-between mb-5 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 -mt-2 -mx-2 rounded-xl z-20 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 pl-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-white"><path d="M2 12h6" /><path d="M22 12h-6" /><path d="M12 2v6" /><path d="M12 22v-6" /><path d="M20 7l-3-3" /><path d="M4 20l3-3" /><path d="M4 7h16" /><path d="M4 17h16" /></svg>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Son Yorumlar</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsReviewsModalOpen(true)}
                                        className="text-xs text-white font-bold bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-md"
                                    >
                                        Tümünü Gör
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {data.reviews && data.reviews.length > 0 ? (
                                        data.reviews.map((review: any, idx: number) => (
                                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 transition hover:border-blue-500/30">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">{review.author_name}</span>
                                                    <span className="text-[10px] font-medium text-slate-500 shrink-0">{review.relative_time_description}</span>
                                                </div>
                                                <div className="flex gap-1 mb-3 items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < (review.rating || 0) ? "#fbbf24" : "#475569"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                    ))}
                                                    {review.ai_categories && review.ai_categories.map((cat: string, ci: number) => (
                                                        <span key={ci} className="ml-2 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">{cat}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic mb-3 line-clamp-3">
                                                    "{review.text}"
                                                </p>
                                                <button onClick={() => setAiResponseModal({isOpen: true, review, responseText: generateAiResponse(review)})} className="text-[10px] bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/20 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 border border-indigo-500/20">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                    AI Yanıtla
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-slate-500 py-10">
                                            <p className="text-sm">Yorum verisi yok.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 8. İletilen Loglar (Span 4) */}
                            <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/20 shadow-xl h-[400px] flex flex-col relative overflow-hidden group transition hover:shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
                                <div className="flex justify-between items-center mb-5 z-10 relative">
                                    <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 drop-shadow-md"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        İletilen Rapor Logları
                                    </h3>
                                </div>

                                <div className="flex-1 w-full relative rounded-2xl overflow-y-auto border border-white/20 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 p-5 space-y-4 custom-scrollbar z-10">
                                    {sentLogs.filter(log => log.branch_name === data.branch_name).length > 0 ? (
                                        sentLogs.filter(log => log.branch_name === data.branch_name).map((log, i) => (
                                            <div key={i} className="border-l-4 border-emerald-500 pl-4 py-1">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400">{log.type} İletisi</span>
                                                    <span className="text-[10px] font-mono text-slate-500">{log.date}</span>
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{log.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                            <p className="text-sm font-medium">Henüz yöneticiye bir rapor iletilmedi.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

                    {activeModule === 'directory' && (
                        <DirectoryModule 
                            branches={branches}
                            data={data}
                            allPhones={allPhones}
                            admins={admins}
                            activeSettingsTab={activeSettingsTab}
                            setActiveSettingsTab={setActiveSettingsTab}
                            newAdmin={newAdmin}
                            setNewAdmin={setNewAdmin}
                            isAdminFormOpen={isAdminFormOpen}
                            setIsAdminFormOpen={setIsAdminFormOpen}
                            editingAdminId={editingAdminId}
                            setEditingAdminId={setEditingAdminId}
                            fetchAllPhones={fetchAllPhones}
                            handleAddNewAdmin={handleAddNewAdmin}
                            handleEditAdmin={(admin) => {
                                setEditingAdminId(admin.id);
                                setNewAdmin({ name: admin.name, email: admin.email, phone: admin.phone, photo: admin.photo || '', receive_emails: admin.receive_emails });
                                setIsAdminFormOpen(true);
                            }}
                            handleDeleteAdmin={deleteAdmin}
                        />
                    )}

                    {activeModule === 'aeo' && (
                        <AeoModule data={data} />
                    )}

                    {activeModule === 'competitor' && (
                        <CompetitorModule data={data} selectedCity={selectedCity} />
                    )}

                    {activeModule === 'settings' && (
                        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Sistem Ayarları</h2>
                                <p className="text-slate-600 dark:text-slate-400">Bu alan ilerleyen güncellemelerde bildirim tercihleri ve genel platform ayarları için kullanılacaktır.</p>
                            </div>
                        </div>
                    )}
            
            {/* --- REVIEWS MODAL (Son Mesajları Oku) --- */}
            {isReviewsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                Son 5 Müşteri Yorumu ({data?.branch_name})
                            </h2>
                            <button onClick={() => setIsReviewsModalOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition bg-white dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 p-2 rounded-lg">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                            {data?.reviews && data.reviews.length > 0 ? (
                                data.reviews.slice(0, 5).map((review: any, idx: number) => (
                                    <div key={idx} className="bg-white/80 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-700/50 rounded-xl p-5 hover:bg-slate-50/60 dark:bg-slate-800/60 transition shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-lg text-slate-700 dark:text-slate-300">
                                                    {review.author_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{review.author_name}</div>
                                                    <div className="text-xs text-slate-500">{review.relative_time_description}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < (review.rating || 0) ? "#fbbf24" : "#475569"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                ))}
                                            </div>
                                        </div>

                                        {review.ai_categories && review.ai_categories.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {review.ai_categories.map((cat: string, ci: number) => (
                                                    <span key={ci} className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">{cat}</span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-800 italic">
                                            "{review.text}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500">Henüz yorum bulunmuyor.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
                            </div>
</main>
        </div>
        </div>
    );
}
