import React, { useState } from 'react';

interface DirectoryModuleProps {
    branches?: any[];
    data: any;
    allPhones: any[];
    admins: any[];
    activeSettingsTab: string;
    setActiveSettingsTab: (tab: any) => void;
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
    branches, data, allPhones, admins, activeSettingsTab, setActiveSettingsTab,
    newAdmin, setNewAdmin, isAdminFormOpen, setIsAdminFormOpen,
    editingAdminId, setEditingAdminId, fetchAllPhones, handleAddNewAdmin,
    handleEditAdmin, handleDeleteAdmin
}: DirectoryModuleProps) {
    
    const currentTab = activeSettingsTab === 'admin' ? 'admin' : 'brand';
    const [editedPhones, setEditedPhones] = useState<{[key: string]: string}>({});

    const handlePhoneChange = (place_id: string, value: string) => {
        setEditedPhones(prev => ({...prev, [place_id]: value}));
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full overflow-hidden shadow-xl flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Rehber ve Yönetici Paneli</h2>
                </div>
                
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={() => setActiveSettingsTab('current')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${currentTab === 'brand' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Marka Şubeleri ({branches ? branches.length : 0})
                    </button>
                    <button 
                        onClick={() => setActiveSettingsTab('admin')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${currentTab === 'admin' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Sistem Yöneticileri
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-[#0f172a]/50">
                    {currentTab === 'admin' && (
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

                    {currentTab === 'brand' && (
                        <div className="space-y-4">
                            {(!branches || branches.length === 0) ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Lütfen Bir Marka Arayın</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Rehberde şube telefonlarını listelemek ve kaydetmek için önce arama bölümünden bir marka listelemesi yapın. (Örn: Oses Çiğköfte)</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {branches.map((branch: any, i: number) => {
                                        const existingPhoneObj = allPhones.find(p => p.place_id === branch.place_id);
                                        const existingPhone = existingPhoneObj ? existingPhoneObj.phone : '';
                                        const displayPhone = editedPhones[branch.place_id] !== undefined ? editedPhones[branch.place_id] : existingPhone;
                                        const hasUnsavedChanges = editedPhones[branch.place_id] !== undefined && editedPhones[branch.place_id] !== existingPhone;

                                        return (
                                            <div key={branch.place_id || i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 shadow-sm transition gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-slate-800 dark:text-white text-lg">{branch.name}</div>
                                                        {existingPhone && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800/50">Kayıtlı</span>}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                        {branch.vicinity || branch.formatted_address || "Adres bulunamadı"}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                                    <input 
                                                        type="text"
                                                        value={displayPhone}
                                                        onChange={(e) => handlePhoneChange(branch.place_id, e.target.value)}
                                                        placeholder="05XX XXX XX XX"
                                                        className={`w-full sm:w-56 bg-slate-50 dark:bg-slate-900 border ${hasUnsavedChanges ? 'border-amber-400 dark:border-amber-600/50' : 'border-slate-200 dark:border-slate-700'} rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-slate-800 dark:text-slate-200 font-medium`}
                                                    />
                                                    <button 
                                                        onClick={async () => {
                                                            const phoneToSave = displayPhone;
                                                            if (!phoneToSave) {
                                                                alert("Lütfen geçerli bir telefon numarası girin.");
                                                                return;
                                                            }
                                                            try {
                                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/update_phone`, {
                                                                    method: 'POST',
                                                                    headers: {'Content-Type': 'application/json'},
                                                                    body: JSON.stringify({ place_id: branch.place_id, phone: phoneToSave, branch_name: branch.name })
                                                                });
                                                                if (res.ok) {
                                                                    const newEdited = {...editedPhones};
                                                                    delete newEdited[branch.place_id];
                                                                    setEditedPhones(newEdited);
                                                                    fetchAllPhones();
                                                                    alert("Numara başarıyla kaydedildi!");
                                                                }
                                                            } catch (e) { console.error(e); }
                                                        }}
                                                        disabled={!displayPhone || (!hasUnsavedChanges && existingPhone)}
                                                        className={`px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition whitespace-nowrap flex items-center justify-center
                                                            ${(!displayPhone || (!hasUnsavedChanges && existingPhone)) 
                                                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                                                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25'}`}
                                                    >
                                                        {(!hasUnsavedChanges && existingPhone) ? 'Kaydedildi' : 'Kaydet'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
