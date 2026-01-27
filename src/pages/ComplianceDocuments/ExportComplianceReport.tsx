import { useEffect, useState } from "react";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";

type Status = "idle" | "generating" | "success";
type ExportType = "pdf" | "excel";

type Question = {
  question_no: number;
  question: string;
  answer: string;
  score: number;
};

interface Props {
  opened: boolean;
  onClose: () => void;
  questions: Question[];
}

export default function ExportComplianceReportModal({
  opened,
  onClose,
  filename,
  questions,
}: Props) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [exportType, setExportType] = useState<ExportType | null>(null);

  useEffect(() => {
    if (opened) {
      setStatus("idle");
      setExportType(null);
    }
  }, [opened]);

  /* ---------- PDF ---------- */
  const generatePDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Compliance Report", 40, 40);

    autoTable(doc, {
      startY: 70,
      head: [["Q No", "Question", "Answer", "Confidence (%)"]],
      body: questions.map(q => [
        q.question_no,
        q.question,
        q.answer,
        `${q.score}%`,
      ]),
      styles: { fontSize: 8, cellPadding: 7, overflow: "linebreak" },
      headStyles: { fillColor: [11, 99, 229], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 550 },
        2: { cellWidth: 120 },
        4: { cellWidth: 50 },
      },
    });

    doc.save(filename + ".pdf");
  };

  /* ---------- EXCEL ---------- */
  const generateExcel = () => {
    const rows = questions.map(q => ({
      "Question No": q.question_no,
      Question: q.question,
      Answer: q.answer,
      "Confidence (%)": q.score,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compliance Report");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      filename + ".xlsx"
    );
  };

  /* ---------- EXPORT ---------- */
  const handleExport = (type: ExportType) => {
    if (!questions.length) return;

    setExportType(type);
    setStatus("generating");

    setTimeout(() => {
      type === "pdf" ? generatePDF() : generateExcel();
      setStatus("success");
    }, 400);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      radius="xl"
      size="md"
      withCloseButton={false}
      closeOnClickOutside={false}
      overlayProps={{ blur: 4 }}
    >
      <div className="text-center">
        {status !== "success" && (
          <>
            {/* <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
              <FileText className="text-white" />
            </div> */}
            <h2 className="text-xl font-semibold text-gray-800">
              Export Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose your preferred format
            </p>
          </>
        )}

        {status === "idle" && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleExport("pdf")}
              className="rounded-2xl bg-white p-4 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <FileText className="text-white" size={20} />
              </div>
              <p className="font-medium">PDF</p>
              <p className="text-xs text-gray-500">Standard format</p>
            </button>

            <button
              onClick={() => handleExport("excel")}
              className="rounded-2xl bg-white p-4 hover:shadow-lg transition"
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
              className="mt-6 px-8 py-4
              rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white
              font-medium
              shadow-[0_10px_25px_rgba(47,128,255,0.4)]
              hover:scale-105
              transition
              cursor-pointer "
            >
              Start New Analysis
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                }}
                className="mt-6 px-6 py-2 flex items-center gap-1 text-sm text-blue-600 cursor-pointer" >
                <ChevronLeft size={20} />
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
