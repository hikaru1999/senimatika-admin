import React from 'react';

const GlobalStyles = () => (
  <style>
    {`
      @keyframes spin-gallery { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .spinner-blue { border: 4px solid rgba(37, 99, 235, 0.3); border-top: 4px solid #2563eb; border-radius: 50%; width: 48px; height: 48px; animation: spin-gallery 0.8s linear infinite; }
      .button-spinner { border: 2px solid rgba(37, 99, 235, 0.3); border-top: 2px solid #2563eb; border-radius: 50%; width: 16px; height: 16px; animation: spin-gallery 0.8s linear infinite; display: inline-block; }
    `}
  </style>
);

export default function MapGallery({ levels, isLoading, loadingMapId, onAddNew, onLoad, onDelete }) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f1f5f9' }}>
        <GlobalStyles />
        <div className="spinner-blue"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: "#f1f5f9", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <GlobalStyles />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1>🗺️ Senimatika Map Gallery</h1>
        <button onClick={onAddNew} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
          + Buat Level Baru
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 32 }}>
        {levels.map((lvl) => (
          <div key={lvl.id} style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ width: "100%", aspectRatio: "16/10", background: "#f8fafc", borderRadius: 12, marginBottom: 16, display: "grid", gridTemplateColumns: `repeat(${lvl.width}, 1fr)`, overflow: "hidden" }}>
              {lvl.tiles?.slice(0, 400).map((t, i) => (
                <div key={i} style={{ backgroundColor: t.object !== "NONE" ? "#334155" : (t.ground === "PATH" ? "#fbbf24" : "#22c55e") }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 10, background: lvl.levelType === "TUTORIAL" ? "#f59e0b" : "#64748b", color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 800 }}>
                {lvl.levelType || "NORMAL"}
              </span>
              {lvl.isActive !== false && (
                <span style={{ fontSize: 10, background: "#10b981", color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 800 }}>ACTIVE</span>
              )}
              {lvl.isActive === false && (
                <span style={{ fontSize: 10, background: "#ef4444", color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 800 }}>DISABLED</span>
              )}
            </div>
            <h3 style={{ margin: 0 }}>{lvl.name}</h3>
            <p style={{ fontSize: 12, color: "#64748b" }}>ID: {lvl.id} • {lvl.width} x {lvl.height}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button 
                onClick={() => onLoad(lvl.id)} 
                disabled={loadingMapId == lvl.id}
                style={{ 
                  flex: 2, 
                  padding: 10, 
                  background: "#eff6ff", 
                  color: "#2563eb", 
                  border: "none", 
                  borderRadius: 10, 
                  fontWeight: 700, 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: loadingMapId == lvl.id ? 0.7 : 1, 
                }}
              >
                {loadingMapId == lvl.id ? (
                  <div className="button-spinner"></div>
                ) : (
                  "Edit"
                )}
              </button>
              <button onClick={() => onDelete(lvl.id)} style={{ flex: 1, padding: 10, background: "#fff1f2", color: "#e11d48", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}