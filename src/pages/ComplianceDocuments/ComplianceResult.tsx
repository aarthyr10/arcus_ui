// import { useEffect, useMemo, useState } from "react";
// import { ServiceEndpoint } from "../../config/ServiceEndpoint";
// import axios from "axios";
// import { ChevronLeft, Download, Loader, Pencil, PencilLine, Trash2 } from "lucide-react";
// import { Pagination, Select, Text } from "@mantine/core";
// import { useNavigate, useParams } from "react-router-dom";
// import ExportComplianceReportModal from "./ExportComplianceReport";

// type ResultRow = {
//   id: number;
//   clause: string;
//   response: string;
//   score: number;
//   reference: string;
//   answer_modified?: boolean;
//   remarks?: string | null;   // ✅ ADD THIS
// };

// const getConfidenceColorHex = (score: number) => {
//   if (score === 0) return "#6b7280"; // gray-500
//   if (score > 90) return "#22c55e"; // green-500
//   if (score >= 70) return "#eab308"; // yellow-500
//   if (score >= 40) return "#f97316"; // orange-500
//   return "#ef4444"; // red-500
// };

// function chunk<T>(array: T[], size: number): T[][] {
//   if (!array.length) return [];
//   const head = array.slice(0, size);
//   const tail = array.slice(size);
//   return [head, ...chunk(tail, size)];
// }

// const formatRemarkLabel = (tag: string) =>
//   tag
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// const getRemarkStyle = (tag: string) => {
//   const value = tag.toLowerCase();

//   if (value.includes("not evaluated"))
//     return "bg-gray-100 text-gray-900 border border-gray-500";

//   if (value.includes("non comply"))
//     return "bg-yellow-100 text-yellow-900 border border-yellow-500";

//   if (value.includes("not applicable"))
//     return "bg-teal-100 text-teal-900 border border-teal-400";

//   if (value.includes("contractor"))
//     return "bg-blue-100 text-blue-900 border border-blue-500";

//   if (value.includes("partially compliant") || value.includes("partial"))
//     return "bg-orange-100 text-orange-900 border border-amber-500";

//   if (value.includes("non compliant") || value.includes("non-compliant"))
//     return "bg-red-100 text-red-900 border border-red-500";

//   if (value.includes("compliant") || value.includes("comply"))
//     return "bg-green-100 text-green-900 border border-green-500";

//   if (value.includes("product"))
//     return "bg-indigo-100 text-indigo-900 border border-indigo-500";

//   if (value.includes("project_specific"))
//     return "bg-purple-100 text-purple-900 border border-purple-500";

//   return "bg-gray-100 text-gray-800 border border-gray-400";
// };

// export default function ComplianceResults() {
//   const navigate = useNavigate();
//   const { docId } = useParams<{ docId: string }>();
//   const [rows, setRows] = useState<ResultRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [filename, setFilename] = useState<string>("");

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     if (!docId) return;
//     const fetchResults = async () => {
//       try {
//         setLoading(true);

//         const endpoint =
//           ServiceEndpoint.apiBaseUrl +
//           ServiceEndpoint.uploadedDocuments.getById(docId);

//         const res = await axios.get(endpoint, {
//           headers: { "ngrok-skip-browser-warning": "true" },
//         });

//         setFilename(res.data?.file_name ?? "");

//         const questions = res.data?.data?.questions ?? [];
//         const mappedRows: ResultRow[] = questions.map((q: any) => {
//           let score = Number(q.confidence_score ?? 0);

//           if (score > 0 && score <= 1) {
//             score = score * 100;
//           }

//           score = Math.max(0, Math.min(100, score));

//           return {
//             id: q.question_no,
//             clause: q.question,
//             response:
//               q.answer_modified && q.modified_answer
//                 ? q.modified_answer
//                 : q.answer, score,
//             reference: q.reference,
//             remarks: q.remarks,
//             answer_modified: q.answer_modified,

//           };
//         });

//         setRows(mappedRows);
//         setPage(1);
//       } catch (err) {
//         console.error("Failed to load compliance results", err);
//         setRows([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [docId]);

//   const handleEdit = (id: number) => {
//     navigate(`/compliance/edit/${docId}/${id}`);
//   };

//   const pages = useMemo(() => {
//     return chunk(rows, pageSize);
//   }, [rows, pageSize]);

//   const paginatedRows = pages[page - 1] ?? [];

//   const totalResults = rows.length;
//   const totalPages = pages.length;

//   const startIndex =
//     totalResults === 0 ? 0 : (page - 1) * pageSize + 1;

//   const endIndex = Math.min(page * pageSize, totalResults);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-10">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="z-10 px-6 py-6 mt-10">
//         <div className="max-w-[1200px] mx-auto">
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
//               <button
//                 className="flex items-center gap-1 text-sm text-blue-600 font-medium cursor-pointer"
//                 onClick={() => navigate("/compliance")}
//               >
//                 <ChevronLeft size={20} />
//                 Back
//               </button>

//               <button
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm cursor-pointer shadow-lg hover:scale-[1.03] transition"
//                 onClick={() => setOpen(true)}
//               >
//                 <Download size={14} />
//                 Export Report
//               </button>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-600 ">
//                   <th className="py-3 px-2 w-[60px]">S.No</th>
//                   <th className="py-3 px-2 w-[600px]">Compliance Clause</th>
//                   <th className="py-3 px-5 w-[600px]">AI Response</th>
//                   <th className="py-3 px-5 w-[600px]">Reference</th>
//                   <th className="py-3 px-2 w-[120px] text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedRows.map((row: ResultRow) => {
//                   const remarkTags = row.remarks?.split("|") ?? [];

//                   return (
//                     <tr key={row.id}>
//                       <td className="py-4 px-2">{row.id}</td>

//                       <td className="py-4 px-2">
//                         <div className="text-gray-800 leading-relaxed">
//                           {row.clause}
//                         </div>
//                         <div className="mt-2 flex items-center justify-evenly gap-4">
//                           {/* Remark tags */}
//                           {remarkTags.length > 0 ? (
//                             <div className="flex flex-wrap gap-2">
//                               {remarkTags.map((tag, index) => (
//                                 <span
//                                   key={index}
//                                   className={`px-3 py-1 text-xs font-semibold rounded-full border 
//                                  ${getRemarkStyle(tag)}`}
//                                 >
//                                   {formatRemarkLabel(tag)}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <div />
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-4 px-5">
//                         <div className="mt-2 text-gray-800 leading-relaxed">
//                           {remarkTags.map((tag, index) => (
//                             <span
//                               key={index}
//                             // className={`px-3 py-1 text-xs font-semibold rounded-full border 
//                             // `}
//                             >
//                               {formatRemarkLabel(tag)}.
//                             </span>
//                           ))}
//                           {row.response}
//                         </div>

//                         {row.answer_modified && (
//                           <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 rounded-full bg-emerald-100 border border-emerald-300">
//                             <PencilLine className="w-3.5 h-3.5" />
//                             <span className="uppercase tracking-wide">Modified</span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="py-4 px-5">{row.reference}</td>
//                       <td className="py-4 px-2">
//                         <div className="flex flex-col items-center justify-center gap-2">
//                           <div
//                             className="w-12 h-12 rounded-full relative shrink-0"
//                             style={{
//                               background: `conic-gradient(${getConfidenceColorHex(row.score)} ${row.score * 3.6}deg, #e5e7eb 0deg)`,
//                             }}
//                           >
//                             <div className="absolute inset-[4px] bg-white rounded-full flex items-center justify-center">
//                               <span className="text-xs font-bold text-gray-800">
//                                 {Math.round(row.score)}%
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-center gap-3">
//                             <Pencil
//                               size={16}
//                               className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
//                               onClick={() => handleEdit(row.id)}
//                             />
//                             <Trash2
//                               size={16}
//                               className="text-red-500 cursor-pointer hover:text-red-700 transition"
//                             />
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>

//             </table>
//           </div>
//         </div>
//         <div className="max-w-[1200px] mx-auto mt-10 px-4">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
//             <div className="flex items-center gap-2 text-sm whitespace-nowrap">
//               <Text size="sm">Showing</Text>
//               <Select
//                 value={String(pageSize)}
//                 onChange={(v) => {
//                   setPageSize(Number(v));
//                   setPage(1);
//                 }}
//                 data={(() => {
//                   const step = 10;
//                   const sizes: number[] = [];
//                   const maxSize = Math.ceil(totalResults / step) * step;
//                   for (let i = step; i <= maxSize; i += step) {
//                     sizes.push(i);
//                   }
//                   if (sizes.length === 0) sizes.push(10);
//                   return sizes.map(String);
//                 })()}
//                 size="xs"
//                 w={70}
//                 classNames={{
//                   input:
//                     "text-sm border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-blue-500 z-[-10]",
//                 }}
//               />
//               <Text size="sm">
//                 {`${startIndex} - ${endIndex} of ${totalResults} Results`}
//               </Text>
//             </div>

//             {totalPages > 1 && (
//               <Pagination
//                 total={totalPages}
//                 value={page}
//                 onChange={setPage}
//                 size="sm"
//                 radius="xl"
//                 siblings={1}
//                 withEdges
//                 classNames={{
//                   root: "flex flex-row flex-nowrap items-center gap-1",
//                   control:
//                     "border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center",
//                 }}
//                 styles={{
//                   control: {
//                     "&[dataActive]": {
//                       backgroundColor: "#0B63E5",
//                       color: "white",
//                       borderColor: "#0B63E5",
//                     },
//                   },
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <ExportComplianceReportModal
//         opened={open}
//         onClose={() => setOpen(false)}
//         filename={filename}
//         questions={rows.map((r) => ({
//           question_no: r.id,
//           question: r.clause,
//           answer: r.response,
//           reference: r.reference,
//           score: r.score,
//         }))}
//       />
//     </>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronLeft, Download, Loader, Pencil, PencilLine, Trash2 } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import ExportComplianceReportModal from "./ExportComplianceReport";

type ResultRow = {
  id: number;
  clause: string;
  response: string;
  score: number;
  reference: string;
  answer_modified?: boolean;
  remarks?: string | null;
};

const getConfidenceColorHex = (score: number) => {
  if (score === 0) return "#6b7280";
  if (score > 90) return "#22c55e";
  if (score >= 70) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

const formatRemarkLabel = (tag: string) =>
  tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
  if (value.includes("partial"))
    return "bg-orange-100 text-orange-900 border border-amber-500";
  if (value.includes("non compliant"))
    return "bg-red-100 text-red-900 border border-red-500";
  if (value.includes("compliant"))
    return "bg-green-100 text-green-900 border border-green-500";

  return "bg-gray-100 text-gray-800 border border-gray-400";
};

export default function ComplianceResults() {
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();

  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!docId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const endpoint =
          ServiceEndpoint.apiBaseUrl +
          ServiceEndpoint.uploadedDocuments.getById(docId);

        const res = await axios.get(endpoint, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        setFilename(res.data?.file_name ?? "");

        const questions = res.data?.data?.questions ?? [];
        const mappedRows: ResultRow[] = questions.map((q: any) => {
          let score = Number(q.confidence_score ?? 0);
          if (score > 0 && score <= 1) score = score * 100;
          score = Math.max(0, Math.min(100, score));

          return {
            id: q.question_no,
            clause: q.question,
            response:
              q.answer_modified && q.modified_answer
                ? q.modified_answer
                : q.answer,
            score,
            reference: q.reference,
            remarks: q.remarks,
            answer_modified: q.answer_modified,
          };
        });

        setRows(mappedRows);
        setPage(1);
      } catch (err) {
        console.error(err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [docId]);

  const handleEdit = (id: number) => {
    navigate(`/compliance/edit/${docId}/${id}`);
  };

  const pages = useMemo(() => chunk(rows, pageSize), [rows, pageSize]);
  const paginatedRows = pages[page - 1] ?? [];

  const totalResults = rows.length;
  const totalPages = pages.length;

  const startIndex =
    totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalResults);

  if (loading) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
      <Loader />
    </div>
  );
}


  return (
    <>
      <div className="z-10 px-3 sm:px-6 py-4 sm:py-6 mt-6">
        <div className="max-w-[1200px] mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Compliance Results
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Review AI-generated compliance responses
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 text-sm text-blue-600 font-medium"
                onClick={() => navigate("/compliance")}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm shadow-lg hover:scale-[1.03] transition"
                onClick={() => setOpen(true)}
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-3 sm:p-6 overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-2">S.No</th>
                  <th className="py-3 px-2">Compliance Clause</th>
                  <th className="py-3 px-2">AI Response</th>
                  <th className="py-3 px-2">Reference</th>
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map((row) => {
                  const remarkTags = row.remarks?.split("|") ?? [];

                  return (
                    <tr key={row.id} className="border-t">
                      <td className="py-4 px-2">{row.id}</td>

                      <td className="py-4 px-2">
                        {row.clause}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {remarkTags.map((tag, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRemarkStyle(tag)}`}
                            >
                              {formatRemarkLabel(tag)}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        {row.response}
                        {row.answer_modified && (
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 rounded-full bg-emerald-100 border border-emerald-300">
                            <PencilLine className="w-3 h-3" />
                            Modified
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-2">{row.reference}</td>

                      <td className="py-4 px-2 text-center">
                        <div className="flex flex-col items-center gap-2">

                          {/* score */}
                          <div
                            className="w-12 h-12 rounded-full relative"
                            style={{
                              background: `conic-gradient(${getConfidenceColorHex(row.score)} ${row.score * 3.6}deg, #e5e7eb 0deg)`
                            }}
                          >
                            <div className="absolute inset-[4px] bg-white rounded-full flex items-center justify-center text-xs font-bold">
                              {Math.round(row.score)}%
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Pencil
                              size={16}
                              className="text-blue-600 cursor-pointer"
                              onClick={() => handleEdit(row.id)}
                            />
                            <Trash2
                              size={16}
                              className="text-red-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="max-w-[1200px] mx-auto mt-8 px-2">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

            <div className="flex items-center gap-2 text-sm">
              <Text size="sm">Showing</Text>

              <Select
                value={String(pageSize)}
                onChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
                data={["10", "20", "30", "40"]}
                size="xs"
                w={70}
              />

              <Text size="sm">
                {`${startIndex}-${endIndex} of ${totalResults}`}
              </Text>
            </div>

            {totalPages > 1 && (
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                size="sm"
                radius="xl"
              />
            )}
          </div>
        </div>
      </div>

      <ExportComplianceReportModal
        opened={open}
        onClose={() => setOpen(false)}
        filename={filename}
        questions={rows.map((r) => ({
          question_no: r.id,
          question: r.clause,
          answer: r.response,
          reference: r.reference,
          score: r.score,
        }))}
      />
    </>
  );
}
