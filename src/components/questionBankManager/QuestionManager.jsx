import { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import QuestionForm from "./QuestionForm";
import QuestionPreview from "./QuestionPreview";
import Snackbar from "../Snackbar";

function QuestionManager({ onSaveSuccess, onCancel, editData, branches = [], materiList = [] }) {
  const [branch, setBranch] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [materi, setMateri] = useState("");
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answerKey, setAnswerKey] = useState([0]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [predictorInput, setPredictorInput] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setEditingId(editData.id);
      setJenjang(editData.jenjang || "");
      setBranch(editData.branch || "");
      setMateri(editData.materi || "");
      setQuestion(editData.question || "");
      const type = editData.questionType || "multiple_choice";
      setQuestionType(type);
      setOptions(editData.options || (type === "short_answer" ? [] : ["", "", "", ""]));
      setAnswerKey(editData.answerKey || (type === "short_answer" ? [] : [0]));
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = (keepContext = false) => {
    if (!keepContext) {
      setBranch("");
      setJenjang("");
      setMateri("");
    }
    setQuestion("");
    setQuestionType("multiple_choice");
    setOptions(["", "", "", ""]);
    setAnswerKey([0]);
    setEditingId(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleSave = async () => {
    const trimmedOptions = options.map((opt) => opt.trim());
    const validOptions = trimmedOptions.filter((opt) => opt);

    if (!jenjang.trim() || !materi.trim() || !question.trim()) {
      return alert("Isi jenjang, materi, dan pertanyaan terlebih dahulu.");
    }

    if (questionType !== "short_answer" && validOptions.length < 2) {
      return alert("Isi minimal dua opsi.");
    }

    if (answerKey.length === 0) {
      return alert("Pilih satu atau lebih kunci jawaban.");
    }

    setIsLoading(true);

    try {
      const questionData = {
        jenjang: jenjang.trim(),
        branch: branch.trim(),
        materi: materi.trim(),
        question: question.trim(),
        questionType,
        options: trimmedOptions,
        answerKey,
        updatedAt: new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, "questions", editingId), questionData);
        resetForm(false);
        setSnackbar({ open: true, message: "Soal berhasil diperbarui!", type: "success" });
        if (onSaveSuccess) onSaveSuccess(true);
      } else {
        await addDoc(collection(db, "questions"), {
          ...questionData,
          isOnlineQuiz: false,
          isBattleQuiz: false,
          createdAt: new Date(),
        });
        resetForm(true);
        setSnackbar({ open: true, message: "Soal berhasil ditambahkan ke Arsip!", type: "success" });
        if (onSaveSuccess) onSaveSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Gagal menyimpan soal.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerKeyChange = (index, checked) => {
    if (questionType === "multiple_choice") {
      setAnswerKey([index]);
      return;
    }

    if (checked) {
      setAnswerKey((prev) => Array.from(new Set([...prev, index])));
    } else {
      setAnswerKey((prev) => prev.filter((item) => item !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addPredictor = () => {
    if (!predictorInput.trim()) return;
    if (answerKey.includes(predictorInput.trim())) return;
    setAnswerKey([...answerKey, predictorInput.trim()]);
    setPredictorInput("");
  };

  const removePredictor = (index) => {
    setAnswerKey(answerKey.filter((_, i) => i !== index));
  };

  const handleTypeChange = (type) => {
    setQuestionType(type);
    setAnswerKey(type === "short_answer" ? [] : [0]);
    if (type === "short_answer") setOptions([]);
    else if (options.length === 0) setOptions(["", "", "", ""]);
  };

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <QuestionForm
        formData={{ branch, jenjang, materi, question, questionType, options, answerKey, predictorInput, editingId }}
        setters={{ setBranch, setJenjang, setMateri, setQuestion, setPredictorInput }}
        helpers={{ handleTypeChange, updateOption, handleAnswerKeyChange, addPredictor, removePredictor }}
        isLoading={isLoading}
        branches={branches}
        materiList={materiList}
        onSave={handleSave}
        onCancel={onCancel}
      />
      
      <Snackbar 
        isOpen={snackbar.open} 
        message={snackbar.message} 
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
      />

      <div style={{ width: "360px", position: "sticky", top: 10 }}>
        <div style={{ marginBottom: 12, fontWeight: 800, color: "#1e293b", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>In-app Preview</div>
        <QuestionPreview
          question={question}
          questionType={questionType}
          options={options}
        />
      </div>
    </div>
  );
}

export default QuestionManager;