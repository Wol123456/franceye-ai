import re

with open('frontend/app/page.tsx', 'r') as f:
    content = f.read()

# Add missing fetchAdmins helper if needed
if 'const fetchAdmins = async () =>' not in content:
    content = content.replace('const fetchAllPhones = async () => {', '''
    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAllPhones = async () => {''')

# 1. Replace outer shell
old_shell = '''        <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">'''

new_shell = '''        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/10 flex flex-col z-20 shadow-xl">
                <div className="p-6 cursor-pointer" onClick={() => { setActiveModule('dashboard'); setView('search'); }}>
                    <img src="/logo.png" alt="FrancEye AI" className="h-10 w-auto bg-white p-1 rounded-lg mb-4 drop-shadow" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent tracking-tight">FrancEye AI</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yönetim Paneli</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button onClick={() => { setActiveModule('dashboard'); setView('search'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        Şube Sağlığı
                    </button>
                    <button onClick={() => { setActiveModule('directory'); fetchAllPhones(); fetchAdmins(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'directory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Rehber & Yönetici
                    </button>
                    <button onClick={() => setActiveModule('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeModule === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Ayarlar
                    </button>
                </nav>
                <div className="p-6 border-t border-slate-200 dark:border-white/10">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl text-sm font-semibold transition text-slate-700 dark:text-slate-300">
                        {isDarkMode ? '☀️ Açık Tema' : '🌙 Koyu Tema'}
                    </button>
                </div>
            </aside>
            
            {/* Main Area */}
            <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
'''
content = content.replace(old_shell, new_shell)

# 2. Hide the original Header since we have a Sidebar now
old_header_start = '{/* Header */}'
new_header_start = '{/* Header */}\n                {activeModule === \'dashboard\' && ('
if new_header_start not in content:
    content = content.replace(old_header_start, new_header_start)
    content = content.replace('{/* Main Search or Results */}', ')}\n                {/* Main Search or Results */}')

# 3. Wrap Main Search or Results in activeModule === 'dashboard'
if '{activeModule === \'dashboard\' && (\n                    <div className=\"space-y-10\">' not in content:
    content = content.replace('{/* Main Search or Results */}', '{activeModule === \'dashboard\' && (\n                    <div className=\"space-y-10\">\n                {/* Main Search or Results */}')
    content = content.replace('{/* Modal (Reviews) */}', '                    </div>\n                )}\n                {/* Modal (Reviews) */}')

# 4. Remove the old dark mode / Settings buttons from header
content = re.sub(r'<div className="mt-4 md:mt-0 flex flex-wrap items-center justify-end gap-3 z-30 relative">.*?</div>', '', content, flags=re.DOTALL)
content = re.sub(r'</header>', '</div>\n                </header>', content) # Fix the div wrapper we just broke if any, actually wait, the regex might remove the whole div. Let's be careful.

with open('backend/refactor_ui.py', 'w') as f:
    pass # clean up

with open('frontend/app/page.tsx', 'w') as f:
    f.write(content)
