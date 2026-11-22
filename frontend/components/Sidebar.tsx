'use client';
import React from 'react';

interface SidebarProps {
    activeModule: string;
    setActiveModule: (module: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (dark: boolean) => void;
    setView: (view: 'search' | 'dashboard') => void;
    onDirectoryClick: () => void;
    onExitDemo?: () => void;
}

const NAV_ITEMS = [
    {
        key: 'dashboard',
        label: 'Şube Sağlığı',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        key: 'aeo',
        label: 'Yapay Zeka (AEO)',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L14 18H10l-1.7-3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/>
                <path d="M10 22h4"/><path d="M12 18v4"/>
            </svg>
        ),
    },
    {
        key: 'competitor',
        label: 'Rakip Analizi',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
        ),
    },
    {
        key: 'directory',
        label: 'Rehber & Yönetici',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
    {
        key: 'settings',
        label: 'Ayarlar',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
        ),
    },
];

export default function Sidebar({ activeModule, setActiveModule, isDarkMode, setIsDarkMode, setView, onDirectoryClick, onExitDemo }: SidebarProps) {
    const handleNav = (key: string) => {
        if (key === 'directory') {
            onDirectoryClick();
        } else {
            setActiveModule(key);
            if (key === 'dashboard') setView('search');
        }
    };

    return (
        <aside
            style={{ background: 'var(--fe-sidebar-bg)' }}
            className="w-60 flex flex-col h-full flex-shrink-0 select-none"
        >
            {/* Logo */}
            <div
                className="flex items-center gap-3 px-5 py-5 cursor-pointer border-b"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => { setActiveModule('dashboard'); setView('search'); }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                    FE
                </div>
                <div>
                    <div className="font-bold text-white text-[15px] leading-tight">FrancEye AI</div>
                    <div className="text-[11px]" style={{ color: 'var(--fe-sidebar-txt)' }}>Yönetim Paneli</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                <div className="fe-label px-2 pb-2 block" style={{ color: 'rgba(191,208,232,0.5)' }}>MODÜLLER</div>
                {NAV_ITEMS.map(item => {
                    const isActive = activeModule === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => handleNav(item.key)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                            style={{
                                background: isActive ? 'var(--fe-sidebar-active-bg)' : 'transparent',
                                color: isActive ? 'var(--fe-sidebar-active-txt)' : 'var(--fe-sidebar-txt)',
                            }}
                            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--fe-sidebar-hover-bg)'; }}
                            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                            <span className="text-[13px] font-medium">{item.label}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {onExitDemo && (
                    <button
                        onClick={onExitDemo}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-xs font-semibold"
                        style={{ color: '#93C5FD', background: 'rgba(37,99,235,0.1)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.2)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.1)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <span>Ürün Tanıtımına Dön</span>
                    </button>
                )}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                    style={{ color: 'var(--fe-sidebar-txt)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--fe-sidebar-hover-bg)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                    {isDarkMode ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                    <span className="text-[13px]">{isDarkMode ? 'Açık Tema' : 'Koyu Tema'}</span>
                </button>
            </div>
        </aside>
    );
}
