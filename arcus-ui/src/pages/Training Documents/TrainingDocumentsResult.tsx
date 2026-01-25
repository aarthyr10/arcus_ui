import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronLeft, Download, Loader, Pencil, Trash2 } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

type ResultRow = {
  id: number;
  file_name: string;
  clause: string;      // We'll use lines from extracted_data
  response: string;    // Placeholder
  score: number;       // Placeholder
};

// Helper: chunk array for pagination
function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

// Helper: determine color for score bar
const getColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

export default function TrainingDocumentsResult() {
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!docId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const endpoint =
          ServiceEndpoint.apiBaseUrl +
          ServiceEndpoint.trainDocuments.getById(docId);
console.log(endpoint);

        const res = await axios.get(endpoint, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const fileName = res.data?.file_name ?? "Unknown File";
        const extractedData = res.data?.data?.extracted_data ?? "";
console.log("1234:",fileName);

        // Split the extracted data into lines (or by paragraphs)
        const lines = extractedData.split("\n").filter(Boolean);

        const mappedRows: ResultRow[] = lines.map((line:any, index:any) => ({
          id: index + 1,
          file_name: fileName,
          clause: line,
          response: "-", // Placeholder since API has no response
          score: 0,      // Placeholder
        }));

        setRows(mappedRows);
        setPage(1);
      } catch (err) {
        console.error("Failed to load results", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [docId]);

  const pages = useMemo(() => chunk(rows, pageSize), [rows, pageSize]);
  const paginatedRows = pages[page - 1] ?? [];
  const totalResults = rows.length;
  const totalPages = pages.length;
  const startIndex = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalResults);

  const handleEdit = (id: number) => {
    console.log("Edit row:", id);
    navigate(`/compliance/edit/${docId}/${id}`);
  };
  const handleDelete = (id: number) => {
    console.log("Delete row:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="z-10 px-6 py-6 mt-13">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
Training Documents            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review AI-generated compliance responses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 text-sm text-blue-600"
              onClick={() => navigate("/knowledge")}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm">
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 ">
                <th className="py-3 px-2 w-[60px]">S.No</th>
                <th className="py-3 px-2 w-[500px]">Clause</th>
                <th className="py-3 px-5">AI Response</th>
                <th className="py-3 px-2 w-[180px]">Confidence</th>
                <th className="py-3 px-2 w-[120px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-4 px-2">{row.id}</td>
                  <td className="py-4 px-2">{row.clause}</td>
                  <td className="py-4 px-5">{row.response}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {row.score}%
                      </span>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getColor(
                            row.score
                          )}`}
                          style={{ width: `${row.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Pencil
                        size={16}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => handleEdit(row.id)}
                      />
                      <Trash2
                        size={16}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(row.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="max-w-[1200px] mx-auto mt-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-sm whitespace-nowrap">
            <Text size="sm">Showing</Text>
            <Select
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
              data={["10", "20", "50"]}
              size="xs"
              w={70}
              classNames={{
                input:
                  "text-sm border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-blue-500 z-[-10]",
              }}
            />
            <Text size="sm">
              {`${startIndex} - ${endIndex} of ${totalResults} Results`}
            </Text>
          </div>

          {totalPages > 1 && (
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              size="sm"
              radius="xl"
              siblings={1}
              withEdges
              classNames={{
                root: "flex flex-row flex-nowrap items-center gap-1",
                control:
                  "border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center",
              }}
              styles={{
                control: {
                  "&[data-active]": {
                    backgroundColor: "#0B63E5",
                    color: "white",
                    borderColor: "#0B63E5",
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}




// import { useEffect, useMemo, useState } from "react";
// import { ServiceEndpoint } from "../../config/ServiceEndpoint";
// import axios from "axios";
// import { ChevronLeft, Download, Loader, Book, Calendar, FileText, HardDrive } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";

// type ResultRow = {
//   id: number;
//   file_name: string;
//   clause: string;      // We'll use lines from extracted_data
//   response: string;    // Placeholder
//   score: number;       // Placeholder
// };

// // Helper: chunk array for pagination
// function chunk<T>(array: T[], size: number): T[][] {
//   if (!array.length) return [];
//   const head = array.slice(0, size);
//   const tail = array.slice(size);
//   return [head, ...chunk(tail, size)];
// }

// // Helper: determine color for score bar
// const getColor = (score: number) => {
//   if (score >= 80) return "bg-green-500";
//   if (score >= 50) return "bg-yellow-400";
//   return "bg-red-500";
// };

// export default function TrainingDocumentsResult() {
//   const navigate = useNavigate();
//   const { docId } = useParams<{ docId: string }>();
//   const [rows, setRows] = useState<ResultRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [selectedChunk, setSelectedChunk] = useState<number | null>(null);

//   const document = {
//     title: "HVAC Installation Manual v3.2",
//     type: "Manual",
//     status: "Trained",
//     uploadedOn: "2026-01-12",
//     lastTrainedOn: "2026-01-15",
//     fileSize: "12.4 MB",
//     totalPages: 145,
//     aiIndexStatus: "Ready"
//   };

//   const metaTags = [
//     "Energy Efficiency Standards",
//     "Maintenance Guidelines", 
//     "Refrigerant Specifications",
//     "Electrical Requirements",
//     "Ductwork Design",
//     "Quality Assurance"
//   ];

//   const chunks = [
//     { id: 1, pages: "1-25", title: "Introduction & Safety", status: "Trained" },
//     { id: 2, pages: "26-75", title: "Installation Procedures", status: "Trained" },
//     { id: 3, pages: "76-120", title: "Technical Specifications", status: "Trained" },
//     { id: 4, pages: "121-145", title: "Appendices", status: "Low Certainty" }
//   ];

//   const getStatusTextColor = (status: string) => {
//     if (status === "Trained") return "text-green-700 bg-green-100";
//     if (status === "Low Certainty") return "text-orange-700 bg-orange-100";
//     return "text-gray-700 bg-gray-100";
//   };

//   useEffect(() => {
//     if (!docId) return;

//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const endpoint =
//           ServiceEndpoint.apiBaseUrl +
//           ServiceEndpoint.trainDocuments.getById(docId);
//         console.log(endpoint);

//         const res = await axios.get(endpoint, {
//           headers: { "ngrok-skip-browser-warning": "true" },
//         });

//         const fileName = res.data?.file_name ?? "Unknown File";
//         const extractedData = res.data?.data?.extracted_data ?? "";
//         console.log("1234:", fileName);

//         // Split the extracted data into lines (or by paragraphs)
//         const lines = extractedData.split("\n").filter(Boolean);

//         const mappedRows: ResultRow[] = lines.map((line:any, index:any) => ({
//           id: index + 1,
//           file_name: fileName,
//           clause: line,
//           response: "-", // Placeholder since API has no response
//           score: 0,      // Placeholder
//         }));

//         setRows(mappedRows);
//         setPage(1);
//       } catch (err) {
//         console.error("Failed to load results", err);
//         setRows([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [docId]);

//   const pages = useMemo(() => chunk(rows, pageSize), [rows, pageSize]);
//   const paginatedRows = pages[page - 1] ?? [];
//   const totalResults = rows.length;
//   const totalPages = pages.length;

//   const handleEdit = (id: number) => {
//     console.log("Edit row:", id);
//     navigate(`/compliance/edit/${docId}/${id}`);
//   };
//   const handleDelete = (id: number) => {
//     console.log("Delete row:", id);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-10">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen  p-8">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4" onClick={() => navigate("/knowledge")}>
//             <ChevronLeft size={20} />
//             <span className="text-sm font-medium">Training Documents</span>
//           </button>
          
//           <div className="flex items-start justify-between">
//             <div className="flex items-start gap-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
//                 <Book className="text-white" size={28} />
//               </div>
              
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
//                 <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
//                   {document.status}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Document Summary Card */}
//         <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Document Summary</h2>
//           <div className="grid grid-cols-3 gap-8">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Document Type</p>
//               <p className="font-medium text-gray-900">{document.type}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Uploaded On</p>
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-gray-400" />
//                 <p className="font-medium text-gray-900">{document.uploadedOn}</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">File Size</p>
//               <div className="flex items-center gap-2">
//                 <HardDrive size={16} className="text-gray-400" />
//                 <p className="font-medium text-gray-900">{document.fileSize}</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Total Pages</p>
//               <div className="flex items-center gap-2">
//                 <FileText size={16} className="text-gray-400" />
//                 <p className="font-medium text-gray-900">{document.totalPages}</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Last Trained On</p>
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-gray-400" />
//                 <p className="font-medium text-gray-900">{document.lastTrainedOn}</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">AI Index Status</p>
//               <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
//                 {document.aiIndexStatus}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Meta Data Tags */}
//         <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-3">
//             <span className="text-cyan-500 mr-2">🏷️</span>Meta Data Tag
//           </h2>
//           <p className="text-sm text-gray-500 mb-4">AI-identified topics and key standards</p>
//           <div className="flex flex-wrap gap-3">
//             {metaTags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Chunk Information */}
//         <div className="bg-white rounded-3xl shadow-lg p-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Chunk Information</h2>
//           <div className="space-y-4">
//             {chunks.map((chunk) => (
//               <div
//                 key={chunk.id}
//                 className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
//                 onClick={() => setSelectedChunk(chunk.id)}
//               >
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900 mb-1">
//                     Pages {chunk.pages} • {chunk.title}
//                   </p>
//                 </div>
//                 <span className={`px-4 py-2 ${getStatusTextColor(chunk.status)} text-sm font-medium rounded-full`}>
//                   {chunk.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mt-8">
//           <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
//             <Download size={18} />
//             Download Document
//           </button>
//           <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow border border-gray-200">
//             Retrain AI Model
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
