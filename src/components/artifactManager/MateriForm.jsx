import React, { useState, useEffect } from "react";
import SimpleMDE from "react-simplemde-editor";
import Snackbar from "../Snackbar";

// const MDE_OPTIONS = {
//     spellChecker: false,
//     autosave: { enabled: false },
//     placeholder: "Tulis isi materi di sini...",
//     toolbar: [
//         "bold", "italic", "|", "unordered-list", "ordered-list", "|",
//         "image", "|",
//         {
//             name: "latex",
//             action: (editor) => {
//                 const cm = editor.codemirror;
//                 cm.replaceSelection(`$${cm.getSelection()}$`);
//             },
//             className: "fa fa-code",
//             title: "Menyisipkan LaTeX",
//         },
//         "|",
//         {
//             name: "align-left",
//             action: (editor) => {
//                 const cm = editor.codemirror;
//                 cm.replaceSelection(`[left]${cm.getSelection()}[/left]`);
//             },
//             className: "fa fa-align-left",
//             title: "Align Left",
//         },
//         {
//             name: "align-center",
//             action: (editor) => {
//                 const cm = editor.codemirror;
//                 cm.replaceSelection(`[center]${cm.getSelection()}[/center]`);
//             },
//             className: "fa fa-align-center",
//             title: "Align Center",
//         },
//         {
//             name: "align-right",
//             action: (editor) => {
//                 const cm = editor.codemirror;
//                 cm.replaceSelection(`[right]${cm.getSelection()}[/right]`);
//             },
//             className: "fa fa-align-right",
//             title: "Align Right",
//         },
//         {
//             name: "align-justify",
//             action: (editor) => {
//                 const cm = editor.codemirror;
//                 cm.replaceSelection(`[justify]${cm.getSelection()}[/justify]`);
//             },
//             className: "fa fa-align-justify",
//             title: "Align Justify",
//         },
//         "|",
//         "preview", "side-by-side", "fullscreen",
//     ],
// };

export default function MateriForm({ formData, handlers, isLoading, statusMessage, uniqueMateriSuggestions }) {
    const { materiType, materi, title, content, category, editingId } = formData;
    const { setMateriType, setMateri, setTitle, setContent, setCategory, handleSave, resetForm } = handlers;

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    useEffect(() => {
        if (statusMessage) {
            setIsSnackbarOpen(true);
        }
    }, [statusMessage]);

    return (
        <div style={formContainerStyle}>
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
            <div style={infoBoxStyle}>
                <i className="fa fa-info-circle"></i>
                <span>Daftar simbol LaTeX: <a href="https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", fontWeight: 700, textDecoration: "underline" }}>Lihat Referensi Simbol Disini</a></span>
            </div>
            <SimpleMDE value={content} onChange={setContent} options={MDE_OPTIONS} />
            
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                <button onClick={handleSave} disabled={isLoading} style={confirmButtonStyle(isLoading)}>
                    {isLoading ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Tambah Materi")}
                </button>
                {editingId && <button onClick={resetForm} style={cancelButtonStyle}>Batal</button>}
            </div>
            <Snackbar 
                isOpen={isSnackbarOpen} 
                message={statusMessage} 
                type={statusMessage.includes("Gagal") ? "error" : "success"}
                onClose={() => setIsSnackbarOpen(false)} 
            />
        </div>
    );
}

const formContainerStyle = { background: "white", borderRadius: 18, padding: 22, boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)" };
const infoBoxStyle = { marginBottom: 12, padding: "10px 14px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, fontSize: 13, color: "#0369a1", display: "flex", alignItems: "center", gap: 8 };
const labelStyle = { display: "block", marginBottom: 8, color: "#334155", fontWeight: "bold", fontSize: 14 };
const inputStyle = { width: "95%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, fontSize: 14 };
const radioLabelStyle = { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 };
const confirmButtonStyle = (loading) => ({ padding: "14px 16px", borderRadius: 12, border: "none", background: "#2563eb", color: "white", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1, flex: 1 });
const cancelButtonStyle = { padding: "14px 16px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", color: "#334155", cursor: "pointer" };
const statusBoxStyle = { marginTop: 16, padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #cbd5e1", fontSize: 13 };