import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import axios from "axios";
import { ChevronDown, ChevronLeft, Eye, Loader2, X } from "lucide-react";
import { Pagination, Select, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
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

const GRADIENT_COLORS = {
  blue: "#2f80ff",      // 0% Deep Blue
  sky: "#4aa3f7",       // ~25% Sky Blue
  azure: "#6fbfe8",     // ~50% Soft Azure
  lightCyan: "#3fd0e8", // ~75% Light Cyan
  cyan: "#12c2e9",      // 100% Cyan
};
const GRADIENTS = {
  root: `
    linear-gradient(
      90deg,
      ${GRADIENT_COLORS.blue},
      ${GRADIENT_COLORS.sky},
      ${GRADIENT_COLORS.azure},
      ${GRADIENT_COLORS.lightCyan},
      ${GRADIENT_COLORS.cyan}
    )
  `,

  level1: `
    linear-gradient(
      90deg,
      #e6f4ff,
      #dff3fb,
      #eaf9ff
    )
  `,
  level2: `
    linear-gradient(
      90deg,
      #f7fbff,
      #ffffff
    )
  `,
};

const BORDERS = {
  root: "#2f80ff",
  level1: "#90cdf4",
  level2: "#cfe9ff",
  default: "#e5e7eb",
};
const BRANCH_COLORS = [
  GRADIENT_COLORS.blue,
  GRADIENT_COLORS.sky,
  GRADIENT_COLORS.azure,
  GRADIENT_COLORS.lightCyan,
  GRADIENT_COLORS.cyan,
];

const lighten = (hex: string, percent = 70) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
};

const makeGradient = (color: string) =>
  `linear-gradient(90deg, ${color}, ${lighten(color, 40)})`;

export function buildMindmapGraph(
  mindmap: any
): { nodes: Node[]; edges: Edge[] } {
  if (!mindmap) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const X_GAP = 460;
  const Y_GAP = 520;
  let currentY = 0;

  /* ---------------- Utils ---------------- */

  const usedIds = new Set<string>();
  const makeId = (base = "node") => {
    let id = base.toString().replace(/\s+/g, "-");
    let i = 1;
    while (usedIds.has(id)) id = `${base}-${i++}`;
    usedIds.add(id);
    return id;
  };

  const safe = (v: any): string => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean")
      return String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  };

  /* ---------------- CHILD EXTRACTION (KEY FIX) ---------------- */

  const extractChildren = (node: any): any[] => {
    if (!node || typeof node !== "object") return [];

    // 1️⃣ Explicit known keys
    if (Array.isArray(node.children)) return node.children;
    if (Array.isArray(node.items))
      return node.items.map((i: any) => ({
        title: i.key,
        ...i,
      }));
    if (Array.isArray(node.nodes)) return node.nodes;

    // 2️⃣ ANY array fallback
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === "object" ? v : { value: v }
        );
      }
    }

    return [];
  };

  /* ---------------- Label ---------------- */

  const getLabel = (node: any) => (
    <div className="space-y-1 text-xs">
      {node.title && (
        <div className="font-semibold text-slate-800">
          {safe(node.title)}
        </div>
      )}
      {node.value && (
        <div className="text-slate-600 whitespace-pre-wrap">
          {safe(node.value)}
        </div>
      )}
      {node.source && (
        <div className="text-[10px] text-slate-400">
          Source: {node.source}
        </div>
      )}
    </div>
  );

  /* ---------------- Style ---------------- */

  const getStyle = (
    depth: number,
    branchColor?: string
  ): CSSProperties => {
    // ROOT
    if (depth === 0) {
      return {
        background: GRADIENTS.root,
        color: "#fff",
        borderRadius: 18,
        padding: 16,
        width: 380,
        border: `1px solid ${BORDERS.root}`,
      };
    }

    // LEVEL 1 – colorful branches
    if (depth === 1 && branchColor) {
      return {
        background: makeGradient(branchColor),
        border: `1px solid ${branchColor}`,
        borderRadius: 16,
        padding: 14,
        width: 340,
        color: "#0f172a",
      };
    }

    // LEVEL 2+ – soft tint of branch
    if (branchColor) {
      return {
        background: lighten(branchColor, 90),
        border: `1px solid ${lighten(branchColor, 40)}`,
        borderRadius: 14,
        padding: 12,
        width: 420,
      };
    }

    return {
      background: GRADIENTS.level2,
      border: `1px solid ${BORDERS.default}`,
      borderRadius: 14,
      padding: 12,
      width: 420,
    };
  };

  /* ---------------- Traverse ---------------- */

  const traverse = (
    node: any,
    depth: number,
    parentId?: string,
    branchColor?: string
  ): number => {
    const id = makeId(
      node.id || node.title || node.key || `node-${depth}`
    );

    const children = extractChildren(node);

    // assign color at first level
    const currentBranchColor =
      depth === 1
        ? BRANCH_COLORS[nodes.length % BRANCH_COLORS.length]
        : branchColor;

    // 🌿 Leaf
    if (!children.length) {
      const y = currentY;
      currentY += Y_GAP;

      nodes.push({
        id,
        position: { x: depth * X_GAP, y },
        data: { label: getLabel(node) },
        style: getStyle(depth, currentBranchColor),
      });

      if (parentId) {
        edges.push({
        id: makeId(`e-${parentId}-${id}`),
        source: parentId,
        target: id,
        type: "bezier", // 🔥 KEY CHANGE
        style: {
          stroke: currentBranchColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: currentBranchColor,
        },
      });

      }
      return y;
    }

    // 🌳 Parent
    const childYs = children.map((c) =>
      traverse(c, depth + 1, id, currentBranchColor)
    );

    const centerY =
      childYs.reduce((a, b) => a + b, 0) / childYs.length;

    nodes.push({
        id,
        position: { x: depth * X_GAP, y:centerY },
        data: { label: getLabel(node) },
        style: getStyle(depth, currentBranchColor),
      });

    if (parentId) {
       edges.push({
        id: makeId(`e-${parentId}-${id}`),
        source: parentId,
        target: id,
        type: "bezier", // 🔥 KEY CHANGE
        style: {
          stroke: currentBranchColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: currentBranchColor,
        },
      });
          }

    return centerY;
  };

  /* ---------------- ROOT NORMALIZATION (🔥 THIS FIXES YOUR JSON) ---------------- */

  const root = {
    ...(mindmap.root ?? {}),
    children:
      mindmap.root?.children ??
      mindmap.nodes ??
      [],
  };

  traverse(root, 0);
  // 🔥 normalize Y positions (critical)
  const minY = Math.min(...nodes.map(n => n.position.y));
  nodes.forEach(n => {
    n.position.y -= minY;
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
  const shouldFitView = rfNodes.length <= 6;
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [lightbox, setLightbox] = useState<{ open: boolean; src?: string; info?: string; }>({ open: false, src: undefined, info: undefined });


  useEffect(() => {
    if (!docId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const endpoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.trainDocuments.getById(docId);
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
        const extracted = res.data?.data?.extracted_json;
        setRows(mappedRows);
        setMindmap(res.data?.data?.mindmap_json);
        setExtractedText(extracted ? JSON.stringify(extracted, null, 2) : "");
        setImages(res.data?.data?.image_assets ?? res.data.image_assets ?? []);
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
  const mindmapHeight = useMemo(() => {
    if (!rfNodes.length) return 260;

    let minY = Infinity;
    let maxY = -Infinity;

    rfNodes.forEach((node) => {
      const estimatedHeight =
        node.style?.width === 380 ? 140 :
          node.style?.width === 340 ? 120 :
            110;

      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + estimatedHeight);
    });

    const height = maxY - minY + 32;

    // 🔥 key line
    return rfNodes.length <= 6 ? height : Math.max(height, 260);
  }, [rfNodes]);

  const mindmapGraph = useMemo(() => {
    const graph = buildMindmapGraph(mindmap);
    return graph;
  }, [mindmap]);

  const downloadImage = async (url: string, filename?: string) => {
    try {
      const res = await axios.get(url, {
        responseType: "blob",
        headers: { "ngrok-skip-browser-warning": "true" },
      });

      const blob = res.data;
      const ext = blob.type.split("/")[1] || "jpg";

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || `image.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.error("Failed to download image:", err);
      alert(err.message);
    }
  };
  useEffect(() => {
    const fetchImages = async () => {
      const urls: { [key: string]: string } = {};

      for (const img of images) {
        try {
          const imageUrl =
            ServiceEndpoint.apiBaseUrl +
            ServiceEndpoint.trainDocumentsimage.getById(img.image_id);

          const res = await axios.get(imageUrl, {
            responseType: "blob",
            headers: { "ngrok-skip-browser-warning": "true" },
          });

          urls[img.image_id] = URL.createObjectURL(res.data);
        } catch (err) {
          console.error("Failed to fetch image:", img.image_id, err);
        }
      }

      setImageUrls(urls);

      return () => {
        Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
      };
    };

    if (images.length) fetchImages();
  }, [images]);



  useEffect(() => {
    const graph = buildMindmapGraph(mindmap);
    if (graph) {
      setRfNodes(graph.nodes);
      setRfEdges(graph.edges);
    }
  }, [mindmap]);

 if (loading) {
   return (
     <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
       <Loader2 className="animate-spin text-blue-500" size={50} />
     </div>
   );
 }
  return (
     <div className="z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mt-3 md:mt-8 lg:mt-8">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex sm:flex-row sm:items-center sm:justify-between mb-6 gap-10 sm:gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Training Documents            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review AI-generated compliance responses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button"
              className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer"
              onClick={() => navigate("/knowledge")}
            >
              <ChevronLeft size={20} />
              Back
            </button>
          </div>
        </div>
       <div className="flex flex-wrap gap-2 border-b pb-3 mb-6 overflow-x-auto">
          {[
            mindmapGraph.nodes.length > 0 && { k: "mindmap", l: "Mindmap" },
            extractedText.length > 0 && { k: "extracted", l: "Extracted JSON" },
            { k: "table", l: "ID & Chunks" },
            images.length > 0 && { k: "images", l: "Images" },
          ]
            .filter(Boolean)
            .map((t: any) => (
              <button type="button"
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
         <div className="mb-6 sm:mb-8">
            {/* HEADER */}
            <div
              className="
        flex items-center justify-between
        bg-white/30 border border-white/40 backdrop-blur-md
        rounded-2xl 
        px-4 sm:px-6 
        py-4 sm:py-5 
        shadow-sm
        hover:shadow-md hover:bg-white transition
      "
              onClick={() => setShowMindmap((prev) => !prev)} >
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                Show Mindmap
              </span>

              <button type="button"
                onClick={() => setShowMindmap((prev) => !prev)}
                className={`w-8 h-8 sm:w-9 sm:h-9
          flex items-center justify-center
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
            {showMindmap &&
              (mindmapGraph.nodes.length > 0 ? (
                <div className="
            bg-white/70 backdrop-blur-xl 
            rounded-2xl shadow-lg 
            p-3 sm:p-6 lg:p-10 
            mt-4 
            overflow-hidden
          "
        >
                  <div
            style={{
              width: "100%",
              height: mindmapHeight,
              overflow: "auto",
            }}
            className="
              rounded-xl
            "
          >
                    <ReactFlow
                      nodes={rfNodes}
                      edges={rfEdges}
                      fitView={shouldFitView}
                      fitViewOptions={{
                        padding: 0.2,
                      }}
                      defaultEdgeOptions={{
    type: "bezier",
    style: {
      strokeWidth: 2,
    },
  }}
                      zoomOnScroll={!shouldFitView}
                      panOnScroll={!shouldFitView}
                      minZoom={0.4}
                      maxZoom={1.2}
                    >
                      <Background gap={22} color="#e5e7eb" />
                      <Controls />
                    </ReactFlow>
                  </div>
                </div>
              ) : (
                <NoData label="Mindmap" />
              ))}
          </div>
        )}
{activeTab === "images" && (
  images.length > 0 ? (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-10 mb-8">
      <Text fw={600} size="md" mb="sm">
        Document Pages
      </Text>

     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {images.map((img) => (
    <div
      key={img.image_id}
      className="
        group relative
        flex flex-col
        h-[420px]
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm
        hover:shadow-lg
        transition
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
        {imageUrls[img.image_id] ? (
          <img
            src={imageUrls[img.image_id]}
            alt={`Page ${img.page_no}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading...
          </div>
        )}

        {/* VIEW OVERLAY */}
        {imageUrls[img.image_id] && (
          <button
            type="button"
            title="View image"
            onClick={() =>
              setLightbox({
                open: true,
                src: imageUrls[img.image_id],
                info: `Page: ${img.page_no} | ${img.file_name}`,
              })
            }
            className="
              absolute inset-0
              flex items-center justify-center
              gap-2
              bg-black/40
              text-white
              opacity-0
              group-hover:opacity-100
              transition
            "
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        )}
      </div>

      {/* INFO */}
      <div className="flex-1 p-3 text-sm text-gray-700">
        <p className="font-medium mb-1">Page: {img.page_no}</p>
        <p className="line-clamp-2 text-gray-600">
          {img.file_name}
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="p-3 pt-0">
        <button
          type="button"
          title="Download image"
          onClick={() =>
            downloadImage(imageUrls[img.image_id], img.file_name)
          }
          className="
            w-full py-2
            text-sm
            rounded-md
            text-white
            bg-gradient-to-br from-[#2f80ff] to-[#12c2e9]
            hover:opacity-90
            transition
          "
        >
          Download
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Fullscreen Lightbox Popup */}
      {lightbox.open && lightbox.src && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2"
          onClick={() => setLightbox({ open: false })}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <img
              src={lightbox.src}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />

            {lightbox.info && (
              <div className="absolute bottom-20 text-white text-sm bg-black/50 px-4 py-2 rounded-md">
                {lightbox.info}
              </div>
            )}

            {/* X mark close button with background */}
            <button type="button" title="close image"
              className="absolute top-5 right-5 text-white bg-black/70 p-2 rounded-full hover:bg-black/90 transition"
              onClick={() => setLightbox({ open: false })}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
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
                <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto">
                  {extractedText}
                </pre>
              </div>
            ) : (
              <NoData label="Extracted Text" />
            )
          )}
        </div>
        {/* TABLE */}
        {activeTab === "table" && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-3 sm:p-6 overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-3 px-2 w-[60px]">S.No</th>
                  <th className="py-3 px-2 ">Chunk</th>
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
        <div className="max-w-[1200px] mx-auto mt-6 sm:mt-10 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-center sm:text-left">
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