import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
  references?: string[];
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

type ApiChatResponse = {
  conversation_id?: string;
  model_name?: string;
  status?: "SUCCESS" | "ERROR";
  response_text?: string | null;
  references?: ApiChatReference[];
  error?: { code?: string; message?: string; details?: any } | null;
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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

export default function SmartAssistant() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      ts: Date.now(),
      content:
        "Hello! I’m your Daikin Smart Compliance Assistant. I can help you with questions about compliance documents, training materials, and regulatory requirements. How can I assist you today?",
    },
  ]);

  const quickPrompts = useMemo(
    () => [
      "What are the latest compliance requirements?",
      "Explain HVAC safety procedures",
      "Show energy efficiency standards",
    ],
    [],
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);


  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

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
    ]); setInput("");

    try {
      // Build history in the backend format from the messages we already have.
      // Exclude the welcome message to avoid polluting context.
      // Note: `messages` here is the state snapshot before we appended `userMsg`.
      // Include the new user message explicitly so the backend gets the latest turn.
      const history: ApiHistoryItem[] = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
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
          // Optional knobs (backend has defaults if omitted)
          model_name: "llama3.2:latest",
          metadata_filters: {
            product_code: "RXQ-ARYFK",
          },
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

      const references: string[] | undefined = Array.isArray(data?.references)
        ? data.references
          .slice(0, 10)
          .map((r) => {
            const parts: string[] = [];
            if (r?.train_id) parts.push(`train_id: ${r.train_id}`);
            if (r?.chunk_id) parts.push(`chunk_id: ${r.chunk_id}`);
            if (typeof r?.score === "number") parts.push(`score: ${r.score.toFixed(4)}`);
            return parts.length ? parts.join(" • ") : "reference";
          })
        : undefined;

      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: assistantText,
        ts: Date.now(),
        references,
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        assistantMsg,
      ]);

    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to reach the chat service.";
      setError(msg);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: `a_err_${Date.now()}`,
          role: "assistant",
          content: "Sorry — I couldn’t reach the assistant service. Please try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="w-full flex items-start justify-center px-6 mt-5">
      <div className="w-full max-w-6xl">
        <div className="mb-5">
          <h1 className="text-3xl font-semibold text-gray-800">Smart Assistant</h1>
          <div className="text-xs text-gray-500">
            Ask questions about compliance and training documents
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-white/60">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/60">

          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="px-6 py-5 h-[350px] overflow-y-auto"
          >
            <div className="space-y-4">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={
                        isUser
                          ? "max-w-[75%] rounded-2xl rounded-tr-md bg-[#05b4e6] text-white px-4 py-3 shadow"
                          : "max-w-[75%] rounded-2xl rounded-tl-md bg-white/80 text-gray-800 px-4 py-3 shadow"
                      }
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.content === "__typing__" ? <TypingDots /> : m.content}
                      </div>
                      {m.content !== "__typing__" && (
                        <div className={`mt-2 mb-2 text-[10px] ${isUser ? "text-white/80" : "text-gray-400"}`}>
                          {formatTime(m.ts)}
                        </div>)}

                      {!!m.references?.length && (
                        <div className="mt-3">
                          <div className="text-xs font-medium text-gray-600">References</div>
                          <ul className="mt-1 list-disc list-inside text-xs text-gray-600 space-y-1">
                            {m.references.map((r, idx) => (
                              <li key={`${m.id}_ref_${idx}`}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Quick prompts */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/70 border border-white/80 text-gray-700 hover:bg-white shadow-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 bg-white/75 border border-white/80 rounded-2xl px-4 py-3 shadow-sm">
              <input
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
                disabled={isSending}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={isSending || !input.trim()}
                className="h-10 w-10 rounded-xl bg-[#05b4e6] disabled:bg-gray-300 text-white flex items-center justify-center shadow"
                aria-label="Send"
              >
                <HiOutlinePaperAirplane className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
