import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  FileText,
  Loader,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { Textarea, Group, Button } from "@mantine/core";

const getConfidenceTagStyle = (score: number) => {
  if (score === 0) return "bg-gray-500";
  if (score > 90) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

// ✅ ADD THIS NEW FUNCTION
const getConfidenceColorHex = (score: number) => {
  if (score === 0) return "#6b7280"; // gray-500
  if (score > 90) return "#22c55e"; // green-500
  if (score >= 70) return "#eab308"; // yellow-500
  if (score >= 40) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
};

const getRingColorClass = (score: number) =>
  getConfidenceTagStyle(score).replace("bg-", "text-");

const formatRemarkLabel = (tag: string) =>
  tag
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getRemarkStyle = (tag: string) => {
  const value = tag.toLowerCase();

  // NOT EVALUATED
  if (value.includes("not evaluated"))
    return "bg-yellow-100 text-yellow-800 border-yellow-300";

  // CONTRACTOR RELATED / SPECIFIC
  if (value.includes("contractor"))
    return "bg-blue-100 text-blue-800 border-blue-300";

  // PARTIALLY COMPLIANT
  if (value.includes("partially compliant"))
    return "bg-orange-100 text-orange-800 border-orange-300";

  // NON COMPLIANT
  if (value.includes("non compliant"))
    return "bg-red-100 text-red-800 border-red-300";

  // COMPLIANT
  if (value.includes("compliant"))
    return "bg-green-100 text-green-800 border-green-300";

  // PRODUCT SPECIFIC (fallback)
  if (value.includes("product"))
    return "bg-indigo-100 text-indigo-800 border-indigo-300";

  return "bg-gray-100 text-gray-700 border-gray-300";
};

export default function EditReviewComplianceDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  const { docId, id } = useParams<{ docId: string; id: string }>();

  const [loading, setLoading] = useState(true);
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
        // remarks: q.remarks,
      } catch (err) {
        console.error("Failed to load question", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [docId, id]);
  const rawScore = question?.confidence_score;

  const score =
    typeof rawScore === "number"
      ? rawScore > 0 && rawScore <= 1
        ? Math.round(rawScore * 100)
        : Math.max(0, Math.min(100, rawScore))
      : 0; // ← NO confidence from backend → 0
      
const remarkTags: string[] = question?.remarks
  ? Array.isArray(question.remarks)
    ? question.remarks
    : question.remarks.split("|").map((r: string) => r.trim())
  : [];



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
          <div className="relative text-sm mt-4 border border-[#9AD8FB] rounded-xl bg-white/60 px-4 py-4">
            <span className="font-semibold text-md text-blue-500"> Clause </span>
            <div className="mt-2 text-md font-normal text-gray-800">
              {question?.question || "No question text available"}
            </div>
          </div>

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
            </div>
            {remarkTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {remarkTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border 
              ${getRemarkStyle(tag)}`}
                  >
                    {formatRemarkLabel(tag)}
                  </span>
                ))}
              </div>
            ) : (
              <div /> // keeps spacing consistent
            )}
            <div
              className="w-10 h-10 rounded-full relative shrink-0"
              style={{
                background: `conic-gradient(${getConfidenceColorHex(score)} ${score * 3.6}deg, #e5e7eb 0deg)`,
              }}
            >
              <div className="absolute inset-[4px] bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-gray-800">
                  {Math.round(score)}%
                </span>
              </div>
            </div>
          </div>
          <p>{question.answer}</p>
          <div className="py-4">
            {question?.answer_modified && (
              <span className="py-2 text-sm font-medium text-blue-600">
                Modified Answer </span>
            )}
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
    </div>
  );
}