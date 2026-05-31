import React from "react";

export default function OnlineQuizConfigSection({
    formData, setters, handlers, isLoading
}) {
    const { quizTitle, quizMateri, quizDescription, quizReward, isQuizActive, quizQuestions, editingQuizId } = formData;
    const { setQuizTitle, setQuizMateri, setQuizDescription, setQuizReward, setIsQuizActive } = setters;
    const { handleSaveQuiz, resetQuizForm } = handlers;

    return (
        <div style={formContainerStyle}>
            {/* Header */}
            <div style={formHeaderStyle}>
                <h2 style={{ marginTop: 0, color: "#2563eb" }}>🚀 Konfigurasi Online Quiz</h2>
            </div>

            {/* Body */}
            <div style={formBodyStyle}>
                <label style={labelStyle}>Judul Kuis</label>
                <input
                    placeholder="Contoh: Kuis Mingguan Logika"
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Materi/Topik</label>
                <input
                    placeholder="Contoh: Logika Matematika"
                    value={quizMateri}
                    onChange={e => setQuizMateri(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Deskripsi</label>
                <input
                    placeholder="Kuis untuk melatih pemahaman materi..."
                    value={quizDescription}
                    onChange={e => setQuizDescription(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Reward Koin (Total)</label>
                <input
                    type="number"
                    placeholder="Jumlah koin reward"
                    value={quizReward}
                    onChange={e => setQuizReward(e.target.value)}
                    style={inputStyle}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                    <input
                        type="checkbox"
                        id="activeStatus"
                        checked={isQuizActive}
                        onChange={(e) => setIsQuizActive(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="activeStatus" style={{ fontWeight: 600, color: "#166534", cursor: "pointer" }}>Set Aktif (Kuis dapat diakses user)</label>
                </div>

                <div style={{ marginBottom: 16, padding: 14, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ fontSize: 13 }}><span style={{ color: "#64748b" }}>Jumlah Soal:</span> <br /><strong>{quizQuestions.length}</strong></div>
                    <div style={{ fontSize: 13 }}><span style={{ color: "#64748b" }}>Total Poin:</span> <br /><strong>{quizQuestions.reduce((sum, q) => sum + Number(q.points || 0), 0)}</strong></div>
                    <div style={{ fontSize: 12, gridColumn: "span 2", borderTop: "1px solid #e2e8f0", paddingTop: 8, color: "#475569" }}>
                        ⏱️ <strong>Estimasi:</strong> {Math.floor(quizQuestions.reduce((sum, q) => sum + Number(q.timer || 0), 0) / 60)}m {quizQuestions.reduce((sum, q) => sum + Number(q.timer || 0), 0) % 60}s
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={formFooterStyle}>
                <button
                    onClick={handleSaveQuiz}
                    disabled={isLoading}
                    style={{ ...saveButtonStyle, margin: 0 }}
                >
                    {isLoading ? "Menyimpan..." : editingQuizId ? "Update Kuis" : "Simpan Kuis"}
                </button>
                {editingQuizId && (
                    <button
                        onClick={resetQuizForm}
                        style={{ ...cancelButtonStyle, margin: 0 }}
                    >
                        Batal
                    </button>
                )}
            </div>
        </div>
    );
}

const formContainerStyle = { 
    background: "white", 
    borderRadius: 18, 
    padding: 22, 
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    height: "720px",
    boxSizing: "border-box"
};

const formHeaderStyle = { flexShrink: 0, paddingBottom: 16 };
const formBodyStyle = { flex: 1, overflowY: "auto", paddingRight: 10 };
const formFooterStyle = { flexShrink: 0, display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #f1f5f9" };

const labelStyle = { display: "block", marginBottom: 8, color: "#334155", fontWeight: 600 };
const inputStyle = { width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, boxSizing: "border-box" };
const saveButtonStyle = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer" };
const cancelButtonStyle = { padding: "14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 600, cursor: "pointer" };