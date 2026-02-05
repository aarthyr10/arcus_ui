import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';
import UploadProgress from './pages/UploadDocuments/UploadProgress';
import ComplianceDocuments from './pages/ComplianceDocuments/ComplianceDocuments';
import TrainingDocuments from './pages/Training Documents/TrainingDocuments';
import ComplianceResults from './pages/ComplianceDocuments/ComplianceResult';
import TrainingDocumentsResult from './pages/Training Documents/TrainingDocumentsResult';
import UploadTrainingDocument from './pages/Training Documents/UploadTrainingDocument';
import EditReviewComplianceDocuments from './pages/ComplianceDocuments/EditReviewComplianceDocuments';
import SmartAssistant from './pages/SmartAssitant/SmartAssistant';

function App() {

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
              <Route path="/compliance/edit/:docId/:id" element={<EditReviewComplianceDocuments />} />
              <Route path="/knowledge" element={<TrainingDocuments />} />
              <Route path="/uploadknowledge" element={<UploadTrainingDocument />} />
              <Route path="/knowledgeresult/:docId" element={<TrainingDocumentsResult />} />
              <Route path='/assistant' element={<SmartAssistant />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
