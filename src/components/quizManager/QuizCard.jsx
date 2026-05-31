import React from "react";

export default function QuizCard({ quiz, quizType, handleEditQuiz, handleDeleteQuiz, handleToggleQuizActive }) {
    const isOnline = quizType === "online";
    const isBoss = quizType === "boss";
    const isUnique = quizType === "unique";

    const cardBorderColor = isBoss ? "#ddd6fe" : (isUnique ? "#fbcfe8" : "#e2e8f0");
    const typeBadgeBg = isBoss ? "#7c3aed" : (isUnique ? "#ec4899" : "#2563eb");

    return (
        <div style={{ background: "white", borderRadius: 18, padding: 20, border: `1px solid ${cardBorderColor}`, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                    <span style={{ fontSize: 10, background: typeBadgeBg, color: "white", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase", fontWeight: "bold" }}>{quizType}</span>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>{quiz.title}</h3>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{quiz.materi}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleEditQuiz(quiz)} style={editButtonStyle}>Edit</button>
                    <button onClick={() => handleDeleteQuiz(quiz.id, quiz.originCollection || (isUnique ? "unique_quizzes" : (isBoss ? "boss_quizzes" : "online_quizzes")))} style={deleteButtonStyle}>Hapus</button>
                </div>
            </div>
            <div style={{ display: "flex", gap: 16, borderTop: "1px solid #f1f5f9", paddingTop: 12, fontSize: 13, color: "#475569" }}>
                <span>📋 <strong>{(quiz.questions?.length || quiz.questionIds?.length) || 0}</strong> Soal</span>
                {isOnline && <span>🪙 <strong>{quiz.rewardCoin || 0}</strong> Koin</span>}
                {isBoss && <span>⏱️ <strong>{quiz.questions?.[0]?.timer || 0}s</strong> /soal</span>}
            </div>

            {/* Status Toggle (Khusus Online Quiz) */}
            {isOnline && (
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: quiz.active ? "#f0fdf4" : "#f8fafc", padding: "8px 12px", borderRadius: 10, border: `1px solid ${quiz.active ? "#bbf7d0" : "#e2e8f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: quiz.active ? "#22c55e" : "#94a3b8" }}></div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: quiz.active ? "#166534" : "#64748b" }}>
                            {quiz.active ? "AKTIF" : "NON-AKTIF"}
                        </span>
                    </div>
                    <button
                        onClick={() => handleToggleQuizActive(quiz)}
                        style={{
                            padding: "4px 10px", borderRadius: 6, border: "none",
                            background: quiz.active ? "#fee2e2" : "#dcfce7",
                            color: quiz.active ? "#991b1b" : "#166534",
                            fontSize: 11, fontWeight: 800, cursor: "pointer"
                        }}
                    >
                        {quiz.active ? "⛔ Nonaktifkan" : "✅ Aktifkan"}
                    </button>
                </div>
            )}
        </div>
    );
}

const editButtonStyle = { padding: "6px 12px", borderRadius: 8, border: "1px solid #2563eb", background: "#eff6ff", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 12 };
const deleteButtonStyle = { padding: "6px 12px", borderRadius: 8, border: "1px solid #f87171", background: "#fee2e2", color: "#b91c1c", fontWeight: 600, cursor: "pointer", fontSize: 12 };