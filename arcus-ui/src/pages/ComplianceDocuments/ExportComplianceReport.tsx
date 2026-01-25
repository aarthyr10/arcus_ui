import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation, useNavigate } from "react-router-dom";

type Status = "idle" | "generating" | "success";
type ExportType = "pdf" | "excel";

type Question = {
  question_no: number;
  question: string;
  answer: string;
  reference: string;
  score: number; // ✅ add this
};


export default function ExportComplianceReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const getScoreFromAnswer = (answer: string) => {
    if (answer?.toLowerCase() === "compliant") return 95;
    if (answer?.toLowerCase() === "partial") return 70;
    return 40;
  };

const rawQuestions = location.state?.questions ?? [];

const questions: Question[] = rawQuestions.map((q: any) => {
  const score = Math.max(
    0,
    Math.min(100, Number(q.score ?? getScoreFromAnswer(q.answer)) || 0)
  );

  return {
    question_no: q.question_no ?? q.id,
    question: q.question ?? q.clause,
    answer: q.answer ?? q.response,
    reference: q.reference ?? "-",
    score,
  };
});

  const [status, setStatus] = useState<Status>("idle");
  const [exportType, setExportType] = useState<ExportType | null>(null);

const generatePDF = (questions: Question[]) => {
  const doc = new jsPDF("landscape", "pt", "a4");

  doc.setFontSize(16);
  doc.text("Compliance Report", 40, 40);

  autoTable(doc, {
    startY: 70,
    head: [["Q No", "Question", "Answer", "Reference", "Confidence (%)"]],
    body: questions.map(q => [
      q.question_no,
      q.question,
      q.answer,
      q.reference,
      `${q.score}%`,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [11, 99, 229],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 280 },
      2: { cellWidth: 150 },
      3: { cellWidth: 220 },
      4: { cellWidth: 70 },
    },
  });

  doc.save("Compliance-Report.pdf");
};

  /* ---------------- EXCEL ---------------- */
  const generateExcel = (questions: Question[]) => {
  const excelRows = questions.map(q => ({
    "Question No": q.question_no,
    "Question": q.question,
    "Answer": q.answer,
    "Reference": q.reference,
    "Confidence (%)": q.score,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Compliance Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "Compliance-Report.xlsx");
};

  const handleExport = (type: ExportType) => {
    setExportType(type);
    setStatus("generating");

    setTimeout(() => {
      if (type === "pdf") generatePDF(questions);
      if (type === "excel") generateExcel(questions);
      setStatus("success");
    }, 500);
  };

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">No data available for export.</p>
        <button
          onClick={() => navigate("/compliance")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center w-full max-w-md">
        {status !== "success" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
              <FileText className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Export Report</h2>
            <p className="text-sm text-gray-500 mt-1">Choose your preferred format</p>
          </>
        )}

        {status === "idle" && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleExport("pdf")}
              className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <FileText className="text-white" size={20} />
              </div>
              <p className="font-medium">PDF</p>
              <p className="text-xs text-gray-500">Standard format</p>
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 flex items-center justify-center mb-2">
                <FileText className="text-white" size={20} />
              </div>
              <p className="font-medium">Excel</p>
              <p className="text-xs text-gray-500">Editable format</p>
            </button>
          </div>
        )}

        {status === "generating" && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-gray-600">
              Generating {exportType?.toUpperCase()} report...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Export Successful!</h3>
            <p className="text-sm text-gray-500 mt-1">Your {exportType?.toUpperCase()} report is ready</p>
            <button
              onClick={() => navigate("/uploads")}
              className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Start New Analysis
            </button>
            <button onClick={() => setStatus("idle")} className="mt-3 text-xs text-gray-500 hover:underline">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
