import React, { useState, useMemo } from "react";
import { POWER_UP_OPTIONS, DEFAULT_POWER_UP_QUANTITY } from "./Constants";

export default function UserDetailModal({ 
    isOpen, onClose, userDetail, isEditMode, setIsEditMode, 
    editableUserDetail, setEditableUserDetail, linkedData, 
    isFetchingLinkedData, onSave, isLoading 
}) {
    const [selectedPowerUpToAdd, setSelectedPowerUpToAdd] = useState("");
    const [activeTab, setActiveTab] = useState("info");

    const powerUpSummary = useMemo(() => {
        const source = isEditMode ? editableUserDetail?.powerUps : userDetail?.powerUps;
        if (!source || source.length === 0) return [];
        
        const counts = {};
        source.forEach(pu => {
            const key = pu.uiName || pu.name;
            counts[key] = (counts[key] || 0) + 1;
        });
        
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [isEditMode, editableUserDetail?.powerUps, userDetail?.powerUps]);

    if (!isOpen || !userDetail) return null;

    const handleEditFieldChange = (field, value) => {
        setEditableUserDetail(prev => ({ ...prev, [field]: value }));
    };

    const handleAddPowerUp = () => {
        if (!selectedPowerUpToAdd) return;
        setEditableUserDetail(prev => {
            const currentPowerUps = prev.powerUps ? [...prev.powerUps] : [];
            currentPowerUps.push({
                name: selectedPowerUpToAdd,
                uiName: POWER_UP_OPTIONS.find(opt => opt.name === selectedPowerUpToAdd)?.uiName || selectedPowerUpToAdd,
                quantity: DEFAULT_POWER_UP_QUANTITY
            });
            return { ...prev, powerUps: currentPowerUps };
        });
        setSelectedPowerUpToAdd("");
    };

    const handleRemovePowerUp = (index) => {
        setEditableUserDetail(prev => ({
            ...prev,
            powerUps: prev.powerUps.filter((_, i) => i !== index)
        }));
    };

    const InfoItem = ({ icon, label, value, color = "#1e293b", isBoolean = false }) => (
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <p style={{ margin: "0 0 6px", color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em' }}>{icon} {label}</p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: isBoolean ? (value ? "#16a34a" : "#dc2626") : color }}>
                {isBoolean ? (value ? "AKTIF" : "NON-AKTIF") : (value || "N/A")}
            </p>
        </div>
    );

    const EditableItem = ({ label, field, type = "number" }) => (
        <div>
            <label style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12, display: "block" }}>{label}:</label>
            <input
                type={type}
                value={editableUserDetail[field] ?? 0}
                onChange={(e) => handleEditFieldChange(field, e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: '14px', boxSizing: 'border-box' }}
            />
        </div>
    );

    return (
        <div style={overlayStyle}>
            <style>
                {`
                    .tab-btn { padding: 12px 20px; border: none; background: transparent; color: #64748b; font-weight: 700; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; font-size: 14px; }
                    .tab-btn-active { color: #2563eb; border-bottom-color: #2563eb; background: #eff6ff; }
                    .modal-content-area::-webkit-scrollbar { width: 6px; }
                    .modal-content-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                `}
            </style>
            <div style={modalStyle}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: "#1e293b" }}>
                            {userDetail.username || "Anonymous User"}
                        </h2>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>UID: {userDetail.uid}</p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        {!isEditMode ? (
                            <button onClick={() => setIsEditMode(true)} style={editBtnStyle}>✏️ Edit Metadata</button>
                        ) : (
                            <button onClick={() => setIsEditMode(false)} style={cancelBtnStyle}>Batal Edit</button>
                        )}
                        <button onClick={onClose} style={closeBtnStyle}>✕</button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: 24 }}>
                    <button onClick={() => setActiveTab("info")} className={`tab-btn ${activeTab === "info" ? "tab-btn-active" : ""}`}>👤 Profil Utama</button>
                    <button onClick={() => setActiveTab("stats")} className={`tab-btn ${activeTab === "stats" ? "tab-btn-active" : ""}`}>🪙 Item & Ekonomi</button>
                    <button onClick={() => setActiveTab("activity")} className={`tab-btn ${activeTab === "activity" ? "tab-btn-active" : ""}`}>📜 Aktivitas Belajar</button>
                </div>

                <div className="modal-content-area" style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '8px' }}>
                    {/* Tab 1: Basic Info */}
                    {activeTab === "info" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <InfoItem label="Email" value={userDetail.email} />
                            <InfoItem label="Nama Lengkap" value={userDetail.fullname} />
                            <InfoItem label="Role" value={userDetail.role} color="#2563eb" />
                            <InfoItem label="Kelas" value={userDetail.kelas} />
                            <InfoItem label="Jenjang" value={userDetail.grade} />
                            <InfoItem label="Status Online" value={userDetail.isOnline} isBoolean />
                            <InfoItem label="Dibuat Pada" value={userDetail.createdAt?.toDate ? new Date(userDetail.createdAt.toDate()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"} />
                        </div>
                    )}

                    {/* Tab 2: Stats & Items */}
                    {activeTab === "stats" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {isEditMode ? (
                                    <>
                                        <EditableItem label="Koin" field="coins" />
                                        <EditableItem label="Total Boss Dikalahkan" field="totalBossDefeated" />
                                        <EditableItem label="Total Peti Dibuka" field="totalChestsOpened" />
                                        <EditableItem label="Legendary Pity" field="legendaryPityCounter" />
                                    </>
                                ) : (
                                    <>
                                        <InfoItem label="Koin Senimatika" value={userDetail.coins ?? 0} color="#b45309" />
                                        <InfoItem label="Boss Dikalahkan" value={userDetail.totalBossDefeated ?? 0} />
                                        <InfoItem label="Peti Dibuka" value={userDetail.totalChestsOpened ?? 0} />
                                        <InfoItem label="Legendary Pity" value={userDetail.legendaryPityCounter ?? 0} />
                                    </>
                                )}
                            </div>

                            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 13, fontWeight: 800 }}>🎒 MANAJEMEN POWER-UPS</p>
                                
                                {powerUpSummary.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #cbd5e1' }}>
                                        {powerUpSummary.map(([name, count], i) => (
                                            <span key={i} style={{ fontSize: '10px', fontWeight: 800, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', border: '1px solid #dbeafe' }}>
                                                {name}: {count}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {isEditMode ? (
                                    <>
                                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                            <select
                                                value={selectedPowerUpToAdd}
                                                onChange={(e) => setSelectedPowerUpToAdd(e.target.value)}
                                                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #cbd5e1", outline: 'none' }}
                                            >
                                                <option value="">-- Pilih Power-Up --</option>
                                                {POWER_UP_OPTIONS.map(pu => <option key={pu.name} value={pu.name}>{pu.uiName}</option>)}
                                            </select>
                                            <button onClick={handleAddPowerUp} disabled={!selectedPowerUpToAdd} style={addPuBtnStyle}>Tambah</button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            {editableUserDetail.powerUps?.map((pu, idx) => (
                                                <div key={idx} style={{ padding: '10px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{pu.uiName || pu.name}</span>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <button onClick={() => handleRemovePowerUp(idx)} style={rmPuBtnStyle}>✕</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {userDetail.powerUps && userDetail.powerUps.length > 0 ? userDetail.powerUps.map((pu, idx) => (
                                            <div key={idx} style={{ padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                                                {pu.uiName || pu.name}
                                            </div>
                                        )) : <p style={{ fontSize: 13, color: '#94a3b8' }}>Tidak ada item di inventory.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Activity */}
                    {activeTab === "activity" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {isFetchingLinkedData ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(37, 99, 235, 0.2)', borderTopColor: '#2563eb', width: '32px', height: '32px' }}></div>
                                    <p style={{ color: "#64748b", fontSize: 14 }}>Sinkronisasi data aktivitas...</p>
                                </div>
                            ) : (
                                <>
                                    <LinkedDataList label="Kuis yang Diselesaikan" items={linkedData.quizzes} icon="✅" />
                                    <LinkedDataList label="Eksplorasi Peta Selesai" items={linkedData.maps} isMap icon="🗺️" />
                                    <LinkedDataList label="Scroll Materi Dimiliki" items={linkedData.contents} icon="📜" />
                                    
                                    <div style={{ padding: '16px', borderRadius: '12px', background: '#fff7ed', border: '1px solid #ffedd5' }}>
                                        <p style={{ margin: "0 0 4px", color: "#9a3412", fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Sesi Tutorial</p>
                                        {isEditMode ? (
                                            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={editableUserDetail.tutorial_completed ?? false}
                                                    onChange={(e) => handleEditFieldChange("tutorial_completed", e.target.checked)}
                                                />
                                                <span style={{ fontSize: 14, fontWeight: 700 }}>Tandai Tutorial Selesai</span>
                                            </label>
                                        ) : (
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: userDetail.tutorial_completed ? "#166534" : "#991b1b" }}>
                                                {userDetail.tutorial_completed ? "Sudah Melewati Tutorial" : "Belum Tutorial"}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                {isEditMode && (
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={onSave} disabled={isLoading} style={saveBtnStyle(isLoading)}>
                            {isLoading ? "🔄 Memproses Perubahan..." : "💾 Simpan Semua Perubahan"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const LinkedDataList = ({ label, items, icon, isMap = false }) => (
    <div style={{ padding: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{icon} {label}</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {items.length > 0 ? items.map(i => (
                <li key={i.id} style={{ fontSize: 13, color: "#1e293b", padding: '4px 0', borderBottom: '1px solid #f8fafc', fontWeight: 600 }}>
                    {isMap ? i.name : `${i.title} (${i.materi})`}
                </li>
            )) : <li style={{ fontSize: 13, color: "#94a3b8" }}>Belum ada data tercatat.</li>}
        </ul>
    </div>
);

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, backdropFilter: 'blur(4px)' };
const modalStyle = { background: 'white', width: '100%', maxWidth: 700, borderRadius: 24, padding: 32, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: "'Inter', sans-serif" };
const editBtnStyle = { padding: "8px 16px", borderRadius: 10, border: "none", background: "#eff6ff", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontSize: '13px' };
const closeBtnStyle = { width: 32, height: 32, borderRadius: 8, border: "1px solid #cbd5e1", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer", display: 'grid', placeItems: 'center' };
const addPuBtnStyle = { padding: "10px 16px", borderRadius: 10, border: "none", background: "#10b981", color: "white", fontWeight: 700, cursor: "pointer" };
const rmPuBtnStyle = { width: 24, height: 24, borderRadius: 6, border: "none", background: "#fee2e2", color: "#ef4444", fontSize: 10, cursor: "pointer", fontWeight: 'bold' };
const saveBtnStyle = (loading) => ({ width: '100%', padding: "14px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 800, cursor: "pointer", opacity: loading ? 0.7 : 1 });
const cancelBtnStyle = { padding: "8px 16px", borderRadius: 10, border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: '13px' };
const listStyle = { margin: 0, padding: 0, listStyle: 'none' };
const puItemStyle = { fontSize: 13, color: "#334155", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 };