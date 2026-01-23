import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
// import "@mantine/core/styles.css";
// import "@mantine/dates/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';
import UploadProgress from './pages/UploadDocuments/UploadProgress';
import ComplianceDocuments from './pages/ComplianceDocuments/ComplianceDocuments';
import EditReview from './pages/Edit&Review/EditReview';
// import ComplianceResults from './pages/Result/ComplianceResult';
import axios from 'axios';
import TrainingDocuments from './pages/Training Documents/TrainingDocuments';
import ComplianceResults from './pages/ComplianceDocuments/ComplianceResult';
import TrainingDocumentsResult from './pages/Training Documents/TrainingDocumentsResult';
import UploadTrainingDocument from './pages/Training Documents/UploadTrainingDocument';

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
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.config.headers["X-Skip-Interceptor"] === "true") {
        return Promise.reject(error);
      }
      // else if (error.response && error.response.status === 500) {
      //   showServerErrorToast();
      // }
      return Promise.reject(error);
    }
  );

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
            </Route>
            {/* <Route path="/analyzing" element={<AnalyzingDocuments />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
