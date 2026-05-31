import React from "react";

export default function QuizInfoModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)', padding: 20
        }}>
            <style>
                {`
                    .modal-col {
                        flex: 1;
                        padding: 20px;
                        text-align: center;
                        border-radius: 16px;
                        transition: background 0.2s;
                    }
                    .modal-col:hover {
                        background: #f8fafc;
                    }
                `}
            </style>
            <div style={{
                background: 'white', width: '100%', maxWidth: 900,
                borderRadius: 32, padding: 40, position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: 24, right: 24, border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#94a3b8' }}
                >
                    <i className="fa fa-times"></i>
                </button>

                {/* <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={{ margin: 0, fontSize: 28, color: '#1e293b' }}>Panduan Tipe Kuis</h2>
                    <p style={{ color: '#64748b', marginTop: 8 }}>Pahami perbedaan fungsionalitas setiap kategori kuis di dalam game</p>
                </div> */}

                <div style={{ display: 'flex', gap: 20 }}>
                    {/* Online Quiz Info */}
                    <div className="modal-col">
                        <div style={{ 
                            aspectRatio: '9/16', background: '#eff6ff', borderRadius: 15, marginBottom: 20, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                            border: '1px solid #dbeafe'
                        }}>
                            <img 
                                src="/assets/preview_quiz.png" 
                                alt="Online Quiz" 
                                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/eff6ff/2563eb?text=Online+Quiz"; }}
                            />
                        </div>
                        <h3 style={{ color: '#2563eb', marginBottom: 12 }}>Online Quiz</h3>
                        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            Kuis kompetitif yang dapat diakses langsung melalui menu "Quiz" pada Senimatika. 
                            Admin dapat menentukan <strong>soal</strong>, <strong>koin</strong>, <strong>durasi</strong> dan mengatur status 
                            aktif/non-aktif kuis secara berkala.
                        </p>
                    </div>

                    {/* Boss Battle Info */}
                    <div className="modal-col">
                        <div style={{ 
                            aspectRatio: '9/16', background: '#f5f3ff', borderRadius: 15, marginBottom: 20, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                            border: '1px solid #ede9fe'
                        }}>
                            <img 
                                src="/assets/preview_boss_battle.png" 
                                alt="Boss Battle" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/f5f3ff/7c3aed?text=Boss+Battle"; }}
                            />
                        </div>
                        <h3 style={{ color: '#7c3aed', marginBottom: 12 }}>Boss Battle</h3>
                        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            Kuis tantangan pada fitur eksplorasi dengan <strong>durasi per soal</strong> yang ketat. 
                            Digunakan saat pemain berhadapan dengan Boss di peta.
                        </p>
                    </div>

                    {/* Station Quiz Info */}
                    <div className="modal-col">
                        <div style={{ 
                            aspectRatio: '9/16', background: '#fdf2f8', borderRadius: 15, marginBottom: 20, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                            border: '1px solid #fce7f3'
                        }}>
                            <img 
                                src="/assets/preview_station_quiz.png" 
                                alt="Station Quiz" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/fdf2f8/ec4899?text=Station+Quiz"; }}
                            />
                        </div>
                        <h3 style={{ color: '#ec4899', marginBottom: 12 }}>Station Quiz</h3>
                        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            Kuis spesifik yang muncul pada koordinat <strong>Station</strong> tertentu di peta. 
                            Hanya diperbolehkan berisi <strong>1 soal pilihan</strong> untuk memvalidasi 
                            eksplorasi pemain di lokasi tersebut.
                        </p>
                    </div>
                </div>

                {/* <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <button 
                        onClick={onClose}
                        style={{ 
                            padding: '12px 32px', borderRadius: 12, border: 'none', 
                            background: '#0f172a', color: 'white', fontWeight: 700, 
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
                    >
                        Siap Mengelola Kuis
                    </button>
                </div> */}
            </div>
        </div>
    );
}