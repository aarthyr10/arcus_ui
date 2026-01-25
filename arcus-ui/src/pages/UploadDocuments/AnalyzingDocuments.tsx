import { useEffect, useState } from "react";
import { FileText, Brain, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
}

const steps = [
  { label: "Reading documents", icon: FileText },
  { label: "Analyzing compliance clauses", icon: Brain },
  { label: "Verifying specifications", icon: CheckCircle },
  { label: "Generating responses", icon: Sparkles },
];

export default function AnalyzingDocumentsModal({ open }: Props) {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState(0);

  // lock background scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    setVisibleSteps(0);

    const timer = setInterval(() => {
      setVisibleSteps((prev) =>
        prev < steps.length ? prev + 1 : prev
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (visibleSteps === steps.length) {
      const timeout = setTimeout(() => {
        navigate("/compliance");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [visibleSteps, navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2f80ff]/60 to-[#12c2e9]/60 backdrop-blur-sm animate-fadeIn" />

      {/* modal content */}
      <div className="relative w-full h-full flex items-center justify-center animate-scaleIn">
        <div className="flex flex-col items-center text-center">

          {/* Orbit */}
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

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shadow-inner z-10">
              <Brain className="text-blue-500" size={36} />
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-semibold text-white">
            Analyzing Documents
          </h1>

          <p className="mt-2 text-white max-w-md">
            Our AI is processing your compliance requirements
          </p>

          <div className="mt-6 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = index < visibleSteps;

              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-2 justify-center text-sm transition-all duration-700
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                  `}
                >
                  <Icon size={25} color="#0092B8" />
                  <span className="text-[#fff] font-medium">
                    {step.label}
                  </span>                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .animate-orbit {
          animation: orbit 6s linear infinite;
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
