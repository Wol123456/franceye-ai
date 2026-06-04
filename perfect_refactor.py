def main():
    with open('frontend/app/page.tsx', 'r') as f:
        content = f.read()

    # 1. Imports
    content = content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport Sidebar from '../components/Sidebar';\nimport DirectoryModule from '../components/DirectoryModule';"
    )

    # 2. State & Functions
    content = content.replace(
        "const [isSettingsOpen, setIsSettingsOpen] = useState(false);",
        "const [activeModule, setActiveModule] = useState('dashboard');\n    const [isSettingsOpen, setIsSettingsOpen] = useState(false);"
    )
    if "const fetchAdmins =" not in content:
        content = content.replace(
            "const fetchAllPhones = async () => {",
            """const fetchAdmins = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/admins`);
            if (res.ok) setAdmins(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAllPhones = async () => {"""
        )

    # 3. Main wrapper
    original_return = '''    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">'''
    
    new_return = '''    return (
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
    content = content.replace(original_return, new_return)

    # 4 & 5. Replace Settings Modal with New Modules
    start_modal = '{/* --- SETTINGS MODAL --- */}'
    end_modal = '{/* --- REVIEWS MODAL (Son Mesajları Oku) --- */}'
    
    s_idx = content.find(start_modal)
    e_idx = content.find(end_modal)
    
    if s_idx != -1 and e_idx != -1:
        new_modules = '''                    </div> {/* End Dashboard */}

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
        content = content[:s_idx] + new_modules + content[e_idx:]

    # 6. Close <main>
    # The file originally ends with:
    #         </div>
    #         </div>
    #     );
    # }
    original_end = '''        </div>
        </div>
    );
}'''
    new_end = '''                </main>
        </div>
        </div>
    );
}'''
    content = content.replace(original_end, new_end)

    with open('frontend/app/page.tsx', 'w') as f:
        f.write(content)

main()
