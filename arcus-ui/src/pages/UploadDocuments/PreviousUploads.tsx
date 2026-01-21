// import { Eye, FileText } from "lucide-react";
// import UploadItem from "./UploadItem";

// const PreviousUploads = () => {
//   return (
//     <div className="
//       w-full lg:w-[360px]
//       bg-[#eef8fd]
//       rounded-3xl
//       shadow-[0_20px_40px_rgba(0,0,0,0.18)]
//       p-6
//     ">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                  <FileText className="w-6 h-6" />
//  Previous Uploads
//       </h3>

//       <div className="space-y-4">
//         <UploadItem
//           name="Fan.pdf"
//           date="01/15/2026, 09:17 AM"
//         />
//         <UploadItem
//           name="Warranty.pdf"
//           date="01/17/2026, 08:17 AM"
//         />
//         <UploadItem
//           name="Specification_Doc_v2.docx"
//           date="01/16/2026, 08:17 PM"
//         />
//       </div>
//     </div>
//   );
// };

// export default PreviousUploads;



import { FileText } from "lucide-react";
import UploadItem from "./UploadItem";

const PreviousUploads = () => {
  return (
    <div className="
      w-full lg:w-[420px]
      bg-[#eef8fd]
      rounded-3xl
      shadow-[0_20px_40px_rgba(0,0,0,0.18)]
      p-6
    ">
      <h3 className="
        text-base
        font-semibold
        text-[#1f2937]
        mb-4
        flex items-center gap-2
      ">
        <FileText className="w-5 h-5 text-[#2f80ff]" />
        Previous Uploads
      </h3>

      <div className="space-y-4">
        <UploadItem
          name="Fan.pdf"
          date="01/15/2026, 09:17 AM"
        />
        <UploadItem
          name="Warranty.pdf"
          date="01/17/2026, 08:17 AM"
        />
        <UploadItem
          name="Specification_Doc_v2.docx"
          date="01/16/2026, 08:17 PM"
        />
      </div>
    </div>
  );
};

export default PreviousUploads;
