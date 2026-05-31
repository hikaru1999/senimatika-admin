import React, { useState, useEffect } from 'react';

export default function SetAllModal({ isOpen, onClose, onConfirm, type, typeColor }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) setInputValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isPoints = type === "points";
  const title = isPoints ? "Set Semua Poin" : "Set Semua Durasi";
  const label = isPoints ? "Jumlah Poin" : "Durasi (Detik)";
  const icon = isPoints ? "🪙" : "⏱️";

  const handleConfirm = () => {
    if (inputValue !== "" && !isNaN(inputValue)) {
      onConfirm(Number(inputValue));
      onClose();
    } else {
      alert("Masukkan angka yang valid.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ fontSize: '40px', marginBottom: '16px', textAlign: 'center' }}>{icon}</div>
        <h3 style={{ margin: '0 0 8px', textAlign: 'center', color: '#1e293b' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24, textAlign: 'center' }}>
          Terapkan nilai ini ke seluruh soal yang telah Anda pilih dalam daftar kuis ini.
        </p>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8 }}>{label}</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="0"
            style={inputStyle}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button 
            onClick={handleConfirm} 
            style={{ ...confirmButtonStyle, background: typeColor }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { 
  position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', 
  zIndex: 2500, display: 'flex', alignItems: 'center', 
  justifyContent: 'center', backdropFilter: 'blur(4px)' 
};
const modalStyle = { 
  background: 'white', padding: 32, borderRadius: 24, width: 320, 
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' 
};
const inputStyle = { 
  width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', 
  fontSize: 16, boxSizing: 'border-box', outline: 'none' 
};
const cancelButtonStyle = { 
  flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', 
  background: 'white', fontWeight: 600, cursor: 'pointer', color: '#475569' 
};
const confirmButtonStyle = { 
  flex: 2, padding: '12px', borderRadius: 12, border: 'none', 
  color: 'white', fontWeight: 700, cursor: 'pointer' 
};