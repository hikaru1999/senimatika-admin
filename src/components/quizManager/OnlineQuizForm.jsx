import React from "react";
import OnlineQuizConfigSection from "./OnlineQuizConfigSection";
import QuizQuestionSelector from "./QuizQuestionSelector";

export default function OnlineQuizForm({
    formData, setters, handlers, isLoading, questions, uniqueMateri, uniqueJenjangs, renderWithImages, quizBankFilter, filteredQuestionsForQuizBank
}) {
    const { quizTitle, quizMateri, quizDescription, quizReward, isQuizActive, quizQuestions, editingQuizId } = formData;
    const { setQuizTitle, setQuizMateri, setQuizDescription, setQuizReward, setIsQuizActive, setQuizQuestions } = setters;
    const { handleSaveQuiz, resetQuizForm } = handlers;
    const { quizBankFilterSearch, setQuizBankFilterSearch, quizBankFilterJenjang, setQuizBankFilterJenjang, quizBankFilterMateri, setQuizBankFilterMateri } = quizBankFilter;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <OnlineQuizConfigSection
                formData={{ quizTitle, quizMateri, quizDescription, quizReward, isQuizActive, quizQuestions, editingQuizId }}
                setters={{ setQuizTitle, setQuizMateri, setQuizDescription, setQuizReward, setIsQuizActive }}
                handlers={{ handleSaveQuiz, resetQuizForm }}
                isLoading={isLoading}
            />
            <QuizQuestionSelector
                questions={questions}
                uniqueMateri={uniqueMateri}
                uniqueJenjangs={uniqueJenjangs}
                renderWithImages={renderWithImages}
                quizBankFilter={quizBankFilter}
                filteredQuestionsForQuizBank={filteredQuestionsForQuizBank}
                quizQuestions={quizQuestions}
                setQuizQuestions={setQuizQuestions}
                defaultPoints={10}
                defaultTimer={30}
                typeColor="#2563eb"
                allowSetAllPoints={true}
                allowSetAllTimer={true} 
            />
        </div>
    );
}