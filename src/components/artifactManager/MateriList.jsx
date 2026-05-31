import React from "react";
import MateriCard from "./MateriCard";

export default function MateriList({ items, isLoading, onEdit, onDelete, renderWithImages }) {
    if (isLoading) return <div>Memuat data...</div>;
    if (items.length === 0) return <div style={emptyBoxStyle}>Belum ada data.</div>;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {items.map(item => (
                <MateriCard 
                    key={item.id} 
                    item={item} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    renderWithImages={renderWithImages} 
                />
            ))}
        </div>
    );
}

const emptyBoxStyle = { color: "#64748b", padding: 20, background: "white", borderRadius: 12 };