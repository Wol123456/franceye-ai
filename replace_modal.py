with open('frontend/app/page.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('{/* --- SETTINGS MODAL --- */}')
end_idx = content.find('{/* --- REVIEWS MODAL (Son Mesajları Oku) --- */}')

if start_idx != -1 and end_idx != -1:
    new_modules = """
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

            """
    content = content[:start_idx] + new_modules + content[end_idx:]

with open('frontend/app/page.tsx', 'w') as f:
    f.write(content)
