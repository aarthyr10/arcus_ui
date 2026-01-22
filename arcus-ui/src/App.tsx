import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';
import UploadProgress from './pages/UploadDocuments/UploadProgress';
import AnalyzingDocuments from './pages/UploadDocuments/AnalyzingDocuments';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Start />} />
            <Route element={<AppLayout />}>
              <Route path='/uploads' element={<UploadDocuments />} />
              <Route path='/uploadsprogess' element={<UploadProgress />} />
                <Route path="/analyzing" element={<AnalyzingDocuments />} />
    
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
