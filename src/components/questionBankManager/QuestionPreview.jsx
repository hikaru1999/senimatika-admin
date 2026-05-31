import React from "react";
import MathPreview from "../MathPreview";

export default function QuestionPreview({ question, questionType, options }) {
  const getAlignment = (text) => {
    if (!text) return "left";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("[center]")) return "center";
    if (lowerText.includes("[right]")) return "right";
    if (lowerText.includes("[justify]")) return "justify";
    return "left";
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      const alignment = getAlignment(line);
      const mathRegex = /(\$\$.*?\$\$|\$.*?\$)/gs;
      const parts = line.split(mathRegex);

      return (
        <div key={lineIdx} style={{ textAlign: alignment, width: '100%', minHeight: line.trim() === "" ? "1em" : "auto" }}>
          {parts.map((part, index) => {
            if (part.match(mathRegex)) {
              const isBlock = part.startsWith('$$');
              return (
                <span 
                  key={index} 
                  style={{ 
                    display: isBlock ? 'block' : 'inline-block', 
                    textAlign: isBlock ? 'center' : 'inherit',
                    verticalAlign: 'baseline',
                    margin: isBlock ? '4px 0' : '0 2px'
                  }}
                >
                  <MathPreview text={part} />
                </span>
              );
            } else {
              const formatted = part
                .replace(/\*\*_(.*?)_\*\*/g, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                .replace(/\[\/?(center|right|justify)\]/gi, '')
                .replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');
              return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
            }
          })}
        </div>
      );
    });
  };

  const renderWithImages = (text) => {
    if (!text) return null;
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const parts = text.split(imgRegex);

    return (
      <div style={{ display: "block", width: "100%" }}>
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            return part ? <div key={index}>{renderFormattedText(part)}</div> : null;
          } else {
            return (
              <img 
                key={index} 
                src={part} 
                alt="Preview" 
                style={{ maxWidth: "100%", height: "auto", borderRadius: 12, margin: "12px auto", border: "2px solid #5D4037", display: "block", background: "#f1f5f9" }} 
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x300/E5DCC3/3E2723?text=⚠️+Link+Gambar+Invalid`; }}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div style={{ background: "#F0E7D8", borderRadius: "24px", border: "3px solid #5D4037", padding: "24px 20px", width: "100%", height: "640px", boxSizing: "border-box", display: "flex", flexDirection: "column", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ height: "40px", background: "rgba(93, 64, 55, 0.1)", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", color: "#5D4037" }}>[ BATTLE HEADER SIMULATION ]</div>
      <div style={{ background: "#E5DCC3", borderRadius: "16px", padding: "16px", marginBottom: "16px", flexShrink: 0, minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#3E2723" }}>
        <div style={{ fontSize: "14px", textAlign: "left", lineHeight: "1.5" }}>{renderWithImages(question || "Tulis pertanyaan untuk melihat preview...")}</div>
      </div>
      {questionType === "check_boxes" && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", paddingLeft: "4px" }}><div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "rgba(62, 39, 35, 0.6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>i</div><span style={{ fontSize: "11px", fontWeight: "bold", color: "rgba(62, 39, 35, 0.7)" }}>Pilih semua jawaban yang benar</span></div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {options.map((opt, idx) => (
          <div key={idx} style={{ background: "#FDF8E1", border: "2px solid rgba(62, 39, 35, 0.2)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", color: "#3E2723" }}>
            {questionType === "check_boxes" && <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: "1.5px solid rgba(62, 39, 35, 0.5)", flexShrink: 0 }} />}
            <div style={{ fontSize: "13px" }}>{renderWithImages(opt || `Opsi ${idx + 1}`)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}><div style={{ width: "36px", height: "36px", background: "#5D4037", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#F0E7D8" }}>🎒</div><div style={{ flex: 1, height: "36px", background: "#3E2723", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "14px" }}>ATTACK!</div></div>
    </div>
  );
}