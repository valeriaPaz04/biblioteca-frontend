import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/RegisterEscritor.css';

const RegisterEscritor = () => {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para edición de autor
  const [editAutor, setEditAutor] = useState(null);

  // Cargar autores recientes al montar el componente
  useEffect(() => {
    fetchAutores();
  }, []);

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

  // Eliminar autor
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este autor?")) return;
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Autor eliminado correctamente");
        fetchAutores();
      } else {
        const err = await res.json();
        alert(err.error || "Error al eliminar autor");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  // Al hacer click en editar, llenar el formulario con los datos del autor
  const handleEdit = (autor) => {
    setEditAutor(autor);
  };

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      nacionalidad: form.nacionalidad.value,
      fechaNacimiento: form.fechaNacimiento.value,
      generoLiterario: form.generoLiterario.value,
      idiomaPrincipal: form.idiomaPrincipal.value,
      foto: form.fotografiaUrl.value,
      biografia: form.biografia.value
    };
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores/${editAutor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Autor actualizado correctamente");
        setEditAutor(null);
        form.reset();
        fetchAutores();
      } else {
        const err = await res.json();
        alert(err.error || "Error al editar autor");
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
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      nacionalidad: form.nacionalidad.value,
      fechaNacimiento: form.fechaNacimiento.value,
      generoLiterario: form.generoLiterario.value,
      idiomaPrincipal: form.idiomaPrincipal.value,
      foto: form.fotografiaUrl.value,
      biografia: form.biografia.value
    };

    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSuccess('Autor registrado correctamente');
        form.reset();
        fetchAutores();
      } else {
        const err = await res.json();
        setError(err.error || 'Error al registrar autor');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-escritor-container">
      <h1 className="main-title">Registra un Nuevo Escritor</h1>
      <div className="title-border"></div>
      <div className="header-section">
        <Link to="/authors" className="back-button">
          <span className="back-arrow">&#8592;</span> VOLVER
        </Link>
        <div className="form-title-section">
          <span className="person-icon"><i className="fi fi-rr-user"></i></span>
          <h1 className="form-title">Formulario de Registro</h1>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

      <form onSubmit={editAutor ? handleUpdate : handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" defaultValue={editAutor?.nombre || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input type="text" id="apellido" name="apellido" defaultValue={editAutor?.apellido || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="nacionalidad">Nacionalidad</label>
            <input type="text" id="nacionalidad" name="nacionalidad" defaultValue={editAutor?.nacionalidad || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" defaultValue={editAutor?.fechaNacimiento ? editAutor.fechaNacimiento.slice(0,10) : ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="generoLiterario">Género Literario</label>
            <input type="text" id="generoLiterario" name="generoLiterario" defaultValue={editAutor?.generoLiterario || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="idiomaPrincipal">Idioma Principal</label>
            <input type="text" id="idiomaPrincipal" name="idiomaPrincipal" defaultValue={editAutor?.idiomaPrincipal || ""} required />
          </div>
          <div className="form-group">
            <label htmlFor="fotografiaUrl">Fotografía (URL)</label>
            <input type="url" id="fotografiaUrl" name="fotografiaUrl" defaultValue={editAutor?.foto || ""} required />
          </div>
          <div className="form-group full-width">
            <label htmlFor="biografia">Biografía</label>
            <textarea id="biografia" name="biografia" defaultValue={editAutor?.biografia || ""}></textarea>
          </div>
        </div>
        <div className="register-button-container">
          <button type="submit" className="register-button" disabled={loading}>
            {editAutor ? "Guardar Cambios" : (loading ? 'Registrando...' : 'Registrar')}
          </button>
          {editAutor && (
            <button type="button" className="register-button" style={{background:'#ccc',color:'#333',marginLeft:'10px'}} onClick={()=>{setEditAutor(null);document.querySelector('form').reset();}}>Cancelar</button>
          )}
        </div>
      </form>

      <h2 className="main-title" style={{ marginTop: '40px' }}>Autores Registrados</h2>
      <div className="title-border"></div>

      <div className="authors-grid">
        {autores.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hay autores registrados recientemente.</p>
        ) : (
          autores.map(autor => (
            <div key={autor._id} className="author-card">
              <img src={autor.foto} alt={`${autor.nombre} ${autor.apellido}`} />
              <p>{autor.nombre} {autor.apellido}</p>
              <div className="author-actions">
                <button onClick={() => handleEdit(autor)}>Editar</button>
                <button onClick={() => handleDelete(autor._id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
  );
};

export default RegisterEscritor;