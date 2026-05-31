import React from "react";
import QuizQuestionSelector from "./QuizQuestionSelector";

export default function StationQuizForm({
    formData, setters, handlers, isLoading, questions, uniqueMateri, uniqueJenjangs, renderWithImages, uqBankFilter, filteredQuestionsForUqBank
}) {
    const { uqTitle, uqMateri, uqQuestions, editingUqId } = formData;
    const { setUqTitle, setUqMateri, setUqQuestions } = setters;
    const { handleSaveUniqueQuest, resetUniqueQuestForm } = handlers;
    const { uqBankFilterSearch, setUqBankFilterSearch, uqBankFilterJenjang, setUqBankFilterJenjang, uqBankFilterMateri, setUqBankFilterMateri } = uqBankFilter;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Form Pengaturan Unique Quest */}
            <div style={{ background: "white", borderRadius: 18, padding: 22, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" }}>
                <h2 style={{ marginTop: 0, color: "#ec4899" }}>{editingUqId ? "✨ Edit Station Quiz" : "✨ Konfigurasi Station Quiz"}</h2>

                <label style={labelStyle}>Judul Kuis</label>
                <input
                    placeholder="Contoh: Tantangan Station 1"
                    value={uqTitle}
                    onChange={e => setUqTitle(e.target.value)}
                    style={inputStyle}
                />

                <label style={labelStyle}>Materi/Topik</label>
                <input
                    placeholder="Contoh: Transformasi Geometri"
                    value={uqMateri}
                    onChange={e => setUqMateri(e.target.value)}
                    list="materi-suggestions-uq"
                    autoComplete="off"
                    style={inputStyle}
                />
                <datalist id="materi-suggestions-uq">
                    {uniqueMateri.map((item, idx) => (
                        <option key={idx} value={item} />
                    ))}
                </datalist>

                <div style={{ marginBottom: 16, padding: 12, background: "#fdf2f8", borderRadius: 12, border: "1px solid #fbcfe8" }}>
                    <strong>Soal Terpilih: {uqQuestions.length} / 1</strong>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleSaveUniqueQuest}
                        disabled={isLoading || uqQuestions.length !== 1}
                        style={saveButtonStyle}
                    >
                        {isLoading ? "Menyimpan..." : editingUqId ? "Simpan Perubahan" : "Simpan Kuis"}
                    </button>
                    {editingUqId && (
                        <button
                            onClick={resetUniqueQuestForm}
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
                quizBankFilter={uqBankFilter}
                filteredQuestionsForQuizBank={filteredQuestionsForUqBank}
                quizQuestions={uqQuestions}
                setQuizQuestions={setUqQuestions}
                defaultPoints={0}
                defaultTimer={0}
                typeColor="#ec4899"
                singleSelection={true}
                allowSetAllPoints={false}
                allowSetAllTimer={false}
            />
        </div>
    );
}

const labelStyle = { display: "block", marginBottom: 8, color: "#334155", fontWeight: 600 };
const inputStyle = { width: "95%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16 };
const saveButtonStyle = { flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#ec4899", color: "white", fontWeight: 700, cursor: "pointer" };
const cancelButtonStyle = { padding: "14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 600, cursor: "pointer" };