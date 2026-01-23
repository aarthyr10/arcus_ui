// import { useState } from "react";
// import {
//   ChevronLeft,
//   Download,
//   Lightbulb,
//   Pencil,
//   Trash2,
// } from "lucide-react";
// import { Pagination } from "@mantine/core";

// type ResultRow = {
//   id: number;
//   clause: string;
//   response: string;
//   score: number;
// };

// const rows: ResultRow[] = [
//   {
//     id: 1,
//     clause: "Energy Efficiency Standards",
//     response:
//       "The proposed HVAC system meets ENERGY STAR certification requirements with a SEER rating of 18.2, exceeding the minimum requirement.",
//     score: 95,
//   },
//   {
//     id: 2,
//     clause: "Installation Requirements",
//     response:
//       "Installation must be performed by certified technicians following ASHRAE guidelines. Documentation shows compliance.",
//     score: 92,
//   },
//   {
//     id: 3,
//     clause: "Refrigerant Specifications",
//     response:
//       "System uses R-410A refrigerant in compliance with EPA regulations. Partial documentation on leak detection systems.",
//     score: 78,
//   },
//   {
//     id: 4,
//     clause: "Noise Level Compliance",
//     response:
//       "Operating noise levels measured at 58dB, meeting the residential requirement of ≤60dB as per local ordinance.",
//     score: 48,
//   },
//   {
//     id: 5,
//     clause: "Warranty & Service Terms",
//     response:
//       "Standard 5-year parts warranty and 10-year compressor warranty align with industry standards.",
//     score: 90,
//   },
// ];

// const getColor = (score: number) => {
//   if (score >= 90) return "bg-green-500 text-green-600";
//   if (score >= 70) return "bg-orange-500 text-orange-500";
//   return "bg-red-500 text-red-500";
// };




// export default function ComplianceResults() {
//   const [view, setView] = useState<"table" | "cards">("table");
//   const ITEMS_PER_PAGE = 3;

//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

//   const paginatedRows = rows.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <>
//       <div className="z-10 px-6 py-6 mt-13">
//         <div className="max-w-[1200px] mx-auto">

//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-800">
//                 Compliance Results
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Review AI-generated compliance responses
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <button className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer">
//                 <ChevronLeft size={16} />
//                 Back
//               </button>

//               {/* TOGGLE */}
//               <div className="flex    p-1">
//                 <button
//                   onClick={() => setView("table")}
//                   className={`px-4 py-1 rounded-s-4xl text-sm transition cursor-pointer ${view === "table"
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-500"
//                     }`}
//                 >
//                   Table
//                 </button>
//                 <button
//                   onClick={() => setView("cards")}
//                   className={`px-4 py-1 rounded-r-4xl text-sm transition cursor-pointer ${view === "cards"
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-500"
//                     }`}
//                 >
//                   Cards
//                 </button>
//               </div>

//               <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm shadow cursor-pointer">
//                 <Download size={14} />
//                 Export Report
//               </button>
//             </div>
//           </div>

//           {/* ================= TABLE VIEW ================= */}
//           {view === "table" && (
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-600">
//                     <th className="py-3 w-[60px]">S.No</th>
//                     <th className="py-3 w-[260px]">Compliance Clause</th>
//                     <th className="py-3">AI Response</th>
//                     <th className="py-3 w-[180px]">Confidence Score</th>
//                     <th className="py-3 w-[120px] text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {paginatedRows.map((row) => (
//                     <tr key={row.id} className="">
//                       <td className="py-4">{row.id}</td>
//                       <td className="py-4 text-gray-600">{row.clause}</td>
//                       <td className="py-4 text-gray-600">
//                         {row.response}
//                       </td>
//                       <td className="py-4">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`font-semibold ${getColor(row.score).split(" ")[1]}`}
//                           >
//                             {row.score}%
//                           </span>
//                           <div className="w-[90px] h-[6px] bg-gray-200 rounded-full">
//                             <div
//                               className={`h-full rounded-full ${getColor(row.score).split(" ")[0]}`}
//                               style={{ width: `${row.score}%` }}
//                             />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4">
//                         <div className="flex justify-center gap-3">
//                           <Pencil size={16} className="text-blue-600 cursor-pointer" />
//                           <Trash2 size={16} className="text-red-500 cursor-pointer" />
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 {/* Human-in-the-Loop */}
//               </table>
//               <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-start gap-2 text-xs text-gray-600">
//                 <Lightbulb size={14} className="text-yellow-500 mt-[1px]" />
//                 <p>
//                   <span className="font-medium text-gray-700">
//                     Human-in-the-Loop:
//                   </span>{" "}
//                   Edit AI responses to add manual corrections or delete non-applicable
//                   clauses for compliance audit clarity.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* ================= CARD VIEW ================= */}
//           {view === "cards" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {paginatedRows.map((row) => (
//                 <div
//                   key={row.id}
//                   className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-5"
//                 >
//                   <h3 className="font-semibold text-gray-800">
//                     {row.clause}
//                   </h3>

//                   <p className="text-sm text-gray-600 mt-2">
//                     {row.response}
//                   </p>

//                   <div className="mt-4 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`font-semibold ${getColor(row.score).split(" ")[1]}`}
//                       >
//                         {row.score}%
//                       </span>
//                       <div className="w-[90px] h-[6px] bg-gray-200 rounded-full">
//                         <div
//                           className={`h-full rounded-full ${getColor(row.score).split(" ")[0]}`}
//                           style={{ width: `${row.score}%` }}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex gap-3">
//                       <Pencil size={16} className="text-blue-600 cursor-pointer" />
//                       <Trash2 size={16} className="text-red-500 cursor-pointer" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         {/* Pagination */}
//         <div className="mt-4 flex items-center justify-between">
//           <span className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>

//           <Pagination
//             value={currentPage}
//             onChange={setCurrentPage}
//             total={totalPages}
//             size="sm"
//             radius="md"
//             withEdges
//             styles={{
//               control: {
//                 borderColor: "#e5e7eb",
//                 color: "#4b5563",

//                 "&[data-active]": {
//                   backgroundColor: "#2563eb",
//                   borderColor: "#2563eb",
//                   color: "#fff",
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// }



// import { useEffect, useMemo, useState } from "react";
// import { Download, Pencil, Trash2 } from "lucide-react";
// import { Pagination, Select } from "@mantine/core";

// type ResultRow = {
//   id: number;
//   clause: string;
//   response: string;
//   score: number;
// };

// type Props = {
//   docId: string;
// };

// const mockRows: ResultRow[] = [
//   {
//     id: 1,
//     clause: "Energy Efficiency Standards",
//     response:
//       "The HVAC system meets ENERGY STAR requirements with SEER 18.2.",
//     score: 95,
//   },
//   {
//     id: 2,
//     clause: "Installation Requirements",
//     response:
//       "Installed by certified technicians following ASHRAE guidelines.",
//     score: 92,
//   },
//   {
//     id: 3,
//     clause: "Refrigerant Specifications",
//     response:
//       "Uses R-410A refrigerant. Partial documentation on leak detection.",
//     score: 78,
//   },
//   {
//     id: 4,
//     clause: "Noise Level Compliance",
//     response:
//       "Noise level measured at 58dB, within acceptable limits.",
//     score: 48,
//   },
// ];

// const getColor = (score: number) => {
//   if (score >= 90) return "bg-green-500 text-green-600";
//   if (score >= 70) return "bg-orange-500 text-orange-500";
//   return "bg-red-500 text-red-500";
// };

// export default function ComplianceResults({ docId }: Props) {
//   const [rows, setRows] = useState<ResultRow[]>([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(3);

//   useEffect(() => {
//     // 🔥 replace with real API using docId
//     setRows(mockRows);
//   }, [docId]);

//   const paginatedRows = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return rows.slice(start, start + pageSize);
//   }, [rows, page, pageSize]);

//   const totalPages = Math.ceil(rows.length / pageSize);

//   return (
//     <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
//       <div className="flex justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             Compliance Results
//           </h2>
//           <p className="text-sm text-gray-500">
//             Document ID: {docId}
//           </p>
//         </div>

//         <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm">
//           <Download size={14} />
//           Export Report
//         </button>
//       </div>

//       <table className="w-full text-sm">
//         <thead>
//           <tr className="text-left text-gray-600">
//             <th>S.No</th>
//             <th>Clause</th>
//             <th>Response</th>
//             <th>Score</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {paginatedRows.map((row) => (
//             <tr key={row.id}>
//               <td className="py-3">{row.id}</td>
//               <td>{row.clause}</td>
//               <td>{row.response}</td>
//               <td>
//                 <div className="flex items-center gap-2">
//                   <span className={getColor(row.score).split(" ")[1]}>
//                     {row.score}%
//                   </span>
//                   <div className="w-20 h-1 bg-gray-200 rounded">
//                     <div
//                       className={`${getColor(row.score).split(" ")[0]} h-full rounded`}
//                       style={{ width: `${row.score}%` }}
//                     />
//                   </div>
//                 </div>
//               </td>
//               <td className="flex justify-center gap-3 py-3">
//                 <Pencil size={16} className="text-blue-600" />
//                 <Trash2 size={16} className="text-red-500" />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {totalPages > 1 && (
//         <div className="mt-6 flex justify-between items-center">
//           <Select
//             size="xs"
//             value={String(pageSize)}
//             onChange={(v) => {
//               if (v) {
//                 setPageSize(Number(v));
//                 setPage(1);
//               }
//             }}
//             data={["3", "6", "9"]}
//             w={80}
//           />

//           <Pagination
//             value={page}
//             onChange={setPage}
//             total={totalPages}
//             size="sm"
//           />
//         </div>
//       )}
//     </div>
//   );
// }




import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Pagination, Select, Loader } from "@mantine/core";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";

type ResultRow = {
  id: number;
  clause: string;
  response: string;
  score: number;
};

type Props = {
  docId: string;
};

const getScoreFromAnswer = (answer: string) => {
  if (answer?.toLowerCase() === "compliant") return 95;
  if (answer?.toLowerCase() === "partial") return 70;
  return 40;
};

const getColor = (score: number) => {
  if (score >= 90) return "bg-green-500 text-green-600";
  if (score >= 70) return "bg-orange-500 text-orange-500";
  return "bg-red-500 text-red-500";
};

export default function ComplianceResults({ docId }: Props) {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // const endpoint =ServiceEndpoint.apiBaseUrl +ServiceEndpoint.uploadedDocuments.getById.replace(":id", docId);
const endpoint =
  ServiceEndpoint.apiBaseUrl +
  ServiceEndpoint.uploadedDocuments.getById(docId);

useEffect(() => {
  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await axios.get(endpoint, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });

      console.log("API RESPONSE:", res.data);

      const questions = res.data?.data?.questions ?? [];

      const mappedRows: ResultRow[] = questions.map((q: any) => ({
        id: q.question_no,
        clause: q.question,
        response: q.answer,
        score: q.confidence_score ?? getScoreFromAnswer(q.answer),
      }));

      setRows(mappedRows);
      setPage(1);
    } catch (err) {
      console.error("Failed to load compliance results", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  if (docId) fetchResults();
}, [docId]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const totalPages = Math.ceil(rows.length / pageSize);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Compliance Results
          </h2>
          <p className="text-sm text-gray-500">
            Document ID: {docId}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm">
          <Download size={14} />
          Export Report
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">S.No</th>
            <th>Compliance Clause</th>
            <th>AI Response</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {paginatedRows.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="py-3">{row.id}</td>

              <td className="pr-4 max-w-xl">
                <p className="line-clamp-3">{row.clause}</p>
              </td>

              <td>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    row.response === "Compliant"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {row.response}
                </span>
              </td>

              <td>
                <div className="flex items-center gap-2">
                  <span className={getColor(row.score).split(" ")[1]}>
                    {row.score}%
                  </span>
                  <div className="w-20 h-1 bg-gray-200 rounded">
                    <div
                      className={`${getColor(row.score).split(" ")[0]} h-full rounded`}
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <Select
            size="xs"
            value={String(pageSize)}
            onChange={(v) => {
              if (v) {
                setPageSize(Number(v));
                setPage(1);
              }
            }}
            data={["5", "10", "15"]}
            w={80}
          />

          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
