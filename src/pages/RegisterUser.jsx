import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/RegisterUser.css';

const RegisterUser = () => {
  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  // Estado para usuarios
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Recargar usuarios
  const fetchUsers = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios`);
      if (!res.ok) throw new Error("No se pudo obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  const visibleUsers = users.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(users.length);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Usuario eliminado correctamente");
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Error al eliminar usuario");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  // Estado para edición de usuario
  const [editUser, setEditUser] = useState(null);

  // Al hacer click en editar, llenar el formulario con los datos del usuario
  const handleEdit = (user) => {
    setEditUser(user);
  };

  // Guardar cambios de edición
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      telefono: form.telefono.value,
      role: form.role.value,
      genero: form.genero.value,
      fechaNacimiento: form.fechaNacimiento.value
    };
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Usuario actualizado correctamente");
        setEditUser(null);
        form.reset();
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Error al editar usuario");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="register-escritor-container">
      <h1 className="main-title">Registra un Nuevo Usuario</h1>
      <div className="title-border"></div>
      <div className="header-section">
        <Link to="/user" className="back-button">
          <span className="back-arrow">&#8592;</span> VOLVER
        </Link>
        <div className="form-title-section">
          <span className="person-icon"><i className="fi fi-rr-user-add"></i></span>
          <h1 className="form-title">Formulario de Registro</h1>
        </div>
      </div>

      <form onSubmit={editUser ? handleUpdate : async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
          nombre: form.nombre.value,
          email: form.email.value,
          password: form.password.value,
          telefono: form.telefono.value,
          role: form.role.value,
          genero: form.genero.value,
          fechaNacimiento: form.fechaNacimiento.value
        };
        try {
          const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
          const res = await fetch(`${API_BASE}/api/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            alert("Usuario registrado correctamente");
            form.reset();
            fetchUsers();
          } else {
            const err = await res.json();
            alert(err.error || "Error al registrar usuario");
          }
        } catch (err) {
          alert("Error de conexión con el servidor");
        }
      }}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de Usuario</label>
            <input type="text" id="nombre" name="nombre" required defaultValue={editUser?.nombre || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required defaultValue={editUser?.email || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required defaultValue={editUser?.password || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input type="text" id="telefono" name="telefono" required defaultValue={editUser?.telefono || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select id="role" name="role" required defaultValue={editUser?.role || ""}>
              <option value="">Selecciona un rol</option>
              <option value="Lector">Lector</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="genero">Género</label>
            <select id="genero" name="genero" required defaultValue={editUser?.genero || ""}>
              <option value="">Selecciona género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" defaultValue={editUser?.fechaNacimiento ? editUser.fechaNacimiento.slice(0,10) : ""} />
          </div>
        </div>
        <div className="register-button-container">
          <button type="submit" className="register-button">{editUser ? "Guardar Cambios" : "Registrar Usuario"}</button>
          {editUser && (
            <button type="button" className="register-button" style={{background:'#ccc',color:'#333',marginLeft:'10px'}} onClick={()=>{setEditUser(null);document.querySelector('form').reset();}}>Cancelar</button>
          )}
        </div>
      </form>

      <h2 className="main-title" style={{ marginTop: '40px' }}>Usuarios Registrados</h2>
      <div className="title-border"></div>

      <div className="users-grid">
        {/* Mostrar usuarios desde la base de datos */}
        {visibleUsers.length === 0 ? (
          <p style={{textAlign: 'center'}}>No hay usuarios registrados.</p>
        ) : (
          visibleUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-initials">{getInitials(user.nombre)}</div>
              <p>{user.nombre}</p>
              <div className="user-actions">
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {visibleCount < users.length && (
        <button onClick={handleShowMore} style={{marginTop: '20px'}}>VER MÁS USUARIOS</button>
      )}
    </div>
  );
};

export default RegisterUser;
