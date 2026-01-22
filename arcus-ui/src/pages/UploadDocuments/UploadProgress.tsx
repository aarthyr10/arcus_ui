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

import { useLocation } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

const UploadProgress = () => {
  const location = useLocation();
  const file: File | undefined = location.state?.file;

  // UI state only (later connect API)
  const [status] = useState<"uploading" | "processing" | "done">(
    "uploading"
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4">
      {/* Card */}
      <div className="w-full max-w-[720px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-10">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Uploading Documents
        </h2>

        <p className="text-gray-500 text-center mt-1">
          Please wait while we process your file
        </p>

        {/* File Info Box */}
        <div className="mt-8 border rounded-2xl bg-white/60 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">
              {file?.name ?? "document.pdf"}
            </p>
            <p className="text-sm text-gray-500">
              {file
                ? `${(file.size / 1024).toFixed(2)} KB`
                : "—"}
            </p>
          </div>

          {/* Status Icon */}
          {status === "done" ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <Loader2 className="animate-spin text-blue-500" size={22} />
          )}
        </div>

        {/* Progress Area */}
        <div className="mt-10 flex flex-col items-center">
          {status === "uploading" && (
            <>
              <Loader2
                size={42}
                className="animate-spin text-blue-500"
              />
              <p className="mt-4 text-gray-600 font-medium">
                Uploading file…
              </p>
            </>
          )}

          {status === "processing" && (
            <>
              <Loader2
                size={42}
                className="animate-spin text-green-500"
              />
              <p className="mt-4 text-gray-600 font-medium">
                Processing document…
              </p>
            </>
          )}

          {status === "done" && (
            <>
              <CheckCircle size={42} className="text-green-500" />
              <p className="mt-4 text-green-600 font-medium">
                Completed
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
