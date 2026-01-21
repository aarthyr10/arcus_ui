import './App.css'
import "./themes/Colors.css";
import "./themes/colorDef.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from './pages/Start';
import UploadDocuments from './pages/UploadDocuments/UploadDocuments';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Start />} />
            <Route element={<AppLayout />}>
              <Route path='/Uploads' element={<UploadDocuments />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
