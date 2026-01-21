// import { Eye, FileText, RefreshCw } from "lucide-react";

// interface Props {
//   name: string;
//   date: string;
// }

// const UploadItem = ({ name, date }: Props) => {
//   return (
//     <div className="
//       bg-[#dff2ff]
//       rounded-2xl
//       p-4
//       border border-blue-200
//     ">
//       <div className="flex items-start ">
//         {/* <div className=""> */}
//         <FileText className="w-6 h-6 text-blue-500" />
//         {/* </div> */}
//         <div>
//           <p className="font-medium text-gray-800">{name}</p>
//           <p className="text-xs text-gray-500">{date}</p>
//           <span className="
//           text-xs
//           px-3 py-1
//           rounded-full
//           bg-green-100
//           text-green-700
//           font-medium
//         ">
//             ✔ Processed
//           </span>
//         </div>


//       </div>

//       <div className="flex gap-3 mt-4">
//         <button className="
//           flex-1
//           bg-blue-500
//           text-white
//           py-2
//           rounded-lg
//           text-sm
//           hover:bg-blue-600
//         ">
//           <Eye className="w-6 h-6" />

//           View
//         </button>

//         <button className="
//           flex-1
//           bg-white
//           border
//           border-gray-300
//           py-2
//           rounded-lg
//           text-sm
//           hover:bg-gray-50
//         ">
//           <RefreshCw className="w-5 h-5 text-gray-600" />
//           Reuse
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadItem;



// import { Eye, FileText, RefreshCw, CheckCircle } from "lucide-react";

// interface Props {
//   name: string;
//   date: string;
// }

// const UploadItem = ({ name, date }: Props) => {
//   return (
//     <div className="
//       bg-[#e4f4ff]
//       rounded-2xl
//       p-4
//       border border-[#b7dcff]
//     ">
//       {/* Top section */}
//       <div className="flex gap-3">
//         <FileText className="w-6 h-6 text-[#2f80ff] mt-1" />

//         <div className="flex-1">
//           <p className="text-sm font-medium text-[#1f2937]">
//             {name}
//           </p>

//           <p className="text-xs text-gray-500 mt-0.5">
//             {date}
//           </p>

//           {/* Processed badge */}
//           {/* <span className="
//             inline-flex items-center gap-1
//             mt-2
//             text-xs
//             px-5 py-2
//             rounded-full
//             bg-[#e9fff3]
//             text-[#16a34a]
//             border border-[#86efac]
//             font-medium
//           ">
//             <CheckCircle className="w-3.5 h-3.5 text-green-500" />

//             Processed
//           </span> */}
//           <span
//   className="
//     inline-flex items-center gap-1
//     mt-2
//     px-5 py-1.5
//     text-xs font-medium
//     rounded-full
//     bg-white/30
//     border border-[#05DF72]
//     text-[#05DF72]
//     backdrop-blur-sm
//   "
// >
//   <CheckCircle className="w-3.5 h-3.5 text-[#05DF72]" />
//   Processed
// </span>

//         </div>
//       </div>

//       {/* Buttons */}
//       {/* <div className="flex gap-3 mt-4">
//         {/* <button className="
//           flex items-center justify-center gap-2
//           flex-1
//           bg-[#2f80ff]
//           text-white
//           py-2.5
//           rounded-xl
//           text-sm
//           font-medium
//           hover:bg-[#2563eb]
//           transition
//         ">
//           <Eye className="w-4 h-4" />
//           View
//         </button> 
//   <button className="
//           flex items-center justify-center gap-2
//           flex-1
//           bg-[#2f80ff]
//           text-white
//           py-2.5
//           rounded-xl
//           text-sm
//           font-medium
//           hover:bg-[#2563eb]
//           transition
//         ">
//           <Eye className="w-4 h-4" />
//           View
//         </button>
//         {/* <button className="
//           flex items-center justify-center gap-2
//           flex-1
//           bg-white
//           border border-gray-300
//           py-2.5
//           rounded-xl
//           text-sm
//           text-gray-600
//           hover:bg-gray-50
//           transition
//         ">
//           <RefreshCw className="w-4 h-4" />
//           Reuse
//         </button> 
//         <button
//   className="
//     flex items-center justify-center gap-2
//     w-[161.5px] h-[32px]
//     bg-white
//     border border-[#d1d5db]
//     rounded-[10px]
//     text-sm font-medium
//     text-gray-600
//     hover:bg-[#f9fafb]
//     transition-colors
//   "
// >
//   <RefreshCw className="w-4 h-4" />
//   Reuse
// </button>

//       </div> */}
//       <div className="flex gap-[8px] w-[331px] h-[32px] mt-4">
//   <button className="
//     flex items-center justify-center gap-2
//     w-[161.5px] h-[32px]
//     bg-[#2B7FFF]
//     text-white
//     rounded-[10px]
//     text-sm font-medium
//     hover:bg-[#2563eb]
//     transition-colors
//   ">
//     <Eye className="w-4 h-4" />
//     View
//   </button>

//   <button className="
//     flex items-center justify-center gap-2
//     w-[161.5px] h-[32px]
//     bg-white
//     border border-[#d1d5db]
//     rounded-[10px]
//     text-sm font-medium
//     text-gray-600
//     hover:bg-[#f9fafb]
//     transition-colors
//   ">
//     <RefreshCw className="w-4 h-4" />
//     Reuse
//   </button>
// </div>

//     </div>
//   );
// };

// export default UploadItem;

import { Eye, FileText, RefreshCw, CheckCircle } from "lucide-react";

interface Props {
  name: string;
  date: string;
}

const UploadItem = ({ name, date }: Props) => {
  return (
    <div
      className="
    flex flex-col items-start gap-3
    w-full max-w-[363px]
    min-h-[148px]
    px-4 pt-4 pb-3
    bg-[#DEF3FF]
    border border-[#9AD8FB]
    rounded-[16.4px]" >

      {/* Top section */}
      <div className="flex gap-3 w-full">
        <FileText className="w-5 h-5 text-[var(--primary-btn-color)] mt-1 shrink-0" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-normal text-[#1F2937] truncate">
            {name}
          </p>

          <p className="text-xs text-gray-500 mt-0.5">
            {date}
          </p>

          <span
            className="
              inline-flex items-center gap-1
              mt-2
              px-4 py-1
              text-xs font-medium
              rounded-full
              bg-white/30
              border border-[#05DF72]
              text-[#05DF72]
              backdrop-blur-sm " >
            <CheckCircle className="w-3.5 h-3.5" />
            Processed
          </span>
        </div>
      </div>


      {/* Buttons row */}
      <div
        className="
          flex flex-col sm:flex-row
          gap-2 sm:gap-[8px]
          w-full"
      >
        <button
          className="
          flex items-center justify-center gap-2
          w-full sm:w-[161.5px]
          h-[32px]
          text-white
          rounded-[10px]
          text-sm font-medium
          bg-[var(--primary-btn-color)]
          hover:bg-[var(--primary-btn-color)]
          transition-colors"
        // style={{
        //   backgroundColor: "var(--primary-color)",
        //   ":hover": {
        //     backgroundColor: "var(--primary-color)",
        //   }
        // }}
        >
          <Eye className="w-4 h-4" />
          View
        </button>

        <button
          className="
      flex items-center justify-center gap-2
      w-full sm:w-[161.5px]
      h-[32px]
      bg-white
      border border-[#d1d5db]
      rounded-[10px]
      text-sm font-medium
      text-gray-600
      hover:bg-[#f9fafb]
      transition-colors
    "
        >
          <RefreshCw className="w-4 h-4" />
          Reuse
        </button>
      </div>

    </div>

  );
};

export default UploadItem;