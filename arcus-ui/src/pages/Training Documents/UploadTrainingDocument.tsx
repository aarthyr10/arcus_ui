import { useRef, useState } from "react";
import {
    Group,
    Text,
    Progress,
    Loader
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { ChevronLeft, FileText, X } from "lucide-react";
import { Upload, XCircle } from "lucide-react";
import axios from "axios";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { useNavigate } from "react-router-dom";
import { LiaCheckCircleSolid } from "react-icons/lia";

export default function UploadTrainingDocument() {
    const navigate = useNavigate();
    const openRef = useRef<() => void>(null);

    const [files, setFiles] = useState<File[]>([]);
    const [docType, setDocType] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const canUpload = files.length > 0 && !!docType && !loading;

    const endPoint =
        ServiceEndpoint.apiBaseUrl +
        ServiceEndpoint.trainDocuments.upload;

    const documentTypes = [
        { title: "Manual", desc: "Technical manuals and handbooks" },
        { title: "SOP", desc: "Standard operating procedures" },
        { title: "Policy", desc: "Company policies and guidelines" },
        { title: "Specification", desc: "Product specifications" },
        { title: "Standard", desc: "Industry standards" },
    ];

    const handleUpload = async () => {
        if (!docType) {
            alert("Please select a document type");
            return;
        }

        if (!files.length) {
            alert("Please select at least one file");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("product_code", "TEST123");

        try {
            setLoading(true);
            setProgress(0);

            await axios.post(endPoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            navigate("/knowledge");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-[1100px]">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Upload Training Document
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Add documents to enhance AI knowledge base
                        </p>
                    </div>

                    <button
                        disabled={loading}
                        className={`flex items-center gap-1 text-sm
    ${loading
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-600"
                            }`}
                        onClick={() => !loading && navigate("/knowledge")}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>

                </div>

                {/* DOCUMENT TYPE */}
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
                                    className={`cursor-pointer rounded-xl border px-5 py-4 transition-all
                    ${active
                                            ? "border-[#2f80ff] bg-[#e9f6ff]"
                                            : "border-gray-200 bg-white hover:border-blue-300"
                                        }`}
                                >
                                    <p className="text-sm font-semibold">{type.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DROPZONE */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-10">
                    <Dropzone
                        openRef={openRef}
                        multiple
                        disabled={loading}
                        accept={[
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            "application/vnd.ms-excel",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                            "text/csv",
                        ]}
                        onDrop={(acceptedFiles) => {
                            setFiles((prev) => {
                                const unique = acceptedFiles.filter(
                                    (f) => !prev.some((p) => p.name === f.name && p.size === f.size)
                                );
                                return [...prev, ...unique];
                            });
                        }}
                        className="border-dashed border-[#7dd3fc] bg-[#f3fbff] px-6 py-14 text-center"
                    >
                        <Group justify="center" style={{ pointerEvents: "none" }}>
                            <Dropzone.Accept>
                                <Upload size={40} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <XCircle size={40} color="red" />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Upload className="mx-auto text-gray-600 mb-4" size={36} />
                            </Dropzone.Idle>
                        </Group>

                        <Text ta="center" fw={500} mt="md">
                            Drag & drop files here
                        </Text>
                        <Text ta="center" size="sm" c="dimmed">
                            or click to browse
                        </Text>
                        <button
                            onClick={() => openRef.current?.()}
                            className="mt-4 px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white cursor-pointer hover:none"
                            type="button"  >
                            Browse Files
                        </button>
                    </Dropzone>

                    {/* FILE LIST */}
                    {files.map((file, index) => (
                        <div
                            key={file.name + index}
                            className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            {!loading && (
                                <button
                                    onClick={() =>
                                        setFiles((prev) => prev.filter((_, i) => i !== index))
                                    }
                                >
                                    <X size={18} className="text-red-500" />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* PROGRESS */}
                    {loading && (
                        <div className="mt-6">
                            <Text size="sm" mb={6}>
                                Uploading… {progress}%
                            </Text>
                            <Progress value={progress} radius="xl" />
                        </div>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4">
                    <button
                        disabled={loading}
                        onClick={() => {
                            setFiles([]);
                            setDocType("");
                            setProgress(0);
                        }}
                        className="px-6 py-2 rounded-xl text-sm bg-white text-gray-600 shadow-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={!canUpload}
                        className={`px-6 py-2 rounded-xl text-sm flex items-center gap-2 transition-all
    ${canUpload
                                ? "bg-gradient-to-r from-[#2f80ff] to-[#12c2e9] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {loading ? <Loader size="xs" /> : <LiaCheckCircleSolid size={18} />}
                        Upload Documents
                    </button>

                </div>
            </div>
        </div>
    );
}
