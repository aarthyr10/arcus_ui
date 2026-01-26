import {
  ArrowLeft,
  Download,
  Sparkles,
  Check,
  X,
  FileText,
  Loader,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";

export default function EditReview() {
  const navigate = useNavigate();

  const { docId, id } = useParams<{ docId: string; id: string }>();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);


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

        setQuestion(found);
        setText(found.modified_answer ?? found.answer ?? "");
        setFileName(res.data?.file_name ?? null);

      } catch (err) {
        console.error("Failed to load question", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [docId, id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!docId || !id) return;

    try {
      const endpoint =
        ServiceEndpoint.apiBaseUrl +
        ServiceEndpoint.uploadedDocuments.updateAnswer(docId, id);

      await axios.put(
        endpoint,
        { answer: text },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );

      navigate(`/complianceresult/${docId}`);
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
            onClick={() => navigate(-1)}
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
                <FileText className="w-5 h-5 text-[var(--primary-btn-color)] mt-1 shrink-0" />{fileName || "No reference available"}
              </span>
            </p>
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

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm shadow hover:scale-[1.03] transition">
              <Download size={14} />
              Export Report
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[160px] rounded-2xl p-4 bg-[#F6FFFB] border border-[#4ADE80] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />

          {/* ===== CONFIDENCE SCORE ===== */}
          <div className="mt-8 bg-[#eef8fd] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {question?.confidence_score ?? 95}%
              </span>
            </div>

            <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[95%] bg-green-500 rounded-full" />
            </div>

            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">High</span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>+ Add mention of zoning capabilities</p>
              <p>+ Include warranty information</p>
            </div>
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="mt-10 flex gap-6">
            <button
              onClick={() => navigate(-1)}
              className="
                flex-1 h-12 rounded-full
                bg-gradient-to-r from-pink-500 to-red-500
                text-white font-medium
                shadow-md
                flex items-center justify-center gap-2
                hover:scale-[1.02] transition" >
              <X size={16} />
              Reset
            </button>

            <button
              className="
                flex-1 h-12 rounded-full
                bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
                text-white font-medium
                shadow-md
                flex items-center justify-center gap-2
                hover:scale-[1.02] transition
              "
              onClick={handleSubmit}
            >
              <Check size={16} />
              Submit
            </button>
          </div>
        </div>

        {/* ===== EDITING TIPS ===== */}
        <div className="bg-[#eef8fd] backdrop-blur-xl border border-white/50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Editing Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Be specific with technical specifications and standards</li>
            <li>Include relevant regulation numbers and dates</li>
            <li>Use clear, professional language for compliance documentation</li>
            <li>Verify all measurements and certifications are accurate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
