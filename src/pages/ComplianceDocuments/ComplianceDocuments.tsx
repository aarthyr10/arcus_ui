import axios from "axios";
import { ChevronRight, FileText, Calendar, FileCheck, Loader2, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { useNavigate } from "react-router-dom";
import { Pagination, Select, Text } from "@mantine/core";
import { CheckCircle, XCircle, Clock, UploadCloud } from "lucide-react";

export interface UploadedDoc {
  doc_id: string;
  file_name: string;
  created_at: string;
  updated_at: string;
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

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    badgeClass: string;
    iconBg: string;
  }
> = {
  UPLOADED: {
    label: "Uploaded",
    icon: <UploadCloud size={14} />,
    badgeClass: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-500",
  },
  PROCESSING: {
    label: "Processing",
    icon: <Clock size={14} />,
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconBg: "bg-yellow-500",
  },
  SUCCESS: {
    label: "Completed",
    icon: <CheckCircle size={14} />,
    badgeClass: "bg-green-100 text-green-700",
    iconBg: "bg-green-500",
  },
  ERROR: {
    label: "Error",
    icon: <XCircle size={14} />,
    badgeClass: "bg-red-100 text-red-700",
    iconBg: "bg-red-500",
  },
  FAILED: {
    label: "Failed",
    icon: <XCircle size={14} />,
    badgeClass: "bg-red-100 text-red-700",
    iconBg: "bg-red-500",
  },
};

export default function ComplianceDocuments() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0);

  const endPoint =
    ServiceEndpoint.apiBaseUrl +
    ServiceEndpoint.uploadedDocuments.getAll;

  const formatDateTime = (utcString: string) => {
    if (!utcString) return "-";

    // Force UTC (because backend doesn't send "Z")
    const date = new Date(utcString.endsWith("Z") ? utcString : utcString + "Z");

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProcessingTime = (
    created: string,
    updated: string,
    status: string
  ) => {
    if (!created) return "-";

    const createdDate = new Date(
      created.endsWith("Z") ? created : created + "Z"
    );

    // If still processing → calculate till NOW
    const endDate =
      status === "SUCCESS"
        ? new Date(updated.endsWith("Z") ? updated : updated + "Z")
        : new Date();

    const diffInSeconds = Math.floor(
      (endDate.getTime() - createdDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60)
      return `${diffInMinutes}m ${diffInSeconds % 60}s`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours}h ${diffInMinutes % 60}m`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ${diffInHours % 24}h`;
  };

  const isUpdatedDifferent = (created: string, updated: string) => {
    if (!created || !updated) return false;

    const createdDate = new Date(
      created.endsWith("Z") ? created : created + "Z"
    );

    const updatedDate = new Date(
      updated.endsWith("Z") ? updated : updated + "Z"
    );

    return createdDate.getTime() !== updatedDate.getTime();
  };

  useEffect(() => {
  const hasProcessingDocs = docs.some(
    (doc) => doc.status !== "SUCCESS"
  );

  if (!hasProcessingDocs) return; // stop interval if no processing docs

  const interval = setInterval(() => {
    setTick((prev) => prev + 1);
  }, 3000);

  return () => clearInterval(interval);
}, [docs]);

  const getUploadedDocuments = async (): Promise<UploadedDoc[]> => {
    const res = await axios.get(endPoint, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    return res.data
      .map((doc: any) => ({
        doc_id: doc.doc_id,
        file_name: doc.file_name,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        status: doc.status,
        file_url: doc.path,
        clauses: doc.questions_count,
      }))
      .sort(
        (a: UploadedDoc, b: UploadedDoc) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  };

 useEffect(() => {
  let interval: ReturnType<typeof setInterval>;

  const fetchDocs = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const data = await getUploadedDocuments();
      setDocs(data);

      const hasProcessing = data.some(
        (doc) => doc.status !== "SUCCESS"
      );

      if (!hasProcessing && interval) {
        clearInterval(interval);
      }
    } catch (error) {
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // First load → show loader
  fetchDocs(true);

  // Polling → no full loader
  interval = setInterval(() => fetchDocs(false), 5000);

  return () => clearInterval(interval);
}, []);


  const rows = docs;

  const pages = useMemo(() => chunk(rows, pageSize), [rows, pageSize]);
  const paginatedRows = pages[page - 1] ?? [];

  const totalResults = rows.length;
  const totalPages = pages.length;
  const startIndex = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalResults);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
        <Loader2 className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex justify-center px-3 sm:px-6 py-4 sm:py-6 mt-4 md:mt-10 lg:mt-15">
        <div className="w-full max-w-[1200px] mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
                Compliance Documents
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">
                View previously uploaded compliance documents and their analysis results
              </p>
            </div>

            <button
              onClick={() => navigate("/uploads")}
              className="
              h-10 sm:h-11 px-5 sm:px-6 rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white text-xs sm:text-sm font-medium
              shadow-lg hover:scale-[1.03] transition cursor-pointer
              w-full sm:w-auto
            "
            >
              Upload New Complaint DC
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-4 sm:space-y-5">
            {paginatedRows.map((doc: any) => {
              const status =
                STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.UPLOADED;

              return (
                <div
                  key={doc.doc_id}
                  onClick={() =>
                    doc.status === "SUCCESS" &&
                    navigate(`/complianceresult/${doc.doc_id}`)
                  }
                  className="
                  flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-4
                  bg-white/30 border border-white/40 backdrop-blur-md
                  rounded-2xl px-4 sm:px-6 py-4 sm:py-5
                  shadow-sm cursor-pointer transition
                  hover:shadow-md hover:bg-white
                  "
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                      <FileText className="text-white" size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                        {doc.file_name}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Created: {formatDateTime(doc.created_at)}
                        </span>
                        {isUpdatedDifferent(doc.created_at, doc.updated_at) && (
                          <span className="flex items-center gap-1">
                            Updated: {formatDateTime(doc.updated_at)}
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-medium ${doc.status === "SUCCESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`} >
                          <Timer
                            size={14}
                            className={doc.status !== "SUCCESS" ? "animate-pulse" : ""}
                          />
                          {doc.status === "SUCCESS" ? "Processed in" : "Processing for"}{" "}
                          {getProcessingTime(doc.created_at, doc.updated_at, doc.status)}
                        </span>

                        <span className="flex items-center gap-1">
                          <FileCheck size={14} />
                          {doc.clauses} clauses
                        </span>
                        <span
                          className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-medium ${status.badgeClass}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="text-gray-400 self-end sm:self-auto" />
                </div>
              );
            })}

            {/* PAGINATION */}
            <div className="max-w-[1200px] mx-auto mt-8 sm:mt-10 px-2 sm:px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

                {/* LEFT */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-center">
                  <Text size="sm">Showing</Text>

                  <Select
                    value={String(pageSize)}
                    onChange={(v) => {
                      setPageSize(Number(v));
                      setPage(1); // reset to first page
                    }}
                    data={(() => {
                      const sizes: number[] = [];
                      const total = docs.length;
                      const step = 10; // you can adjust step if needed
                      for (let i = step; i <= total + step; i += step) {
                        sizes.push(i);
                      }
                      return sizes.map(String);
                    })()}
                    size="xs"
                    w={70}
                    classNames={{
                      input:
                        "text-sm border-gray-300 hover:border-gray-400 rounded-md shadow-sm focus:border-blue-500",
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
                        "&[dataActive]": {
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
        </div>
      </div>
    </>
  );
}
