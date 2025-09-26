import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [librosCount, setLibrosCount] = useState(0);
  const [autoresCount, setAutoresCount] = useState(0);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [prestamosCount, setPrestamosCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const [librosRes, autoresRes, usuariosRes, prestamosRes] = await Promise.all([
        fetch(`${API_BASE}/api/libros`),
        fetch(`${API_BASE}/api/autores`),
        fetch(`${API_BASE}/api/usuarios`),
        fetch(`${API_BASE}/api/prestamos`)
      ]);

      const libros = await librosRes.json();
      const autores = await autoresRes.json();
      const usuarios = await usuariosRes.json();
      const prestamos = await prestamosRes.json();

      setLibrosCount(libros.length);
      setAutoresCount(autores.length);
      setUsuariosCount(usuarios.length);
      setPrestamosCount(prestamos.length);
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="main-title">Bienvenid@ {user?.username}! Conoce Biblioteca Nexus</h1>
        <div className="title-border"></div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card libros">
          <h2>Libros</h2>
          <p className="stat-number">{librosCount}</p>
          <Link to="/register-libro" className="stat-button">Añadir Libro</Link>
        </div>
        <div className="stat-card autores">
          <h2>Autores</h2>
          <p className="stat-number">{autoresCount}</p>
          <Link to="/register-escritor" className="stat-button">Añadir Autor</Link>
        </div>
        <div className="stat-card usuarios">
          <h2>Usuarios</h2>
          <p className="stat-number">{usuariosCount}</p>
          <Link to="/register-user" className="stat-button">Añadir Usuario</Link>
        </div>
        <div className="stat-card prestamos">
          <h2>Préstamos</h2>
          <p className="stat-number">{prestamosCount}</p>
          <Link to="/borrow" className="stat-button">Ver Préstamos</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;