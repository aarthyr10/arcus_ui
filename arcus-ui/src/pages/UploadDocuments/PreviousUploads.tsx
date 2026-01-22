// import { Eye, FileText } from "lucide-react";
// import UploadItem from "./UploadItem";

// const PreviousUploads = () => {
//   return (
//     <div className="
//       w-full lg:w-[360px]
//       bg-[#eef8fd]
//       rounded-3xl
//       shadow-[0_20px_40px_rgba(0,0,0,0.18)]
//       p-6
//     ">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                  <FileText className="w-6 h-6" />
//  Previous Uploads
//       </h3>

//       <div className="space-y-4">
//         <UploadItem
//           name="Fan.pdf"
//           date="01/15/2026, 09:17 AM"
//         />
//         <UploadItem
//           name="Warranty.pdf"
//           date="01/17/2026, 08:17 AM"
//         />
//         <UploadItem
//           name="Specification_Doc_v2.docx"
//           date="01/16/2026, 08:17 PM"
//         />
//       </div>
//     </div>
//   );
// };

// export default PreviousUploads;



// import { FileText } from "lucide-react";
// import UploadItem from "./UploadItem";

// const PreviousUploads = () => {
//   return (
//     <div className="
//       w-full lg:w-[420px]
//       bg-[#eef8fd]
//       rounded-3xl
//       shadow-[0_20px_40px_rgba(0,0,0,0.18)]
//       p-6
//     ">
//       <h3 className="
//         text-base
//         font-semibold
//         text-[#1f2937]
//         mb-4
//         flex items-center gap-2
//       ">
//         <FileText className="w-5 h-5 text-[#2f80ff]" />
//         Previous Uploads
//       </h3>

//       <div className="space-y-4">
//         <UploadItem
//           name="Fan.pdf"
//           date="01/15/2026, 09:17 AM"
//         />
//         <UploadItem
//           name="Warranty.pdf"
//           date="01/17/2026, 08:17 AM"
//         />
//         <UploadItem
//           name="Specification_Doc_v2.docx"
//           date="01/16/2026, 08:17 PM"
//         />
//       </div>
//     </div>
//   );
// };

// export default PreviousUploads;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText } from "lucide-react";
// import UploadItem from "./UploadItem";
// import { ServiceEndpoint } from "../../config/ServiceEndpoint";

// /* ================= TYPES ================= */

// export interface UploadedDoc {
//   doc_id: string;
//   file_name: string;
//   created_at: string;
//   status: "processed" | "pending" | "failed";
//   file_url?: string;
// }

// /* ================= COMPONENT ================= */

// const PreviousUploads = () => {
//   const [docs, setDocs] = useState<UploadedDoc[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= API ================= */
//   // const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.getAll;
//   // const endPoint= "https://contractional-napoleon-superblessed.ngrok-free.dev/api/v1/uploaded-documents";
//   const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.getAll;  // Now /api/v1/uploaded-documents

//   // const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
//   //   const res = await axios.get(endPoint
//   //     , {
//   //       // withCredentials: true,
//   //       headers: {
//   //         "ngrok-skip-browser-warning": "true",
//   //       },
//   //     }
//   //   );


//   //   return res.data.data;
//   // };
// const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
//   try {
//     const res = await axios.get(endPoint, {
//       headers: {
//         "ngrok-skip-browser-warning": "true",
//       },
//     });

//     return res.data.data;
//   } catch (err: any) {
//     console.error(
//       "Failed to fetch documents",
//       err.response?.data || err.message
//     );
//     throw err; // important so caller knows it failed
//   }
// };

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     getUploadedDocuments()
//       .then(setDocs)
//       .catch((err) => {
//         console.error("Failed to fetch documents", err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= UI ================= */

//   return (
//     <div className="w-full lg:w-[420px] bg-[#eef8fd] rounded-3xl p-6">
//       <h3 className="flex items-center gap-2 mb-4 font-semibold">
//         <FileText className="w-5 h-5 text-[#2f80ff]" />
//         Previous Uploads
//       </h3>

//       {loading && (
//         <p className="text-gray-500 text-sm">Loading…</p>
//       )}

//       {/* {!loading && docs.length === 0 && (
//           <p className="text-gray-400 text-sm">
//             No documents uploaded
//           </p>
//         )} */}

//       <div className="space-y-4">
//         {docs.map((doc) => (
//           <UploadItem
//             key={doc.doc_id}
//             name={doc.file_name}
//             date={new Date(doc.created_at).toLocaleString()}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PreviousUploads;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText } from "lucide-react";
// import UploadItem from "./UploadItem";
// import { ServiceEndpoint } from "../../config/ServiceEndpoint";

// /* ================= TYPES ================= */

// export interface UploadedDoc {
//   doc_id: string;
//   file_name: string;
//   created_at: string;
//   status: "processed" | "pending" | "failed";  // Map API's "UPLOADED" to "processed"
//   file_url?: string;
//   // Optional: Add other fields if needed, e.g., file_type?: string;
// }

// /* ================= COMPONENT ================= */

// const PreviousUploads = () => {
//   const [docs, setDocs] = useState<UploadedDoc[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= API ================= */
//   const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.getAll;

//   const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
//     try {
//       const res = await axios.get(endPoint, {
//         headers: {
//           "ngrok-skip-browser-warning": "true",
//         },
//       });

//       console.log("API Response:", res.data);  // Debug: Should show the array

//       // API returns array directly as res.data, not res.data.data
//       if (Array.isArray(res.data)) {
//         // Map API fields to your interface
//         return res.data.map((doc: any) => ({
//           doc_id: doc.doc_id,
//           file_name: doc.file_name,
//           created_at: doc.created_at,
//           status: doc.status === "UPLOADED" ? "processed" : "pending",  // Map status
//           file_url: doc.path || undefined,  // Optional: Use path as file_url
//         }));
//       } else {
//         console.warn("Invalid API response: Expected array");
//         return [];
//       }
//     } catch (err: any) {
//       console.error("Failed to fetch documents", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     getUploadedDocuments()
//       .then((data) => setDocs(data))
//       .catch((err) => {
//         console.error("Error in useEffect:", err);
//         setDocs([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   /* ================= UI ================= */

//   return (
//     <div className="w-full lg:w-[420px] bg-[#eef8fd] rounded-3xl p-6">
//       <h3 className="flex items-center gap-2 mb-4 font-semibold">
//         <FileText className="w-5 h-5 text-[#2f80ff]" />
//         Previous Uploads
//       </h3>

//       {loading && <p className="text-gray-500 text-sm">Loading…</p>}

//       {!loading && docs.length === 0 && (
//         <p className="text-gray-400 text-sm">No documents uploaded</p>
//       )}

//       <div className="space-y-4">
//         {docs.map((doc) => (
//           <UploadItem
//             key={doc.doc_id}
//             name={doc.file_name}
//             date={new Date(doc.created_at).toLocaleString()}
//             status={doc.status}  // Pass actual status
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PreviousUploads;


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
  status: "processed" | "pending" | "failed";
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

  // const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
  //   try {
  //     const res = await axios.get(endPoint, {
  //       headers: {
  //         "ngrok-skip-browser-warning": "true",
  //       },
  //     });

  //     console.log("API Response:", res.data);

  //     if (Array.isArray(res.data)) {
  //       // Map API fields to your interface
  //       const mappedDocs = res.data.map((doc: any) => ({
  //         doc_id: doc.doc_id,
  //         file_name: doc.file_name,
  //         created_at: doc.created_at,
  //         status: doc.status === "UPLOADED" ? "processed" : "pending",
  //         file_url: doc.path || undefined,
  //       }));

  //       // Sort by created_at descending (newest first) and take the last 3 (most recent)
  //       const sortedDocs = mappedDocs
  //         .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  //         .slice(0, 3);  // Take only the first 3 (most recent)

  //       return sortedDocs;
  //     } else {
  //       console.warn("Invalid API response: Expected array");
  //       return [];
  //     }
  //   } catch (err: any) {
  //     console.error("Failed to fetch documents", err.response?.data || err.message);
  //     throw err;
  //   }
  // };
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
          status:
            doc.status === "SUCCESS"
              ? "processed"
              : doc.status === "FAILED"
                ? "failed"
                : "pending",
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

      <div className="space-y-4">
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