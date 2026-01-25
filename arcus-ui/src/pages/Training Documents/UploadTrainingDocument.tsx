import { useRef, useState } from "react";
import { ChevronLeft, FileText, Upload, X } from "lucide-react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { useNavigate } from "react-router-dom";
import { LiaCheckCircleSolid } from "react-icons/lia";

export default function UploadTrainingDocument() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File[]>([]);
    const [docType, setDocType] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [inputKey, setInputKey] = useState(0);


    const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.trainDocuments.upload;

    // ✅ Browse file
    // const handleBrowse = () => {
    //     fileInputRef.current?.click();
    // };
    const handleBrowse = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // 🔥 force reset
            fileInputRef.current.click();
        }
    };
// const handleBrowse = () => {
//   setInputKey((k) => k + 1); // 🔥 recreate input
// };

    // ✅ File select
    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFile = e.target.files?.[0];
    //     if (!selectedFile) return;

    //     setFile(selectedFile);

    //     // 🔑 allow same file to be selected again
    //     e.target.value = "";
    // };
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // Add new files, avoid duplicates
  setFile((prev) => {
    const newFiles = Array.from(files).filter(
      (f) => !prev.some((p) => p.name === f.name && p.size === f.size)
    );
    return [...prev, ...newFiles];
  });

  e.target.value = ""; // reset input
};

const handleRemoveFile = (index: number) => {
  setFile((prev) => {
    const updated = prev.filter((_, i) => i !== index);
    if (updated.length === 0) setInputKey((k) => k + 1); // reset input
    return updated;
  });
};

    // ✅ Drag & Drop
    // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault();
    //     if (e.dataTransfer.files?.[0]) {
    //         setFile(e.dataTransfer.files[0]);
    //     }
    // };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        setFile((prev) => [...prev, ...Array.from(files)]);
    };



    // ✅ Upload handler
    // const handleProcess = async () => {
    //     if (!file || !docType) return;

    //     const formData = new FormData();
    //     formData.append("files", file);
    //     formData.append("product_code", "TEST123");

    //     try {
    //         setLoading(true);
    //         setProgress(0);

    //         const res = await axios.post(endPoint, formData, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //             onUploadProgress: (e) => {
    //                 if (e.total) {
    //                     setProgress(Math.round((e.loaded * 100) / e.total));
    //                 }
    //             },

    //         });
    //               console.log("Upload success:", res.data);

    //         navigate("/knowledge");
    //     } catch (err) {
    //         console.error("Upload failed", err);
    //         alert("Upload failed. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleProcess = async () => {
        if (!file.length || !docType) return;

        const formData = new FormData();

        file.forEach((file) => {
            formData.append("files", file); // backend must accept array
        });

        formData.append("product_code", "TEST123");

        try {
            setLoading(true);
            setProgress(0);

            const res = await axios.post(endPoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            console.log("Upload success:", res.data);
            navigate("/knowledge");
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

// const handleCancel = () => {
//   setFile([]);
//   setDocType("");

//   if (fileInputRef.current) {
//     fileInputRef.current.value = ""; // 🔥 critical
//   }
// };
const handleCancel = () => {
  setFile([]);
  setDocType("");
  setInputKey((k) => k + 1); // recreate input
};


    const documentTypes = [
        {
            title: "Manual",
            desc: "Technical manuals and handbooks",
        },
        {
            title: "SOP",
            desc: "Standard operating procedures",
        },
        {
            title: "Policy",
            desc: "Company policies and guidelines",
        },
        {
            title: "Specification",
            desc: "Product specifications",
        },
        {
            title: "Standard",
            desc: "Industry standards",
        },
    ];

    return (
        <div className="min-h-screen 
                  rounded-2xl flex items-center justify-center p-6">
            <div className="w-full max-w-[1100px]">

                {/* Title */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Upload Training Document
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Add documents to enhance AI knowledge base
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-sm text-blue-600" onClick={() => navigate("/knowledge")}>
                            <ChevronLeft size={16} />
                            Back
                        </button>
                    </div>
                </div>

                {/* Document Type */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-sm font-medium text-gray-700 mb-6">
                        Select Document Type
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {documentTypes.map((type) => {
                            const active = docType === type.title;

                            return (
                                <div
                                    key={type.title}
                                    onClick={() => setDocType(type.title)}
                                    className={`cursor-pointer rounded-xl border px-5 py-4 transition-all ${active ? "border-[#2f80ff] bg-[#e9f6ff] shadow-sm" : "border-gray-200 bg-white hover:border-blue-300"
                                        }`} >
                                    <p className="text-sm font-semibold text-gray-800">
                                        {type.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {type.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upload Box */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-10">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        // className="relative rounded-xl border border-dashed border-[#7dd3fc]bg-[#f3fbff] px-6 py-14 text-center"
                        className="relative rounded-xl border border-dashed border-[#7dd3fc] bg-[#f3fbff] px-6 py-14 text-center"


                    >
                        <Upload className="mx-auto text-gray-600 mb-4" size={36} />

                        <p className="text-sm font-medium text-gray-700">
                            Drag & drop files here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            or click to browse
                        </p>

                        <button
                            onClick={handleBrowse}
                            className="mt-4 px-5 py-2 text-sm rounded-md bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white"
                            type="button"  >
                            Browse Files
                        </button>

                        <input
                            ref={fileInputRef}
                              key={inputKey}
                            type="file"
                            hidden
                            multiple
                            accept=".pdf,.doc,.docx,.xlsx,.csv"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* AFTER FILE SELECTED */}
                    {file.map((file, _index) => (
                        <div key={`${file.name}-${_index}`} className="mt-5 flex items-center justify-between rounded-lg
                    bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="text-blue-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            {/* <button
                                onClick={() => {
                                    setFile(null);
                                    setDocType("");

                                    // 🔑 RESET the file input
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }} className="text-gray-400 hover:text-red-500 text-lg"
                            >
                                <X className="text-red-500 hover:scale-110 transition" size={18} />
                            </button> */}
                            <button
                                aria-label="Remove file"
                              onClick={() => handleRemoveFile(_index)} className="cursor-pointer"
                            >
                                <X className="text-red-500 hover:scale-110 transition" size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        className="px-6 py-2 rounded-lg text-sm bg-white text-gray-600 shadow-sm"
                          onClick={handleCancel}  >
                        Cancel
                    </button>

                    <button
                        onClick={handleProcess}
                        disabled={!file.length || !docType || loading}
                        className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2
    ${file.length && docType && !loading
                                ? "bg-[#2f80ff] text-white hover:bg-blue-700 shadow-md"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >

                        <span className="w-5 h-5 flex items-center justify-center">
                            <LiaCheckCircleSolid size={18} />
                        </span> Upload Documents
                    </button>
                </div>

            </div>
        </div>
    );
}
