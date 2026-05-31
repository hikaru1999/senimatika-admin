import React from 'react';

export default function MapCanvas({ 
  map, 
  playerPos, 
  bossPos, 
  onTileClick, 
  onHover, 
  isMouseDown, 
  onAddDimension,
  activeTool,
  setActiveTool
}) {
  return (
    <div style={{ flex: 1, padding: "60px", overflow: "auto", background: "#f1f5f9" }}>
      {activeTool === "PLAYER" && (
        <div style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontWeight: 'bold',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '15px' }}>📍 Menempatkan Pemain...</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool("NONE");
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>
      )}

      {activeTool === "ERASER" && (
        <div style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontWeight: 'bold',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '15px' }}>🧼 Mode Penghapus Aktif...</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool("NONE");
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ width: "fit-content", margin: "0 auto", position: "relative" }}>
        <button onClick={() => onAddDimension("top")} style={btnSideStyle('top')}>➕ BARIS ATAS</button>
        <button onClick={() => onAddDimension("bottom")} style={btnSideStyle('bottom')}>➕ BARIS BAWAH</button>
        <button onClick={() => onAddDimension("left")} style={btnSideStyle('left')}>➕ KOLOM KIRI</button>
        <button onClick={() => onAddDimension("right")} style={btnSideStyle('right')}>➕ KOLOM KANAN</button>

        <div style={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${map[0].length}, 40px)`,
            boxShadow: "0 0 0 1px #ddd" 
        }}>
          {map.map((row, y) => row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              onMouseDown={() => { isMouseDown.current = true; onTileClick(x, y); }}
              onMouseEnter={() => { onHover({ x, y }); if (isMouseDown.current) onTileClick(x, y); }}
              onMouseUp={() => { isMouseDown.current = false; }}
              style={{
                width: 40, height: 40, border: "1px solid #ddd", position: "relative", cursor: "pointer", background: "white"
              }}
            >
              {tile.groundVariant && <img src={`/assets/${tile.groundVariant}.png`} style={imgFullStyle} />}
              {tile.objectVariant && <img src={`/assets/${tile.objectVariant}.png`} style={{ ...imgFullStyle, zIndex: 2 }} />}
              {playerPos.x === x && playerPos.y === y && <img src="/assets/ic_player.png" style={playerImgStyle} />}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

const imgFullStyle = { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 };
const playerImgStyle = { width: "60%", height: "90%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, pointerEvents: "none" };

const btnSideStyle = (side) => {
    const base = { position: "absolute", zIndex: 100, fontSize: 10, fontWeight: 800, cursor: "pointer", background: "white", border: "1px solid #cbd5e1", padding: "4px 10px" };
    if (side === 'top') return { ...base, top: -30, left: "50%", transform: "translateX(-50%)" };
    if (side === 'bottom') return { ...base, bottom: -30, left: "50%", transform: "translateX(-50%)" };
    if (side === 'left') return { ...base, left: -60, top: "50%", transform: "translateY(-50%) rotate(-90deg)" };
    if (side === 'right') return { ...base, right: -60, top: "50%", transform: "translateY(-50%) rotate(90deg)" };
};