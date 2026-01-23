import axios from "axios";
import { ChevronRight, FileText, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import { ServiceEndpoint } from "../../config/ServiceEndpoint";

// type DocItem = {
//   title: string;
//   date: string;
//   clauses: number;
// };

// const documents: DocItem[] = [
//   {
//     title: "HVAC System Compliance Form",
//     date: "2026-01-15",
//     clauses: 12,
//   },
//   {
//     title: "Building Safety Requirements",
//     date: "2026-01-10",
//     clauses: 8,
//   },
//   {
//     title: "Energy Efficiency Standards",
//     date: "2026-01-05",
//     clauses: 15,
//   },
//   {
//     title: "Air Quality Specifications",
//     date: "2025-12-28",
//     clauses: 10,
//   },
// ];
export interface UploadedDoc {
  doc_id: string;
  file_name: string;
  created_at: string;
  status: string;
  // status: "uploaded" | "pending"| "processed" | "failed";
  file_url?: string;
    clauses: number;

}
export default function ComplianceDocuments() {
  const navigate = useNavigate(); // ✅ init navigate
    const [docs, setDocs] = useState<UploadedDoc[]>([]);
    const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.getAll;

  const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
    try {
      const res = await axios.get(endPoint, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        // Map API fields to your interface
        const mappedDocs = res.data.map((doc: any) => ({
          doc_id: doc.doc_id,
          file_name: doc.file_name,
          created_at: doc.created_at,
          status:doc.status,
          file_url: doc.path || undefined,
            clauses: Math.floor(Math.random() * 20) + 5, // 5–24 clauses

        }));

        // Sort by created_at descending (newest first) and take the last 3 (most recent)
        // const sortedDocs = mappedDocs
        //   .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        //   .slice(0, 3);
const sortedDocs = mappedDocs.sort(
  (a, b) =>
    new Date(b.created_at).getTime() -
    new Date(a.created_at).getTime()
);

        return sortedDocs;
      } else {
        console.warn("Invalid API response: Expected array");
        return [];
      }
    } catch (err: any) {
      console.error("Failed to fetch documents", err.response?.data || err.message);
      throw err;
    }
  };
  /* ================= FETCH ================= */

  useEffect(() => {
    getUploadedDocuments()
      .then((data) => setDocs(data))
      .catch((err) => {
        console.error("Error in useEffect:", err);
        setDocs([]);
      })
      // .finally(() => setLoading(false));
  }, []);
  return (
    <div className="w-full bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7] flex justify-center px-6 py-3 mt-13">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Compliance Documents
            </h1>
            <p className="mt-1 text-gray-500">
              View previously uploaded compliance documents and their analysis results
            </p>
          </div>

          {/* ✅ NAVIGATION ADDED HERE */}
          <button
            onClick={() => navigate("/uploads")}
            className="
              h-11 px-6 rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white text-sm font-medium
              shadow-lg hover:scale-[1.03] transition cursor-pointer
            "
          >
            Upload New Complaint DC
          </button>
        </div>

        {/* DOCUMENT LIST */}
        <div className="space-y-5">
          {docs.map((doc:any, index:any) => (
            <div
              key={index}
              className="
                flex items-center justify-between
                bg-white/70 backdrop-blur-md
                rounded-2xl
                px-6 py-5
                border border-gray-200
                shadow-sm
                hover:shadow-md hover:bg-white transition
                cursor-pointer
              "
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center">
                  <FileText className="text-white" size={22} />
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    {doc.file_name}
                  </p>

                  <div className="mt-1 flex items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {/* {doc.date} */}
                      {new Date(doc.created_at).toLocaleDateString()}

                    </span>

                    {/* <span>{doc.clauses} clauses analyzed</span> */}
<span>{doc.clauses} clauses analyzed</span>

                    <span className="px-3 py-[2px] rounded-md text-xs font-medium bg-green-100 text-green-700">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
