// import { useEffect, useState } from "react";
// import {
//   FileText,
//   Brain,
//   CheckCircle,
//   Sparkles,
// } from "lucide-react";

// const steps = [
//   { label: "Reading documents", icon: FileText },
//   { label: "Analyzing compliance clauses", icon: Brain },
//   { label: "Verifying specifications", icon: CheckCircle },
//   { label: "Generating responses", icon: Sparkles },
// ];

// export default function AnalyzingDocuments() {
//   const [visibleSteps, setVisibleSteps] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setVisibleSteps((prev) =>
//         prev < steps.length ? prev + 1 : prev
//       );
//     }, 2000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-[#eaf6fb] via-[#edf9ff] to-[#cfe9f6] flex items-center justify-center overflow-hidden">

//       {/* Floating dots */}
//       <span className="absolute w-2 h-2 bg-blue-400 rounded-full left-[35%] top-[42%] animate-pulse" />
//       <span className="absolute w-2 h-2 bg-cyan-400 rounded-full left-[60%] top-[48%] animate-pulse" />

//       <div className="flex flex-col items-center text-center">

//         {/* Brain + rotating arcs */}
//         <div className="relative w-36 h-36 flex items-center justify-center">

//           {/* Rotating arc group */}
//           <div className="absolute inset-0 animate-spin-slow">
//             {[0, 90, 180, 270].map((deg) => (
//               <span
//                 key={deg}
//                 className="absolute top-0 left-1/2 w-6 h-2 bg-blue-500 rounded-full"
//                 style={{
//                   transform: `rotate(${deg}deg) translateX(-50%)`,
//                   transformOrigin: "center 72px",
//                 }}
//               />
//             ))}
//           </div>

//           {/* Brain circle (STATIC) */}
//           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-inner z-10">
//             <Brain className="text-blue-500" size={36} />
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="mt-6 text-4xl font-semibold text-gray-800">
//           Analyzing Documents
//         </h1>

//         <p className="mt-2 text-gray-500 max-w-md">
//           Our AI is processing your compliance requirements
//         </p>

//         {/* Steps */}
//         <div className="mt-6 space-y-3">
//           {steps.slice(0, visibleSteps).map((step, index) => {
//             const Icon = step.icon;
//             return (
//               <div
//                 key={step.label}
//                 className="flex items-center gap-2 justify-center text-sm font-normal animate-step"
//               >
//                 <Icon size={16} color="#0092B8" />
            
//                 {step.label}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Animations */}
//       <style>
//         {`
//           .animate-spin-slow {
//             animation: spin 8s linear infinite;
//           }

//           .animate-step {
//             animation: fadeSlide 0.5s ease-out forwards;
//           }

//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }

//           @keyframes fadeSlide {
//             from {
//               opacity: 0;
//               transform: translateY(6px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

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
        navigate("/next-page"); // 👈 change route if needed
      }, 800); // slight pause after final step

      return () => clearTimeout(timeout);
    }
  }, [visibleSteps, navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#eaf6fb] via-[#edf9ff] to-[#cfe9f6] flex items-center justify-center overflow-hidden">

      {/* Floating dots */}
      <span className="absolute w-2 h-2 bg-blue-400 rounded-full left-[35%] top-[42%] animate-pulse" />
      <span className="absolute w-2 h-2 bg-cyan-400 rounded-full left-[60%] top-[48%] animate-pulse" />

      <div className="flex flex-col items-center text-center">

        {/* Brain with orbit arcs */}
        <div className="relative w-40 h-40 flex items-center justify-center">

          {/* Orbit arcs */}
          <div className="absolute inset-0 animate-orbit">
            <span className="orbit-arc top" />
            <span className="orbit-arc right" />
            <span className="orbit-arc bottom" />
            <span className="orbit-arc left" />
          </div>

          {/* Brain circle */}
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
          {steps.slice(0, visibleSteps).map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="flex items-center gap-2 justify-center text-sm font-normal animate-step"
              >
                <Icon size={16} color="#0092B8" />
                {step.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .animate-orbit {
          animation: orbit 6s linear infinite;
        }

        .orbit-arc {
          position: absolute;
          width: 26px;
          height: 8px;
          background: #3b82f6;
          border-radius: 999px;
        }
        .orbit-arc.top {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .orbit-arc.right {
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
        }
        .orbit-arc.bottom {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .orbit-arc.left {
          left: 0;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
        }

        .animate-step {
          animation: fadeSlide 0.5s ease-out forwards;
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

