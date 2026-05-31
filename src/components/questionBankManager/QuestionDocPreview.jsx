import React from "react";
import MathPreview from "../MathPreview";

export default function QuestionDocPreview({ questions, includeAnswerKey, onClose }) {
  const questionTypeLabels = {
    multiple_choice: "Pilihan Ganda",
    check_boxes: "Pilihan Ganda Kompleks",
    short_answer: "Isian Singkat"
  };

  const getAlignment = (text) => {
    if (text.includes("[center]")) return "center";
    if (text.includes("[right]")) return "right";
    if (text.includes("[justify]")) return "justify";
    return "left";
  };

  const cleanText = (text) => {
    return text.replace(/\[\/?(left|center|right|justify)\]/gi, "");
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  const renderFormattedText = (text) => {
    if (!text) return null;
    const mathRegex = /(\$\$.*?\$\$|\$.*?\$)/gs;
    const parts = text.split(mathRegex);

    return (
      <span style={{ whiteSpace: 'pre-wrap' }}>
        {parts.map((part, index) => {
          if (part.match(mathRegex)) {
            const isBlock = part.startsWith('$$');
            return (
              <span key={index} style={{ 
                display: isBlock ? 'block' : 'inline-block', 
                textAlign: isBlock ? 'center' : 'inherit',
                margin: isBlock ? '8px 0' : '0',
                verticalAlign: 'baseline'
              }}>
                <MathPreview text={part} />
              </span>
            );
          } else {
            const formatted = part
              .replace(/\*\*_(.*?)_\*\*/g, '<strong><em>$1</em></strong>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/_(.*?)_/g, '<em>$1</em>')
              .replace(/\[\/?(left|center|right|justify)\]/gi, '');
            return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
          }
        })}
      </span>
    );
  };

  const renderContent = (text) => {
    if (!text) return null;
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const parts = text.split(imgRegex);

    return (
      <div style={{ display: 'block', width: '100%' }}>
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            return <span key={index}>{renderFormattedText(part)}</span>;
          } else {
            return (
              <img 
                key={index} 
                src={part} 
                alt="Question Asset" 
                style={{ 
                  maxWidth: '75%', 
                  maxHeight: '400px', 
                  objectFit: 'contain', 
                  display: 'block', 
                  margin: '15px auto', 
                  borderRadius: 8, 
                  border: '1.5px solid #000' 
                }} 
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="print-preview-overlay" style={overlayStyle}>
      <style>
        {`
          @media print {
            @page { size: A4; margin: 20mm; }
            html, body {
              visibility: hidden;
              height: auto !important;
              overflow: visible !important;
              background: #fff !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .no-print { display: none !important; }
            
            /* Reset posisi fixed dari overlay saat cetak agar konten mengalir normal */
            .print-preview-overlay, .print-preview-overlay * {
              visibility: visible !important;
            }
            .print-preview-overlay {
              position: absolute !important; /* Paksa ke koordinat 0,0 kertas */
              left: 0 !important;
              top: 0 !important;
              background: white !important;
              overflow: visible !important;
              height: auto !important;
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            .a4-container { 
              position: relative !important;
              width: 100% !important;
              height: auto !important;
              margin: 0 !important; 
              padding: 0 !important;
              box-shadow: none !important;
              background: white !important;
              overflow: visible !important;
            }
            
            .a4-page {
              width: 100% !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important; /* Reset padding agar tidak double dengan margin @page */
              box-shadow: none !important;
              border: none !important;
              display: block !important;
              position: relative !important;
            }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            
            /* Optimasi pemotongan teks agar tidak terlihat berantakan di ujung halaman */
            h1, h2, h3, p, span, div { orphans: 2; widows: 2; }
            .question-item { break-inside: auto; page-break-inside: auto; }
          }
          .a4-page {
            width: 210mm;
            min-height: 297mm;
            padding: 25.4mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            box-sizing: border-box;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            position: relative;
            color: #000;
          }
          .question-item { margin-bottom: 24px; break-inside: auto; }
        `}
      </style>

      {/* Toolbar Preview */}
      <div className="no-print" style={toolbarStyle}>
        <div style={{ fontWeight: 700 }}>📄 Pratinjau Dokumen Ujian (A4)</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.print()} style={printBtnStyle}>🖨️ Cetak / Simpan PDF</button>
          <button onClick={onClose} style={closeBtnStyle}>Tutup</button>
        </div>
      </div>

      <div className="a4-container" style={{ paddingTop: 80, paddingBottom: 40, background: '#525659', minHeight: '100vh' }}>
        <div className="a4-page">
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #1e3058 0%, #1037a4 100%)', 
            padding: '28px 20px', 
            borderRadius: '20px', 
            marginBottom: '40px',
            border: '1px solid #334155',
            position: 'relative',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            {/* <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, height: '4px', 
              background: 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
              borderRadius: '20px 20px 0 0'
            }} /> */}
            
            <img 
              src="/assets/text_admin.png" 
              alt="Senimatika Admin" 
              style={{ height: '50px', width: 'auto', marginBottom: '0px', opacity: 0.9 }} 
            />
            
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>
              ARSIP SOAL SENIMATIKA
            </h1>
            <div style={{ fontSize: '14px', marginTop: 6, color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Ethnomathematics Learning Management System
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              🕒 Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className="question-item">
              {/* Baris Penomoran & Identitas Soal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#1e293b', minWidth: '24px' }}>{i + 1}.</span>
                
                <div style={{ 
                    display: 'inline-flex', 
                    gap: '10px', 
                    fontSize: '9px', 
                    background: '#f0f9ff', 
                    color: '#0369a1', 
                    padding: '4px 12px', 
                    borderRadius: '6px', 
                    fontWeight: 800,
                    border: '1px solid #bae6fd',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                  <span>{q.jenjang || "UMUM"}</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span>{q.materi || "UMUM"}</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span>{questionTypeLabels[q.questionType] || q.questionType || "UMUM"}</span>
                </div>
              </div>

              {/* Konten Pertanyaan */}
              <div style={{ 
                textAlign: getAlignment(q.question), 
                marginLeft: '36px',
                width: 'calc(100% - 36px)'
              }}>
                <div style={{ flex: 1 }}>
                  {renderContent(q.question)}
                </div>
              </div>

              {/* Opsi / Field Jawaban */}
              <div style={{ marginLeft: 36, marginTop: 12 }}>
                {q.questionType === "short_answer" ? (
                  <div style={{ borderBottom: '1px dashed #000', width: '100%', height: 20, marginTop: 10 }}></div>
                ) : q.questionType === "check_boxes" ? (
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <tbody>
                       {q.options?.map((opt, idx) => (
                         <tr key={idx}>
                           <td style={{ width: 30, verticalAlign: 'top', padding: '5px 0' }}>☐</td>
                           <td style={{ padding: '5px 0' }}>{renderContent(opt)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                ) : (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {q.options?.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8 }}>
                        <div style={{ fontWeight: 700, width: 20 }}>{getOptionLabel(idx)}.</div>
                        <div style={{ flex: 1 }}>{renderContent(opt)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Kunci Jawaban */}
          {includeAnswerKey && (
            <div style={{ 
              marginTop: 50, 
              paddingTop: 20, 
              borderTop: '2px solid #000', 
              pageBreakBefore: 'always'
            }}>
              <h2 style={{ fontSize: '16px', borderBottom: '1px solid #000', paddingBottom: 5 }}>KUNCI JAWABAN</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 15 }}>
                {questions.map((q, i) => (
                  <div key={i} style={{ fontSize: '13px' }}>
                    <strong>{i + 1}.</strong> {q.questionType === "short_answer" ? q.answerKey.join(", ") : q.answerKey.map(idx => getOptionLabel(idx)).join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Page Footer Sim (Halaman) */}
          <div style={{ position: 'absolute', bottom: '15mm', left: 0, right: 0, textAlign: 'center', fontSize: '10px', color: '#666' }} className="no-print">
            Halaman 1 dari 1 (Browser akan menangani penomoran saat cetak)
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, overflowY: 'auto' };
const toolbarStyle = { 
  position: 'fixed', top: 0, left: 0, right: 0, height: 64, 
  background: '#202124', color: 'white', display: 'flex', 
  alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', 
  zIndex: 10001, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' 
};
const printBtnStyle = { padding: "10px 20px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", fontWeight: 700, cursor: "pointer" };
const closeBtnStyle = { padding: "10px 20px", borderRadius: 8, border: "1px solid #5f6368", background: "transparent", color: "white", cursor: "pointer" };