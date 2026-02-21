import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { ChevronLeft, Download, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Modal, Select } from "@mantine/core";
import * as XLSX from "xlsx";

type ChatRole = "assistant" | "user";

type ApiImage = {
  file_name: string;
  file_path: string;
  url: string;
};

type ApiChatResponse = {
  conversation_id?: string;
  model_name?: string;
  status?: "SUCCESS" | "ERROR";
  response_text?: string | null;
  references?: ApiChatReference[];
  images?: ApiImage[];   // ✅ ADD THIS
  error?: { code?: string; message?: string; details?: any } | null;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
  references?: string[];
  images?: ApiImage[];   // ✅ ADD THIS
  responseTimeMs?: number;   // ✅ ADD THIS
};

type ApiHistoryItem = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ApiChatReference = {
  document_id?: string | null;
  train_id?: string | null;
  chunk_id?: string | null;
  score?: number | null;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatResponseTime(ms: number) {
  if (ms < 1000) {
    return `${ms} ms`;
  }

  const totalSeconds = Math.floor(ms / 1000);

  if (totalSeconds < 60) {
    return `${(ms / 1000).toFixed(2)} s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}

const getWelcomeMessage = (): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  ts: Date.now(),
  content:
    "Hello! I’m your Daikin Smart Compliance Assistant. I can help you with questions about compliance documents, training materials, and regulatory requirements. How can I assist you today?",
});

export default function SmartAssistant() {

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage()]);
  const [opened, setOpened] = useState(false);
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [_requestStart, setRequestStart] = useState<number | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  // const quickPrompts = useMemo(
  //   () => [
  //     "What are the latest compliance requirements?",
  //     "Explain HVAC safety procedures",
  //     "Show energy efficiency standards",
  //   ],
  //   [],
  // );
  const startNewConversation = () => {
    setConversationStarted(true);   // 👈 ADD THIS
    setConversationId(null);
    setSelectedProduct(null);
    setMessages([getWelcomeMessage()]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);


  const getChatRows = () => {
    return messages
      .filter(m => m.content !== "__typing__")
      .map(m => [
        m.role === "user" ? "User" : "Assistant",
        m.content,
        formatTime(m.ts),
      ]);
  };

  const onClose = () => {
    setOpened(false);
    setStatus("idle");
    setExportType(null);
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const sendMessage = async (text: string) => {
    const requestStartTime = Date.now();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    if (!selectedProduct) {
      setError("Please select a product first.");
      return;
    }
    const start = Date.now();
    setRequestStart(start);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (start) {
        const elapsed = Date.now() - start;
        setLiveSeconds(elapsed);
      }
    }, 100);


    setError(null);
    setIsSending(true);
    const typingId = `typing_${Date.now()}`;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: trimmed,
      ts: Date.now(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: typingId,
        role: "assistant",
        content: "__typing__",
        ts: Date.now(),
      },
    ]);

    setInput("");

    try {
      const updatedMessages = [
        ...messages
          .filter((m) => m.content !== "__typing__")
          .concat(userMsg),
      ];

      const history: ApiHistoryItem[] = updatedMessages
        .filter((m) => m.id !== "welcome" && m.content !== "__typing__")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const resp = await axios.post<ApiChatResponse>(
        ServiceEndpoint.apiBaseUrl + ServiceEndpoint.chat.send,
        {
          type: conversationId ? "EXTENDED" : "NEW",
          query: trimmed,
          conversation_id: conversationId,
          history,
          model_name: "llama3.2:latest",
          // metadata_filters: { product_code: "RXQ-ARYFK" },
          metadata_filters: { product_code: selectedProduct },
          max_tokens: 512,
          temperature: 0.2,
          top_p: 0.9,
        },
        { withCredentials: true },
      );

      const data = resp?.data ?? {};

      if (data?.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }

      const assistantText =
        (typeof data?.response_text === "string" && data.response_text) ||
        (typeof (data as any)?.answer === "string" && (data as any).answer) ||
        "I received your request, but couldn’t parse the response.";
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }


      const responseDuration = Date.now() - requestStartTime;
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: assistantText,
        ts: Date.now(),
        images: data?.images ?? [],   // ✅ ADD THIS
        responseTimeMs: responseDuration,   // ✅ ADD THIS
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        assistantMsg,
      ]);
    } catch {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: `a_err_${Date.now()}`,
          role: "assistant",
          content: "Sorry — I couldn’t reach the assistant service.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };
  const generateChatPDF = () => {
    const doc = new jsPDF("portrait", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Smart Assistant Chat Report", 40, 40);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60);

    autoTable(doc, {
      startY: 80,
      head: [["Role", "Message", "Time"]],
      body: getChatRows(),
      styles: {
        fontSize: 9,
        cellPadding: 6,
        overflow: "linebreak",
        valign: "top",
      },
      headStyles: {
        fillColor: [5, 180, 230], // same blue
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 360 },
        2: { cellWidth: 90 },
      },
    });

    doc.save("Smart-Assistant-Chat.pdf");
  };
  const generateChatExcel = () => {
    const rows = messages
      .filter(m => m.content !== "__typing__")
      .map(m => ({
        Role: m.role === "user" ? "User" : "Assistant",
        Message: m.content,
        Time: formatTime(m.ts),
      }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Chat Report");

    XLSX.writeFile(workbook, "Smart-Assistant-Chat.xlsx");
  };

  const hasValidResponse = messages.some(
    (m) =>
      m.role === "assistant" &&
      m.content !== "__typing__" &&
      m.id !== "welcome"
  );

  const handleExport = (type: "pdf" | "excel") => {
    if (!messages.length) return;

    setExportType(type);
    setStatus("generating");

    setTimeout(() => {
      if (type === "pdf") {
        generateChatPDF();   // 🔥 CHAT PDF
      }

      if (type === "excel") {
        generateChatExcel();
      }
      setStatus("success");
    }, 500);
  };


  return (
    // 🔥 CENTER FIX ONLY HERE
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center px-3 sm:px-6 mt-4 md:mt-13 lg:mt-13">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
              Smart Assistant
            </h1>
            <div className="text-[11px] sm:text-xs text-gray-500">
              Ask questions about compliance and training documents
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:w-auto">

            {conversationStarted && (
              <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">

                {/* Product Select */}
                <Select
                  placeholder="Select Product Code"
                  value={selectedProduct}
                  onChange={(value) => setSelectedProduct(value)}
                  disabled={!conversationStarted || hasValidResponse || isSending}
                  data={[
                    { value: "RXQ-ARYFK", label: "RXQ-ARYFK" },
                  ]}
                  searchable
                  clearable={false}
                  size="sm"
                  radius="md"
                  className="w-full lg:w-56"
                  styles={{
                    input: {
                      cursor:
                        !conversationStarted || hasValidResponse || isSending
                          ? "not-allowed"
                          : "pointer",
                    },
                  }}
                />

                {/* New Conversation */}
                {hasValidResponse && (
                  <button
                    onClick={startNewConversation}
                    disabled={isSending}
                    className="w-full lg:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm shadow-lg transition hover:scale-[1.03] hover:bg-gradient-to-l disabled:cursor-not-allowed" >
                    New Conversation
                  </button>
                )}
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={() => setOpened(true)}
              disabled={isSending || !hasValidResponse}
              className={`w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white text-sm shadow-lg transition 
                ${isSending || !hasValidResponse
                            ? "cursor-not-allowed"
                            : "hover:scale-[1.03] hover:bg-gradient-to-l" }`} >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-white/60">

          {/* Chat messages */}
          <div
            ref={scrollRef}
            className="px-3 sm:px-6 py-4 sm:py-5 h-[50vh] sm:h-[250px] lg:h-[350px] overflow-y-auto"
          >
            <div className="space-y-4">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={
                        isUser
                          ? "max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-md bg-[#05b4e6] text-white px-3 sm:px-4 py-2 sm:py-3 shadow text-sm"
                          : "max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-md bg-white/80 text-gray-800 px-3 sm:px-4 py-2 sm:py-3 shadow text-sm"
                      }
                    >
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {m.content === "__typing__" ? (
                          <div className="flex flex-col gap-2">
                            <TypingDots />
                            <span className="text-[10px] text-gray-400">
                              Processing... {formatResponseTime(liveSeconds)}
                            </span>
                          </div>
                        ) : (
                          m.content
                        )}

                      </div>
                      {m.content !== "__typing__" && (
                        <div className="flex justify-between items-center mt-2 text-[10px]">
                          {m.role === "assistant" && m.responseTimeMs !== undefined && (
                            <div
                              className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-medium ${m.responseTimeMs < 5000
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              Processed in {formatResponseTime(m.responseTimeMs)}
                            </div>
                          )}
                          {/* RIGHT SIDE – Message Clock Time */}
                          <div className={`${isUser ? "text-white/80" : "text-gray-400"}`}>
                            {formatTime(m.ts)}
                          </div>

                        </div>
                      )}

                      {/* ✅ Show Images */}
                      {m.images && m.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {m.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}   // ✅ JUST THIS
                              alt={img.file_name}
                              className="rounded-lg shadow-md max-h-40 object-contain cursor-pointer hover:scale-105 transition"
                            />


                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick buttons */}
          {/* <div className="px-3 sm:px-6 pb-3 sm:pb-4">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  className="text-[11px] sm:text-xs px-3 py-1.5 rounded-full bg-white/70 border border-white/80 text-gray-700 hover:bg-white shadow-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div> */}

          {!conversationStarted ? (
            // 🔹 START BUTTON
            <div className="px-6 pb-6 text-center">
              <button
                onClick={() => setConversationStarted(true)}
                className="px-6 py-3 w-full rounded-full bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] hover:bg-gradient-to-l text-white shadow-lg"
              >
                Start Conversation
              </button>
            </div>
          ) : (
            // 🔹 INPUT SECTION
            <div className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="flex items-center gap-2 bg-white/75 border rounded-2xl px-4 py-3 shadow-sm">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about compliance or training documents..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  disabled={!selectedProduct || isSending}   // 🔥 DISABLED until product selected
                />

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || !selectedProduct}
                  className="h-10 w-10 rounded-full bg-[#05b4e6] text-white flex items-center justify-center disabled:opacity-50"
                >
                  <HiOutlinePaperAirplane />
                </button>
              </div>

              {/* Show helper message if product not selected */}
              {!selectedProduct && (
                <p className="text-xs text-red-500 mt-2">
                  Please select a product code to start chatting.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        radius="xl"
        size="md"
        withCloseButton={false}
        closeOnClickOutside={false}
        overlayProps={{ blur: 4 }}
      >
        <div className="text-center">

          {status !== "success" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800">
                Export Report
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose your preferred format
              </p>
            </>
          )}

          {/* FORMAT SELECTION */}
          {status === "idle" && (
            <div className="grid grid-cols-2 gap-4 mt-6">

              <button
                onClick={() => handleExport("pdf")}
                className="rounded-2xl bg-white p-4 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-pink-500 flex items-center justify-center mb-2">
                  <FileText className="text-white" size={20} />
                </div>
                <p className="font-medium">PDF</p>
                <p className="text-xs text-gray-500">Standard format</p>
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="rounded-2xl bg-white p-4 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-2">
                  <FileText className="text-white" size={20} />
                </div>
                <p className="font-medium">Excel</p>
                <p className="text-xs text-gray-500">Editable format</p>
              </button>

            </div>
          )}

          {/* LOADING */}
          {status === "generating" && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-600">
                Generating {exportType?.toUpperCase()} report...
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">
                Export Successful!
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your PDF report is ready
              </p>

              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 flex items-center gap-1 text-sm text-blue-600"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            </div>
          )}

        </div>
      </Modal>

    </div>
  );
}
