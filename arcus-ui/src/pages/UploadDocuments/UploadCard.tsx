import { Input } from "@mantine/core";
import { useRef } from "react";
import { useNavigate } from "react-router";

const UploadCard = () => {

  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  // // Trigger file picker
  // const uploadFiles = () => {
  //   fileInputRef.current?.click();
  // };

  // // Handle selected files
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   console.log("Selected files:", files);

  //   // Example: upload to backend
  //   // const formData = new FormData();
  //   // Array.from(files).forEach(file => formData.append("files", file));
  //   // axios.post("/upload", formData);
  // };

  // // Drag & drop handlers
  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   const files = e.dataTransfer.files;
  //   if (!files || files.length === 0) return;

  //   console.log("Dropped files:", files);
  // };
  //     const navigate = useNavigate();
  // const uploadFiles = () => {
  //   navigate('/UploadsProgess');
  // }
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Navigate immediately and pass file in memory
    navigate("/uploadsprogess", {
      state: { file },
    });
  };
  return (
    <>
      <div className="
      w-full lg:w-[600px]
      h-[430px]
      bg-[#eef8fd]
      rounded-3xl
      shadow-[0_20px_40px_rgba(0,0,0,0.18)]
      p-8
    ">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Upload Documents
        </h2>

        <p className="text-gray-500 text-center mt-1 mb-6">
          Drop your compliance forms and specification documents
        </p>
        {/* <Input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        // onChange={handleFileChange}
      /> */}
        <Input
          ref={inputRef}
          type="file"
          hidden
          onChange={handleFiles}
        />
        {/* Upload Box */}
        <div className="
        border-2 border-dashed border-gray-300
        rounded-2xl
        p-12
        flex flex-col items-center justify-center
        text-center cursor-pointer
        bg-white/40"
          //  onDragOver={(e) => e.preventDefault()}
          // onDrop={handleDrop}
          // onClick={uploadFiles}
          onClick={openPicker}

        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            />
          </svg>

          <p className="font-medium text-gray-700">
            Drag & Drop files here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse
          </p>
        </div>
      </div>
    </>
  );
};

export default UploadCard;




// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const UploadCard = () => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const navigate = useNavigate();

//   const openPicker = () => {
//     inputRef.current?.click();
//   };

//   const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;

//     const file = e.target.files[0];

//     // Navigate immediately and pass file in memory
//     navigate("/UploadsProgess", {
//       state: { file },
//     });
//   };

//   return (
//     <div className="w-full lg:w-[600px] h-[430px] bg-[#eef8fd] rounded-3xl shadow p-8">
//       <h2 className="text-2xl font-semibold text-center">
//         Upload Documents
//       </h2>

//       <input
//         ref={inputRef}
//         type="file"
//         hidden
//         onChange={handleFiles}
//       />

//       <div
//         onClick={openPicker}
//         className="border-2 border-dashed rounded-2xl p-12 mt-6 text-center bg-white/40 cursor-pointer"
//       >
//         <p className="font-medium">Drag & Drop files here</p>
//         <p className="text-sm text-gray-500">or click to browse</p>
//       </div>
//     </div>
//   );
// };

// export default UploadCard;
