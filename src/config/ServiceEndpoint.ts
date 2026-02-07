const ServiceEndpoint = {
  apiBaseUrl: "/api/v1", // Use this for dev (proxy); switch to full URL for prod

  // TRAINING DOCUMENTS
  trainDocuments: {
    upload: "/train-documents", // POST
    getAll: "/trained-documents", // GET
    getById: (id: string) => `/trained-documents/${id}`, // GET
  },

  trainDocumentsimage: {
    getById: (id: string) => `/image-assets/${id}`, // GET
  },

  // UPLOADED DOCUMENTS
  uploadedDocuments: {
    upload: "/upload-documents", // POST
    getAll: "/uploaded-documents", // GET
    getById: (id: string) => `/uploaded-documents/${id}`, // GET
    updateAnswer: (docId: string, questionId: string) =>
      `/uploaded-documents/${docId}/questions/${questionId}`, // POST
  },

  // CHAT
  chat: {
    send: "/chat", // POST
  },
  documentSearch: {
    search: "/docs-search", // POST
  },
};

export { ServiceEndpoint };
