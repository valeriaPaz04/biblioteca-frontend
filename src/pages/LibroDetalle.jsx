import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/LibroDetalle.css';

export default function LibroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchLibro();
  }, [id]);

  const fetchLibro = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros/${id}`);
      if (!res.ok) throw new Error('Libro no encontrado');
      const data = await res.json();
      setLibro(data);
    } catch (err) {
      setError('Error al cargar el libro');
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarPrestamo = async () => {
    setErrorMessage('');
    if (!user) {
      setErrorMessage('Debes iniciar sesión para solicitar un préstamo');
      return;
    }
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 14); // 14 días

    const data = {
      usuario: user._id,
      libro: id,
      fechaLimite: fechaLimite.toISOString()
    };

    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/prestamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Préstamo solicitado exitosamente');
        navigate('/borrow');
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Error al solicitar préstamo');
      }
    } catch (err) {
      setErrorMessage('Error de conexión');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!libro) return <div>Libro no encontrado</div>;

  return (
    <div className="libro-detalle-container">
      <h1 className="main-title">Detalles del Libro</h1>
      <div className="title-border"></div>

      <div className="libro-detalle-content">
        <div className="libro-info">
          <h2 className="libro-titulo">{libro.titulo}</h2>
          <p className="libro-autor"><strong>Autor:</strong> {libro.autor.nombre} {libro.autor.apellido || ''}</p>
          <p className="libro-isbn"><strong>ISBN:</strong> {libro.isbn}</p>
          <p className="libro-anio"><strong>Año de Publicación:</strong> {libro.anioPublicacion}</p>
          <p className="libro-genero"><strong>Género:</strong> {libro.genero}</p>
          <p className="libro-editorial"><strong>Editorial:</strong> {libro.editorial}</p>
          <p className="libro-descripcion"><strong>Descripción:</strong> {libro.descripcion}</p>
        </div>
        <div className="libro-imagen">
          <img src={libro.foto} alt={libro.titulo} />
          {libro.disponible ? (
            <button className="prestamo-button" onClick={handleSolicitarPrestamo}>SOLICITAR PRÉSTAMO</button>
          ) : (
            <p className="error-message">Libro no disponible</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>

      <Link to="/books" className="back-button">
        <span className="back-arrow">&#8592;</span> VOLVER
      </Link>
    </div>
  );
}