import { useState } from "react";
import {
  ChevronLeft,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

type ResultRow = {
  id: number;
  clause: string;
  response: string;
  score: number;
};

const rows: ResultRow[] = [
  {
    id: 1,
    clause: "Energy Efficiency Standards",
    response:
      "The proposed HVAC system meets ENERGY STAR certification requirements with a SEER rating of 18.2, exceeding the minimum requirement.",
    score: 95,
  },
  {
    id: 2,
    clause: "Installation Requirements",
    response:
      "Installation must be performed by certified technicians following ASHRAE guidelines. Documentation shows compliance.",
    score: 92,
  },
  {
    id: 3,
    clause: "Refrigerant Specifications",
    response:
      "System uses R-410A refrigerant in compliance with EPA regulations. Partial documentation on leak detection systems.",
    score: 78,
  },
  {
    id: 4,
    clause: "Noise Level Compliance",
    response:
      "Operating noise levels measured at 58dB, meeting the residential requirement of ≤60dB as per local ordinance.",
    score: 48,
  },
  {
    id: 5,
    clause: "Warranty & Service Terms",
    response:
      "Standard 5-year parts warranty and 10-year compressor warranty align with industry standards.",
    score: 90,
  },
];

const getColor = (score: number) => {
  if (score >= 90) return "bg-green-500 text-green-600";
  if (score >= 70) return "bg-orange-500 text-orange-500";
  return "bg-red-500 text-red-500";
};

export default function ComplianceResults() {
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <div className="bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-6 py-6 mt-13">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Compliance Results
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review AI-generated compliance responses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer">
              <ChevronLeft size={16} />
              Back
            </button>

            {/* TOGGLE */}
            <div className="flex rounded-full bg-white shadow p-1">
              <button
                onClick={() => setView("table")}
                className={`px-4 py-1 rounded-full text-sm transition cursor-pointer ${
                  view === "table"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-4 py-1 rounded-full text-sm transition cursor-pointer ${
                  view === "cards"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500"
                }`}
              >
                Cards
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm shadow cursor-pointer">
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* ================= TABLE VIEW ================= */}
        {view === "table" && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 w-[60px]">S.No</th>
                  <th className="py-3 w-[260px]">Compliance Clause</th>
                  <th className="py-3">AI Response</th>
                  <th className="py-3 w-[180px]">Confidence Score</th>
                  <th className="py-3 w-[120px] text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-none">
                    <td className="py-4">{row.id}</td>
                    <td className="py-4 font-medium">{row.clause}</td>
                    <td className="py-4 text-gray-600">
                      {row.response}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${getColor(row.score).split(" ")[1]}`}
                        >
                          {row.score}%
                        </span>
                        <div className="w-[90px] h-[6px] bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full ${getColor(row.score).split(" ")[0]}`}
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-3">
                        <Pencil size={16} className="text-blue-600 cursor-pointer" />
                        <Trash2 size={16} className="text-red-500 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= CARD VIEW ================= */}
        {view === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rows.map((row) => (
              <div
                key={row.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-5"
              >
                <h3 className="font-semibold text-gray-800">
                  {row.clause}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {row.response}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${getColor(row.score).split(" ")[1]}`}
                    >
                      {row.score}%
                    </span>
                    <div className="w-[90px] h-[6px] bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${getColor(row.score).split(" ")[0]}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Pencil size={16} className="text-blue-600 cursor-pointer" />
                    <Trash2 size={16} className="text-red-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
