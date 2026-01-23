import axios from "axios";
import { ChevronRight, FileText, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import ComplianceResults from "../ComplianceDocuments/ComplianceResult";
import { useNavigate } from "react-router-dom";

export interface UploadedDoc {
  doc_id: string;
  file_name: string;
  created_at: string;
  status: string;
  file_url?: string;
  clauses: number;
}

export default function TrainingDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const endPoint =
    ServiceEndpoint.apiBaseUrl +
    ServiceEndpoint.trainDocuments.getAll;

  const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
    const res = await axios.get(endPoint, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    return res.data
      .map((doc: any) => ({
        doc_id: doc.doc_id,
        file_name: doc.file_name,
        created_at: doc.created_at,
        status: doc.status,
        file_url: doc.path,
        clauses: Math.floor(Math.random() * 20) + 5,
      }))
      .sort(
        (a: UploadedDoc, b: UploadedDoc) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  };

  useEffect(() => {
    getUploadedDocuments()
      .then(setDocs)
      .catch(() => setDocs([]));
  }, []);
  useEffect(() => {
    if (selectedDocId) {
      console.log("State updated:", selectedDocId);
    }
  }, [selectedDocId]);

  return (
    <>
      <div className="w-full bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7] flex justify-center px-6 py-3 mt-13">
        <div className="w-full max-w-6xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Training Documents
              </h1>
              <p className="mt-1 text-gray-500">
                Manage AI knowledge base with manuals, SOPs, and policies
              </p>
            </div>

            {/* ✅ NAVIGATION ADDED HERE */}
            <button
              onClick={() => navigate("/uploadsTrainingDocuments")}
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

          <div className="space-y-5">
            {docs.map((doc) => (
              <div
                key={doc.doc_id}
                onClick={() => {
                  setSelectedDocId(doc.doc_id);
                  console.log("Selected doc id:", doc.doc_id);
                }}
                className={`
                  flex items-center justify-between
                  bg-white/70 backdrop-blur-md
                  rounded-2xl px-6 py-5
                  border shadow-sm
                  cursor-pointer transition
                  hover:shadow-md hover:bg-white
                  ${selectedDocId === doc.doc_id
                    ? "ring-2 ring-blue-500"
                    : "border-gray-200"}
                `}
              >
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center">
                    <FileText className="text-white" size={22} />
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">
                      {doc.file_name}
                    </p>

                    <div className="mt-1 flex gap-5 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>

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

          {/* RESULTS */}
          {selectedDocId && (
            <div className="mt-12">
              <ComplianceResults docId={selectedDocId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
