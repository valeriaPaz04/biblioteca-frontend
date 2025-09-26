import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/RegisterLibro.css';

const RegisterLibro = () => {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para edición de libro
  const [editLibro, setEditLibro] = useState(null);

  // Cargar libros y autores recientes al montar el componente
  useEffect(() => {
    fetchLibros();
    fetchAutores();
    const editData = localStorage.getItem('editLibro');
    if (editData) {
      setEditLibro(JSON.parse(editData));
      localStorage.removeItem('editLibro');
    }
  }, []);

  const fetchLibros = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros`);
      if (!res.ok) throw new Error('Error al cargar libros');
      const data = await res.json();
      setLibros(data);
    } catch (err) {
      setError('Error al cargar libros');
    }
  };

  const fetchAutores = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores`);
      if (!res.ok) throw new Error('Error al cargar autores');
      const data = await res.json();
      setAutores(data);
    } catch (err) {
      setError('Error al cargar autores');
    }
  };

  // Eliminar libro
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este libro?")) return;
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Libro eliminado correctamente");
        fetchLibros();
      } else {
        const err = await res.json();
        alert(err.error || "Error al eliminar libro");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  // Al hacer click en editar, llenar el formulario con los datos del libro
  const handleEdit = (libro) => {
    setEditLibro(libro);
  };

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      titulo: form.titulo.value,
      autor: form.autor.value,
      isbn: form.isbn.value,
      anioPublicacion: form.anioPublicacion.value,
      genero: form.genero.value,
      editorial: form.editorial.value,
      foto: form.portadaUrl.value,
      descripcion: form.sinopsis.value
    };
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros/${editLibro._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Libro actualizado correctamente");
        setEditLibro(null);
        form.reset();
        fetchLibros();
      } else {
        const err = await res.json();
        alert(err.error || "Error al editar libro");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const form = e.target;

    const data = {
      titulo: form.titulo.value,
      autor: form.autor.value,
      isbn: form.isbn.value,
      anioPublicacion: form.anioPublicacion.value,
      genero: form.genero.value,
      editorial: form.editorial.value,
      foto: form.portadaUrl.value,
      descripcion: form.sinopsis.value
    };

    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSuccess('Libro registrado correctamente');
        form.reset();
        fetchLibros();
      } else {
        const err = await res.json();
        setError(err.error || 'Error al registrar libro');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-libro-container">
      <h1 className="main-title">Registra un Nuevo Libro</h1>
      <div className="title-border"></div>
      <div className="header-section">
        <Link to="/books" className="back-button">
          <span className="back-arrow">&#8592;</span> VOLVER
        </Link>
        <div className="form-title-section">
          <span className="person-icon"><i className="fi fi-rr-book"></i></span>
          <h1 className="form-title">Formulario de Registro</h1>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

      <form onSubmit={editLibro ? handleUpdate : handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" defaultValue={editLibro?.titulo || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="autor">Autor</label>
            <select id="autor" name="autor" defaultValue={editLibro?.autor?._id || ""} required>
              <option value="">Selecciona un autor</option>
              {autores.map(autor => (
                <option key={autor._id} value={autor._id}>
                  {autor.nombre} {autor.apellido}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input type="text" id="isbn" name="isbn" defaultValue={editLibro?.isbn || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="anioPublicacion">Año de Publicación</label>
            <input type="text" id="anioPublicacion" name="anioPublicacion" defaultValue={editLibro?.anioPublicacion || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="genero">Género</label>
            <input type="text" id="genero" name="genero" defaultValue={editLibro?.genero || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="editorial">Editorial</label>
            <input type="text" id="editorial" name="editorial" defaultValue={editLibro?.editorial || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="portadaUrl">Portada (URL)</label>
            <input type="url" id="portadaUrl" name="portadaUrl" defaultValue={editLibro?.foto || ""} required />
          </div>
          <div className="form-group full-width">
            <label htmlFor="sinopsis">Sinopsis</label>
            <textarea id="sinopsis" name="sinopsis" defaultValue={editLibro?.descripcion || ""} required></textarea>
          </div>
        </div>
        <div className="register-button-container">
          <button type="submit" className="register-button" disabled={loading}>
            {editLibro ? "Guardar Cambios" : (loading ? 'Registrando...' : 'Registrar')}
          </button>
          {editLibro && (
            <button type="button" className="register-button" style={{background:'#ccc',color:'#333',marginLeft:'10px'}} onClick={()=>{setEditLibro(null);document.querySelector('form').reset();}}>Cancelar</button>
          )}
        </div>
      </form>

      <h2 className="main-title" style={{ marginTop: '40px' }}>Libros Registrados</h2>
      <div className="title-border"></div>

      <div className="authors-grid">
        {libros.length === 0 ? (
          <p style={{textAlign: 'center'}}>No hay libros registrados recientemente.</p>
        ) : (
          libros.map(libro => (
            <div key={libro._id} className="author-card">
              <img src={libro.foto} alt={libro.titulo} style={{ borderRadius: '0', width: '100px', height: '150px', objectFit: 'cover' }} />
              <p>{libro.titulo}</p>
              <div className="author-actions">
                <button onClick={() => handleEdit(libro)}>Editar</button>
                <button onClick={() => handleDelete(libro._id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegisterLibro;
