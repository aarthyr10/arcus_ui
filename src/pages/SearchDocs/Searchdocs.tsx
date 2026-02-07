import React, { useState } from "react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { Loader, Search } from "lucide-react";
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
      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30">
          <Loader className="animate-spin" />
        </div>
      )}
      <div className="z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 mt-4 sm:mt-14">
        {/* <div className="px-6 py-10 max-w-7xl mx-auto"> */}
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Search Documents
        </h1>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-8">
          {/* SEARCH BAR */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-3 w-full max-w-[720px]">
              <TextInput
                placeholder="Type keyword to search documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                leftSection={<Search size={18} />}
                size="lg"                 // 🔥 increases height
                radius="xl"
                className="flex-1"
                styles={{
                  input: {
                    height: 76,           // 🔥 custom height
                    fontSize: 16,
                  },
                }}
              />

              <Button
                size="lg"                 // 🔥 matches input height
                radius="xl"
                onClick={handleSearch}
                loading={loading}
                className="px-6"
              >
                Search
              </Button>
            </div>
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
      </>
      );
};

      export default Searchdocs;
