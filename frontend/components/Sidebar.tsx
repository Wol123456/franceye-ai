import React from 'react';

interface SidebarProps {
    activeModule: string;
    setActiveModule: (module: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (dark: boolean) => void;
    setView: (view: 'search' | 'dashboard') => void;
    onDirectoryClick: () => void;
}

export default function Sidebar({ activeModule, setActiveModule, isDarkMode, setIsDarkMode, setView, onDirectoryClick }: SidebarProps) {
    return (
        <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col z-20 shadow-xl h-full flex-shrink-0">
            <div className="p-6 cursor-pointer" onClick={() => { setActiveModule('dashboard'); setView('search'); }}>
                <img src="/logo.png" alt="FrancEye AI" className="h-10 w-auto bg-white p-1 rounded-lg mb-4 shadow" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent tracking-tight">FrancEye AI</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yönetim Paneli</p>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <button onClick={() => { setActiveModule('dashboard'); setView('search'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    📊 Şube Sağlığı
                </button>
                <button onClick={() => setActiveModule('competitor')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'competitor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    ⚔️ Rakip Analizi
                </button>
                <button onClick={onDirectoryClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'directory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    📒 Rehber & Yönetici
                </button>
                <button onClick={() => setActiveModule('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    ⚙️ Ayarlar
                </button>
            </nav>
            <div className="p-6 border-t border-slate-200 dark:border-white/10">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 rounded-xl text-sm font-semibold transition text-slate-800 dark:text-slate-200">
                    {isDarkMode ? '☀️ Açık Tema' : '🌙 Koyu Tema'}
                </button>
            </div>
        </aside>
    );
}
