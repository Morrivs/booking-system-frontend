import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./app/pages/auth/home";
import Login from "./app/pages/auth/login";
import Register from "./app/pages/auth/register";
import PropertyDetail from "./app/pages/Property/PropertyDetail";
import MyProperties from "./app/pages/Property/PropertyListHost";
import MyBookings from "./app/pages/bookings/MyBookingsPage";
import HostBookings from "./app/components/booking/HostBookings";
import ProtectedRoute from "./app/components/protecterRoute";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />

          {/* --- RUTAS PROTEGIDAS (Solo con Token) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mis-propiedades" element={<MyProperties />} />
            <Route path="/mis-reservas" element={<MyBookings />} />
            <Route path="/mis-solicitudes" element={<HostBookings />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
