import axios from "axios";
import { ChevronRight, FileText, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
// import ComplianceResults from "../ComplianceDocuments/ComplianceResult";
import { useNavigate } from "react-router-dom";
import { Pagination, Select, Text } from "@mantine/core";

export interface UploadedDoc {
  doc_id: string;
  file_name: string;
  created_at: string;
  status: string;
  file_url?: string;
  clauses: number;
}

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

export default function TrainingDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  // const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const endPoint =
    ServiceEndpoint.apiBaseUrl +
    ServiceEndpoint.trainDocuments.getAll;

  const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
    const res = await axios.get(endPoint, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    return res.data
      .map((doc: any) => ({
        doc_id: doc.train_id,
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
  // useEffect(() => {
  //   if (selectedDocId) {
  //     console.log("State updated:", selectedDocId);
  //   }
  // }, [selectedDocId]);

  const rows = docs; // 👈 missing line

  const pages = useMemo(() => {
    return chunk(rows, pageSize);
  }, [rows, pageSize]);

  const paginatedRows = pages[page - 1] ?? [];

  const totalResults = rows.length;
  const totalPages = pages.length;

  const startIndex =
    totalResults === 0 ? 0 : (page - 1) * pageSize + 1;

  const endIndex = Math.min(page * pageSize, totalResults);

  useEffect(() => {
    setPage(1);
  }, [docs]);
  return (
    <>
      <div className="w-full flex justify-center  px-6 py-3 mt-13">

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
              onClick={() => navigate("/uploadknowledge")}
              className="
              h-11 px-6 rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white text-sm font-medium
              shadow-lg hover:scale-[1.03] transition cursor-pointer
            "
            >
              Upload New Document
            </button>
          </div>

          <div className="space-y-5">
            {paginatedRows.map((doc: any) => (
              <div
                key={doc.doc_id}
                // onClick={() => {
                //   setSelectedDocId(doc.doc_id);
                //   console.log("Selected doc id:", doc.doc_id);
                // }}
                onClick={() => navigate(`/knowledgeresult/${doc.doc_id}`)}
                className={`
                  flex items-center justify-between
                  bg-white/30 border border-white/40  backdrop-blur-md
                  rounded-2xl px-6 py-5
                   shadow-sm
                  cursor-pointer transition
                  hover:shadow-md hover:bg-white`}
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

                      {/* <span>{doc.clauses} clauses analyzed</span> */}

                      {/* <span className="px-3 py-[2px] rounded-md text-xs font-medium bg-green-100 text-green-700">
                        Completed
                      </span> */}
                      <span
                        className={`px-3 py-[2px] rounded-md text-xs font-medium ${doc.status === "Manual" && "bg-blue-100 text-blue-600"
                          } ${doc.status === "SOP" && "bg-purple-100 text-purple-600"}
            ${doc.status === "Policy" && "bg-green-100 text-green-600"}
            ${doc.status === "Specification" && "bg-orange-100 text-orange-600"}
            ${doc.status === "Standard" && "bg-cyan-100 text-cyan-600"}
          `}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="text-gray-400" />
              </div>

            ))}
            {/* <div className="mt-10 px-6 py-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm text-sm text-gray-700 max-w-6xl mx-auto"> */}
            <div className="bg-white/30 border border-white/40 mt-10 px-6 py-4 backdrop-blur-md rounded-2xl shadow-sm text-sm text-gray-700 max-w-6xl mx-auto">
              <h1 className="text-xl mb-2">
                About Training Documents
              </h1>
              <p>
                Training documents are used to enhance the AI's knowledge base. Upload
                manuals, standard operating procedures, policies, and specifications
                to improve compliance analysis accuracy and enable the Smart Assistant
                to provide better responses.
              </p>
            </div>


            <div className="max-w-[1200px] mx-auto mt-10 px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

                {/* LEFT */}
                <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <Text size="sm">Showing</Text>

                  <Select
                    value={String(pageSize)}
                    onChange={(v) => {
                      setPageSize(Number(v));
                      setPage(1);
                    }}
                    data={(() => {
                      const step = 10;
                      const sizes: number[] = [];

                      // Use totalResults instead of totalPages
                      const maxSize = Math.ceil(totalResults / step) * step;

                      for (let i = step; i <= maxSize; i += step) {
                        sizes.push(i);
                      }

                      // Always at least one option
                      if (sizes.length === 0) sizes.push(10);

                      return sizes.map(String);
                    })()}
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

                {/* RIGHT */}
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

          {/* RESULTS */}
          {/* {selectedDocId && (
            <div className="mt-12">
              <ComplianceResults docId={selectedDocId} />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
