import re

with open('frontend/app/page.tsx', 'r') as f:
    content = f.read()

# 1. State changes
content = content.replace('const [isSettingsOpen, setIsSettingsOpen] = useState(false);', 'const [activeModule, setActiveModule] = useState("dashboard");\n    const [isSettingsOpen, setIsSettingsOpen] = useState(false);')

if 'const fetchAdmins = async () =>' not in content:
    content = content.replace('const fetchAllPhones = async () => {', '''
    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAllPhones = async () => {''')

# 2. Extract notifications
notif_match = re.search(r'<div className="relative">(.*?)</div>\s*</div>\s*</header>', content, flags=re.DOTALL)
notifications_jsx = '<div className="relative z-50">' + notif_match.group(1) + '</div>' if notif_match else ''

# 3. Create renderDashboard
content = content.replace('    return (\n        <div className={isDarkMode ? \'dark\' : \'\'}>\n            <div className="min-h-screen', '    const renderDashboard = () => (\n        <>\n            <div className="w-full relative')

# The modal starts at `            {/* --- SETTINGS MODAL --- */}`
modal_start_idx = content.find('{/* --- SETTINGS MODAL --- */}')
if modal_start_idx != -1:
    # Close renderDashboard
    content = content[:modal_start_idx] + '        </>\n    );\n\n    ' + content[modal_start_idx:]

# 4. Turn Modal into renderDirectory
# Re-evaluate the string because we just changed content
content = content.replace(
    '{/* --- SETTINGS MODAL --- */}\n            {isSettingsOpen && (\n                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">\n                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">',
    'const renderDirectory = () => (\n                <div className="animate-fade-in space-y-6">\n                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full overflow-hidden shadow-xl flex flex-col min-h-[500px]">'
)

content = content.replace('<button onClick={() => setIsSettingsOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition">✕</button>', '')
content = content.replace('<h2 className="text-xl font-bold">Ayarlar & Şube Rehberi</h2>', '<h2 className="text-2xl font-bold text-slate-800 dark:text-white">Rehber ve Yönetici Paneli</h2>')

# Find the end of renderDirectory.
# It was:
#                         </div>
#                     </div>
#                 </div>
#             )}
end_directory = content.find('                        </div>\n                    </div>\n                </div>\n            )}')
if end_directory != -1:
    content = content[:end_directory] + '                        </div>\n                    </div>\n    );' + content[end_directory + len('                        </div>\n                    </div>\n                </div>\n            )}'):]

# 5. Add Main Return Statement
end_idx = content.find('        </div>\n        </div>\n    );\n}')
if end_idx != -1:
    main_return = f'''        </div>
    );

    const renderSettings = () => (
        <div className="animate-fade-in space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Sistem Ayarları</h2>
                <p className="text-slate-600 dark:text-slate-400">Bu alan ilerleyen güncellemelerde bildirim tercihleri ve genel platform ayarları için kullanılacaktır.</p>
            </div>
        </div>
    );

    return (
        <div className={{isDarkMode ? 'dark' : ''}}>
            <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden">
                <Sidebar 
                    activeModule={{activeModule}}
                    setActiveModule={{setActiveModule}}
                    isDarkMode={{isDarkMode}}
                    setIsDarkMode={{setIsDarkMode}}
                    setView={{setView}}
                    onDirectoryClick={{() => {{ setActiveModule('directory'); fetchAllPhones(); fetchAdmins(); }}}}
                />
                <main className="flex-1 overflow-y-auto relative w-full">
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 w-full p-6 md:p-10">
                        {{activeModule === 'dashboard' && (
                            <div className="flex justify-end absolute top-6 right-6">
                                {notifications_jsx}
                            </div>
                        )}}
                        {{activeModule === 'dashboard' && renderDashboard()}}
                        {{activeModule === 'directory' && renderDirectory()}}
                        {{activeModule === 'settings' && renderSettings()}}
                    </div>
                </main>
            </div>
        </div>
    );
}}
'''
    content = content[:end_idx] + main_return

# Remove the old header completely because the Sidebar replaces it.
# Wait, if I remove the old header, renderDashboard won't have it. That's correct!
header_start = content.find('{/* Header */}')
header_end = content.find('</header>', header_start)
if header_start != -1 and header_end != -1:
    content = content[:header_start] + content[header_end + len('</header>'):]

# Also ensure Sidebar is imported
if 'import Sidebar' not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport Sidebar from '../components/Sidebar';")

with open('frontend/app/page.tsx', 'w') as f:
    f.write(content)
