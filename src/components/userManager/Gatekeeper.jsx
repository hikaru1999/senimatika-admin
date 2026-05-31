import React, { useState } from "react";

export default function Gatekeeper({ onAuthorized }) {
    const [inputPasskey, setInputPasskey] = useState("");

    const checkPasskey = () => {
        if (inputPasskey === import.meta.env.VITE_GATEKEEPER_PASSKEY) {
            onAuthorized();
        } else {
            alert("Passkey salah!");
        }
    };

    return (
        <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
            <div style={{ background: "white", padding: 40, borderRadius: 24, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: 400, textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
                <h2 style={{ margin: "0 0 8px", color: "#1e293b" }}>Akses Terbatas</h2>
                <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Halaman ini memerlukan Passkey khusus untuk dapat diakses.</p>
                
                <input
                    type="password"
                    placeholder="Masukkan Passkey"
                    value={inputPasskey}
                    onChange={(e) => setInputPasskey(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') checkPasskey(); }}
                    style={{ width: "93%", padding: "12px", borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, textAlign: "center", fontSize: 16 }}
                />
                
                <button
                    onClick={checkPasskey}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                >
                    Buka Akses
                </button>
            </div>
        </div>
    );
}