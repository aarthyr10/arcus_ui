// import { Input } from "@mantine/core";
// import { useRef } from "react";
// import { useNavigate } from "react-router";

// const UploadCard = () => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const navigate = useNavigate();

//   const openPicker = () => {
//     inputRef.current?.click();
//   };

// const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (!e.target.files || e.target.files.length === 0) return;

//   const files = Array.from(e.target.files); 

//   navigate("/uploadsprogess", {
//     state: { file: files }, 
//   });
//   e.target.value = "";
// };

//     return (
//     <>
//       <div className="
//       w-full lg:w-[600px]
//       h-[430px]
//       bg-[#eef8fd]
//       rounded-3xl
//       shadow-[0_20px_40px_rgba(0,0,0,0.18)]
//       p-8
//     ">
//         <h2 className="text-2xl font-semibold text-gray-800 text-center">
//           Upload Documents
//         </h2>

//         <p className="text-gray-500 text-center mt-1 mb-6">
//           Drop your compliance forms and specification documents
//         </p>
//         <Input
//           ref={inputRef}
//           type="file"
//           hidden
//           multiple
//           accept=".pdf,.doc,.docx,.xlsx,.csv"  
//           onChange={handleFiles}
//         />
//         <div className="
//         border-2 border-dashed border-gray-300
//         rounded-2xl
//         p-12
//         flex flex-col items-center justify-center
//         text-center cursor-pointer
//         bg-white/40"
//           onClick={openPicker} >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 text-blue-500 mb-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
//             />
//           </svg>

//           <p className="font-medium text-gray-700">
//             Drag & Drop files here
//           </p>
//           <p className="text-sm text-gray-500">
//             or click to browse
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadCard;

import { Input, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const UploadCard = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [productCode, setProductCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      // alert("Upload in progress. Please wait until it completes.");
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const blockRefresh = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // REQUIRED
    };

    window.addEventListener("beforeunload", blockRefresh);

    return () => {
      window.removeEventListener("beforeunload", blockRefresh);
    };
  }, []);

  const openPicker = () => {
    if (!productCode.trim()) {
      setError("Product code is required");
      return;
    }
    setError("");
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    navigate("/uploadsprogess", {
      state: {
        files,
        productCode, // ✅ sending product code
      },
    });
    e.target.value = "";
  };

  return (
    <>
      <div
        className="
        w-full lg:w-[600px]
        max-w-[600px]
        bg-[#eef8fd]
        rounded-3xl
        shadow-[0_20px_40px_rgba(0,0,0,0.18)]
        p-5 sm:p-6 lg:p-8
        mx-auto
      "
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Upload Documents
        </h2>

        <p className="text-gray-500 text-center mt-1 mb-4 sm:mb-6 text-sm sm:text-base">
          Drop your compliance forms and specification documents
        </p>
        {/* PRODUCT CODE INPUT */}
        <div className="mb-8">
          <div className="min-h-[86px]"> {/* 🔒 locks height */}
            <TextInput
              label="Product Code"
              placeholder="Enter product code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              // onChange={(e) =>  setProductCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
              error={error}
              radius="md"
              size="md"
              required
              styles={{
                root: { marginBottom: 32 }, // 🔥 fixed spacing
              }}
            />
          </div>
        </div>

        <Input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept=".pdf,.doc,.docx,.xlsx,.csv"
          onChange={handleFiles}
        />

        <div
          className="
          border-2 border-dashed border-gray-300
          rounded-2xl
          p-6 sm:p-8 lg:p-12
          flex flex-col items-center justify-center
          text-center cursor-pointer
          bg-white/40
        "
          onClick={openPicker}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-3 sm:mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            />
          </svg>

          <p className="font-medium text-gray-700 text-sm sm:text-base">
            Drag & Drop files here
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            or click to browse
          </p>
        </div>
      </div>
    </>
  );
};

export default UploadCard;
