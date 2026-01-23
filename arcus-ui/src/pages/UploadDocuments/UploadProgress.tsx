import { useLocation, useNavigate } from "react-router-dom";
import { X, FileText } from "lucide-react";
import { LiaCheckCircleSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { FaCloud } from "react-icons/fa";
import AnalyzingDocuments from "./AnalyzingDocuments";
import { ServiceEndpoint } from "../../config/ServiceEndpoint";
import { uploadDocument } from "../../services/upload.service";

const UploadProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const file: File | undefined = location.state?.file;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
    const [showAnalyzing, setShowAnalyzing] = useState(false);


  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.upload;
  console.log(endPoint);

  // const handleProcess = () => {
  //   setLoading(true);
  //   setProgress(0);
  // };
  useEffect(() => {
  if (!file) {
    navigate("/", { replace: true });
  }
}, [file, navigate]);
  const handleProcess = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);

      const response = await uploadDocument(
        file,
        "TEST123", // 🔴 replace with real product code
        (percent) => setProgress(percent)
      );

      console.log("Upload success:", response.data);

      // Show analyzing modal after upload completes
      setTimeout(() => {
        setShowAnalyzing(true);
      }, 300);

    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   if (!loading) return;

  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         return 100;
  //       }
  //       return prev + 1;
  //     });
  //   }, 40);

  //   return () => clearInterval(interval);
  // }, [loading]);

  // useEffect(() => {
  //   if (progress === 100) {
  //     setTimeout(() => {
  //       navigate("/analyzing");
  //     }, 300);
  //   }
  // }, [progress, navigate]);
  // const [showAnalyzing, setShowAnalyzing] = useState(false);

  // useEffect(() => {
  //   if (progress === 100) {
  //     setTimeout(() => {
  //       setShowAnalyzing(true);
  //     }, 300);
  //   }
  // }, [progress]);

  return (
    <>
      <div className="flex w-full items-center align-middle justify-center bg-gradient-to-br from-[#eaf6fb] to-[#] px-4 py-2">
        <style>{`
        @keyframes cloudPopup {
          0% { 
            transform: scale(0.5);
            opacity: 0;
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
                0% { width: 0%; }
                20% { width: 20%; }
                40% { width: 40%; }
                60% { width: 60%; }
                80% { width: 80%; }
                100% { width: 100%; }
        }
        
        .animate-cloudPopup {
          animation: cloudPopup 1.5s ease-in-out infinite;
        }
        
       .animate-arrowMove {
          animation: arrowMove 1.5s ease-in-out infinite;
        }
        

           .animate-progressSlide {
  animation: progressSlide 2s ease-in-out infinite;
}

      `}</style>

        <div className="w-full max-w-162.5 bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_30px_70px_rgba(0,0,0,0.18)] px-8 py-4">

          {/* Header */}
          <h1 className="text-[28px] font-semibold text-gray-800 text-center">
            Upload Documents
          </h1>
          <p className="text-gray-500 text-center mt-2">
            Drop your compliance forms and specification documents
          </p>

          {/* Drag & Drop Box */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-linear-to-br from-white to-[#f4fbff] px-6 text-center py-2">
            <div className="flex justify-center align-top">
              <div className="flex flex-col items-center">
                <div className="mt-8 flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Cloud Animation with Popup */}
                    <div className="relative w-16 h-16   flex items-center justify-center animate-cloudPopup overflow-hidden">
                      <FaCloud className="text-[#4f8df7]" size={100} />
                      <div className="absolute inset-0 flex items-center justify-center animate-arrowMove z-10">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </div>
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
                  {file?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {/* {file
                  `${(file.size / 1024).toFixed(2)} KB`
                  } */}
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : ""}
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
              bg-linear-to-r from-[#2f80ff] to-[#12c2e9]
              text-white font-medium text-medium
              shadow-[0_18px_40px_rgba(47,128,255,0.45)]
              hover:scale-[1.02] transition
              flex items-center justify-center gap-2 cursor-pointer
            "
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <LiaCheckCircleSolid size={18} />
              </span>
              Process Documents
            </button>
          ) : (
            <div className="mt-8 flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90">
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
      <AnalyzingDocuments open={showAnalyzing} />
    </>
  );
};

export default UploadProgress;