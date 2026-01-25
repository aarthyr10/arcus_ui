import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronLeft, Loader } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

type ResultRow = {
  id: number;
  file_name: string;
  clause: string;
  response: string;
  score: number;
};

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

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
        const res = await axios.get(endpoint, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const fileName = res.data?.file_name ?? "Unknown File";
        const chunks = res.data?.data?.chunks ?? [];
        const mappedRows: ResultRow[] = chunks.map(
          (chunk: any, index: number) => ({
            id: index + 1,
            file_name: fileName,
            clause: chunk.text,
            response: "-",
            score: 0,
          })
        );

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

  // const handleEdit = (id: number) => {
  //   console.log("Edit row:", id);
  //   navigate(`/compliance/edit/${docId}/${id}`);
  // };
  // const handleDelete = (id: number) => {
  //   console.log("Delete row:", id);
  // };

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

            {/* <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm">
              <Download size={14} />
              Export Report
            </button> */}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 ">
                <th className="py-3 px-2 w-[60px]">S.No</th>
                <th className="py-3 px-2 w-[500px]">Chunk</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-4 px-2">{row.id}</td>
                  <td className="py-4 px-2">{row.clause}</td>
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