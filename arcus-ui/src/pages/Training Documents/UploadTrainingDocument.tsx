import { useRef, useState } from "react";
import { ChevronLeft, FileText, Upload, X } from "lucide-react";
// import axios from "axios";
// import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { useNavigate } from "react-router-dom";
import { LiaCheckCircleSolid } from "react-icons/lia";

export default function UploadTrainingDocument() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState<string>("");
    const [loading, _setLoading] = useState(false);
    const [_progress, _setProgress] = useState(0);

    // const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.trainDocuments.upload;

    // ✅ Browse file
    const handleBrowse = () => {
        fileInputRef.current?.click();
    };

    // ✅ File select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // 🔑 allow same file to be selected again
        e.target.value = "";
    };

    // ✅ Drag & Drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            setFile(e.dataTransfer.files[0]);
        }
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
    //         navigate("/knowledge");
    //     } catch (err) {
    //         console.error("Upload failed", err);
    //         alert("Upload failed. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
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
        <div className="min-h-screen bg-white/30 border border-white/40  backdrop-blur-md
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
                        className="relative rounded-xl border border-dashed border-[#7dd3fc]bg-[#f3fbff] px-6 py-14 text-center">
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
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* AFTER FILE SELECTED */}
                    {file && (
                        <div className="mt-5 flex items-center justify-between rounded-lg
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
                                onClick={() => {
                                    setFile(null);
                                    // setDocType("");
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                        // navigate(-1)
                                    }
                                }} className="cursor-pointer"
                            >
                                <X className="text-red-500 hover:scale-110 transition" size={18} />
                            </button>
                        </div>
                    )}
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        className="px-6 py-2 rounded-lg text-sm bg-white text-gray-600 shadow-sm"
                        onClick={() => { setDocType(""); }} >
                        Cancel
                    </button>

                    <button
                        // onClick={handleProcess}
                        disabled={!file || !docType || loading}
                        className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2
      ${file && docType
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
