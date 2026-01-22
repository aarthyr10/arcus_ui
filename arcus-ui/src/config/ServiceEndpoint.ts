const ServiceEndpoint={
    apiBaseUrl: "https://contractional-napoleon-superblessed.ngrok-free.dev",
    // trainDocuments: {
    //     documentUpload: "/train-documents"
    // }
     // =========================
  // TRAINING DOCUMENTS
  // =========================
  trainDocuments: {
    upload: "/train-documents",                  // POST
    getAll: "/trained-documents",               // GET
    getById: (id: string) =>` /trained-documents/${id}`, // GET
  },

  // =========================
  // UPLOADED DOCUMENTS
  // =========================
  uploadedDocuments: {
    upload: "/upload-documents",                 // POST
    getAll: "/uploaded-documents",               // GET
    getById: (id: string) => `/uploaded-documents/${id}`, // GET
    updateAnswer: (docId: string, questionId: string) =>
     ` /uploaded-documents/${docId}/questions/${questionId}`, // POST
  },

  // =========================
  // CHAT
  // =========================
  chat: {
    send: "/chat",                               // POST
  },

}

export {ServiceEndpoint}