import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';
import UploadProgress from './pages/UploadDocuments/UploadProgress';
import ComplianceDocuments from './pages/ComplianceDocuments/ComplianceDocuments';
import EditReview from './pages/Edit&Review/EditReview';
import TrainingDocuments from './pages/Training Documents/TrainingDocuments';
import ComplianceResults from './pages/ComplianceDocuments/ComplianceResult';
import TrainingDocumentsResult from './pages/Training Documents/TrainingDocumentsResult';
import UploadTrainingDocument from './pages/Training Documents/UploadTrainingDocument';
import EditReviewTrainingDocument from './pages/Training Documents/EditReviewTrainingDocument';
import { useEffect } from 'react';

function App() {
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

  return (
    <>
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Start />} />
            <Route element={<AppLayout />}>
              <Route path='/uploads' element={<UploadDocuments />} />
              <Route path='/uploadsprogess' element={<UploadProgress />} />
              <Route path="/compliance" element={<ComplianceDocuments />} />
              <Route path="/complianceresult/:docId" element={<ComplianceResults />} />
              <Route path="/compliance/edit/:docId/:id" element={<EditReview />} />
              <Route path="/knowledge" element={<TrainingDocuments />} />
              <Route path="/uploadknowledge" element={<UploadTrainingDocument />} />
              <Route path="/knowledgeresult/:docId" element={<TrainingDocumentsResult />} />
              <Route path="/knowledge/edit/:docId/:id" element={<EditReviewTrainingDocument />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
