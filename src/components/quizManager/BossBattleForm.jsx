import React from "react";
import QuizQuestionSelector from "./QuizQuestionSelector";

export default function BossBattleForm({
    formData, setters, handlers, isLoading, questions, uniqueMateri, uniqueJenjangs, renderWithImages, quizBankFilter, filteredQuestionsForQuizBank
}) {
    const { quizTitle, quizMateri, bossDuration, quizQuestions, editingQuizId } = formData;
    const { setQuizTitle, setQuizMateri, setBossDuration, setQuizQuestions } = setters;
    const { handleSaveQuiz, resetQuizForm } = handlers;
    const { quizBankFilterSearch, setQuizBankFilterSearch, quizBankFilterJenjang, setQuizBankFilterJenjang, quizBankFilterMateri, setQuizBankFilterMateri } = quizBankFilter;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Form Pengaturan Kuis */}
            <div style={{ background: "white", borderRadius: 18, padding: 22, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" }}>
                <h2 style={{ marginTop: 0, color: "#7c3aed" }}>🛡️ Konfigurasi Boss Battle Quiz</h2>

                <label style={labelStyle}>Judul Kuis</label>
                <input
                    placeholder="Contoh: Boss Battle Aljabar"
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Materi/Topik</label>
                <input
                    placeholder="Contoh: Aljabar Linear"
                    value={quizMateri}
                    onChange={e => setQuizMateri(e.target.value)}
                    style={inputStyle}
                />

                {/* <label style={labelStyle}>Durasi Per Soal (Detik)</label>
                <input
                    type="number"
                    placeholder="Durasi per soal dalam detik"
                    value={bossDuration}
                    onChange={e => setBossDuration(e.target.value)}
                    style={inputStyle}
                /> */}

                <div style={{ marginBottom: 16, padding: 14, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                    <div style={{ fontSize: 13 }}><span style={{ color: "#64748b" }}>Jumlah Soal:</span> <br /><strong>{quizQuestions.length}</strong></div>
                    <div style={{ fontSize: 12, borderTop: "1px solid #e2e8f0", paddingTop: 8, color: "#475569" }}>
                        ⏱️ <strong>Estimasi:</strong> {Math.floor(quizQuestions.reduce((sum, q) => sum + Number(bossDuration || 0), 0) / 60)}m {quizQuestions.reduce((sum, q) => sum + Number(bossDuration || 0), 0) % 60}s
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleSaveQuiz}
                        disabled={isLoading}
                        style={saveButtonStyle}
                    >
                        {isLoading ? "Menyimpan..." : editingQuizId ? "Update Kuis" : "Simpan Kuis"}
                    </button>
                    {editingQuizId && (
                        <button
                            onClick={resetQuizForm}
                            style={cancelButtonStyle}
                        >
                            Batal
                        </button>
                    )}
                </div>
            </div>

            <QuizQuestionSelector
                questions={questions}
                uniqueMateri={uniqueMateri}
                uniqueJenjangs={uniqueJenjangs}
                renderWithImages={renderWithImages}
                quizBankFilter={quizBankFilter}
                filteredQuestionsForQuizBank={filteredQuestionsForQuizBank}
                quizQuestions={quizQuestions}
                setQuizQuestions={setQuizQuestions}
                defaultPoints={0} 
                defaultTimer={bossDuration}
                typeColor="#7c3aed"
                allowSetAllPoints={false} 
                allowSetAllTimer={true}  
            />
        </div>
    );
}

const labelStyle = { display: "block", marginBottom: 8, color: "#334155", fontWeight: 600 };
const inputStyle = { width: "95%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16 };
const saveButtonStyle = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#7c3aed", color: "white", fontWeight: 700, cursor: "pointer" };
const cancelButtonStyle = { padding: "14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 600, cursor: "pointer" };