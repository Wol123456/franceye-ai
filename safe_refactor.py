import os

def refactor():
    with open('frontend/app/page.tsx', 'r') as f:
        content = f.read()

    # 1. Imports and state
    if "import Sidebar" not in content:
        content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport Sidebar from '../components/Sidebar';\nimport DirectoryModule from '../components/DirectoryModule';")
    
    if "const [activeModule" not in content:
        content = content.replace("const [isSettingsOpen, setIsSettingsOpen] = useState(false);", "const [activeModule, setActiveModule] = useState('dashboard');\n    const [isSettingsOpen, setIsSettingsOpen] = useState(false);")

    if "const fetchAdmins =" not in content:
        content = content.replace("const fetchAllPhones = async () => {", '''const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAllPhones = async () => {''')

    # 2. Wrap Dashboard
    content = content.replace(
        '''    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">''',
        '''    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden">
                <Sidebar 
                    activeModule={activeModule}
                    setActiveModule={setActiveModule}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    setView={setView}
                    onDirectoryClick={() => { setActiveModule('directory'); fetchAllPhones(); fetchAdmins(); }}
                />
                <main className="flex-1 overflow-y-auto relative w-full">
                    <div style={{ display: activeModule === 'dashboard' ? 'block' : 'none' }}>'''
    )

    # We also want to hide the original header except the notification bell!
    # Actually, if we just keep the header, it's fine. The user can see it.
    # But they wanted the sidebar. We can hide the left side of the header.
    # Let's just let it be for now, or just replace the header with just the notification bell.
    
    # 3. Replace Settings Modal with new modules
    start_idx = content.find('{/* --- SETTINGS MODAL --- */}')
    end_idx = content.find('{/* --- REVIEWS MODAL (Son Mesajları Oku) --- */}')

    if start_idx != -1 and end_idx != -1:
        new_modules = '''
                    </div> {/* End of Dashboard Wrapper */}
                    
                    {activeModule === 'directory' && (
                        <DirectoryModule 
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
                                setNewAdmin({ name: admin.name, email: admin.email, phone: admin.phone, receive_emails: admin.receive_emails });
                                setIsAdminFormOpen(true);
                            }}
                            handleDeleteAdmin={deleteAdmin}
                        />
                    )}

                    {activeModule === 'settings' && (
                        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Sistem Ayarları</h2>
                                <p className="text-slate-600 dark:text-slate-400">Bu alan ilerleyen güncellemelerde bildirim tercihleri ve genel platform ayarları için kullanılacaktır.</p>
                            </div>
                        </div>
                    )}
            '''
        content = content[:start_idx] + new_modules + content[end_idx:]
    else:
        print("Could not find modal delimiters")
        return

    # 4. We need to close the `main` tag at the very end of the file.
    # The file ends with:
    #         </div>
    #     );
    # }
    # Since we replaced `<div className="min-h-screen...">` with `<div className="flex h-screen..."><Sidebar/><main>`,
    # The closing tags actually still match! 
    # Because `<div className="min-h-screen">` was closed by the `</div>` before the final `</div>`.
    # Wait, we replaced one `div` with `<div className="flex"><Sidebar/><main>`.
    # So we have ONE EXTRA open tag (`<main>`). We need to close `</main>` instead of the `</div>` that was there.
    # Let's replace the final `        </div>\n    );\n}` with `        </main>\n        </div>\n        </div>\n    );\n}`
    
    end_replace = content.rfind('        </div>\n    );\n}')
    if end_replace != -1:
        content = content[:end_replace] + '                </main>\n        </div>\n    );\n}'
    
    with open('frontend/app/page.tsx', 'w') as f:
        f.write(content)

refactor()
