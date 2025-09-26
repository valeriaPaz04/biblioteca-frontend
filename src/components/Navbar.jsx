import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Logo from "../assets/logoBiblioteca.png"

import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Initialize theme from localStorage or default to 'light'

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.className = theme; // Apply the theme class to the body
    localStorage.setItem('theme', theme); // Persist theme in localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="nav-links" style={{ display: "flex", justifyContent: "end", }}>
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Mi Cuenta</Link>
            <Link to="/user" style={{ paddingRight: "70px" }}>Comunidad</Link>
          </>
        )}
      </div>

      <div className="nav-logo">
        <Link to="/">
          <img src={Logo} alt="Logo de la Biblioteca" />
        </Link>
        <h1>Biblioteca Nexus</h1>
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/authors">Escritores</Link>
            <Link to="/books">Libros</Link>
            <Link to="/borrow">Préstamos</Link>
            <span>{user.name}</span>
            <a href="#" onClick={logout}>Cerrar sesión</a>
            <button onClick={toggleTheme} className="theme-toggle-button">
              {theme === 'light' ? <span className="theme-icon">⏾</span> : <span className="theme-icon">☀︎</span>}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <button onClick={toggleTheme} className="theme-toggle-button">
              {theme === 'light' ? <span className="theme-icon">⏾</span> : <span className="theme-icon">☀︎</span>}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
