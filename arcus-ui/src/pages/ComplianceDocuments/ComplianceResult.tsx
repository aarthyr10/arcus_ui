import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronLeft, Download, Loader, Pencil, Trash2 } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
type ResultRow = {
  id: number;
  clause: string;
  response: string;
  score: number;
};
// type Props = {
//   docId: string;
// };

const getScoreFromAnswer = (answer: string) => {
  if (answer?.toLowerCase() === "compliant") return 95;
  if (answer?.toLowerCase() === "partial") return 70;
  return 40;
};

const getColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

export default function ComplianceResults() {
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ FIX: view state added
  // const [view, setView] = useState<"table" | "cards">("table");


  useEffect(() => {
    if (!docId) return; // ⛔ hard guard

    const fetchResults = async () => {
      try {
        setLoading(true);

        const endpoint =
          ServiceEndpoint.apiBaseUrl +
          ServiceEndpoint.uploadedDocuments.getById(docId);

        const res = await axios.get(endpoint, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

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

    fetchResults();
  }, [docId]);

  const handleEdit = (id: number) => {
    navigate(`/compliance/edit/${docId}/${id}`);
  };

  // const handleDelete = () => {
  // };

  const pages = useMemo(() => {
    return chunk(rows, pageSize);
  }, [rows, pageSize]);

  const paginatedRows = pages[page - 1] ?? [];

  const totalResults = rows.length;
  const totalPages = pages.length;

  const startIndex =
    totalResults === 0 ? 0 : (page - 1) * pageSize + 1;

  const endIndex = Math.min(page * pageSize, totalResults);

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
              Compliance Results
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review AI-generated compliance responses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm text-blue-600" onClick={() => navigate("/compliance")}>
              <ChevronLeft size={16} />
              Back
            </button>

            {/* TOGGLE */}
            {/* <div className="flex p-1">
              <button
                onClick={() => setView("table")}
                className={`px-4 py-1 rounded-md text-sm ${view === "table"
                  ? "bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white"
                  : "text-gray-500"
                  }`}
              >
                Table
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-4 py-1 rounded-md text-sm ${view === "cards"
                  ? "bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white"
                  : "text-gray-500"
                  }`}
              >
                Cards
              </button>
            </div> */}

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm">
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        {/* {view === "table" && ( */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 ">
                  <th className="py-3 px-2 w-[60px]">S.No</th>
                  <th className="py-3 px-2 w-[500px]">Compliance Clause</th>
                  <th className="py-3 px-5">AI Response</th>
                  <th className="py-3 px-2 w-[180px]">Confidence</th>
                  <th className="py-3 px-2 w-[120px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row: any) => (
                  <tr key={row.id}>
                    <td className="py-4 px-2">{row.id}</td>
                    <td className="py-4 px-2">{row.clause}</td>
                    <td className="py-4 px-5">{row.response}</td>
                    {/* <td className="py-4 px-2">
                      <span className={`getColor(row.score).split(" ")[1] gap-2`}>
                        {row.score}%
                      </span>
                    </td> */}
                    <td className="py-4 px-2">
  <div className="flex items-center gap-2">
    {/* Percentage text */}
    <span className="text-sm font-medium text-green-600">
      {row.score}%
    </span>

    {/* Progress bar container */}
    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${getColor(row.score)}`}
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
                          // onClick={() => handleDelete(row.id)}
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* )} */}

        {/* CARD VIEW */}
        {/* {view === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedRows.map((row: any) => (
              <div key={row.id} className="bg-white/70 rounded-2xl p-5 shadow">
                <h3 className="font-semibold">{row.clause}</h3>
                <p className="text-sm mt-2">{row.response}</p>
              </div>
            ))}
          </div>
        )} */}
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
  );
}
