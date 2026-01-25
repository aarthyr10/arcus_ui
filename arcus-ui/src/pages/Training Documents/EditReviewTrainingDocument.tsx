import React, { useState } from 'react';
import { ChevronLeft, Book, Calendar, HardDrive, Download, FileText } from 'lucide-react';

export default function EditReviewTrainingDocument() {
  const [selectedChunk, setSelectedChunk] = useState(null);

  const document = {
    title: "HVAC Installation Manual v3.2",
    type: "Manual",
    status: "Trained",
    uploadedOn: "2026-01-12",
    lastTrainedOn: "2026-01-15",
    fileSize: "12.4 MB",
    totalPages: 145,
    aiIndexStatus: "Ready"
  };

  const metaTags = [
    "Energy Efficiency Standards",
    "Maintenance Guidelines", 
    "Refrigerant Specifications",
    "Electrical Requirements",
    "Ductwork Design",
    "Quality Assurance"
  ];

  const chunks = [
    { id: 1, pages: "1-25", title: "Introduction & Safety", status: "Trained" },
    { id: 2, pages: "26-75", title: "Installation Procedures", status: "Trained" },
    { id: 3, pages: "76-120", title: "Technical Specifications", status: "Trained" },
    { id: 4, pages: "121-145", title: "Appendices", status: "Low Certainty" }
  ];

  const getStatusColor = (status:any) => {
    if (status === "Trained") return "bg-green-500";
    if (status === "Low Certainty") return "bg-orange-500";
    return "bg-gray-400";
  };

  const getStatusTextColor = (status:any) => {
    if (status === "Trained") return "text-green-700 bg-green-100";
    if (status === "Low Certainty") return "text-orange-700 bg-orange-100";
    return "text-gray-700 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Training Documents</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Book className="text-white" size={28} />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {document.title}
                </h1>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {document.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Summary Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Document Summary</h2>
          
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Document Type</p>
              <p className="font-medium text-gray-900">{document.type}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Uploaded On</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">{document.uploadedOn}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">File Size</p>
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">{document.fileSize}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Pages</p>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">{document.totalPages}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Trained On</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-medium text-gray-900">{document.lastTrainedOn}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">AI Index Status</p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {document.aiIndexStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Data Tags */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            <span className="text-cyan-500 mr-2">🏷️</span>
            Meta Data Tag
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            AI-identified topics and key standards
          </p>
          
          <div className="flex flex-wrap gap-3">
            {metaTags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chunk Information */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Chunk Information</h2>
          
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedChunk(chunk.id)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">
                    Pages {chunk.pages} • {chunk.title}
                  </p>
                </div>
                
                <span className={`px-4 py-2 ${getStatusTextColor(chunk.status)} text-sm font-medium rounded-full`}>
                  {chunk.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
            <Download size={18} />
            Download Document
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            Retrain AI Model
          </button>
        </div>
      </div>
    </div>
  );
}