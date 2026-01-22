// // import { useCallback, useState } from "react";
// // import { useDropzone } from "react-dropzone";

// // const UploadProgress = () => {
// //   const [progress, setProgress] = useState<number | null>(null);
// //   const [fileName, setFileName] = useState<string | null>(null);

// //   const onDrop = useCallback((acceptedFiles: File[]) => {
// //     const file = acceptedFiles[0];
// //     if (!file) return;

// //     setFileName(file.name);
// //     setProgress(0);

// //     // Fake upload progress (replace with API later)
// //     let value = 0;
// //     const interval = setInterval(() => {
// //       value += 10;
// //       setProgress(value);

// //       if (value >= 100) {
// //         clearInterval(interval);
// //       }
// //     }, 300);
// //   }, []);

// //   const { getRootProps, getInputProps, isDragActive } = useDropzone({
// //     onDrop,
// //   });

// //   return (
// //     <div
// //       className="
// //         w-full max-w-[600px]
// //         bg-[rgb(var(--card-bg))]
// //         rounded-3xl
// //         shadow-xl
// //         p-8
// //       "
// //     >
// //       <h2 className="text-2xl font-semibold text-center">
// //         Upload Documents
// //       </h2>

// //       <p className="text-gray-500 text-center mt-1 mb-6">
// //         Drop your compliance files here
// //       </p>

// //       {/* Drop area */}
// //       <div
// //         {...getRootProps()}
// //         className={`
// //           border-2 border-dashed
// //           rounded-2xl
// //           p-12
// //           text-center
// //           cursor-pointer
// //           transition
// //           ${
// //             isDragActive
// //               ? "border-blue-500 bg-blue-50"
// //               : "border-gray-300 bg-white/50"
// //           }
// //         `}
// //       >
// //         <input {...getInputProps()} />
// //         <p className="font-medium">
// //           Drag & Drop files here
// //         </p>
// //         <p className="text-sm text-gray-500">
// //           or click to browse
// //         </p>
// //       </div>

// //       {/* Progress */}
// //       {progress !== null && (
// //         <div className="mt-6">
// //           <p className="text-sm font-medium">{fileName}</p>
// //           <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
// //             <div
// //               className="h-2 rounded-full bg-[rgb(var(--primary-color))] transition-all"
// //               style={{ width: `${progress}%` }}
// //             />
// //           </div>
// //           <p className="text-xs text-gray-500 mt-1">{progress}%</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UploadProgress;


// import { useRef, useState } from "react";
// import { X, CheckCircle } from "lucide-react";

// const UploadProgress = () => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const [files, setFiles] = useState<File[]>([]);

//   const handleClick = () => {
//     inputRef.current?.click();
//   };

//   const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     setFiles(Array.from(e.target.files).slice(0, 9));
//   };

//   const removeFile = (index: number) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] p-6">
//       <div
//         className="
//           w-full max-w-[720px]
//           bg-white/60 backdrop-blur-xl
//           rounded-[28px]
//           shadow-[0_25px_50px_rgba(0,0,0,0.18)]
//           p-8
//         "
//       >
//         {/* Header */}
//         <h1 className="text-3xl font-semibold text-center text-gray-800">
//           Upload Documents
//         </h1>
//         <p className="text-center text-gray-500 mt-2 mb-8">
//           Drop your compliance forms and specification documents
//         </p>

//         {/* Upload Box */}
//         <div
//           onClick={handleClick}
//           className="
//             border border-dashed border-gray-300
//             rounded-2xl
//             p-10
//             text-center
//             bg-white/40
//             cursor-pointer
//             transition
//             hover:border-blue-400
//           "
//         >
//           <div className="flex flex-col items-center gap-4">
//             <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
//               <svg
//                 className="w-7 h-7 text-blue-500"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
//                 <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
//               </svg>
//             </div>

//             <p className="font-medium text-gray-700">
//               Drag & Drop files here
//             </p>
//             <p className="text-sm text-gray-500">
//               or click to browse (Maximum 9 files allowed)
//             </p>
//           </div>

//           <input
//             ref={inputRef}
//             type="file"
//             hidden
//             multiple
//             onChange={handleFiles}
//           />
//         </div>

//         {/* File List */}
//         {files.length > 0 && (
//           <div className="mt-6 space-y-3">
//             {files.map((file, index) => (
//               <div
//                 key={index}
//                 className="
//                   flex items-center justify-between
//                   bg-white/70
//                   border
//                   rounded-xl
//                   px-4 py-3
//                 "
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
//                     📄
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       {file.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {(file.size / 1024).toFixed(2)} KB
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => removeFile(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* CTA */}
//         <div className="mt-8">
//           <button
//             className="
//               w-full
//               flex items-center justify-center gap-2
//               py-4
//               rounded-full
//               bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
//               text-white
//               font-medium
//               shadow-[0_10px_25px_rgba(47,128,255,0.45)]
//               hover:scale-[1.02]
//               transition
//             "
//           >
//             <CheckCircle size={18} />
//             Process Documents
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadProgress;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// // import axios from "axios";
// import { Loader2, CheckCircle } from "lucide-react";

// const UploadProgress = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const file: File | undefined = location.state?.file;

// //   const [status, setStatus] = useState<
// //     "uploading" | "processing" | "done"
// //   >("uploading");

// //   useEffect(() => {
// //     if (!file) return;

// //     const upload = async () => {
// //       try {
// //         const formData = new FormData();
// //         formData.append("file", file);

// //         // Upload starts here
// //         const res = await axios.post(
// //           "http://localhost:5000/upload",
// //           formData
// //         );

// //         const uploadId = res.data.uploadId;

// //         setStatus("processing");

// //         // Optional: navigate to refresh-safe route
// //         navigate(`/uploads-progress/${uploadId}`, {
// //           replace: true,
// //         });
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     upload();
// //   }, [file, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] p-6">
//       <div className="w-full max-w-[720px] bg-white/70 rounded-3xl shadow p-8 text-center">
//         <h1 className="text-2xl font-semibold mb-6">
//           Uploading Documents
//         </h1>

//         {status === "uploading" && (
//           <>
//             <Loader2 className="mx-auto animate-spin text-blue-500" size={40} />
//             <p className="mt-4 text-gray-600">
//               Uploading file…
//             </p>
//           </>
//         )}

//         {status === "processing" && (
//           <>
//             <Loader2 className="mx-auto animate-spin text-green-500" size={40} />
//             <p className="mt-4 text-gray-600">
//               Processing document…
//             </p>
//           </>
//         )}

//         {status === "done" && (
//           <>
//             <CheckCircle className="mx-auto text-green-500" size={40} />
//             <p className="mt-4">Completed</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadProgress;

// import { useLocation, useNavigate } from "react-router-dom";
// import { Loader2, CheckCircle } from "lucide-react";
// import { useState } from "react";

// const UploadProgress = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const file: File | undefined = location.state?.file;

//   // UI-only state
//   const [status] = useState<"uploading" | "processing" | "done">("uploading");

//   return (
//     <>
//     {/* <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4 mt-0"> */}
//       <div className="relative h-screen overflow-hidden flex items-center justify-center px-4">

//       {/* Main Card */}
//       <div
//         className="
//           w-full max-w-[600px]
//           bg-[#eef8fd]
//           rounded-3xl
//           shadow-[0_20px_40px_rgba(0,0,0,0.18)]
//           p-8 " >
//         {/* Title */}
//         <h2 className="text-2xl font-semibold text-gray-800 text-center">
//           Upload Documents
//         </h2>

//         <p className="text-gray-500 text-center mt-1 mb-6">
//           Drop your compliance forms and specification documents
//         </p>

//         {/* Inner Box (same as upload card) */}
//         <div
//           className="
//             border border-gray-200
//             rounded-2xl
//             p-10
//             flex flex-col items-center justify-center
//             text-center
//             bg-white/40
//           "
//         >
//           {status === "uploading" && (
//             <>
//               <Loader2
//                 size={42}
//                 className="animate-spin text-blue-500 mb-4"
//               />
//               <p className="font-medium text-gray-700">
//                 Uploading file…
//               </p>
//             </>
//           )}

//           {status === "processing" && (
//             <>
//               <Loader2
//                 size={42}
//                 className="animate-spin text-green-500 mb-4"
//               />
//               <p className="font-medium text-gray-700">
//                 Processing document…
//               </p>
//             </>
//           )}

//           {status === "done" && (
//             <>
//               <CheckCircle
//                 size={42}
//                 className="text-green-500 mb-4"
//               />
//               <p className="font-medium text-green-600">
//                 Completed
//               </p>
//             </>
//           )}
//         </div>

//         {/* File Row */}
//         <div
//           className="
//             mt-4
//             border
//             rounded-xl
//             px-4 py-3
//             flex items-center justify-between
//             bg-white/60
//           "
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
//               📄
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-800">
//                 {file?.name ?? "document.pdf"}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {file
//                   ? `${(file.size / 1024).toFixed(2)} KB`
//                   : "—"}
//               </p>
//             </div>
//           </div>

//           {status !== "done" ? (
//             <Loader2 className="animate-spin text-blue-500" size={18} />
//           ) : (
//             <CheckCircle className="text-green-500" size={18} />
//           )}
//         </div>

//         {/* Button (disabled state) */}
//         <button
//           // disabled
//           className="
//             mt-6
//             w-full
//             py-3
//             rounded-full
//             bg-gradient-to-r from-blue-500 to-cyan-500
//             text-white
//             font-medium
//             opacity-70
//             flex items-center justify-center gap-2
//           "
//           onClick={() => navigate('/analyzing')}
//         >
//           <Loader2 className="animate-spin" size={18} />
//           Processing Documents
//         </button>
//       </div>
//     </div>
//     </>
//   );
// };

// export default UploadProgress;

import { useLocation, useNavigate } from "react-router-dom";
import { X, CloudUpload, FileText } from "lucide-react";
import { LiaCheckCircleSolid } from "react-icons/lia";
import { useEffect, useState } from "react";

const UploadProgress = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const file: File | undefined = location.state?.file;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = () => {
    setLoading(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [loading]);
    useEffect(() => {
    if (progress === 100) {
      // small delay to show 100% completion
      setTimeout(() => {
        navigate("/analyzing");
      }, 300); 
    }
  }, [progress, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4">
      <div className="w-full max-w-[700px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] px-8 py-8">
        
        {/* Header */}
        <h1 className="text-[28px] font-semibold text-gray-800 text-center">
          Upload Documents
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Drop your compliance forms and specification documents
        </p>

        {/* Drag & Drop Box */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#f4fbff] px-6 py-6 text-center">
          <div className="flex justify-center mt-2">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full bg-[#e8f3ff] flex items-center justify-center animate-cloudFloat">
                <div className="absolute animate-arrowMove">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4f8df7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                </div>
                <CloudUpload className="text-[#4f8df7]" size={30} />
              </div>

              <div className="mt-3 w-16 h-[3px] bg-[#dbeafe] rounded-full overflow-hidden">
                <div className="h-full bg-[#4f8df7] rounded-full animate-lineLoad" />
              </div>
            </div>
          </div>

          <p className="mt-4 font-medium text-gray-700">
            Drag & Drop files here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (Maximum 9 files allowed)
          </p>
        </div>

        {/* Uploaded File */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white/70 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-[#2f80ff]" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {file?.name ?? "daikin demo page.pdf"}
              </p>
              <p className="text-xs text-gray-500">
                {file
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : "211.07 KB"}
              </p>
            </div>
          </div>

          {/* BACK TO PREVIOUS PAGE */}
          <button
            aria-label="Remove file"
            onClick={() => navigate(-1)}  
            className="cursor-pointer" 
          >
            <X className="text-red-500 hover:scale-110 transition" size={18} />
          </button>
        </div>

        {/* Button / Loader */}
        {!loading ? (
          <button
            onClick={handleProcess}
            className="
              mt-6 w-full h-14 rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white font-medium text-lg
              shadow-[0_18px_40px_rgba(47,128,255,0.45)]
              hover:scale-[1.02] transition
              flex items-center justify-center gap-2 cursor-pointer
            "
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <LiaCheckCircleSolid size={20} />
            </span>
            Process Documents
          </button>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle cx="40" cy="40" r="36" stroke="#dbeafe" strokeWidth="6" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={
                    2 * Math.PI * 36 -
                    (progress / 100) * 2 * Math.PI * 36
                  }
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-semibold">
                {progress}%
              </div>
            </div>

            <p className="mt-3 text-gray-500 text-sm">
              Please wait your file is uploading
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;