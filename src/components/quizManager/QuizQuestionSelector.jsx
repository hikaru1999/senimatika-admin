import React, { useState } from "react";
import SetAllModal from "./SetAllModal";

export default function QuizQuestionSelector({
    questions, uniqueMateri, uniqueJenjangs, renderWithImages,
    quizBankFilter, filteredQuestionsForQuizBank,
    quizQuestions, setQuizQuestions,
    defaultPoints = 10, defaultTimer = 30,
    allowSetAllPoints = false, allowSetAllTimer = false, singleSelection = false,
    typeColor = "#2563eb"
}) {
    const { quizBankFilterSearch, setQuizBankFilterSearch, quizBankFilterJenjang, setQuizBankFilterJenjang, quizBankFilterMateri, setQuizBankFilterMateri } = quizBankFilter;

    const [isSetAllModalOpen, setIsSetAllModalOpen] = useState(false);
    const [setAllType, setSetAllType] = useState("points");

    const handleOpenSetAllModal = (type) => {
        setSetAllType(type);
        setIsSetAllModalOpen(true);
    };

    const handleConfirmSetAll = (value) => {
        setQuizQuestions(quizQuestions.map(sq => ({
            ...sq,
            [setAllType === "points" ? "points" : "timer"]: value
        })));
    };

    return (
        <div style={questionBankSelectorOuterStyle}>
            {/* Header */}
            <div style={filterHeaderStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>Pilih Soal dari Arsip</h3>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{questions.length} total soal</span>
                </div>

                <div style={stickyFilterStyle}>
                    <input
                        type="text"
                        placeholder="🔍 Cari teks soal..."
                        value={quizBankFilterSearch}
                        onChange={(e) => setQuizBankFilterSearch(e.target.value)}
                        style={filterInputStyle}
                    />
                    <div style={{ display: "flex", gap: 8, width: "95%" }}>
                        <select
                            value={quizBankFilterJenjang}
                            onChange={(e) => setQuizBankFilterJenjang(e.target.value)}
                            style={filterSelectStyle}
                        >
                            <option value="">Semua Jenjang</option>
                            {uniqueJenjangs.sort().map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Materi..."
                            value={quizBankFilterMateri}
                            onChange={(e) => setQuizBankFilterMateri(e.target.value)}
                            list="quiz-bank-materi-suggestions"
                            style={filterInputStyle}
                        />
                        <datalist id="quiz-bank-materi-suggestions">
                            {uniqueMateri.map((m, idx) => <option key={idx} value={m} />)}
                        </datalist>
                    </div>

                    {((quizQuestions.length > 0 && (allowSetAllPoints || allowSetAllTimer)) || 
                      (quizBankFilterSearch || quizBankFilterJenjang || quizBankFilterMateri)) && (
                        <div style={setAllSettingsStyle(typeColor)}>
                            {(allowSetAllPoints || allowSetAllTimer) && (
                                <>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: typeColor }}>SET SEMUA:</span>
                                    {allowSetAllPoints && (
                                        <button
                                            onClick={() => handleOpenSetAllModal("points")}
                                            style={setAllButtonStyle(typeColor)}
                                        >Poin</button>
                                    )}
                                    {allowSetAllTimer && (
                                        <button
                                            onClick={() => handleOpenSetAllModal("timer")}
                                            style={setAllButtonStyle(typeColor)}
                                        >Durasi</button>
                                    )}
                                </>
                            )}
                            {/* Reset filter button */}
                            {(quizBankFilterSearch || quizBankFilterJenjang || quizBankFilterMateri) && (
                                <button
                                    onClick={() => { setQuizBankFilterSearch(""); setQuizBankFilterJenjang(""); setQuizBankFilterMateri(""); }}
                                    style={resetFilterButtonStyle}
                                >✕ Reset Filter</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div style={questionListBodyStyle}>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Pilih soal untuk dimasukkan ke kuis:</p>
                <div style={{ display: "grid", gap: 12 }}>
                    {filteredQuestionsForQuizBank
                        .map(q => {
                            const selectedEntry = quizQuestions.find(sq => sq.id === q.id);
                            const isSelected = !!selectedEntry;

                        const isDisabled = singleSelection && !isSelected && quizQuestions.length >= 1;
                            return (
                                <div key={q.id} style={questionCardSelectionStyle(isSelected, typeColor)}>
                                    <div style={{ display: "flex", alignItems: "start", gap: 12 }}>
                                        <input
                                            type="checkbox"
                                            style={{ marginTop: 4, width: 18, height: 18, cursor: "pointer" }}
                                        checked={isSelected}
                                        disabled={isDisabled}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setQuizQuestions([...quizQuestions, { id: q.id, points: defaultPoints, timer: defaultTimer }]);
                                                } else {
                                                    setQuizQuestions(quizQuestions.filter(sq => sq.id !== q.id));
                                                }
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: typeColor, fontSize: 11, textTransform: "uppercase" }}>{q.branch} • {q.materi}</div>
                                            {renderWithImages(q.question)}
                                        </div>
                                    </div>

                                    {isSelected && (allowSetAllPoints || allowSetAllTimer) && (
                                        (!singleSelection || isSelected) && (
                                            <div style={questionSettingsStyle(typeColor)}>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>SETTING:</div>
                                                {allowSetAllPoints && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{ fontSize: 12 }}>Poin:</span>
                                                        <input
                                                            type="number"
                                                            value={selectedEntry.points}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                setQuizQuestions(quizQuestions.map(sq => sq.id === q.id ? { ...sq, points: val } : sq));
                                                            }}
                                                            style={settingInputStyle}
                                                        />
                                                    </div>
                                                )}
                                                {allowSetAllTimer && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{ fontSize: 12 }}>Detik:</span>
                                                        <input
                                                            type="number"
                                                            value={selectedEntry.timer}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                setQuizQuestions(quizQuestions.map(sq => sq.id === q.id ? { ...sq, timer: val } : sq));
                                                            }}
                                                            style={settingInputStyle}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            <SetAllModal 
                isOpen={isSetAllModalOpen}
                onClose={() => setIsSetAllModalOpen(false)}
                onConfirm={handleConfirmSetAll}
                type={setAllType}
                typeColor={typeColor}
            />
        </div>
    );
}

const questionBankSelectorOuterStyle = { 
    background: "#f8fafc", 
    borderRadius: 18, 
    padding: 22, 
    border: "1px solid #e2e8f0", 
    display: "flex", 
    flexDirection: "column", 
    height: "720px",
    boxSizing: "border-box"
};

const filterHeaderStyle = { background: "#f8fafc", paddingBottom: 16, flexShrink: 0 };
const stickyFilterStyle = { display: "flex", flexDirection: "column", gap: 10 };
const filterInputStyle = { width: "95%", padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 14, background: "white" };
const filterSelectStyle = { flex: 1, padding: "8px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 12, background: "white" };
const setAllSettingsStyle = (color) => ({ display: "flex", gap: 8, alignItems: "center", background: `${color}1A`, padding: 8, borderRadius: 10, border: `1px solid ${color}40` });
const setAllButtonStyle = (color) => ({ padding: "4px 10px", borderRadius: 6, border: `1px solid ${color}`, background: "white", color: color, fontSize: 11, cursor: "pointer", fontWeight: 600 });
const resetFilterButtonStyle = { marginLeft: "auto", border: "none", background: "transparent", color: "#e11d48", fontSize: 11, cursor: "pointer", fontWeight: 600 };
const questionCardSelectionStyle = (isSelected, color) => ({
    background: isSelected ? `${color}1A` : "white",
    padding: 14,
    borderRadius: 12,
    border: isSelected ? `2px solid ${color}` : "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: 12
});
const questionSettingsStyle = (color) => ({
    display: "flex",
    gap: 12,
    padding: "10px",
    background: "white",
    borderRadius: 8,
    border: `1px solid ${color}40`,
    alignItems: "center"
});
const settingInputStyle = { width: 50, padding: "4px 6px", borderRadius: 6, border: "1px solid #cbd5e1" };
const questionListBodyStyle = { flex: 1, overflowY: "auto", paddingRight: 5 };