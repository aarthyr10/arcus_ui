import {
  Sparkles,
  Check,
  X,
  Loader2,
  ChevronLeft,
  FileText,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { Textarea, Group, Button, Switch } from "@mantine/core";

const getConfidenceColorHex = (score: number) => {
  if (score === 0) return "#6b7280";
  if (score > 90) return "#22c55e";
  if (score >= 70) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

const formatRemarkLabel = (tag: string) =>
  tag
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getRemarkStyle = (tag: string) => {
  const value = tag.toLowerCase();

  if (value.includes("not evaluated"))
    return "bg-gray-100 text-gray-900 border border-gray-500";

  if (value.includes("non comply"))
    return "bg-yellow-100 text-yellow-900 border border-yellow-500";

  if (value.includes("not applicable"))
    return "bg-teal-100 text-teal-900 border border-teal-400";

  if (value.includes("contractor"))
    return "bg-blue-100 text-blue-900 border border-blue-500";

  if (value.includes("partially compliant") || value.includes("partial"))
    return "bg-orange-100 text-orange-900 border border-amber-500";

  if (value.includes("non compliant") || value.includes("non-compliant"))
    return "bg-red-100 text-red-900 border border-red-500";

  if (value.includes("compliant") || value.includes("comply"))
    return "bg-green-100 text-green-900 border border-green-500";

  if (value.includes("product"))
    return "bg-indigo-100 text-indigo-900 border border-indigo-500";

  if (value.includes("project_specific"))
    return "bg-purple-100 text-purple-900 border border-purple-500";

  if (value.includes("this is a modified answer"))
    return "bg-sky-50 text-sky-900 border border-sky-400";

  return "bg-gray-100 text-gray-800 border border-gray-400";
};

const replaceAllStars = (tag: string) =>
  tag.replace(/\*/g, "");

type ParsedReference = {
  doc_name: string;
  chunk: number;
  details: string;
};

function parseDocChunkStatements(
  input: string | null | undefined
): ParsedReference[] {
  if (!input || typeof input !== "string") return [];

  const unwrapped = (() => {
    const m = input.match(/"reference"\s*:\s*"([\s\S]*)"\s*,?\s*$/);
    return m ? m[1] : input;
  })();

  const text = unwrapped
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

  const results: ParsedReference[] = [];

  const re =
    /In\s+(.+?)\s+\(chunk\s+(\d+)\),\s+it\s+states:\s+"([\s\S]*?)"\s*\./g;

  let match;
  while ((match = re.exec(text)) !== null) {
    results.push({
      doc_name: match[1].trim(),
      chunk: Number(match[2]),
      details: match[3].trim(),
    });
  }

  return results;
}

export default function EditReviewComplianceDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  const { docId, id } = useParams<{ docId: string; id: string }>();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);
  const [questionNumber, setQuestionNumber] = useState<any>(null);
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [_fileName, setFileName] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const showReset = text !== originalText;
  const [retrainLLM, setRetrainLLM] = useState(false);
  const parsedReferences = parseDocChunkStatements(reference);


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
          res.data?.data?.questions
        // || [];
        const found = questions.find(
          (q: any) => q.question_no === Number(id)
        );

        if (!found) {
          return;
        }

        setQuestionNumber(found.question_no)
        setQuestion(found);
        setText(replaceAllStars(found.modified_answer ?? found.answer ?? ""));
        setOriginalText(replaceAllStars(found.modified_answer ?? found.answer ?? ""));
        setFileName(res.data?.file_name ?? null);
        setReference(found.reference ?? null);
        // remarks: q.remarks,
      } catch (err) {
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
        <Loader2 className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }

  const handleReset = () => {
    setText(originalText);
    setRetrainLLM(false);
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

      await axios.put(
        endpoint,
        {
          modified_answer: text, // use the field backend expects
          train_modified_answer: retrainLLM, // 👈 true / false
          remarks: "This is a modified answer",
          product_code: "RXQ-ARYFK",
        },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );

      navigate(`/complianceresult/${docId}`);
      setSubmitting(false)
    } catch (err) {
    }
  };


  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center px-3 sm:px-6 lg:px-10 py-6 mt-[3px] lg:mt-[10px]">
      <div className="max-w-[1200px] mx-auto w-full space-y-3">
        {/* ===== HEADER CARD ===== */}
        <div className="bg-[#eef8fd] rounded-2xl px-4 sm:px-6 py-5 relative">

          {/* Back button (top-right) */}
          <button
            onClick={handleback}
            className="absolute top-4 right-4 flex items-center gap-1 text-sm text-blue-600 font-medium cursor-pointer"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Edit & Review
          </h1>

          {/* Clause */}
          <div className="text-sm mt-4 border border-[#9AD8FB] rounded-xl bg-white/60 px-4 py-4">
            <span className="font-semibold text-blue-500"> Clause : {questionNumber} </span>
            <div className="mt-2 text-gray-800">
              {question?.question || "No question text available"}
            </div>
          </div>
          {/* Reference */}
          <div className="mt-4 bg-white/60 rounded-xl px-4 py-3 text-sm border border-[#9AD8FB]">
            <p className="text-gray-500 mb-2">Referenced From:</p>

            {!parsedReferences.length ? (
              <p className="text-gray-700 whitespace-pre-line">
                {reference || "No reference available"}
              </p>
            ) : (
              <div className="space-y-3">
                {parsedReferences.map((ref, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                        <FileText size={14} className="text-blue-700" />
                        {ref.doc_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        Chunk #{ref.chunk}
                      </span>
                    </div>

                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {ref.details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== AI RESPONSE CARD ===== */}
        <div className="bg-[#eef8fd] rounded-2xl p-4 sm:p-8 shadow-lg">

          {/* Header */}
          <div className="flex flex-col items-center md:flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <Sparkles size={16} />
              AI Generated Response
            </div>
            {remarkTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {remarkTags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRemarkStyle(tag)}`}
                  >
                    {formatRemarkLabel(tag)}
                  </span>
                ))}
              </div>
            ) : (
              <div /> // keeps spacing consistent
            )}
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <span className="text-sm text-gray-700">
                Retrain AI Model
              </span>

              <Switch
                checked={retrainLLM}
                onChange={(event) => setRetrainLLM(event.currentTarget.checked)}
                size="md"
                color="blue"
              />
            </div>
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
          <p>{replaceAllStars(question.answer)}</p>
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
                disabled={!showReset || submitting}   // 👈 KEY LINE
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