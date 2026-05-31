import React, { useState, useEffect } from "react";
import { DocumentExportService } from "../services/DocumentExportService";
import QuestionDocPreview from "./QuestionDocPreview";

export default function CreateDocModal({ isOpen, onClose, selectedQuestions, onExportSuccess }) {
    const [orderedQuestions, setOrderedQuestions] = useState([]);
    const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
    const [exportFormat, setExportFormat] = useState("pdf");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showWebview, setShowWebview] = useState(false);

    useEffect(() => {
        if (isOpen) setOrderedQuestions([...selectedQuestions]);
    }, [isOpen, selectedQuestions]);

    if (!isOpen) return null;

    const moveQuestion = (index, direction) => {
        const newOrder = [...orderedQuestions];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;
        
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        setOrderedQuestions(newOrder);
    };

    const handleExport = async () => {
        if (exportFormat === "pdf") {
            setShowWebview(true);
            return;
        }

        setIsGenerating(true);
        try {
            await DocumentExportService.exportToWord(orderedQuestions, includeAnswerKey);
            onExportSuccess();
            onClose();
        } catch (error) {
            alert("Gagal membuat dokumen: " + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    if (showWebview) {
        return <QuestionDocPreview 
            questions={orderedQuestions} 
            includeAnswerKey={includeAnswerKey} 
            onClose={() => setShowWebview(false)} 
        />;
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ margin: 0 }}>Konfigurasi Ekspor Dokumen</h2>
                    <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20 }}>✕</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, maxHeight: "60vh" }}>
                    <div style={{ overflowY: "auto", paddingRight: 10 }}>
                        <label style={sectionLabelStyle}>Urutan Soal (Drag & Drop Simulation)</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {orderedQuestions.map((q, idx) => (
                                <div key={q.id} style={draggableItemStyle}>
                                    <div style={{ flex: 1, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        <strong>{idx + 1}.</strong> {q.question.replace(/[#*`]/g, '')}
                                    </div>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <button onClick={() => moveQuestion(idx, -1)} disabled={idx === 0} style={arrowBtnStyle}>▲</button>
                                        <button onClick={() => moveQuestion(idx, 1)} disabled={idx === orderedQuestions.length - 1} style={arrowBtnStyle}>▼</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
                        <label style={sectionLabelStyle}>Opsi Dokumen</label>
                        
                        <div style={optionRowStyle}>
                            <input type="checkbox" id="key" checked={includeAnswerKey} onChange={e => setIncludeAnswerKey(e.target.checked)} />
                            <label htmlFor="key" style={{ cursor: "pointer" }}>Sediakan Kunci Jawaban</label>
                        </div>

                        <label style={{ ...sectionLabelStyle, marginTop: 20 }}>Format File</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <label style={radioStyle}>
                                <input type="radio" checked={exportFormat === "pdf"} onChange={() => setExportFormat("pdf")} />
                                <span>Adobe PDF (.pdf)</span>
                            </label>
                            <label style={radioStyle}>
                                <input type="radio" checked={exportFormat === "word"} onChange={() => setExportFormat("word")} />
                                <span>Microsoft Word (.docx)</span>
                            </label>
                        </div>

                        <div style={{ marginTop: 40 }}>
                            <button 
                                onClick={handleExport} 
                                disabled={isGenerating} 
                                style={exportBtnStyle(isGenerating)}
                            >
                                {isGenerating ? "⏳ Sedang Memproses..." : (exportFormat === "pdf" ? "👁️ Lihat Preview PDF" : `Generate ${exportFormat.toUpperCase()}`)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
const modalStyle = { background: 'white', width: '90%', maxWidth: 800, borderRadius: 24, padding: 32, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' };
const sectionLabelStyle = { display: "block", fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 12 };
const draggableItemStyle = { display: "flex", alignItems: "center", padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 };
const arrowBtnStyle = { border: "1px solid #cbd5e1", background: "white", borderRadius: 6, cursor: "pointer", padding: "2px 6px", fontSize: 10 };
const optionRowStyle = { display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 };
const radioStyle = { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14 };
const exportBtnStyle = (loading) => ({ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 });