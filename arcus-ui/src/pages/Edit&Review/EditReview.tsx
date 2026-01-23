import { ArrowLeft, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EditReview() {
  const navigate = useNavigate();

  const originalText =
    "Installation must be performed by certified technicians following ASHRAE guidelines. Documentation shows compliance with local building codes Section 12.4.3.";

  const [text, setText] = useState(originalText);

  return (
    <div className="min-h-screen w-250 mt-5 bg-gradient-to-br from-[#edf3f6] to-[#fafdff] px-10 py-6">

      {/* 🌍 PAGE CONTAINER — WIDTH FIX HERE */}
      <div className="w-full max-w-6xl mx-auto">

        {/* 🔝 TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Edit & Review
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Clause 1: Energy Efficiency Standards
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-mudium text-blue-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* 📦 MAIN CARD */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg">

          {/* 🧠 AI GENERATED RESPONSE */}
          <div>
            <label
              htmlFor="ai-response"
              className="block text-sm font-medium text-blue-600 mb-2"
            >
              AI Generated Response
            </label>

            <textarea
              id="ai-response"
              aria-label="AI generated compliance response"
              placeholder="Enter compliance response"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="
                w-full h-40
                rounded-xl p-4
                bg-white/80
                border border-gray-200
                text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-400
                resize-none
              "
            />
          </div>

          {/* 💡 AI SUGGESTIONS */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              AI Suggestions
            </p>

            <div className="space-y-3">
              <button
                onClick={() =>
                  setText(
                    text +
                      " The system also includes advanced zoning capabilities."
                  )
                }
                className="
                  w-full text-left text-sm
                  bg-white/70 hover:bg-white
                  border border-gray-200
                  rounded-lg px-4 py-3
                  transition
                "
              >
                + Add mention of zoning capabilities
              </button>

              <button
                onClick={() =>
                  setText(
                    text + " Installation warranty is valid for 10 years."
                  )
                }
                className="
                  w-full text-left text-sm
                  bg-white/70 hover:bg-white
                  border border-gray-200
                  rounded-lg px-4 py-3
                  transition
                "
              >
                + Include warranty information
              </button>
            </div>
          </div>

          {/* 🎯 ACTION BUTTONS */}
          <div className="mt-10 flex gap-6">
            <button
              onClick={() => navigate(-1)}
              className="
                flex-1 h-12
                rounded-full
                bg-gradient-to-r from-pink-500 to-red-500
                text-white text-sm font-medium
                shadow-md
                flex items-center justify-center gap-2
                hover:scale-[1.02] transition cursor-pointer
              "
            >
              <X size={16} />
              Discard
            </button>

            <button
              onClick={() => console.log("Saved:", text)}
              className="
                flex-1 h-12
                rounded-full
                bg-gradient-to-r from-blue-500 to-cyan-500
                text-white text-sm font-medium
                shadow-md
                flex items-center justify-center gap-2
                hover:scale-[1.02] transition cursor-pointer
              "
            >
              <Check size={16} />
              Accept & Save
            </button>
          </div>
        </div>

        {/* 📘 EDITING TIPS */}
        <div className="mt-8 bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-6">
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
