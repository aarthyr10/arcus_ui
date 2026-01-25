// import axios from "axios";
// import { ServiceEndpoint } from "../config/ServiceEndpoint";

// export const uploadDocument = async (
//   file: File,
//   productCode: string,
//   onProgress?: (percent: number) => void
// ) => {
//   const formData = new FormData();
// formData.append("files", file);
// formData.append("product_code", productCode);

// return axios.post(
//   ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.upload,
//   formData,
//   {
//     onUploadProgress: (event) => {
//       if (!event.total) return;
//       const percent = Math.round((event.loaded * 100) / event.total);
//       onProgress?.(percent);
//     },
//     withCredentials: true, // if you need cookies/auth
//   }
// );

// };
// services/upload.service.ts
import axios from "axios";
import { ServiceEndpoint } from "../config/ServiceEndpoint";

// export const uploadDocument = async (
//   file: File[],
//   productCode: string,
//   onProgress?: (percent: number) => void
// ) => {
//   const formData = new FormData();
//   formData.append("files", file);
//   formData.append("product_code", productCode);

//   return axios.post(
//     ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.upload,  // Now uses /api/upload-documents
//     formData,
//     {
//       onUploadProgress: (event) => {
//         if (!event.total) return;
//         const percent = Math.round((event.loaded * 100) / event.total);
//         onProgress?.(percent);
//       },
//       withCredentials: true,  // Keep if needed for auth
//     }
//   );
// };


export const uploadDocument = async (
  files: File[], // 👈 array
  productCode: string,
  onProgress?: (percent: number) => void
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file); // 👈 SAME key, multiple values
  });

  formData.append("product_code", productCode);

  return axios.post(
    ServiceEndpoint.apiBaseUrl + ServiceEndpoint.uploadedDocuments.upload,
    formData,
    {
      onUploadProgress: (event) => {
        if (!event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress?.(percent);
      },
      withCredentials: true,
    }
  );
};
