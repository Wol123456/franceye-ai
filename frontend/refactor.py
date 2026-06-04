import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Locate the return start
return_idx = content.find('return (')
if return_idx == -1:
    print("Could not find return")
    exit(1)

# Locate the start of Search Bar
search_idx = content.find('{/* --- SEARCH BAR (Always Visible) --- */}')

# Extract notifications block
notif_match = re.search(r'<div className="relative">(.*?)</div>\s*</div>\s*</header>', content, flags=re.DOTALL)
if not notif_match:
    print("Could not find notifications")
    exit(1)

notifications_jsx = '<div className="relative">' + notif_match.group(1) + '</div>'

# Now we replace everything between `return (` and `SEARCH BAR`
new_shell = f'''return (
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
                
                <main className="flex-1 overflow-y-auto relative">
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                        {{activeModule === 'dashboard' && (
                            <>
                                <div className="flex justify-end">
                                    {notifications_jsx}
                                </div>
'''

content = content[:return_idx] + new_shell + content[search_idx:]

# Close the activeModule === 'dashboard' at the end of the dashboard content
# The dashboard ends before `{/* Modal (Reviews) */}`
reviews_idx = content.find('{/* Modal (Reviews) */}')
if reviews_idx != -1:
    content = content[:reviews_idx] + '                            </>\n                        )}\n\n' + content[reviews_idx:]

# Also, wrap the settings modal content into `activeModule === 'directory'` and remove the modal backgrounds.
modal_start_idx = content.find('{/* --- SETTINGS MODAL --- */}')
modal_end_idx = content.find('                        </div>\n                    </div>\n                </div>\n            )}\n        </div>', modal_start_idx)

if modal_start_idx != -1 and modal_end_idx != -1:
    modal_content = content[modal_start_idx:modal_end_idx]
    
    # Clean up the modal content
    new_modal = modal_content.replace('{isSettingsOpen && (', "{activeModule === 'directory' && (")
    new_modal = new_modal.replace('<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">', '<div className="animate-fade-in space-y-6">')
    new_modal = new_modal.replace('<div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">', '<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full overflow-hidden shadow-xl flex flex-col">')
    new_modal = new_modal.replace('<button onClick={() => setIsSettingsOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition">✕</button>', '')
    new_modal = new_modal.replace('<h2 className="text-xl font-bold">Ayarlar & Şube Rehberi</h2>', '<h2 className="text-2xl font-bold text-slate-800 dark:text-white">Rehber ve Yönetici Paneli</h2>')
    
    # We replaced 2 divs out of 3, so we need to fix the closing tags later.
    content = content[:modal_start_idx] + new_modal + content[modal_end_idx:]
    # Replace the remaining closing tags for the modal
    content = content.replace('                        </div>\n                    </div>\n                </div>\n            )}\n        </div>\n    );\n}', '                        </div>\n                    </div>\n                )}\n')

# Add the 'settings' module
settings_jsx = '''
                {activeModule === 'settings' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Sistem Ayarları</h2>
                            <p className="text-slate-600 dark:text-slate-400">Bu alan ilerleyen güncellemelerde bildirim tercihleri ve genel platform ayarları için kullanılacaktır.</p>
                        </div>
                    </div>
                )}
                    </div>
                </main>
            </div>
        </div>
    );
}
'''
content = content + settings_jsx

with open('app/page.tsx', 'w') as f:
    f.write(content)
