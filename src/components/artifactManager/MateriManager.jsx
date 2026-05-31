import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import MathPreview from "../MathPreview";
import SimpleMDE from "react-simplemde-editor";
import Snackbar from "../Snackbar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import "easymde/dist/easymde.min.css";

const MDE_OPTIONS = {
    spellChecker: false,
    autosave: { enabled: false },
    placeholder: "Tulis isi materi di sini...",
    toolbar: [
        "bold", "italic", "|", "unordered-list", "ordered-list", "|",
        "image", "|",
        {
            name: "latex",
            action: (editor) => {
                const cm = editor.codemirror;
                cm.replaceSelection(`$${cm.getSelection()}$`);
            },
            className: "fa fa-code",
            title: "Menyisipkan LaTeX",
        },
        "|",
        {
            name: "align-left",
            action: (editor) => {
                const cm = editor.codemirror;
                cm.replaceSelection(`[left]${cm.getSelection()}[/left]`);
            },
            className: "fa fa-align-left",
            title: "Align Left",
        },
        {
            name: "align-center",
            action: (editor) => {
                const cm = editor.codemirror;
                cm.replaceSelection(`[center]${cm.getSelection()}[/center]`);
            },
            className: "fa fa-align-center",
            title: "Align Center",
        },
        {
            name: "align-right",
            action: (editor) => {
                const cm = editor.codemirror;
                cm.replaceSelection(`[right]${cm.getSelection()}[/right]`);
            },
            className: "fa fa-align-right",
            title: "Align Right",
        },
        {
            name: "align-justify",
            action: (editor) => {
                const cm = editor.codemirror;
                cm.replaceSelection(`[justify]${cm.getSelection()}[/justify]`);
            },
            className: "fa fa-align-justify",
            title: "Align Justify",
        },
        "|",
        "preview", "side-by-side", "fullscreen",
    ],
};

export default function MateriManager({ uniqueMateriSuggestions, onCountsLoad, renderWithImages }) {
    const [contents, setContents] = useState([]);
    const [artifactContents, setArtifactContents] = useState([]);
    const [materiType, setMateriType] = useState("scroll");
    const [materi, setMateri] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("transformasi");
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

    const loadData = async () => {
        setIsLoading(true);
        try {
            const scrollSnapshot = await getDocs(collection(db, "learning_contents"));
            const scrollData = scrollSnapshot.docs.map(doc => ({ id: doc.id, materiType: "scroll", ...doc.data() }));
            setContents(scrollData);

            const artifactSnapshot = await getDocs(collection(db, "artifact_contents"));
            const artifactData = artifactSnapshot.docs.map(doc => ({ id: doc.id, materiType: "artifact", ...doc.data() }));
            setArtifactContents(artifactData);
            
            onCountsLoad && onCountsLoad(scrollData.length, artifactData.length);
        } catch (e) { console.error(e); setSnackbar({ open: true, message: "Gagal memuat data.", type: "error" }); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async () => {
        if (!materi.trim() || !title.trim() || !content.trim()) return alert("Lengkapi semua field.");
        setIsLoading(true);
        const col = materiType === "artifact" ? "artifact_contents" : "learning_contents";
        try {
            const data = { materi: materi.trim(), title: title.trim(), content: content.trim(), updatedAt: new Date() };
            if (materiType === "scroll") data.category = category.trim();

            if (editingId) {
                await updateDoc(doc(db, col, editingId), data);
                setSnackbar({ open: true, message: "Konten berhasil diperbarui!", type: "success" });
            } else {
                await addDoc(collection(db, col), { ...data, createdAt: new Date() });
                setSnackbar({ open: true, message: "Konten berhasil ditambahkan!", type: "success" });
            }
            resetForm();
            await loadData();
        } catch (e) { console.error(e); setSnackbar({ open: true, message: "Gagal menyimpan konten.", type: "error" }); }
        finally { setIsLoading(false); }
    };

    const resetForm = () => {
        setEditingId(null); setMateri(""); setTitle(""); setContent(""); setCategory("transformasi");
    };

    const handleDelete = (id, type) => {
        setItemToDelete({ id, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);
        const { id, type } = itemToDelete;
        
        const col = type === "artifact" ? "artifact_contents" : "learning_contents";
        try {
            await deleteDoc(doc(db, col, id));
            setSnackbar({ open: true, message: "Konten berhasil dihapus!", type: "success" });
            if (editingId === id) resetForm();
            await loadData();
        } catch (e) { 
            console.error(e); 
            setSnackbar({ open: true, message: "Gagal menghapus konten.", type: "error" });
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id); setMateri(item.materi || ""); setMateriType(item.materiType || "scroll");
        setTitle(item.title || ""); setContent(item.content || ""); setCategory(item.category || "transformasi");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "white", borderRadius: 18, padding: 22, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" }}>
                    <h2 style={{ marginTop: 0 }}>{editingId ? "Edit Konten" : "Tambah Konten"}</h2>
                    <label style={labelStyle}>Fungsi Konten</label>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <label style={radioLabelStyle}><input type="radio" checked={materiType === "scroll"} onChange={() => setMateriType("scroll")} /> Chest Reward</label>
                        <label style={radioLabelStyle}><input type="radio" checked={materiType === "artifact"} onChange={() => setMateriType("artifact")} /> Etnomatematika</label>
                    </div>
                    
                    <label style={labelStyle}>Materi</label>
                    <input placeholder="Materi" value={materi} onChange={e => setMateri(e.target.value)} list="materi-suggestions" style={inputStyle} />
                    <datalist id="materi-suggestions">{uniqueMateriSuggestions.map((m, i) => <option key={i} value={m} />)}</datalist>

                    <label style={labelStyle}>Judul</label>
                    <input placeholder="Judul" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />

                    {materiType === "scroll" && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Kategori</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                                <option value="transformasi">Transformasi</option>
                                <option value="aljabar">Aljabar</option>
                                <option value="geometri">Geometri</option>
                                <option value="statistika">Statistika</option>
                            </select>
                        </div>
                    )}

                    <label style={labelStyle}>Isi Materi</label>
                    <SimpleMDE value={content} onChange={setContent} options={MDE_OPTIONS} />
                    
                    <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                        <button onClick={handleSave} disabled={isLoading} style={confirmButtonStyle(isLoading)}>{isLoading ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Tambah Materi")}</button>
                        {editingId && <button onClick={resetForm} style={cancelButtonStyle}>Batal</button>}
                    </div>
                    <Snackbar 
                        isOpen={snackbar.open} 
                        message={snackbar.message} 
                        type={snackbar.type}
                        onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    />
                </div>

                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    isLoading={isLoading}
                />

                <div style={{ background: "#f8fafc", borderRadius: 18, padding: 22 }}>
                    <h2>In-app Preview</h2>
                    {materiType === "scroll" ? (
                        <div style={scrollPreviewStyle}>
                            <div style={scrollContentWrapperStyle}>
                                <h3 style={scrollTitleStyle}>{title.trim() ? title.toUpperCase() : "MATERI BARU"}</h3>
                                <div style={textContentStyle}>{renderWithImages(content || "Belum ada isi materi...", true)}</div>
                            </div>
                        </div>
                    ) : (
                        <div style={artifactPreviewStyle}>
                            <div style={closeIconStyle}>✕</div>
                            <h2 style={artifactTitleStyle}>{title.trim() ? title : "Judul Artifact"}</h2>
                            <div style={artifactBadgeStyle}>{materi.trim() ? materi : "Materi"}</div>
                            <div style={dividerStyle} />
                            <div style={{ width: "100%", flex: 1, overflowY: "auto" }}>
                                <div style={{ color: "#3E2723", fontSize: "13px" }}>{renderWithImages(content || "Tulis isi materi...", true)}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: 40 }}>
                <h2 style={{ marginBottom: 18 }}>Daftar Materi/Topik (ScrollsView)</h2>
                <MateriList items={contents} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} renderWithImages={renderWithImages} />
                
                <h2 style={{ marginTop: 40, marginBottom: 18 }}>Daftar Kesenian & Kebudayaan (Etnomatematika)</h2>
                <MateriList items={artifactContents} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} renderWithImages={renderWithImages} />
            </div>
        </>
    );
}

function MateriList({ items, isLoading, onEdit, onDelete, renderWithImages }) {
    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <style>
                {`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .spinner-blue { border: 3px solid rgba(37, 99, 235, 0.3); border-top: 3px solid #2563eb; border-radius: 50%; width: 24px; height: 24px; animation: spin 0.8s linear infinite; }
                `}
            </style>
            <div className="spinner-blue"></div>
        </div>
    );
    if (items.length === 0) return <div style={emptyBoxStyle}>Belum ada data.</div>;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {items.map(item => (
                <div key={item.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                            <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>{item.title}</h3>
                            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{item.materi || "General"}</p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => onEdit(item)} style={editButtonStyle}>Edit</button>
                            <button onClick={() => onDelete(item.id, item.materiType)} style={deleteButtonStyle}>Hapus</button>
                        </div>
                    </div>
                    <div style={cardContentStyle}>{renderWithImages(item.content || "", true)}</div>
                    <div style={cardFooterStyle}><span>ID: {item.id}</span></div>
                </div>
            ))}
        </div>
    );
}

// Styles
const labelStyle = { display: "block", marginBottom: 8, color: "#334155", fontWeight: "bold", fontSize: 14 };
const inputStyle = { width: "95%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, fontSize: 14 };
const radioLabelStyle = { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 };
const confirmButtonStyle = (loading) => ({ padding: "14px 16px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1, flex: 1 });
const cancelButtonStyle = { padding: "14px 16px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", color: "#334155", cursor: "pointer" };
const statusBoxStyle = { marginTop: 16, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #cbd5e1", fontSize: 13 };
const emptyBoxStyle = { color: "#64748b", padding: 20, background: "white", borderRadius: 12 };

const scrollPreviewStyle = { background: "#F0E7D8", borderRadius: "24px", border: "3px solid #5D4037", width: "360px", height: "640px", margin: "0 auto", padding: "30px 20px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://www.transparenttextures.com/patterns/parchment.png')" };
const scrollContentWrapperStyle = { width: "65%", maxHeight: "75%", overflowY: "auto", textAlign: "center" };
const scrollTitleStyle = { margin: "0 0 12px 0", color: "rgba(161, 0, 0, 0.8)", fontWeight: "700", fontSize: "16px", textTransform: "uppercase" };
const textContentStyle = { lineHeight: "1.6", color: "#3E2723", fontSize: "12px", textAlign: "left" };

const artifactPreviewStyle = { background: "#FDF8E1", borderRadius: "24px", border: "4px solid #8D6E63", width: "360px", height: "640px", margin: "0 auto", padding: "24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" };
const artifactTitleStyle = { fontSize: "22px", fontWeight: "800", textAlign: "center", color: "#3E2723", margin: "20px 0 8px 0" };
const artifactBadgeStyle = { background: "rgba(141, 110, 99, 0.1)", borderRadius: "8px", padding: "4px 12px", fontSize: "12px", color: "#5D4037", fontWeight: "700", marginBottom: "12px" };
const closeIconStyle = { position: "absolute", top: 12, right: 12, color: "#8D6E63", fontSize: 20, fontWeight: "bold" };
const dividerStyle = { width: "100%", height: "1px", background: "rgba(141, 110, 99, 0.2)", marginBottom: "12px" };

const cardStyle = { background: "white", borderRadius: 20, boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", padding: 20, border: "1px solid #e2e8f0" };
const cardContentStyle = { marginTop: 16, color: "#334155", lineHeight: 1.6, maxHeight: 100, overflow: "hidden", fontSize: "13px", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" };
const cardFooterStyle = { marginTop: 16, display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 11 };
const editButtonStyle = { padding: "6px 10px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 12, fontWeight: 600 };
const deleteButtonStyle = { padding: "6px 10px", borderRadius: 10, border: "1px solid #f87171", background: "#fee2e2", color: "#b91c1c", cursor: "pointer", fontSize: 12, fontWeight: 600 };