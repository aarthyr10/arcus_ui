import { useEffect, useState } from "react";
import { FileText, Brain, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { label: "Reading documents", icon: FileText },
  { label: "Analyzing compliance clauses", icon: Brain },
  { label: "Verifying specifications", icon: CheckCircle },
  { label: "Generating responses", icon: Sparkles },
];

export default function AnalyzingDocuments() {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps((prev) =>
        prev < steps.length ? prev + 1 : prev
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (visibleSteps === steps.length) {
      const timeout = setTimeout(() => {
        navigate("/compliancedocuments");
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [visibleSteps, navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#eaf6fb] via-[#edf9ff] to-[#cfe9f6] flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center text-center">

        {/* Curved orbit using SVG */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg
            className="absolute w-full h-full animate-orbit"
            viewBox="0 0 100 100"
          >
            <circle
               cx="50"
    cy="50"
    r="45"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="3"
    strokeLinecap="round"
    strokeDasharray="30 40"
    strokeDashoffset="15"
            />
          </svg>

          {/* Brain */}
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shadow-inner z-10">
            <Brain className="text-blue-500" size={36} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-4xl font-semibold text-gray-800">
          Analyzing Documents
        </h1>

        <p className="mt-2 text-gray-500 max-w-md">
          Our AI is processing your compliance requirements
        </p>

        {/* Steps */}
        <div className="mt-6 space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = index < visibleSteps;

            return (
              <div
                key={step.label}
                className={`
                  flex items-center gap-2 justify-center text-sm
                  transition-opacity duration-700
                  ${isVisible ? "opacity-100" : "opacity-0"}
                `}
              >
                <Icon size={16} color="#0092B8" />
                {step.label}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .animate-orbit {
          animation: orbit 6s linear infinite;
          transform-origin: center;
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}