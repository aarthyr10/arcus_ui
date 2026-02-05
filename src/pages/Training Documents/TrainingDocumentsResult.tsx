import { useEffect, useMemo, useState } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronDown, ChevronLeft, Loader } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import type { Node, Edge } from "reactflow";

type ResultRow = {
  id: number;
  file_name: string;
  clause: string;
  response: string;
  score: number;
};

type ActiveTab = "mindmap" | "extracted" | "images" | "table";

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

function NoData({ label }: { label: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-10 mb-8 text-center text-gray-500">
      No {label} available
    </div>
  );
}

function buildMindmapGraph(mindmap: any): { nodes: Node[]; edges: Edge[] } {
  if (!mindmap) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const X_GAP = 300;
  const Y_GAP = 70;

  /* ---------------- ROOT ---------------- */
  const rootId = "root";
  nodes.push({
    id: rootId,
    position: { x: 0, y: 0 },
    data: {
      label: (
        <div className="font-semibold text-sm text-white">
          {mindmap.root.title}
          <div className="text-xs opacity-80">
            {mindmap.root.product_code}
          </div>
        </div>
      ),
    },
    style: {
      background: "#2563eb",
      padding: 12,
      borderRadius: 12,
    },
  });

  /* ---------------- SECTIONS ---------------- */
  mindmap.nodes.forEach((section: any, sIndex: number) => {
    const sectionId = `section-${sIndex}`;

    nodes.push({
      id: sectionId,
      position: { x: X_GAP, y: sIndex * 350 },
      data: { label: <strong>{section.title}</strong> },
      style: {
        background: "#e0f2fe",
        padding: 10,
        borderRadius: 10,
      },
    });

    edges.push({
      id: `edge-root-${sectionId}`,
      source: rootId,
      target: sectionId,
    });

    /* ---------- KEY VALUE SPECS ---------- */
    const kv = section.items?.key_value_specs ?? [];

    kv.forEach((item: any, i: number) => {
      const id = `${sectionId}-kv-${i}`;

      nodes.push({
        id,
        position: {
          x: X_GAP * 2,
          y: sIndex * 350 + i * Y_GAP,
        },
        data: {
          label: (
            <div className="text-xs">
              <strong>{item.key}</strong>
              <div className="text-gray-600">{item.value}</div>
            </div>
          ),
        },
        style: {
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 8,
          width: 240,
        },
      });

      edges.push({
        id: `edge-${sectionId}-${id}`,
        source: sectionId,
        target: id,
      });
    });

    /* ---------- NUMERIC VALUES ---------- */
    const nums = section.items?.numeric_values_with_units ?? [];

    nums.forEach((val: string, i: number) => {
      const id = `${sectionId}-num-${i}`;

      nodes.push({
        id,
        position: {
          x: X_GAP * 3,
          y: sIndex * 350 + i * Y_GAP,
        },
        data: {
          label: <span className="text-xs font-medium">{val}</span>,
        },
        style: {
          background: "#fef3c7",
          borderRadius: 8,
          padding: 6,
        },
      });

      edges.push({
        id: `edge-${sectionId}-${id}`,
        source: sectionId,
        target: id,
      });
    });
  });

  return { nodes, edges };
}


export default function TrainingDocumentsResult() {
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mindmap, setMindmap] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [rfNodes, setRfNodes] = useState<Node[]>([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);
  const [extractedText, setExtractedText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("table");
  const [showMindmap, setShowMindmap] = useState(false);


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
        setMindmap(res.data?.data?.mindmap_json);
        setExtractedText(
          res.data?.data?.extracted_json?.raw_text
          // ?? res.data?.data?.extracted_data
          ?? ""
        );
        setImages(res.data?.image_assets ?? []);
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

  const mindmapGraph = useMemo(() => {
    const graph = buildMindmapGraph(mindmap);
    return graph;
  }, [mindmap]);

  const getImageUrl = (path: string) => {
    return (
      ServiceEndpoint.apiBaseUrl.replace("/api/v1", "") +
      path.replace("/app", "")
    );
  };
  useEffect(() => {
    const graph = buildMindmapGraph(mindmap);
    if (graph) {
      setRfNodes(graph.nodes);
      setRfEdges(graph.edges);
    }
  }, [mindmap]);

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
              <ChevronLeft size={20} />
              Back
            </button>
          </div>
        </div>
        <div className="flex gap-2 border-b pb-3 mb-6">
          {[
            mindmapGraph.nodes.length > 0 && { k: "mindmap", l: "Mindmap" },
            extractedText?.trim().length > 0 && { k: "extracted", l: "Extracted JSON" },
            { k: "table", l: "ID & Chunks" },
            images.length > 0 && { k: "images", l: "Images" },
          ]
            .filter(Boolean)
            .map((t: any) => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${activeTab === t.k
                  ? "bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {t.l}
              </button>
            ))}
        </div>

        {activeTab === "mindmap" && mindmapGraph && (
          <div className="mb-8">
            {/* HEADER */}
            <div
              className="flex items-center justify-between
                 bg-white/30 border border-white/40 backdrop-blur-md
                 rounded-2xl px-6 py-5 shadow-sm
                 hover:shadow-md hover:bg-white transition"
              onClick={() => setShowMindmap((prev) => !prev)} >
              <span className="text-sm font-semibold text-gray-800">
                Show Mindmap
              </span>

              <button
                onClick={() => setShowMindmap((prev) => !prev)}
                className={`w-9 h-9 flex items-center justify-center
              rounded-full transition
              ${showMindmap
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                aria-label="Toggle mindmap"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${showMindmap ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

            </div>

            {/* CONTENT */}
            {showMindmap && (
              mindmapGraph.nodes.length > 0 ? (
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-10 mt-4 overflow-visible">
                  <div style={{ width: "100%", height: "4000px" }}>
                    <ReactFlow nodes={rfNodes} edges={rfEdges} fitView>
                      <Background />
                      <Controls />
                    </ReactFlow>
                  </div>
                </div>
              ) : (
                <NoData label="Mindmap" />
              )
            )}
          </div>
        )}

        {activeTab === "images" && (
          images.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8">
              <Text fw={600} size="md" mb="sm">
                Document Pages
              </Text>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <img
                      src={getImageUrl(img.path)}
                      alt={`Page ${img.page_number}`}
                      className="w-full h-auto object-contain bg-gray-50"
                      loading="lazy"
                    />

                    <div className="text-xs text-gray-500 text-center py-2">
                      Page {img.page_number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <NoData label="Images" />
          )
        )}
        <div className="">
          {activeTab === "extracted" && extractedText && (
            extractedText.length > 0 ? (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-md font-semibold mb-3">Extracted Text</h3>
                <div className="whitespace-pre-line">{extractedText}</div>
              </div>
            ) : (
              <NoData label="Extracted Text" />
            )
          )}
        </div>
        {/* TABLE */}
        {activeTab === "table" && (
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
        )}
      </div>

      {/* PAGINATION */}
      {activeTab === "table" && (
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
                data={(() => {
                  const step = 10;
                  const sizes: number[] = [];
                  const maxSize = Math.ceil(totalResults / step) * step;
                  for (let i = step; i <= maxSize; i += step) {
                    sizes.push(i);
                  }
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
      )}
    </div>
  );
}