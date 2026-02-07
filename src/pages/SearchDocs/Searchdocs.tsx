import { useState } from "react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { Loader, Search, X } from "lucide-react";
import { TextInput, Button } from "@mantine/core";

interface SearchResult {
  file_name: string;
  file_path: string;
  line_number: number;
  match_line: string;
  context_before: string;
  context_after: string;
}

const Searchdocs = () => {
  const endpoint =
    ServiceEndpoint.apiBaseUrl + ServiceEndpoint.documentSearch.search;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await axios.post(
        endpoint,
        { keyword: query },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setResults(res.data.results ?? []);
    } catch (error) {
      console.error("Search API error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FULL SCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
          <Loader className="animate-spin" />
        </div>
      )}

      <div className="px-3 sm:px-6 lg:px-8 py-6 mt-6 sm:mt-14">
        <div className="max-w-[1200px] mx-auto w-full">

          {/* PAGE TITLE */}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Search Documents
          </h1>

          {/* SEARCH BAR */}
          <div className="flex justify-center mb-10 mt-4">
            <div className="flex items-center gap-4 w-full max-w-[1200px]">

              {/* SEARCH INPUT CARD */}
              <div
                className="
                  group flex items-center gap-3 flex-1
                  rounded-2xl
                  bg-white/70 backdrop-blur-xl
                  border border-white/40
                  shadow-lg
                  px-5
                  transition-all duration-300
                  hover:shadow-xl hover:-translate-y-[1px]
                  focus-within:ring-4 focus-within:ring-blue-500/30
                "
                style={{ height: 68 }}
              >
                {/* ICON (🔍 or ❌) */}
                <div className="w-6 h-6 flex items-center justify-center">
                  {!query ? (
                    <Search
                      size={22}
                      className="
                        text-gray-400
                        transition-all duration-300
                        group-focus-within:text-blue-600
                        group-focus-within:scale-110
                      "
                    />
                  ) : (
                    <button
                      onClick={handleReset}
                      className="
                        text-gray-400
                        hover:text-red-500
                        transition
                        p-1
                        rounded-full
                        hover:bg-gray-100
                      "
                      aria-label="Clear search"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* INPUT */}
                <TextInput
                  variant="unstyled"
                  placeholder="Search documents, files, keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                  styles={{
                    input: {
                      height: 68,
                      fontSize: 17,
                      fontWeight: 500,
                      color: "#1f2937",
                    },
                  }}
                />
              </div>

              {/* SEARCH BUTTON */}
              <Button
                onClick={handleSearch}
                loading={loading}
                radius="md"
                size="lg"
                disabled={!query.trim()}
                styles={{
                  root: {
                    height: 64,
                    background:
                      "linear-gradient(135deg, #2f80ff, #12c2e9)",
                  },
                }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* RESULTS */}
          {searched && (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 overflow-x-auto">
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Search Results
              </h3>

              {results.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No results found
                </div>
              ) : (
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">File</th>
                      <th className="py-3 px-3">Line</th>
                      <th className="py-3 px-3">Matched</th>
                      <th className="py-3 px-3">Context Before</th>
                      <th className="py-3 px-3">Context After</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-none hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-3 text-gray-500">
                          {index + 1}
                        </td>
                        <td className="py-4 px-3 break-all">
                          {item.file_name}
                        </td>
                        <td className="py-4 px-3 font-medium">
                          {item.line_number}
                        </td>
                        <td className="py-4 px-3">
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700">
                            {item.match_line}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-gray-600">
                          {item.context_before}
                        </td>
                        <td className="py-4 px-3 text-gray-600">
                          {item.context_after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Searchdocs;
