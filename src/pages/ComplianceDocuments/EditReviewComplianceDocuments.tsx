import {
  ArrowLeft,
  Download,
  Sparkles,
  Check,
  X,
  FileText,
  Loader,
  TrendingUp,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { Textarea, Group, Button } from "@mantine/core";
import ExportComplianceReportModal from "../ComplianceDocuments/ExportComplianceReport";

const getColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

const getScoreFromAnswer = (answer: string) => {
  if (answer?.toLowerCase() === "partial") return 70;
  if (answer?.toLowerCase() === "compliant") return 95;
  return 40;
};

export default function EditReviewComplianceDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  const { docId, id } = useParams<{ docId: string; id: string }>();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [questionNumber, setQuestionNumber] = useState<any>(null);
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const showReset = text !== originalText;

  useEffect(() => {
    if (!docId || !id) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);

        const endpoint =
          ServiceEndpoint.apiBaseUrl +
          ServiceEndpoint.uploadedDocuments.getById(docId);

        const res = await axios.get(endpoint, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const questions =
          res.data?.questions ||
          res.data?.data?.questions ||
          res.data?.document?.questions ||
          [];
        const found = questions.find(
          (q: any) => q.question_no === Number(id)
        );


        if (!found) {
          console.error("Question not found");
          return;
        }

        setQuestionNumber(found.question_no)
        setQuestion(found);
        setText(found.modified_answer ?? found.answer ?? "");
        setOriginalText(found.modified_answer ?? found.answer ?? "");
        setFileName(res.data?.file_name ?? null);
        setReference(found.reference ?? null);

      } catch (err) {
        console.error("Failed to load question", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [docId, id]);
  const rawScore =
    question?.confidence_score !== undefined &&
      question?.confidence_score !== null
      ? question.confidence_score
      : getScoreFromAnswer(
        question?.modified_answer ?? question?.answer ?? ""
      );
  const score =
    rawScore > 0 && rawScore <= 1
      ? Math.round(rawScore * 100)
      : Math.max(0, Math.min(100, rawScore));


  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }
  const handleReset = () => {
    setText(originalText);
  };
  const handleback = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(location.state?.from || `/complianceresult/${docId}`);
    }
  };

  const handleSubmit = async () => {
    if (!docId || !id) return;

    try {
      setSubmitting(true);
      const endpoint =
        ServiceEndpoint.apiBaseUrl +
        ServiceEndpoint.uploadedDocuments.updateAnswer(docId, id);

      await axios.post(
        endpoint,
        {
          modified_answer: text, // use the field backend expects
        },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );

      navigate(`/complianceresult/${docId}`);
      setSubmitting(false)
    } catch (err) {
      console.error("Failed to update answer", err);
    }
  };


  return (
    <div className="min-h-screen  px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ===== HEADER CARD ===== */}
        <div className="bg-[#eef8fd] backdrop-blur-xl rounded-2xl px-6 py-5 relative">

          {/* Back button (top-right) */}
          <button
            onClick={handleback}
            className="absolute top-5 right-6 flex items-center gap-1 text-sm text-blue-600 font-medium cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-800">
            Edit & Review
          </h1>

          {/* Clause */}
          <p className="text-sm text-gray-500 mt-1">
            {/* Clause 1: Energy Efficiency Standards */}
            {question?.question || "No question text available"}
          </p>

          {/* Reference */}
          <div className="mt-4 bg-white/60 rounded-xl px-4 py-3 text-sm border border-[#9AD8FB]">
            <p className="text-gray-500">Referenced From:</p>
            <p className="text-gray-700 mt-1 font-medium">
              <span className="inline-flex items-center gap-2 mr-2">
                <FileText className="w-5 h-5 text-[var(--primary-btn-color)] mt-1 shrink-0" />
                {fileName || "No reference available"}
              </span>
            </p>
            <p> {reference || "No reference available"} </p>
          </div>
        </div>


        {/* ===== AI RESPONSE CARD ===== */}
        <div className="bg-[#eef8fd] backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-lg">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <Sparkles size={16} />
              AI Generated Response
              {question?.answer_modified && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  Modified Answer </span>
              )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm shadow hover:scale-[1.03] transition" onClick={() => setOpen(true)}>
              <Download size={14} />
              Export Report
            </button>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            autosize
            minRows={2}
            maxRows={10}
            styles={{
              label: {
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: 6,
              },
              input: {
                backgroundColor: "#F6FFFB",
                border: "1px solid #4ADE80",
                borderRadius: "16px",
                padding: "16px",
                fontSize: "14px",
                resize: "none",
                transition: "border 0.2s ease",
              },
            }}
          />


          {/* ===== CONFIDENCE SCORE ===== */}
          {/* ===== CONFIDENCE SCORE ===== */}
          <div className="mt-8 bg-white/30 border border-white/40  backdrop-blur-md rounded-2xl p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <span className="text-lg"><TrendingUp /></span>
                Confidence Score
              </div>

              <span className="text-lg font-bold text-blue-500">
                {score}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getColor(score)}`}
                style={{
                  width: `${score}%`,
                }}
              />
            </div>

            {/* Scale labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="bg-white/30 border border-white/40  backdrop-blur-md">
              AI Suggestions
              <div className="mt-4 space-y-2 text-sm  text-gray-600">
                <p>+ Add mention of zoning capabilities</p>
                <p>+ Include warranty information</p>
              </div>
            </div>
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="mt-10">
            <Group mt={32} gap="lg">
              {/* Reset – show only if text changed */}
              {showReset && (
                <Button
                  fullWidth
                  radius="xl"
                  size="md"
                  color="red"
                  variant="gradient"
                  gradient={{ from: "pink", to: "red" }}
                  onClick={handleReset}
                  leftSection={<X size={16} />}
                  disabled={submitting}
                  styles={{
                    root: {
                      height: 48,
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    },
                  }}
                >
                  Reset
                </Button>
              )}

              {/* Submit – always visible */}
              <Button
                fullWidth
                radius="xl"
                size="md"
                variant="gradient"
                gradient={{ from: "#2f80ff", to: "#12c2e9" }}
                onClick={handleSubmit}
                loading={submitting}
                leftSection={!submitting ? <Check size={16} /> : undefined}
                styles={{
                  root: {
                    height: 48,
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  },
                }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Group>
          </div>

        </div>
      </div>
      <ExportComplianceReportModal
        opened={open}
        onClose={() => setOpen(false)}
        filename={fileName || "Compliance_Report"}
        questions={question ? [{
          question_no: questionNumber,
          question: question.question,
          answer: text,
          score: question.confidence_score ?? 95
        }] : []}
      />

    </div>
  );
}