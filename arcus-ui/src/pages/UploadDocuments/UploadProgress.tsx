// // import { useLocation, useNavigate } from "react-router-dom";
// // import { Loader2, CheckCircle } from "lucide-react";
// // import { useState } from "react";

// // const UploadProgress = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const file: File | undefined = location.state?.file;

// //   // UI-only state
// //   const [status] = useState<"uploading" | "processing" | "done">("uploading");

// //   return (
// //     <>
// //     {/* <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4 mt-0"> */}
// //       <div className="relative h-screen overflow-hidden flex items-center justify-center px-4">

// //       {/* Main Card */}
// //       <div
// //         className="
// //           w-full max-w-[600px]
// //           bg-[#eef8fd]
// //           rounded-3xl
// //           shadow-[0_20px_40px_rgba(0,0,0,0.18)]
// //           p-8 " >
// //         {/* Title */}
// //         <h2 className="text-2xl font-semibold text-gray-800 text-center">
// //           Upload Documents
// //         </h2>

// //         <p className="text-gray-500 text-center mt-1 mb-6">
// //           Drop your compliance forms and specification documents
// //         </p>

// //         {/* Inner Box (same as upload card) */}
// //         <div
// //           className="
// //             border border-gray-200
// //             rounded-2xl
// //             p-10
// //             flex flex-col items-center justify-center
// //             text-center
// //             bg-white/40
// //           "
// //         >
// //           {status === "uploading" && (
// //             <>
// //               <Loader2
// //                 size={42}
// //                 className="animate-spin text-blue-500 mb-4"
// //               />
// //               <p className="font-medium text-gray-700">
// //                 Uploading file…
// //               </p>
// //             </>
// //           )}

// //           {status === "processing" && (
// //             <>
// //               <Loader2
// //                 size={42}
// //                 className="animate-spin text-green-500 mb-4"
// //               />
// //               <p className="font-medium text-gray-700">
// //                 Processing document…
// //               </p>
// //             </>
// //           )}

// //           {status === "done" && (
// //             <>
// //               <CheckCircle
// //                 size={42}
// //                 className="text-green-500 mb-4"
// //               />
// //               <p className="font-medium text-green-600">
// //                 Completed
// //               </p>
// //             </>
// //           )}
// //         </div>

// //         {/* File Row */}
// //         <div
// //           className="
// //             mt-4
// //             border
// //             rounded-xl
// //             px-4 py-3
// //             flex items-center justify-between
// //             bg-white/60
// //           "
// //         >
// //           <div className="flex items-center gap-3">
// //             <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
// //               📄
// //             </div>
// //             <div>
// //               <p className="text-sm font-medium text-gray-800">
// //                 {file?.name ?? "document.pdf"}
// //               </p>
// //               <p className="text-xs text-gray-500">
// //                 {file
// //                   ? `${(file.size / 1024).toFixed(2)} KB`
// //                   : "—"}
// //               </p>
// //             </div>
// //           </div>

// //           {status !== "done" ? (
// //             <Loader2 className="animate-spin text-blue-500" size={18} />
// //           ) : (
// //             <CheckCircle className="text-green-500" size={18} />
// //           )}
// //         </div>

// //         {/* Button (disabled state) */}
// //         <button
// //           // disabled
// //           className="
// //             mt-6
// //             w-full
// //             py-3
// //             rounded-full
// //             bg-gradient-to-r from-blue-500 to-cyan-500
// //             text-white
// //             font-medium
// //             opacity-70
// //             flex items-center justify-center gap-2
// //           "
// //           onClick={() => navigate('/analyzing')}
// //         >
// //           <Loader2 className="animate-spin" size={18} />
// //           Processing Documents
// //         </button>
// //       </div>
// //     </div>
// //     </>
// //   );
// // };

// // export default UploadProgress;

// import { useLocation, useNavigate } from "react-router-dom";
// import { X, CloudUpload, FileText } from "lucide-react";
// import { LiaCheckCircleSolid } from "react-icons/lia";
// import { useEffect, useState } from "react";

// const UploadProgress = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); 
//   const file: File | undefined = location.state?.file;

//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleProcess = () => {
//     setLoading(true);
//     setProgress(0);
//   };

//   useEffect(() => {
//     if (!loading) return;

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 1;
//       });
//     }, 40);

//     return () => clearInterval(interval);
//   }, [loading]);
//     useEffect(() => {
//     if (progress === 100) {
//       // small delay to show 100% completion
//       setTimeout(() => {
//         navigate("/analyzing");
//       }, 300); 
//     }
//   }, [progress, navigate]);

//   return (
//     <div className="flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4">
//        <style>{`
//         @keyframes cloudPulse {
//           0%, 100% { 
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% { 
//             transform: scale(1.15);
//             opacity: 0.3;
//           }
//         }
        
//         @keyframes arrowUp {
//           0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
//           50% { transform: translate(-50%, -50%) translateY(-8px); }
//         }
        
//         @keyframes progress {
//           0% { width: 0%; }
//           100% { width: 70%; }
//         }
        
//         .animate-cloud-pulse {
//           animation: cloudPulse 2s ease-in-out infinite;
//         }
        
//         .animate-arrow-up {
//           animation: arrowUp 1.5s ease-in-out infinite;
//         }
        
//         .animate-progress {
//           animation: progress 2s ease-in-out infinite;
//         }
//       `}</style>
//       <div className="w-full max-w-[700px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] px-8 py-8">
        
//         {/* Header */}
//         <h1 className="text-[28px] font-semibold text-gray-800 text-center">
//           Upload Documents
//         </h1>
//         <p className="text-gray-500 text-center mt-2">
//           Drop your compliance forms and specification documents
//         </p>

//         {/* Drag & Drop Box */}
//         <div className="mt-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#f4fbff] px-6 py-6 text-center">
//           <div className="flex justify-center mt-2">
//             <div className="flex flex-col items-center">
//               {/* <div className="relative w-16 h-16 rounded-full bg-[#e8f3ff] flex items-center justify-center animate-cloudFloat">
//                 <div className="absolute animate-arrowMove">
//                   <svg
//                     width="16"
//                     height="16"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#4f8df7"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M12 19V5" />
//                     <path d="M5 12l7-7 7 7" />
//                   </svg>
//                 </div>
//                 <CloudUpload className="text-[#4f8df7]" size={30} />
//               </div> */}
//                <div className="mt-8 flex flex-col items-center">
//     <div className="relative w-24 h-24 flex items-center justify-center">
      
//       {/* Circular Progress */}
//       <svg className="absolute w-full h-full rotate-[-90deg]">
//         <circle
//           cx="48"
//           cy="48"
//           r="42"
//           stroke="#dbeafe"
//           strokeWidth="6"
//           fill="none"
//         />
//         <circle
//           cx="48"
//           cy="48"
//           r="42"
//           stroke="#3b82f6"
//           strokeWidth="6"
//           fill="none"
//           strokeDasharray={2 * Math.PI * 42}
//           strokeDashoffset={
//             2 * Math.PI * 42 -
//             (progress / 100) * 2 * Math.PI * 42
//           }
//           strokeLinecap="round"
//         />
//       </svg>

//       {/* SAME Cloud Animation */}
//       <div className="relative w-16 h-16 rounded-full bg-[#e8f3ff] flex items-center justify-center animate-cloudFloat">
//         <div className="absolute animate-arrowMove">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#4f8df7"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M12 19V5" />
//             <path d="M5 12l7-7 7 7" />
//           </svg>
//         </div>
//         <CloudUpload className="text-[#4f8df7]" size={30} />
//       </div>
//     </div>

//     {/* Loading line */}

//   {/* </div> */}

//              <div className="mt-4 w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
//               <div className="h-full bg-blue-500 rounded-full animate-progress" />
//             </div>
//           </div>
//             </div>
//           </div>

//           <p className="mt-4 font-medium text-gray-700">
//             Drag & Drop files here
//           </p>
//           <p className="text-sm text-gray-500 mt-1">
//             or click to browse (Maximum 9 files allowed)
//           </p>
//         </div>

//         {/* Uploaded File */}
//         <div className="mt-6 rounded-xl border border-gray-200 bg-white/70 px-5 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <FileText className="text-[#2f80ff]" size={20} />
//             <div>
//               <p className="text-sm font-medium text-gray-800">
//                 {file?.name ?? "daikin demo page.pdf"}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {file
//                   ? `${(file.size / 1024).toFixed(2)} KB`
//                   : "211.07 KB"}
//               </p>
//             </div>
//           </div>

//           {/* BACK TO PREVIOUS PAGE */}
//           <button
//             aria-label="Remove file"
//             onClick={() => navigate(-1)}  
//             className="cursor-pointer" 
//           >
//             <X className="text-red-500 hover:scale-110 transition" size={18} />
//           </button>
//         </div>

//         {/* Button / Loader */}
//         {!loading ? (
//           <button
//             onClick={handleProcess}
//             className="
//               mt-6 w-full h-14 rounded-full
//               bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
//               text-white font-medium text-lg
//               shadow-[0_18px_40px_rgba(47,128,255,0.45)]
//               hover:scale-[1.02] transition
//               flex items-center justify-center gap-2 cursor-pointer
//             "
//           >
//             <span className="w-5 h-5 flex items-center justify-center">
//               <LiaCheckCircleSolid size={20} />
//             </span>
//             Process Documents
//           </button>
//         ) : (
//           <div className="mt-8 flex flex-col items-center">
//             <div className="relative w-20 h-20">
//               <svg className="w-full h-full rotate-[-90deg]">
//                 <circle cx="40" cy="40" r="36" stroke="#dbeafe" strokeWidth="6" fill="none" />
//                 <circle
//                   cx="40"
//                   cy="40"
//                   r="36"
//                   stroke="#3b82f6"
//                   strokeWidth="6"
//                   fill="none"
//                   strokeDasharray={2 * Math.PI * 36}
//                   strokeDashoffset={
//                     2 * Math.PI * 36 -
//                     (progress / 100) * 2 * Math.PI * 36
//                   }
//                   strokeLinecap="round"
//                 />
//               </svg>

//               <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-semibold">
//                 {progress}%
//               </div>
//             </div>

//             <p className="mt-3 text-gray-500 text-sm">
//               Please wait your file is uploading
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
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
      setTimeout(() => {
        navigate("/analyzing");
      }, 300); 
    }
  }, [progress, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-[#eaf6fb] to-[#cfe9f6] px-4 py-2">
      <style>{`
        @keyframes cloudPopup {
          0% { 
            transform: scale(0.5);
            opacity: 0;
          }
          50% { 
            transform: scale(1.1);
            opacity: 1;
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
         @keyframes arrowMove {
          0% { 
            transform: translateY(12px);
            opacity: 0;
          }
          30% { 
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-12px);
            opacity: 0;
          }
        }
        
        @keyframes progressSlide {
          0% { 
            transform: translateX(-100%);
          }
          100% { 
            transform: translateX(500%);
          }
        }
        
        .animate-cloudPopup {
          animation: cloudPopup 2s ease-in-out infinite;
        }
        
       .animate-arrowMove {
          animation: arrowMove 2s ease-in-out infinite;
        }
        
        .animate-progressSlide {
          animation: progressSlide 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-full max-w-[700px] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] px-8 py-4">
        
        {/* Header */}
        <h1 className="text-[28px] font-semibold text-gray-800 text-center">
          Upload Documents
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Drop your compliance forms and specification documents
        </p>

        {/* Drag & Drop Box */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#f4fbff] px-6 text-center py-2">
          <div className="flex justify-center align-top">
            <div className="flex flex-col items-center">
              <div className="mt-8 flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  
                  {/* Circular Progress */}
                  <svg className="absolute w-full h-full rotate-[-90deg]">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="#dbeafe"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="#3b82f6"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={
                        2 * Math.PI * 42 -
                        (progress / 100) * 2 * Math.PI * 42
                      }
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Cloud Animation with Popup */}
                  <div className="relative w-16 h-16 rounded-full bg-[#e8f3ff] flex items-center justify-center animate-cloudPopup overflow-hidden">
                    {/* Chevron Arrow moving like train */}
                  <div className="absolute animate-arrowMove">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4f8df7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </div>
                    <CloudUpload className="text-[#4f8df7]" size={30} />
                  </div>
                </div>

                {/* Loading line - sliding from left to right */}
                <div className="mt-4 w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-4 bg-[#4f8df7] rounded-full animate-progressSlide" />
                </div>
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