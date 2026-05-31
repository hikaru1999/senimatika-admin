import React from "react";

export default function UserTable({ users, onViewDetails }) {
    return (
        <div style={{ background: "white", borderRadius: 24, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
            <style>
                {`
                    .user-row { transition: background 0.2s; }
                    .user-row:hover { background: #f8fafc; }
                    .role-badge { padding: 4px 10px; borderRadius: 8px; fontSize: 11px; fontWeight: 700; text-transform: uppercase; }
                    .role-admin { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
                    .role-player { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
                `}
            </style>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <tr>
                        <th style={{ padding: "18px 20px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>User Info</th>
                        <th style={{ padding: "18px 20px", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Role</th>
                        <th style={{ padding: "16px", fontSize: 13, color: "#64748b" }}>Koin Dikumpulkan</th>
                        <th style={{ padding: "16px", fontSize: 13, color: "#64748b" }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>Tidak ada pengguna ditemukan.</td>
                        </tr> 
                    ) : (
                        users.map(user => (
                            <tr key={user.uid} className="user-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "18px 20px" }}>
                                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>{user.username || user.displayName || "Anonymous User"}</div>
                                    <div style={{ fontSize: 12, color: "#64748b" }}>{user.email || "N/A"}</div>
                                    <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>UID: {user.uid}</div>
                                </td>
                                <td style={{ padding: "18px 20px" }}>
                                    <span className={`role-badge ${user.role?.toLowerCase() === 'admin' ? 'role-admin' : 'role-player'}`}>
                                        {user.role || "Player"}
                                    </span>
                                </td>
                                <td style={{ padding: "18px 20px", fontSize: "15px", fontWeight: 800, color: "#b45309" }}>
                                    🪙 {user.coins ?? user.coin ?? 0}
                                </td>
                                <td style={{ padding: "16px" }}>
                                    <button
                                        onClick={() => onViewDetails(user)}
                                        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 12 }}
                                    >
                                        Lihat Data
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}