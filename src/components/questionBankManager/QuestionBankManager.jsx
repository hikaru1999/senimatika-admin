import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import QuestionManager from "./QuestionManager";
import QuestionCard from "./QuestionCard";
import Snackbar from "../Snackbar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CreateDocModal from "./CreateDocModal";

export default function QuestionBankManager({ questions, isLoading, onRefresh, renderWithImages }) {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
    const [filterBranch, setFilterBranch] = useState("");
    const [filterMateri, setFilterMateri] = useState("");
    const [filterJenjang, setFilterJenjang] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [viewMode, setViewMode] = useState("expanded");
    const [selectedForExport, setSelectedForExport] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [questionIdToDelete, setQuestionIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    useEffect(() => { setCurrentPage(1); }, [filterBranch, filterMateri, filterJenjang, filterSearch]);

    const handleDeleteQuestion = (id) => {
        setQuestionIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!questionIdToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "questions", questionIdToDelete));
            setSnackbar({ open: true, message: "Soal berhasil dihapus dari arsip!", type: "success" });
            onRefresh();
        } catch (e) { 
            setSnackbar({ open: true, message: "Gagal menghapus soal.", type: "error" });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setQuestionIdToDelete(null);
        }
    };

    const handleToggleSelect = (id) => {
        setSelectedForExport(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id) 
                : [...prev, id]
        );
    };

    const filteredQuestions = questions.filter((item) => {
        const branchMatch = (item.branch || "").toLowerCase().includes(filterBranch.toLowerCase());
        const materiMatch = (item.materi || "").toLowerCase().includes(filterMateri.toLowerCase());
        const jenjangMatch = !filterJenjang || item.jenjang === filterJenjang;
        const searchMatch = (item.question || "").toLowerCase().includes(filterSearch.toLowerCase());
        return branchMatch && materiMatch && jenjangMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const currentQuestions = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const uniqueJenjangs = [...new Set(questions.map((q) => q.jenjang).filter(Boolean))];
    const uniqueBranches = [...new Set(questions.map((q) => q.branch).filter(Boolean))];
    const uniqueMateriList = [...new Set(questions.map((q) => q.materi).filter(Boolean))];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>Daftar Soal Tersimpan</h2>
                <div style={{ display: "flex", gap: 12 }}>
                    {selectedForExport.length > 0 && (
                        <button onClick={() => setIsExportModalOpen(true)} style={exportButtonStyle}>
                            📄 Buat Dokumen ({selectedForExport.length})
                        </button>
                    )}
                    <button onClick={() => { setQuestionToEdit(null); setIsQuestionModalOpen(true); }} style={addButtonStyle}>
                        ➕ Tambah Soal Baru
                    </button>
                    <button onClick={onRefresh} style={refreshButtonStyle}>🔄 Refresh</button>
                </div>
            </div>

            <div style={filterBoxStyle}>
                <input type="text" placeholder="🔍 Cari teks soal..." value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} style={filterInputStyle(2)} />
                <select value={filterJenjang} onChange={(e) => setFilterJenjang(e.target.value)} style={selectStyle}>
                    <option value="">Semua Jenjang</option>
                    {uniqueJenjangs.sort().map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <input type="text" placeholder="Cabang..." value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} list="branch-list" style={filterInputStyle(1)} />
                <datalist id="branch-list">{uniqueBranches.map((b, i) => <option key={i} value={b} />)}</datalist>
                
                <div style={{ marginLeft: "auto", display: "flex", background: "#f1f5f9", padding: "4px", borderRadius: "10px" }}>
                    <button onClick={() => setViewMode("compact")} style={viewToggleStyle(viewMode === "compact")}>Compact</button>
                    <button onClick={() => setViewMode("expanded")} style={viewToggleStyle(viewMode === "expanded")}>Full</button>
                </div>
            </div>

            <div style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
                Menampilkan <strong>{filteredQuestions.length}</strong> dari {questions.length} soal
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', background: 'white', borderRadius: 18, border: '1px solid #e2e8f0' }}>
                    <style>
                        {`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            .spinner-blue { border: 3px solid rgba(37, 99, 235, 0.3); border-top: 3px solid #2563eb; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; }
                        `}
                    </style>
                    <div className="spinner-blue"></div>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: viewMode === "compact" ? "repeat(auto-fill, minmax(340px, 1fr))" : "repeat(2, 1fr)", gap: 16 }}>
                    {currentQuestions.map((item) => (
                        <QuestionCard 
                            key={item.id} 
                            item={item} 
                            viewMode={viewMode} 
                            onEdit={(q) => { setQuestionToEdit(q); setIsQuestionModalOpen(true); }} 
                            onDelete={handleDeleteQuestion}
                            isSelected={selectedForExport.includes(item.id)}
                            onToggleSelect={handleToggleSelect} 
                            renderWithImages={renderWithImages} 
                        />
                    ))}
                </div>
            )}

            <CreateDocModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                selectedQuestions={questions.filter(q => selectedForExport.includes(q.id))}
                onExportSuccess={() => {
                    setSelectedForExport([]);
                    setSnackbar({ open: true, message: "Dokumen berhasil dibuat!", type: "success" });
                }}
            />

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title="Hapus Soal?"
                description="Apakah Anda yakin ingin menghapus soal ini? Soal yang sudah dihapus tidak dapat dipulihkan kembali."
            />

            <Snackbar 
                isOpen={snackbar.open} 
                message={snackbar.message} 
                type={snackbar.type}
                onClose={() => setSnackbar({ ...snackbar, open: false })} 
            />

            {totalPages > 1 && (
                <div style={paginationWrapperStyle}>
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={pageButtonStyle}>← Sebelumnya</button>
                    <span style={{ fontWeight: 700 }}>Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={pageButtonStyle}>Berikutnya →</button>
                </div>
            )}
            
            {isQuestionModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <QuestionManager 
                            editData={questionToEdit} 
                            branches={uniqueBranches}
                            materiList={uniqueMateriList}
                            onSaveSuccess={(shouldClose) => { 
                                if (shouldClose) setIsQuestionModalOpen(false); 
                                onRefresh(); 
                            }}
                            onCancel={() => setIsQuestionModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Styles
const exportButtonStyle = { padding: "10px 18px", borderRadius: 10, border: "2px solid #2563eb", background: "#eff6ff", color: "#2563eb", fontWeight: 700, cursor: "pointer" };
const addButtonStyle = { padding: "10px 18px", borderRadius: 10, border: "none", background: "#10b981", color: "white", fontWeight: 700, cursor: "pointer" };
const refreshButtonStyle = { padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", cursor: "pointer" };
const filterBoxStyle = { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center", background: "white", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0" };
const filterInputStyle = (flex) => ({ flex, minWidth: "150px", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1" });
const selectStyle = { padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white", cursor: "pointer" };
const viewToggleStyle = (active) => ({ padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "white" : "transparent", color: active ? "#2563eb" : "#64748b", fontWeight: 600, fontSize: "12px", boxShadow: active ? "0 2px 4px rgba(0,0,0,0.05)" : "none" });
const paginationWrapperStyle = { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 32, padding: "20px 0", borderTop: "1px solid #e2e8f0" };
const pageButtonStyle = { padding: "8px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 600 };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, backdropFilter: 'blur(4px)' };
const modalContentStyle = { background: 'white', width: '95%', maxWidth: 1100, maxHeight: '90vh', overflowY: 'auto', borderRadius: 24, padding: 32, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' };