import React from "react";
import QuizCard from "./QuizCard";

export default function QuizList({ quizzes, uniqueQuests, isLoading, quizType, handleEditQuiz, handleDeleteQuiz, handleToggleQuizActive, handleEditUniqueQuest }) {
    const filteredQuizzes = quizzes.filter(quiz => {
        const type = quiz.quizType || (quiz.originCollection === "boss_quizzes" ? "boss" : "online");
        return type === quizType;
    });

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px', background: 'white', borderRadius: 18, border: '1px solid #e2e8f0' }}>
            <style>
                {`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .spinner-blue { border: 3px solid rgba(37, 99, 235, 0.3); border-top: 3px solid #2563eb; border-radius: 50%; width: 28px; height: 28px; animation: spin 0.8s linear infinite; }
                `}
            </style>
            <div className="spinner-blue"></div>
        </div>
    );

    if (quizType === "unique") {
        if (uniqueQuests.length === 0) return <div style={emptyListStyle}>Belum ada Station Quiz yang terdaftar.</div>;
        return (
            <div style={quizListGridStyle}>
                {uniqueQuests.map(quest => (
                    <QuizCard
                        key={quest.id}
                        quiz={quest}
                        quizType="unique"
                        handleEditQuiz={handleEditUniqueQuest}
                        handleDeleteQuiz={async () => {
                            if (window.confirm("Hapus quest ini?")) {
                                await handleDeleteQuiz(quest.id, "unique_quizzes");
                            }
                        }}
                    />
                ))}
            </div>
        );
    }

    if (filteredQuizzes.length === 0) return <div style={emptyListStyle}>Belum ada {quizType === "boss" ? "Boss Battle" : "Online Quiz"} yang terdaftar.</div>;

    return (
        <div style={quizListGridStyle}>
            {filteredQuizzes.map(quiz => (
                <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    quizType={quiz.quizType || (quiz.originCollection === "boss_quizzes" ? "boss" : "online")}
                    handleEditQuiz={handleEditQuiz}
                    handleDeleteQuiz={handleDeleteQuiz}
                    handleToggleQuizActive={handleToggleQuizActive}
                />
            ))}
        </div>
    );
}

const emptyListStyle = { padding: 20, background: "white", borderRadius: 18, border: "1px solid #e2e8f0", color: "#64748b", textAlign: "center" };
const quizListGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 };