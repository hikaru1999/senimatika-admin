import React, { useState } from "react";
import { GROUND_TYPES, OBJECT_TYPES, GROUND_VARIANTS, OBJECT_VARIANTS } from "./Constants";

export default function EditorSidebar({
  setView,
  levelName, setLevelName,
  levelDescription, setLevelDescription,
  levelPassword, setLevelPassword,
  levelType, setLevelType,
  isActive, setIsActive,
  visibilityMode, setVisibilityMode,
  selectedGround, setSelectedGround,
  selectedGroundVariant, setSelectedGroundVariant,
  selectedObject, setSelectedObject,
  selectedObjectVariant, setSelectedObjectVariant,
  selectedQuizId, setSelectedQuizId,
  quizzes, uniqueQuests, artifactContents,
  activeTool, setActiveTool,
  brushMode, setBrushMode,
  setIsSaveModalOpen,
  setIsClearModalOpen
}) {
  const toggleTool = (tool) => {
    setActiveTool(prev => prev === tool ? "NONE" : tool);
  };

  const [collapsed, setCollapsed] = useState({
    metadata: false,
    ground: false,
    object: false,
  });

  const toggleGroup = (group) => {
    setCollapsed((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div style={{ width: 280, background: "#f8f9fa", padding: 16, borderRight: "1px solid #ddd", overflowY: "auto", fontSize: "14px" }}>
      <style>
        {`
          .back-gallery-btn {
            transition: all 0.2s ease;
          }
          .back-gallery-btn:hover {
            background-color: #001798 !important;
            border-color: #bfdbfe !important;
            transform: translateX(-4px);
          }
        `}
      </style>
      <button 
        onClick={() => setView("gallery")}
        className="back-gallery-btn"
        style={{ 
          width: "100%",
          padding: "12px",
          marginBottom: 24, 
          background: "#021ec0", 
          border: "1px solid #dbeafe", 
          color: "#ffffff", 
          fontWeight: 700, 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 10,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      >
        <i className="fa fa-arrow-left"></i> Kembali ke Galeri
      </button>

      <h2 style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>🛠️ Editor</h2>

      {/* Group 1: Map Metadata */}
      <div onClick={() => toggleGroup('metadata')} style={groupHeaderStyle}>
        <span>Map Metadata</span>
        <span>{collapsed.metadata ? '▶' : '▼'}</span>
      </div>
      {!collapsed.metadata && (
        <div style={{ marginBottom: 20, padding: '0 4px' }}>
          <label style={labelStyle}>Nama Level</label>
          <input value={levelName} onChange={e => setLevelName(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Deskripsi</label>
          <textarea value={levelDescription} onChange={e => setLevelDescription(e.target.value)} style={{...inputStyle, resize: 'vertical'}} rows={2} />

          <label style={labelStyle}>Password (Opsional)</label>
          <input value={levelPassword} onChange={e => setLevelPassword(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Tipe Level</label>
          <select value={levelType} onChange={e => setLevelType(e.target.value)} style={inputStyle}>
            <option value="NORMAL">Normal</option>
            <option value="TUTORIAL">Tutorial</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!isActive} onChange={e => setIsActive(e.target.checked)} />
            Level Aktif
          </label>

          <label style={labelStyle}>Visibility</label>
          {["NORMAL", "FOG", "NIGHT", "FOG_NIGHT"].map(mode => (
            <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', cursor: 'pointer', marginTop: 4 }}>
              <input type="radio" checked={visibilityMode === mode} onChange={() => setVisibilityMode(mode)} />
              {mode.replace('_', ' ')}
            </label>
          ))}
        </div>
      )}

      {/* Group: Ground Texture */}
      <div onClick={() => toggleGroup('ground')} style={groupHeaderStyle}>
        <span>Ground Texture</span>
        <span>{collapsed.ground ? '▶' : '▼'}</span>
      </div>
      {!collapsed.ground && (
        <div style={{ marginBottom: 20, padding: '0 4px' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#64748b' }}>Tipe Ground</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.values(GROUND_TYPES).map(type => (
              <button
                key={type}
                onClick={() => {
                  setSelectedGround(type);
                  setSelectedGroundVariant(GROUND_VARIANTS[type][0]);
                  setBrushMode("GROUND");
                  setActiveTool("BRUSH");
                }}
                style={{
                  padding: '4px 8px',
                  border: selectedGround === type ? "2px solid #2563eb" : "1px solid #ccc",
                  background: "white", cursor: "pointer", borderRadius: 4
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <h4 style={{ margin: '15px 0 10px', fontSize: '12px', color: '#64748b' }}>Varian</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {GROUND_VARIANTS[selectedGround]?.map(variant => (
              <div
                key={variant}
                onClick={() => {
                  setSelectedGroundVariant(variant);
                  setBrushMode("GROUND");
                  setActiveTool("BRUSH");
                }}
                style={{
                  aspectRatio: '1', border: selectedGroundVariant === variant ? "2px solid #2563eb" : "1px solid #ddd",
                  cursor: 'pointer', padding: 2, background: 'white', overflow: 'hidden'
                }}
              >
                <img src={`/assets/${variant}.png`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group 3: Object Texture */}
      <div onClick={() => toggleGroup('object')} style={groupHeaderStyle}>
        <span>Object Texture</span>
        <span>{collapsed.object ? '▶' : '▼'}</span>
      </div>
      {!collapsed.object && (
        <div style={{ marginBottom: 20, padding: '0 4px' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#64748b' }}>Tipe Objek</h4>
          <select 
            value={selectedObject} 
            onChange={e => {
              const type = e.target.value;
              setSelectedObject(type);
              setSelectedQuizId("");
              setBrushMode("OBJECT");
              setActiveTool("BRUSH");
              setSelectedObjectVariant(OBJECT_VARIANTS[type]?.[0] || "");
            }}
            style={inputStyle}
          >
            {Object.values(OBJECT_TYPES).map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          {selectedObject === "BOSS" && (
            <div style={quizBoxStyle('#fffbeb', '#fcd34b')}>
              <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Battle Quiz</label>
              <select value={selectedQuizId} onChange={e => setSelectedQuizId(e.target.value)} style={inputStyle}>
                <option value="">-- Pilih Soal --</option>
                {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
              </select>
            </div>
          )}

          {(selectedObject === "STATION" || selectedObject === "ARTIFACT") && (
            <div style={quizBoxStyle(selectedObject === "STATION" ? '#f0fdf4' : '#e0f2fe', selectedObject === "STATION" ? '#bbf7d0' : '#7dd3fc')}>
              <label style={{ fontWeight: 'bold', fontSize: '11px' }}>{selectedObject === "STATION" ? "Unlock Gate" : "Artifact Info"}</label>
              <select value={selectedQuizId} onChange={e => setSelectedQuizId(e.target.value)} style={inputStyle}>
                <option value="">-- Pilih {selectedObject === "STATION" ? "Quest" : "Konten"} --</option>
                {(selectedObject === "STATION" ? uniqueQuests : artifactContents).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
            </div>
          )}

          {selectedObject !== "NONE" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginTop: 10 }}>
              {OBJECT_VARIANTS[selectedObject]?.map(variant => (
                <div
                  key={variant}
                  onClick={() => {
                    setSelectedObjectVariant(variant);
                    setBrushMode("OBJECT");
                    setActiveTool("BRUSH");
                  }}
                  style={{
                    aspectRatio: '1', border: selectedObjectVariant === variant ? "2px solid #2563eb" : "1px solid #ddd",
                    cursor: 'pointer', padding: 2, background: 'white', overflow: 'hidden'
                  }}
                >
                  <img src={`/assets/${variant}.png`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '10px 0' }} />

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => toggleTool("PLAYER")} style={toolButtonStyle(activeTool === "PLAYER", "#3b82f6")}>
          {activeTool === "PLAYER" ? "📍 Placing Player..." : "📍 Set Player Position"}
        </button>
        <button onClick={() => toggleTool("ERASER")} style={toolButtonStyle(activeTool === "ERASER", "#ef4444")}>
          {activeTool === "ERASER" ? "🧼 Eraser Active" : "🧼 Eraser Mode"}
        </button>
      </div>

      <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => setIsSaveModalOpen(true)} style={actionButtonStyle("#2563eb")}>💾 Save Map</button>
        <button onClick={() => setIsClearModalOpen(true)} style={actionButtonStyle("#dc2626")}>🗑️ Clear Map</button>
      </div>
    </div>
  );
}

const groupHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', cursor: 'pointer', background: '#e2e8f0', borderRadius: '8px', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#1e293b' };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginTop: "12px" };
const inputStyle = { width: "100%", padding: "8px", marginTop: "4px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" };
const quizBoxStyle = (bg, border) => ({ padding: '10px', background: bg, border: `1px solid ${border}`, borderRadius: '8px', marginTop: '10px' });
const toolButtonStyle = (active, color) => ({
  width: "100%", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold",
  background: active ? color : "#eee", color: active ? "white" : "#334155"
});
const actionButtonStyle = (color) => ({
  width: "100%", padding: "12px", background: color, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
});