
import  Home  from './components/Home';
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
