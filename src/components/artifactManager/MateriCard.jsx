import React from "react";

export default function MateriCard({ item, onEdit, onDelete, renderWithImages }) {
    return (
        <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{item.materi || "General"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onEdit(item)} style={editButtonStyle}>Edit</button>
                    <button onClick={() => onDelete(item.id, item.materiType)} style={deleteButtonStyle}>Hapus</button>
                </div>
            </div>
            <div style={cardContentStyle}>
                {renderWithImages(item.content || "", true, item.materiType)}
            </div>
            <div style={cardFooterStyle}><span>ID: {item.id}</span></div>
        </div>
    );
}

const cardStyle = { background: "white", borderRadius: 20, boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", padding: 20, border: "1px solid #e2e8f0" };
const cardContentStyle = { marginTop: 16, color: "#334155", lineHeight: 1.6, maxHeight: 100, overflow: "hidden", fontSize: "13px", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" };
const cardFooterStyle = { marginTop: 16, display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 11 };
const editButtonStyle = { padding: "6px 10px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 12, fontWeight: 600 };
const deleteButtonStyle = { padding: "6px 10px", borderRadius: 10, border: "1px solid #f87171", background: "#fee2e2", color: "#b91c1c", cursor: "pointer", fontSize: 12, fontWeight: 600 };