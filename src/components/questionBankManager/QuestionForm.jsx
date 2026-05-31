import React, { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";

export default function QuestionForm({ 
  formData, 
  setters, 
  helpers, 
  isLoading, 
  branches, 
  materiList, 
  onSave, 
  onCancel 
}) {
  const { branch, jenjang, materi, question, questionType, options, answerKey, predictorInput, editingId } = formData;
  const { setBranch, setJenjang, setMateri, setQuestion, setPredictorInput } = setters;
  const { handleTypeChange, updateOption, handleAnswerKeyChange, addPredictor, removePredictor } = helpers;

  const mdeOptions = useMemo(() => ({
    spellChecker: false,
    toolbar: [
      "bold", "italic", "|", 
      "unordered-list", "ordered-list", "|", 
      "image", "|", 
      { 
        name: "latex", 
        action: (editor) => { editor.codemirror.replaceSelection(`$${editor.codemirror.getSelection()}$`); }, 
        
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
      "|", "preview", "side-by-side", "fullscreen"
    ],
  }), []);

  const syntaxErrors = useMemo(() => {
    const errors = [];
    if (!question) return errors;
    if ((question.match(/\$/g) || []).length % 2 !== 0) errors.push("LaTeX ($) belum ditutup");
    if ((question.match(/\*\*/g) || []).length % 2 !== 0) errors.push("Bold (**) belum ditutup");
    if ((question.match(/_/g) || []).length % 2 !== 0) errors.push("Italic (_) belum ditutup");
    ["center", "right", "left", "justify"].forEach(tag => {
      const open = (question.match(new RegExp(`\\[${tag}\\]`, 'gi')) || []).length;
      const close = (question.match(new RegExp(`\\[\\/${tag}\\]`, 'gi')) || []).length;
      if (open !== close) errors.push(`Tag [${tag}] tidak seimbang`);
    });
    return errors;
  }, [question]);

  return (
    <div style={{ flex: 1, background: "white", borderRadius: 18 }}>
      <h2 style={{ marginTop: 0 }}>{editingId ? "Edit Soal" : "Tambah Soal Baru"}</h2>
      
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {["multiple_choice", "check_boxes", "short_answer"].map(type => (
          <button key={type} onClick={() => handleTypeChange(type)} style={{ padding: "10px 14px", borderRadius: 12, border: questionType === type ? "2px solid #2563eb" : "1px solid #cbd5e1", background: questionType === type ? "#eff6ff" : "white", color: "#1d4ed8", cursor: "pointer" }}>
            Format {type === "multiple_choice" ? "Single Multiple Choice" : type === "check_boxes" ? "Multiple Complex Answer" : "Isian Singkat"}
          </button>
        ))}
      </div>

      <label style={labelStyle}>Jenjang</label>
      <select value={jenjang} onChange={(e) => setJenjang(e.target.value)} style={inputStyle}>
        <option value="">-- Pilih Jenjang --</option>
        {["VII SMP", "VIII SMP", "IX SMP", "X SMA", "XI SMA", "XII SMA"].map(j => <option key={j} value={j}>{j}</option>)}
      </select>
      
      <label style={labelStyle}>Cabang</label>
      <input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Contoh: Aljabar" list="branch-suggestions" style={inputStyle} />
      <datalist id="branch-suggestions">{branches.map((b, i) => <option key={i} value={b} />)}</datalist>

      <label style={labelStyle}>Materi</label>
      <input value={materi} onChange={(e) => setMateri(e.target.value)} placeholder="Contoh: Logika" list="materi-suggestions" style={inputStyle} />
      <datalist id="materi-suggestions">{materiList.map((m, i) => <option key={i} value={m} />)}</datalist>

      <label style={labelStyle}>Pertanyaan</label>
      <div style={infoBoxStyle}>
        <i className="fa fa-info-circle"></i>
        <span>Daftar simbol LaTeX: <a href="https://www.cmor-faculty.rice.edu/~heinken/latex/symbols.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7", fontWeight: 700, textDecoration: "underline" }}>Lihat Referensi Simbol Disini</a></span>
      </div>
      {syntaxErrors.length > 0 && (
        <div style={errorBoxStyle}>
          <strong>⚠️ Kesalahan penulisan:</strong>
          <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{syntaxErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      <SimpleMDE value={question} onChange={setQuestion} options={mdeOptions} />

      {questionType === "short_answer" ? (
        <div style={{ marginBottom: 20 }}>
          <div style={labelStyle}>Prediktor Jawaban</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input placeholder="Jawaban benar..." value={predictorInput} onChange={(e) => setPredictorInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPredictor()} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }} />
            <button onClick={addPredictor} type="button" style={actionBtnStyle}>+</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {answerKey.map((ans, idx) => (
              <div key={idx} style={badgeStyle}>
                <span>{ans}</span>
                <span onClick={() => removePredictor(idx)} style={{ cursor: "pointer", fontWeight: "bold" }}>×</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <div style={labelStyle}>Opsi Jawaban</div>
          {options.map((opt, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <label style={{ width: 24 }}>{idx + 1}.</label>
              <input value={opt} onChange={(e) => updateOption(idx, e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" }} />
              <input 
                type={questionType === "multiple_choice" ? "radio" : "checkbox"} 
                name="answerKey" 
                checked={questionType === "multiple_choice" ? answerKey[0] === idx : answerKey.includes(idx)} 
                onChange={(e) => handleAnswerKeyChange(idx, e.target.checked)} 
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button onClick={onSave} disabled={isLoading} style={saveBtnStyle(isLoading)}>
          {isLoading ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Tambah Soal")}
        </button>
        <button onClick={onCancel} style={cancelBtnStyle}>Batal</button>
      </div>
    </div>
  );
}

const infoBoxStyle = { marginBottom: 12, padding: "10px 14px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, fontSize: 13, color: "#0369a1", display: "flex", alignItems: "center", gap: 8 };
const labelStyle = { display: "block", fontWeight: 600, color: "#334155", marginBottom: 8 };
const inputStyle = { width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 16, boxSizing: "border-box" };
const errorBoxStyle = { marginBottom: 12, padding: 10, background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b", fontSize: 12 };
const actionBtnStyle = { padding: "10px 16px", borderRadius: 10, background: "#10b981", color: "white", border: "none", cursor: "pointer" };
const badgeStyle = { padding: "6px 12px", background: "#f1f5f9", borderRadius: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 8, border: "1px solid #e2e8f0" };
const saveBtnStyle = (loading) => ({ flex: 1, padding: 14, borderRadius: 14, border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.75 : 1 });
const cancelBtnStyle = { padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer" };