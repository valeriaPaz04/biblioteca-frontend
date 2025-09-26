import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/EscritorDetalle.css';

export default function EscritorDetalle() {
  const { id } = useParams();
  const [autor, setAutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAutor();
  }, [id]);

  const fetchAutor = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores/${id}`);
      if (!res.ok) throw new Error('Autor no encontrado');
      const data = await res.json();
      setAutor(data);
    } catch (err) {
      setError('Error al cargar el autor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!autor) return <div>Autor no encontrado</div>;

  return (
    <div className="escritor-detalle-container">
      <h1 className="main-title">Detalles del Autor</h1>
      <div className="title-border"></div>

      <div className="escritor-detalle-content">
        <div className="escritor-info">
          <h2 className="escritor-nombre">{autor.nombre} {autor.apellido}</h2>
          <p className="escritor-nacionalidad"><strong>Nacionalidad:</strong> {autor.nacionalidad}</p>
          <p className="escritor-fecha"><strong>Fecha de Nacimiento:</strong> {new Date(autor.fechaNacimiento).toLocaleDateString()}</p>
          <p className="escritor-genero"><strong>Género Literario:</strong> {autor.generoLiterario}</p>
          <p className="escritor-idioma"><strong>Idioma Principal:</strong> {autor.idiomaPrincipal}</p>
          <p className="escritor-biografia"><strong>Biografía:</strong> {autor.biografia}</p>
        </div>
        <div className="escritor-imagen">
          <img src={autor.foto} alt={`${autor.nombre} ${autor.apellido}`} />
        </div>
      </div>

      <Link to="/authors" className="back-button">
        <span className="back-arrow">&#8592;</span> VOLVER
      </Link>
    </div>
  );
}