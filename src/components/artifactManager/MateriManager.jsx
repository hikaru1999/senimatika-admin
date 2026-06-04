import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Snackbar from "../Snackbar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import MateriForm from "./MateriForm";
import MateriPreview from "./MateriPreview";
import MateriList from "./MateriList";
import "easymde/dist/easymde.min.css";

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
                <MateriForm 
                    formData={{ materiType, materi, title, content, category, editingId }}
                    handlers={{ setMateriType, setMateri, setTitle, setContent, setCategory, handleSave, resetForm }}
                    isLoading={isLoading}
                    statusMessage={snackbar.message}
                    uniqueMateriSuggestions={uniqueMateriSuggestions}
                />

                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    isLoading={isLoading}
                />

                <MateriPreview 
                    previewData={{ materiType, materi, title, content }}
                    renderWithImages={renderWithImages}
                />
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