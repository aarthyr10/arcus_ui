import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';
import UploadProgress from './pages/UploadDocuments/UploadProgress';
import AnalyzingDocuments from './pages/UploadDocuments/AnalyzingDocuments';
import ComplianceDocuments from './pages/ComplianceDocuments/ComplianceDocuments';
import { EditReviewScreen } from './pages/Edit&Review/EditReviewScreen';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Start />} />
            <Route element={<AppLayout />}>
              <Route path='/uploads' element={<UploadDocuments />} />
              <Route path='/uploadsprogess' element={<UploadProgress />} />
                <Route path="/compliance" element={<ComplianceDocuments />} />
                <Route path="/editreviewscreen" element={<EditReviewScreen/>} />
            </Route>
                <Route path="/analyzing" element={<AnalyzingDocuments />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
