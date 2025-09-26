import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import User from './pages/User';
import Escritores from './pages/Escritores'
import Libros from './pages/Libros'
import Prestamos from './pages/Prestamos'
import RegisterEscritor from './pages/RegisterEscritor'
import RegisterLibro from './pages/RegisterLibro'
import RegisterUser from './pages/RegisterUser'
import RegisterPrestamo from './pages/RegisterPrestamo'
import LibroDetalle from './pages/LibroDetalle'
import EscritorDetalle from './pages/EscritorDetalle'

import Footer from "./components/Footer";




export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
        <Route path="/authors" element={<PrivateRoute><Escritores /></PrivateRoute>} />
        <Route path="/books" element={<PrivateRoute><Libros /></PrivateRoute>} />
        <Route path="/book/:id" element={<PrivateRoute><LibroDetalle /></PrivateRoute>} />
        <Route path="/authors/:id" element={<PrivateRoute><EscritorDetalle /></PrivateRoute>} />
        <Route path="/borrow" element={<PrivateRoute><Prestamos /></PrivateRoute>} />
        <Route path="/register-escritor" element={<PrivateRoute><RegisterEscritor /></PrivateRoute>} />
        <Route path="/register-libro" element={<PrivateRoute><RegisterLibro /></PrivateRoute>} />
        <Route path="/register-user" element={<PrivateRoute><RegisterUser /></PrivateRoute>} />
        <Route path="/register-prestamo" element={<PrivateRoute><RegisterPrestamo /></PrivateRoute>} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/profile" element={ <PrivateRoute> <Profile /> </PrivateRoute>}/>
      </Routes>
      <Footer />
    </>
  );
}