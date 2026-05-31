import React from "react";

const questionTypeLabels = {
    multiple_choice: "Single Multiple Choice",
    check_boxes: "Multiple Complex Answer",
    short_answer: "Isian Singkat"
};

export default function QuestionCard({ item, viewMode, onEdit, onDelete, renderWithImages, isSelected, onToggleSelect }) {
    return (
        <div style={questionCardStyle(viewMode)}>
            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                <div style={{ paddingTop: 4 }}>
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => onToggleSelect(item.id)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={metaTextStyle}>{item.jenjang || "-"} • {item.branch || "-"} • {item.materi || "-"}</div>
                    <div style={{ maxHeight: "250px", overflowY: "auto" }}>{renderWithImages(item.question)}</div>
                </div>
            </div>

            {viewMode === "expanded" && (
                <div style={{ marginTop: 14 }}>
                    {item.questionType === "short_answer" ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {item.answerKey?.map((ans, idx) => (
                                <span key={idx} style={badgeStyle}>{ans}</span>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                            {item.options?.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={optionCircleStyle(item.answerKey?.includes(idx))}>{idx + 1}</div>
                                    <div style={{ flex: 1 }}>{renderWithImages(opt)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            <div style={cardFooterStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 12, color: "#002e6e", fontWeight: 700 }}>TIPE: {questionTypeLabels[item.questionType] || item.questionType}</div>
                    <div style={{ fontSize: 12, color: "#000000", fontFamily: "monospace" }}>ID: {item.id}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onEdit(item)} style={editButtonStyle}>Edit</button>
                    <button onClick={() => onDelete(item.id)} style={deleteButtonStyle}>Hapus</button>
                </div>
            </div>
        </div>
    );
}

const questionCardStyle = (mode) => ({ 
    background: "white", 
    borderRadius: 18, 
    padding: mode === "compact" ? 16 : 20, 
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)", 
    border: "1px solid #e2e8f0", 
    display: "flex", 
    flexDirection: "column",
    flex: 1
});

const metaTextStyle = { fontSize: 12, color: "#64748b", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 };
const badgeStyle = { padding: "4px 10px", background: "#f0fdf4", color: "#166534", borderRadius: 8, fontSize: 12, border: "1px solid #bbf7d0", fontWeight: 600 };
const optionCircleStyle = (correct) => ({ width: 26, height: 26, borderRadius: 10, background: correct ? "#2563eb" : "#e2e8f0", display: "grid", placeItems: "center", color: correct ? "white" : "#475569", fontWeight: 700 });
const cardFooterStyle = { marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" };
const editButtonStyle = { padding: "6px 12px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const deleteButtonStyle = { padding: "6px 12px", borderRadius: 8, border: "1px solid #f87171", background: "#fee2e2", color: "#b91c1c", fontSize: 12, fontWeight: 600, cursor: "pointer" };