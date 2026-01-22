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
import EditReview from './pages/Edit&Review/EditReview';
import { useEffect } from 'react';
import ComplianceResults from './pages/Result/ComplianceResult';

function App() {
//   useEffect(() => {
//     const handlePopState = () => {
//       alert("Upload in progress. Please wait until it completes.");
//       window.history.pushState(null, "", window.location.href);
//     };

//     window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);
// useEffect(() => {
//   const blockRefresh = (event: BeforeUnloadEvent) => {
//     event.preventDefault();
//     event.returnValue = ""; // REQUIRED
//   };

//   window.addEventListener("beforeunload", blockRefresh);

//   return () => {
//     window.removeEventListener("beforeunload", blockRefresh);
//   };
// }, []);

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
            <Route path="/editreview" element={<EditReview />} />
            <Route path="/result" element={<ComplianceResults/>} />
          </Route>
          {/* <Route path="/analyzing" element={<AnalyzingDocuments />} /> */}
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App
