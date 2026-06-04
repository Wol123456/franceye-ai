import React from 'react';

interface DirectoryModuleProps {
    data: any;
    allPhones: any[];
    admins: any[];
    activeSettingsTab: 'current' | 'all' | 'admin';
    setActiveSettingsTab: (tab: 'current' | 'all' | 'admin') => void;
    newAdmin: any;
    setNewAdmin: (admin: any) => void;
    isAdminFormOpen: boolean;
    setIsAdminFormOpen: (open: boolean) => void;
    editingAdminId: string | null;
    setEditingAdminId: (id: string | null) => void;
    fetchAllPhones: () => void;
    handleAddNewAdmin: () => void;
    handleEditAdmin: (admin: any) => void;
    handleDeleteAdmin: (id: string) => void;
}

export default function DirectoryModule({
    data, allPhones, admins, activeSettingsTab, setActiveSettingsTab,
    newAdmin, setNewAdmin, isAdminFormOpen, setIsAdminFormOpen,
    editingAdminId, setEditingAdminId, fetchAllPhones, handleAddNewAdmin,
    handleEditAdmin, handleDeleteAdmin
}: DirectoryModuleProps) {
    return (
        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full overflow-hidden shadow-xl flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Rehber ve Yönetici Paneli</h2>
                </div>
                
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={() => setActiveSettingsTab('current')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${activeSettingsTab === 'current' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Mevcut Şube ({data?.branch_name || 'Yok'})
                    </button>
                    <button 
                        onClick={() => setActiveSettingsTab('all')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${activeSettingsTab === 'all' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Tüm Şubeler
                    </button>
                    <button 
                        onClick={() => setActiveSettingsTab('admin')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${activeSettingsTab === 'admin' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Sistem Yöneticileri
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-[#0f172a]/50">
                    {activeSettingsTab === 'admin' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">Yönetici Listesi</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sistem raporlarını e-posta olarak alan yetkililer.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setNewAdmin({ name: '', email: '', phone: '', receive_emails: false });
                                        setEditingAdminId(null);
                                        setIsAdminFormOpen(true);
                                    }} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-blue-500/25 flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    Yeni Ekle
                                </button>
                            </div>

                            {isAdminFormOpen && (
                                <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    <h4 className="font-bold mb-4 text-slate-800 dark:text-white">{editingAdminId ? 'Yönetici Düzenle' : 'Yeni Yönetici Ekle'}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Ad Soyad" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-slate-800 dark:text-white" />
                                        <input type="email" placeholder="E-posta" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-slate-800 dark:text-white" />
                                        <input type="text" placeholder="Telefon" value={newAdmin.phone} onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-slate-800 dark:text-white" />
                                        <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 cursor-pointer hover:border-blue-500 transition">
                                            <input type="checkbox" checked={newAdmin.receive_emails} onChange={e => setNewAdmin({...newAdmin, receive_emails: e.target.checked})} className="w-5 h-5 accent-blue-600 rounded" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Günlük Raporları Al</span>
                                        </label>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-5">
                                        <button onClick={() => setIsAdminFormOpen(false)} className="px-5 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition font-medium">İptal</button>
                                        <button onClick={handleAddNewAdmin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition">{editingAdminId ? 'Güncelle' : 'Kaydet'}</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {admins.map((admin: any) => (
                                    <div key={admin.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{admin.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-3 mt-1">
                                                    <span>{admin.email}</span>
                                                    <span>•</span>
                                                    <span>{admin.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            {admin.receive_emails && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">Aktif Alıcı</span>}
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditAdmin(admin)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'current' && (
                        <div className="space-y-4 max-w-lg mx-auto mt-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{data?.branch_name || 'Şube Seçilmedi'}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Şube Yöneticisi Telefon Numarası</p>
                            </div>
                            
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Telefon Numarası</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-slate-800 dark:text-white font-medium"
                                        placeholder="05..."
                                        value={allPhones.find(p => p.place_id === data?.place_id)?.phone || ''}
                                        onChange={(e) => {
                                            const newPhones = [...allPhones];
                                            const idx = newPhones.findIndex(p => p.place_id === data?.place_id);
                                            if (idx >= 0) newPhones[idx].phone = e.target.value;
                                            else newPhones.push({ place_id: data?.place_id, phone: e.target.value, name: data?.branch_name });
                                        }}
                                    />
                                    <button 
                                        onClick={async () => {
                                            if (!data?.place_id) return;
                                            const phone = allPhones.find(p => p.place_id === data.place_id)?.phone;
                                            try {
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/update_phone`, {
                                                    method: 'POST',
                                                    headers: {'Content-Type': 'application/json'},
                                                    body: JSON.stringify({ place_id: data.place_id, phone, branch_name: data.branch_name })
                                                });
                                                if (res.ok) {
                                                    alert("Kaydedildi!");
                                                    fetchAllPhones();
                                                }
                                            } catch (e) { console.error(e); }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-blue-500/30 transition flex items-center gap-2"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'all' && (
                        <div className="space-y-3">
                            {allPhones.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">Henüz kayıtlı şube telefonu bulunmuyor.</div>
                            ) : (
                                allPhones.map((p: any, i: number) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition gap-4">
                                        <div className="font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <input 
                                                type="text"
                                                defaultValue={p.phone}
                                                onChange={(e) => p.newPhone = e.target.value}
                                                className="w-full sm:w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 font-medium"
                                            />
                                            <button 
                                                onClick={async () => {
                                                    const phoneToSave = p.newPhone !== undefined ? p.newPhone : p.phone;
                                                    try {
                                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/update_phone`, {
                                                            method: 'POST',
                                                            headers: {'Content-Type': 'application/json'},
                                                            body: JSON.stringify({ place_id: p.place_id, phone: phoneToSave, branch_name: p.name })
                                                        });
                                                        if (res.ok) {
                                                            alert("Güncellendi!");
                                                            fetchAllPhones();
                                                        }
                                                    } catch (e) { console.error(e); }
                                                }}
                                                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-5 py-2 rounded-lg text-sm font-bold transition"
                                            >
                                                Güncelle
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
