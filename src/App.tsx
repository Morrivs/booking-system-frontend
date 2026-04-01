import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./app/pages/auth/home";
import Login from "./app/pages/auth/login";
import Register from "./app/pages/auth/register";
import PropertyDetail from "./app/pages/Property/PropertyDetail";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
