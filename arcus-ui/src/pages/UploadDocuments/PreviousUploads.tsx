import { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import UploadItem from "./UploadItem";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

export interface UploadedDoc {
  doc_id: string;
  file_name: string;
  created_at: string;
  status: "uploaded" | "pending"| "processed" | "failed";
  file_url?: string;
}

/* ================= COMPONENT ================= */

const PreviousUploads = () => {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= API ================= */
  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.getAll;
  // const handleView = (id: string) => {
  // navigate(`/uploaded-documents/${id}`);
  // };
  const handleView = async (id: string) => {
    try {
      const res = await axios.get(`${endPoint}/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("View document response:", res.data);

      navigate(`/uploaded-documents/${id}`, {
        state: { document: res.data },
      });

    } catch (err: any) {
      console.error(
        "Failed to view document",
        err.response?.data || err.message
      );
      alert("Failed to view document. Please try again.");
    }
  };

  const mapStatus = (
    apiStatus: string
  ): UploadedDoc["status"] => {
    switch (apiStatus) {
      case "UPLOADED":
        return "uploaded";
      case "PROCESSING":
        return "pending";
        case "SUCCESS":
        return "processed";
      case "ERROR":
        return "failed";
      default:
        return "pending";
    }
  };

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
          status: mapStatus(doc.status),
          file_url: doc.path || undefined,
        }));

        // Sort by created_at descending (newest first) and take the last 3 (most recent)
        const sortedDocs = mappedDocs
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);

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
      .finally(() => setLoading(false));
  }, []);

  /* ================= UI ================= */

  return (
    <div className="w-full lg:w-[420px] bg-[#eef8fd] rounded-3xl p-6">
      <h3 className="flex items-center gap-2 mb-4 font-semibold">
        <FileText className="w-5 h-5 text-[#2f80ff]" />
        Previous Uploads
      </h3>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}

      {!loading && docs.length === 0 && (
        <p className="text-gray-400 text-sm">No documents uploaded</p>
      )}

      <div className="space-y-4 pr-2">
        {docs.map((doc) => (
          <UploadItem
            key={doc.doc_id}
            id={doc.doc_id}               // 👈 important
            name={doc.file_name}
            date={new Date(doc.created_at).toLocaleString()}
            status={doc.status}
            onView={handleView}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviousUploads;