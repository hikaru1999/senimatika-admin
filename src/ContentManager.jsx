import { useEffect, useState, useRef, useMemo } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import MathPreview from "./components/MathPreview";
import QuestionBankManager from "./components/questionBankManager/QuestionBankManager";
import MateriManager from "./components/artifactManager/MateriManager";
import QuizManager from "./components/quizManager/QuizManager";
import "easymde/dist/easymde.min.css";

function ContentManager() {
    const [contents, setContents] = useState([]);
    const [artifactContents, setArtifactContents] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [uniqueQuests, setUniqueQuests] = useState([]);
    const [activeTab, setActiveTab] = useState("materi");
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [uniqueMateri, setUniqueMateri] = useState([]);
    const [uniqueBranches, setUniqueBranches] = useState([]);
    const materiTextareaRef = useRef(null);

    const handleMateriCountsUpdate = (scrollCount, artifactCount) => {
        setContents(new Array(scrollCount).fill(0));
        setArtifactContents(new Array(artifactCount).fill(0));
    };

    const loadQuestions = async () => {
        setIsLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "questions"));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
                });
            setQuestions(data);
            setUniqueMateri([...new Set(data.map(q => q.materi).filter(Boolean))]);
            setUniqueBranches([...new Set(data.map(q => q.branch).filter(Boolean))]);
        } catch (error) {
            console.error("Error loading questions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadQuizzes = async () => {
        try {
            const onlineSnapshot = await getDocs(collection(db, "online_quizzes"));
            const onlineData = onlineSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                originCollection: "online_quizzes"
            }));

            const bossSnapshot = await getDocs(collection(db, "boss_quizzes"));
            const bossData = bossSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                originCollection: "boss_quizzes"
            }));

            setQuizzes([...onlineData, ...bossData]);
        } catch (error) {
            console.error("Error loading quizzes:", error);
        }
    };

    const loadUniqueQuests = async () => {
        try {
            const snapshot = await getDocs(collection(db, "unique_quizzes"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUniqueQuests(data);
        } catch (error) {
            console.error("Error loading unique quests:", error);
        }
    };

    const uniqueJenjangs = useMemo(() => {
        return ["VII SMP", "VIII SMP", "IX SMP", "X SMA", "XI SMA", "XII SMA"];
    }, []);

    useEffect(() => {
        loadQuestions();
        loadQuizzes();
        loadUniqueQuests();
    }, []);
    const getAlignment = (text, isMateri = false, materiType = "scroll") => {
        if (!text) return (isMateri && materiType === "scroll") ? "center" : "left";
        const lowerText = text.toLowerCase();
        if (lowerText.includes("[center]")) return "center";
        if (lowerText.includes("[right]")) return "right";
        if (lowerText.includes("[justify]")) return "justify";
        
        if (isMateri && materiType === "scroll") {
            return text.includes("$") ? "left" : "center";
        }
        return "left";
    };

    const renderFormattedText = (text, isMateri = false, materiType = "scroll") => {
        if (!text) return null;
        const lines = text.split('\n');

        return lines.map((line, lineIdx) => {
            const alignment = getAlignment(line, isMateri, materiType);
            const mathRegex = /(\$\$.*?\$\$|\$.*?\$)/gs;
            const parts = line.split(mathRegex);

            return (
                <div key={lineIdx} style={{ textAlign: alignment, width: '100%', minHeight: line.trim() === "" ? "1em" : "auto" }}>
                    {parts.map((part, index) => {
                        if (part.match(mathRegex)) {
                            const isBlock = part.startsWith('$$');
                            return (
                                <span 
                                    key={index} 
                                    style={{ display: isBlock ? 'block' : 'inline-block', textAlign: isBlock ? 'center' : 'inherit', verticalAlign: 'baseline', margin: isBlock ? '4px 0' : '0 2px' }}>
                                    <MathPreview text={part} />
                                </span>
                            );
                        } else {
                            const formatted = part
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/_(.*?)_/g, '<em>$1</em>')
                                .replace(/\[\/?(center|right|justify)\]/gi, '')
                                .replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');
                            
                            return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
                        }
                    })}
                </div>
            );
        });
    };

    const renderWithImages = (text, isMateri = false, materiType = "scroll") => {
        if (!text) return null;
        const imgRegex = /!\[.*?\]\((.*?)\)/g;
        const parts = text.split(imgRegex);

        return (
            <div style={{ display: "block", width: "100%" }}>
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return part ? <div key={index}>{renderFormattedText(part, isMateri, materiType)}</div> : null;
                    } else {
                        return (
                            <img 
                                key={index} 
                                src={part} 
                                alt="Image Preview" 
                                style={{ maxWidth: "100%", height: "auto", borderRadius: 12, margin: "12px auto", border: "2px solid #5D4037", display: "block", background: "#f1f5f9" }}
                                onError={(e) => { 
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/600x300/E5DCC3/3E2723?text=⚠️+Link+Gambar+Invalid`;
                                }}
                            />
                        );
                    }
                })}
            </div>
        );
    };

    const onlineQuizCount = quizzes.filter(q => (q.quizType || q.originCollection === "online_quizzes") === "online").length;
    const bossQuizCount = quizzes.filter(q => (q.quizType || q.originCollection === "boss_quizzes") === "boss").length;


    return (
        <div style={{ padding: 24, maxWidth: 1080, margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ margin: 0 }}>Senimatika Content Manager</h1>
                    <p style={{ margin: "8px 0 0", color: "#475569" }}>
                        Kelola materi, soal, dan kuis untuk Senimatika secara terpadu.
                    </p>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <div style={{ padding: "6px 12px", background: "#eff6ff", borderRadius: 10, color: "#1d4ed8", fontSize: "12px", fontWeight: 700, border: "1px solid #dbeafe" }}>
                        📚 {contents.length + artifactContents.length} Materi
                    </div>
                    <div style={{ padding: "6px 12px", background: "#f0fdf4", borderRadius: 10, color: "#166534", fontSize: "12px", fontWeight: 700, border: "1px solid #dcfce7" }}>
                        🗃️ {questions.length} Soal
                    </div>
                    <div style={{ padding: "6px 12px", background: "#fff7ed", borderRadius: 10, color: "#9a3412", fontSize: "12px", fontWeight: 700, border: "1px solid #ffedd5" }}>
                        🚀 {onlineQuizCount} Quiz Online
                    </div>
                    <div style={{ padding: "6px 12px", background: "#f5f3ff", borderRadius: 10, color: "#5b21b6", fontSize: "12px", fontWeight: 700, border: "1px solid #ede9fe" }}>
                        🛡️ {bossQuizCount} Boss Battle
                    </div>
                    <div style={{ padding: "6px 12px", background: "#fdf2f8", borderRadius: 10, color: "#9d174d", fontSize: "12px", fontWeight: 700, border: "1px solid #fce7f3" }}>
                        ✨ {uniqueQuests.length} Station Quiz
                    </div>
                </div>
            </div>

            {/* Menu Pane / Tab Navigation */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, marginBottom: 24, borderBottom: "1px solid #e2e8f0", paddingBottom: 16 }}>
                <button
                    onClick={() => setActiveTab("materi")}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "materi" ? "#2563eb" : "transparent",
                        color: activeTab === "materi" ? "white" : "#64748b",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    Manajemen Materi
                </button>
                <button
                    onClick={() => setActiveTab("bank_soal")}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "bank_soal" ? "#2563eb" : "transparent",
                        color: activeTab === "bank_soal" ? "white" : "#64748b",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    Arsip Soal
                </button>
                <button
                    onClick={() => setActiveTab("quiz_management")}
                    style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        background: activeTab === "quiz_management" ? "#2563eb" : "transparent",
                        color: activeTab === "quiz_management" ? "white" : "#64748b",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    Manajemen In-game Quiz
                </button>
            </div>

            {activeTab === "materi" && (
                <MateriManager 
                    uniqueMateriSuggestions={uniqueMateri}
                    onCountsLoad={handleMateriCountsUpdate}
                    renderWithImages={renderWithImages}
                />
            )}

            {activeTab === "bank_soal" && (
                <QuestionBankManager 
                    questions={questions}
                    isLoading={isLoading}
                    onRefresh={loadQuestions}
                    renderWithImages={renderWithImages}
                />
            )}

            {activeTab === "quiz_management" && (
                <QuizManager
                    questions={questions}
                    quizzes={quizzes}
                    uniqueQuests={uniqueQuests}
                    loadQuizzes={loadQuizzes}
                    loadUniqueQuests={loadUniqueQuests}
                    uniqueMateri={uniqueMateri}
                    uniqueJenjangs={uniqueJenjangs}
                    renderWithImages={renderWithImages}
                />
            )}

        </div>
    );
}

export default ContentManager;