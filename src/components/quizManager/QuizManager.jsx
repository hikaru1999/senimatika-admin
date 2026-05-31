import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import OnlineQuizForm from "./OnlineQuizForm";
import BossBattleForm from "./BossBattleForm";
import StationQuizForm from "./StationQuizForm";
import QuizList from "./QuizList";
import QuizInfoModal from "./QuizInfoModal";
import Snackbar from "../Snackbar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

export default function QuizManager({ questions, quizzes, uniqueQuests, loadQuizzes, loadUniqueQuests, uniqueMateri, uniqueJenjangs, renderWithImages }) {
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [quizType, setQuizType] = useState("online");
    const [quizTitle, setQuizTitle] = useState("");
    const [quizMateri, setQuizMateri] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [quizReward, setQuizReward] = useState(0);
    const [bossDuration, setBossDuration] = useState(30);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [uqTitle, setUqTitle] = useState("");
    const [uqMateri, setUqMateri] = useState("");
    const [uqQuestions, setUqQuestions] = useState([]);
    const [editingUqId, setEditingUqId] = useState(null);
    const [quizBankFilterSearch, setQuizBankFilterSearch] = useState("");
    const [quizBankFilterJenjang, setQuizBankFilterJenjang] = useState("");
    const [quizBankFilterMateri, setQuizBankFilterMateri] = useState("");
    const [uqBankFilterSearch, setUqBankFilterSearch] = useState("");
    const [uqBankFilterJenjang, setUqBankFilterJenjang] = useState("");
    const [uqBankFilterMateri, setUqBankFilterMateri] = useState("");

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            await Promise.all([loadQuizzes(), loadUniqueQuests()]);
            setSnackbar({ open: true, message: "Data kuis diperbarui.", type: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Gagal memuat data kuis.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const resetQuizForm = () => {
        setEditingQuizId(null);
        setQuizTitle("");
        setQuizMateri("");
        setQuizDescription("");
        setQuizReward(0);
        setBossDuration(30);
        setIsQuizActive(false);
        setQuizQuestions([]);
        // setQuizType("online");
    };

    const resetUniqueQuestForm = () => {
        setEditingUqId(null);
        setUqTitle("");
        setUqMateri("");
        setUqQuestions([]);
        setQuizType("unique");
    };

    const handleSaveUniqueQuest = async () => {
        if (!uqTitle.trim() || uqQuestions.length !== 1) {
            return alert("Lengkapi Judul Quest dan pilih tepat 1 soal.");
        }

        setIsLoading(true);

        try {
            const questData = {
                title: uqTitle.trim(),
                materi: uqMateri.trim(),
                questions: uqQuestions,
                updatedAt: new Date()
            };

            if (editingUqId) {
                await updateDoc(doc(db, "unique_quizzes", editingUqId), questData);
                setSnackbar({ open: true, message: "Station Quiz berhasil diperbarui!", type: "success" });
            } else {
                await addDoc(collection(db, "unique_quizzes"), {
                    ...questData,
                    createdAt: new Date()
                });
                setSnackbar({ open: true, message: "Station Quiz berhasil ditambahkan!", type: "success" });
            }

            resetUniqueQuestForm();
            await loadUniqueQuests();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Gagal menyimpan Station Quiz.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuiz = async () => {
        const isBoss = quizType === "boss";
        const isDescriptionRequired = !isBoss;

        if (!quizTitle.trim() || (isDescriptionRequired && !quizDescription.trim()) || quizQuestions.length === 0) {
            return alert(isBoss ? "Lengkapi Judul Kuis dan pilih minimal satu soal." : "Lengkapi data kuis (Judul & Deskripsi) dan pilih minimal satu soal.");
        }

        setIsLoading(true);

        const collectionName = quizType === "boss" ? "boss_quizzes" : "online_quizzes";
        try {
            const quizData = {
                materi: quizMateri.trim(),
                description: quizDescription.trim(),
                title: quizTitle.trim(),
                rewardCoin: quizType === "boss" ? 0 : Number(quizReward),
                questions: quizType === "boss"
                    ? quizQuestions.map(q => ({ ...q, timer: Number(bossDuration), points: 0 }))
                    : quizQuestions,
                quizType: quizType,
                active: quizType === "online" ? isQuizActive : true,
                updatedAt: new Date()
            };

            if (editingQuizId) {
                await updateDoc(doc(db, collectionName, editingQuizId), quizData);
                setSnackbar({ open: true, message: "Kuis berhasil diperbarui!", type: "success" });
            } else {
                await addDoc(collection(db, collectionName), {
                    ...quizData,
                    createdAt: new Date()
                });
                setSnackbar({ open: true, message: "Kuis berhasil disimpan!", type: "success" });
            }

            resetQuizForm();
            await loadQuizzes();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Gagal menyimpan kuis.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditQuiz = (quiz) => {
        setEditingQuizId(quiz.id);
        setQuizMateri(quiz.materi || "");
        setQuizDescription(quiz.description || quiz.materi || "");
        setQuizTitle(quiz.title || "");
        setQuizReward(quiz.rewardCoin || 0);
        const type = quiz.quizType || (quiz.originCollection === "boss_quizzes" ? "boss" : "online");
        setIsQuizActive(quiz.active ?? false);
        setQuizType(type);

        if (type === "boss" && quiz.questions?.length > 0) {
            setBossDuration(quiz.questions[0].timer || 30);
        }

        const loadedQuestions = quiz.questions || (quiz.questionIds || []).map(id => ({
            id,
            points: quiz.basePoints || 10,
            timer: quiz.timerPerQuestion || 30
        }));

        setQuizQuestions(loadedQuestions);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleQuizActive = async (quiz) => {
        const collectionName = (quiz.quizType === "boss" || quiz.originCollection === "boss_quizzes") ? "boss_quizzes" : "online_quizzes";
        const newStatus = !quiz.active;

        try {
            await updateDoc(doc(db, collectionName, quiz.id), {
                active: newStatus,
                updatedAt: new Date()
            });
            await loadQuizzes();
            setSnackbar({ open: true, message: `Kuis "${quiz.title}" sekarang ${newStatus ? 'Aktif' : 'Non-Aktif'}`, type: "success" });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Gagal mengubah status kuis.", type: "error" });
        }
    };

    const handleEditUniqueQuest = (quest) => {
        setEditingUqId(quest.id);
        setUqTitle(quest.title || "");
        setUqMateri(quest.materi || "");
        setUqQuestions(quest.questions || []);
        setQuizType("unique");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteQuiz = (id, collectionName) => {
        setItemToDelete({ id, collectionName });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);
        const { id, collectionName } = itemToDelete;
        try {
            await deleteDoc(doc(db, collectionName, id));
            if (editingQuizId === id) resetQuizForm();
            if (editingUqId === id) resetUniqueQuestForm();
            setSnackbar({ open: true, message: "Kuis berhasil dihapus!", type: "success" });
            await loadQuizzes();
            await loadUniqueQuests();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Gagal menghapus kuis.", type: "error" });
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const filteredQuestionsForQuizBank = questions.filter(q => {
        const materiMatch = (q.materi || "").toLowerCase().includes(quizBankFilterMateri.toLowerCase());
        const jenjangMatch = !quizBankFilterJenjang || q.jenjang === quizBankFilterJenjang;
        const searchMatch = (q.question || "").toLowerCase().includes(quizBankFilterSearch.toLowerCase());
        return materiMatch && jenjangMatch && searchMatch;
    });

    const filteredQuestionsForUqBank = questions.filter(q => {
        const materiMatch = (q.materi || "").toLowerCase().includes(uqBankFilterMateri.toLowerCase());
        const jenjangMatch = !uqBankFilterJenjang || q.jenjang === uqBankFilterJenjang;
        const searchMatch = (q.question || "").toLowerCase().includes(uqBankFilterSearch.toLowerCase());
        return materiMatch && jenjangMatch && searchMatch;
    });

    return (
        <div>
            <style>
                {`
                    .info-btn-hover:hover {
                        background-color: #f8fafc !important;
                        color: #2563eb !important;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
                    }
                `}
            </style>
            {/* Mode Switcher & Info Button Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 8, background: "#f1f5f9", padding: 6, borderRadius: 14, width: "fit-content" }}>
                <button
                    onClick={() => { setQuizType("online"); resetQuizForm(); }}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: quizType === "online" ? "white" : "transparent",
                        color: quizType === "online" ? "#2563eb" : "#64748b",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: quizType === "online" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                        transition: "all 0.2s"
                    }}
                >
                    🚀 Online Quiz
                </button>
                <button
                    onClick={() => { setQuizType("boss"); resetQuizForm(); }}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: quizType === "boss" ? "white" : "transparent",
                        color: quizType === "boss" ? "#7c3aed" : "#64748b",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: quizType === "boss" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                        transition: "all 0.2s"
                    }}
                >
                    🛡️ Boss Battle
                </button>
                <button
                    onClick={() => { setQuizType("unique"); resetUniqueQuestForm(); }}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: quizType === "unique" ? "white" : "transparent",
                        color: quizType === "unique" ? "#ec4899" : "#64748b",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: quizType === "unique" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                        transition: "all 0.2s"
                    }}
                >
                    ✨ Station Quiz
                </button>
                </div>

                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="info-btn-hover"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "1px solid #e2e8f0",
                        background: "white",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#64748b",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        transition: "all 0.2s"
                    }}
                    title="Informasi Tipe Kuis"
                >
                    <i className="fa fa-info-circle"></i>
                </button>
            </div>

            {quizType === "online" && (
                <OnlineQuizForm
                    formData={{ quizTitle, quizMateri, quizDescription, quizReward, isQuizActive, quizQuestions, editingQuizId }}
                    setters={{ setQuizTitle, setQuizMateri, setQuizDescription, setQuizReward, setIsQuizActive, setQuizQuestions }}
                    handlers={{ handleSaveQuiz, resetQuizForm }}
                    isLoading={isLoading}
                    questions={questions}
                    uniqueMateri={uniqueMateri}
                    uniqueJenjangs={uniqueJenjangs}
                    renderWithImages={renderWithImages}
                    quizBankFilter={{ quizBankFilterSearch, setQuizBankFilterSearch, quizBankFilterJenjang, setQuizBankFilterJenjang, quizBankFilterMateri, setQuizBankFilterMateri }}
                    filteredQuestionsForQuizBank={filteredQuestionsForQuizBank}
                />
            )}

            {quizType === "boss" && (
                <BossBattleForm
                    formData={{ quizTitle, quizMateri, bossDuration, quizQuestions, editingQuizId }}
                    setters={{ setQuizTitle, setQuizMateri, setBossDuration, setQuizQuestions }}
                    handlers={{ handleSaveQuiz, resetQuizForm }}
                    isLoading={isLoading}
                    questions={questions}
                    uniqueMateri={uniqueMateri}
                    uniqueJenjangs={uniqueJenjangs}
                    renderWithImages={renderWithImages}
                    quizBankFilter={{ quizBankFilterSearch, setQuizBankFilterSearch, quizBankFilterJenjang, setQuizBankFilterJenjang, quizBankFilterMateri, setQuizBankFilterMateri }}
                    filteredQuestionsForQuizBank={filteredQuestionsForQuizBank}
                />
            )}

            {quizType === "unique" && (
                <StationQuizForm
                    formData={{ uqTitle, uqMateri, uqQuestions, editingUqId }}
                    setters={{ setUqTitle, setUqMateri, setUqQuestions }}
                    handlers={{ handleSaveUniqueQuest, resetUniqueQuestForm }}
                    isLoading={isLoading}
                    questions={questions}
                    uniqueMateri={uniqueMateri}
                    uniqueJenjangs={uniqueJenjangs}
                    renderWithImages={renderWithImages}
                    uqBankFilter={{ uqBankFilterSearch, setUqBankFilterSearch, uqBankFilterJenjang, setUqBankFilterJenjang, uqBankFilterMateri, setUqBankFilterMateri }}
                    filteredQuestionsForUqBank={filteredQuestionsForUqBank}
                />
            )}

            {/* Daftar Kuis / Quest */}
            <div style={{ marginTop: 32 }}>
                <h2 style={{ marginBottom: 18 }}>Daftar {quizType === "boss" ? "Boss Battle" : (quizType === "unique" ? "Station Quiz" : "Online Quiz")}</h2>
                <QuizList
                    quizzes={quizzes}
                    uniqueQuests={uniqueQuests}
                    isLoading={isLoading}
                    quizType={quizType}
                    handleEditQuiz={handleEditQuiz}
                    handleDeleteQuiz={handleDeleteQuiz}
                    handleToggleQuizActive={handleToggleQuizActive}
                    handleEditUniqueQuest={handleEditUniqueQuest}
                />
            </div>

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isLoading}
                title="Hapus Kuis?"
                description="Apakah Anda yakin ingin menghapus kuis ini? Semua data terkait kuis ini akan dihapus secara permanen dari server."
            />

            <Snackbar 
                isOpen={snackbar.open} 
                message={snackbar.message} 
                type={snackbar.type}
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
            />

            <QuizInfoModal 
                isOpen={isInfoModalOpen} 
                onClose={() => setIsInfoModalOpen(false)} 
            />
        </div>
    );
}