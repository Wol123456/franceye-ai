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
    
    const [isBranchManagerFormOpen, setIsBranchManagerFormOpen] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
    const [newBranchManager, setNewBranchManager] = useState({ place_id: '', branch_name: '', manager_name: '', phone: '', photo: '' });

    const handleDeleteBranchManager = async (place_id: string) => {
        if(!confirm("Bu şube yöneticisini silmek istediğinize emin misiniz?")) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/delete_phone/${place_id}`, {
                method: 'DELETE'
            });
            fetchAllPhones();
        } catch(e) { console.error(e); }
    };

    const handleSaveBranchManager = async () => {
        if (!newBranchManager.manager_name || !newBranchManager.phone) {
            alert("İsim ve Telefon alanları zorunludur!");
            return;
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/update_phone`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newBranchManager)
            });
            setIsBranchManagerFormOpen(false);
            fetchAllPhones();
        } catch(e) { console.error(e); }
    };

    // Filter combined list of "saved managers" + "searched branches"
    // Create a map of saved managers
    const savedManagersMap = new Map();
    allPhones.forEach(p => savedManagersMap.set(p.place_id, p));

    // Array to display
    const displayList: any[] = [];
    
    // Always show saved ones first
    allPhones.forEach(p => {
        displayList.push({...p, isSaved: true});
    });

    // Append searched branches if not saved
    if (branches) {
        branches.forEach(b => {
            if (!savedManagersMap.has(b.place_id)) {
                displayList.push({
                    place_id: b.place_id,
                    branch_name: b.name,
                    manager_name: '',
                    phone: '',
                    photo: '',
                    isSaved: false
                });
            }
        });
    }

    return (
        <div className="animate-fade-in space-y-6 max-w-7xl mx-auto p-6 md:p-10">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full overflow-hidden shadow-xl flex flex-col min-h-[600px]">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Telefon Rehberi</h2>
                </div>
                
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button 
                        onClick={() => setActiveSettingsTab('current')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${currentTab === 'brand' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Şube Yöneticileri
                    </button>
                    <button 
                        onClick={() => setActiveSettingsTab('admin')} 
                        className={`flex-1 py-4 text-sm font-semibold transition ${currentTab === 'admin' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-400 bg-white/80 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'}`}
                    >
                        Sistem Yöneticileri
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-[#0f172a]/50">
                    
                    {/* ADMİN TAB */}
                    {currentTab === 'admin' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">Yönetici Listesi</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sisteme tam yetkili erişimi olan kişiler.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setNewAdmin({ name: '', email: '', phone: '', photo: '', receive_emails: false });
                                        setEditingAdminId(null);
                                        setIsAdminFormOpen(true);
                                    }} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2"
                                >
                                    Ekle
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
                                        <input type="text" placeholder="Profil Fotoğrafı URL (Opsiyonel)" value={newAdmin.photo} onChange={e => setNewAdmin({...newAdmin, photo: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-slate-800 dark:text-white" />
                                        <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 cursor-pointer hover:border-blue-500 transition">
                                            <input type="checkbox" checked={newAdmin.receive_emails} onChange={e => setNewAdmin({...newAdmin, receive_emails: e.target.checked})} className="w-5 h-5 accent-blue-600 rounded" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Günlük Raporları Al</span>
                                        </label>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-5">
                                        <button onClick={() => setIsAdminFormOpen(false)} className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">İptal</button>
                                        <button onClick={handleAddNewAdmin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md">{editingAdminId ? 'Güncelle' : 'Kaydet'}</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {admins.map((admin: any) => (
                                    <div key={admin.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition">
                                        <div className="flex items-center gap-4">
                                            {admin.photo ? (
                                                <img src={admin.photo} alt={admin.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-900" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                    {admin.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{admin.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{admin.email} • {admin.phone}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditAdmin(admin)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600">Düzenle</button>
                                            <button onClick={() => handleDeleteAdmin(admin.id)} className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20">Sil</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BRAND MANAGERS TAB */}
                    {currentTab === 'brand' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">Şube Yöneticileri</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sisteme kayıtlı şube müdürleri ve iletişim bilgileri.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setNewBranchManager({ place_id: 'custom_' + Date.now(), branch_name: '', manager_name: '', phone: '', photo: '' });
                                        setEditingBranchId(null);
                                        setIsBranchManagerFormOpen(true);
                                    }} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2"
                                >
                                    Manuel Ekle
                                </button>
                            </div>

                            {isBranchManagerFormOpen && (
                                <div className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                    <h4 className="font-bold mb-4 text-slate-800 dark:text-white">{editingBranchId ? 'Şube Yöneticisi Düzenle' : 'Yeni Şube Yöneticisi Ekle'}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Şube Adı (Örn: X Burger Kadıköy)" value={newBranchManager.branch_name} onChange={e => setNewBranchManager({...newBranchManager, branch_name: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 text-slate-800 dark:text-white" />
                                        <input type="text" placeholder="Yönetici Ad Soyad" value={newBranchManager.manager_name} onChange={e => setNewBranchManager({...newBranchManager, manager_name: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 text-slate-800 dark:text-white" />
                                        <input type="text" placeholder="Telefon (05XX XXX XX XX)" value={newBranchManager.phone} onChange={e => setNewBranchManager({...newBranchManager, phone: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 text-slate-800 dark:text-white" />
                                        <input type="text" placeholder="Profil Fotoğrafı URL (Opsiyonel)" value={newBranchManager.photo} onChange={e => setNewBranchManager({...newBranchManager, photo: e.target.value})} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-emerald-500 text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-5">
                                        <button onClick={() => setIsBranchManagerFormOpen(false)} className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">İptal</button>
                                        <button onClick={handleSaveBranchManager} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md">{editingBranchId ? 'Güncelle' : 'Kaydet'}</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {displayList.map((branch: any, i: number) => (
                                    <div key={branch.place_id || i} className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-slate-800 border ${branch.isSaved ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} rounded-xl hover:shadow-md transition gap-4`}>
                                        <div className="flex items-center gap-4">
                                            {branch.photo ? (
                                                <img src={branch.photo} alt={branch.manager_name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-900" />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${branch.isSaved ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                                                    {branch.manager_name ? branch.manager_name.charAt(0) : '?'}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">
                                                    {branch.manager_name || 'İsimsiz Yönetici'}
                                                </div>
                                                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    {branch.branch_name || branch.name}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    {branch.phone || 'Telefon Kaydı Yok'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setNewBranchManager({
                                                        place_id: branch.place_id,
                                                        branch_name: branch.branch_name || branch.name,
                                                        manager_name: branch.manager_name || '',
                                                        phone: branch.phone || '',
                                                        photo: branch.photo || ''
                                                    });
                                                    setEditingBranchId(branch.place_id);
                                                    setIsBranchManagerFormOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
                                            >
                                                {branch.isSaved ? 'Düzenle' : 'Rehbere Ekle'}
                                            </button>
                                            {branch.isSaved && (
                                                <button 
                                                    onClick={() => handleDeleteBranchManager(branch.place_id)}
                                                    className="px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20"
                                                >
                                                    Sil
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
