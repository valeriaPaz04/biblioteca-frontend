
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages/css/Profile.css";

export default function Profile() {
  const { user, login } = useAuth();

  // Datos del usuario logueado
  const [editMode, setEditMode] = useState(false);
  const [prestamos, setPrestamos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || ""
  });

  useEffect(() => {
    if (user) {
      fetchPrestamos();
    }
  }, [user]);

  const fetchPrestamos = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/prestamos/usuario/${user._id}`);
      if (!res.ok) throw new Error('Error al cargar préstamos');
      const data = await res.json();
      setPrestamos(data);
    } catch (err) {
      console.error(err);
    }
  };
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // Estado para la sección de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const memberSince = user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : "";

  // Iniciales para el logo
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  // Calcular préstamos activos y devueltos
  const activeLoans = prestamos.filter(p => p.estado === 'prestado').length;
  const returnedBooks = prestamos.filter(p => p.estado === 'devuelto').length;
  const lastAccess = user?.ultimoAcceso
    ? new Date(user.ultimoAcceso).toLocaleString('es-ES')
    : 'Sin acceso';

  // Manejar cambios en el formulario de datos personales
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Guardar cambios en el backend
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setSuccess("Datos actualizados correctamente");
        login(updatedUser); // Actualiza el usuario en el contexto
        setEditMode(false);
      } else {
        const data = await res.json();
        setError(data.error || "Error al actualizar los datos");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  // Lógica para actualizar la contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Completa todos los campos");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios/${user._id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (res.ok) {
        setPasswordSuccess("Contraseña actualizada correctamente");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Error al actualizar la contraseña");
      }
    } catch (err) {
      setPasswordError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-initials">
          {getInitials(formData.nombre)}
        </div>
        <h2 className="profile-name">{formData.nombre}</h2>
        <p className="profile-username">{formData.email}</p>

        <div className="profile-stats">
          <Link to="/borrow" className="profile-stat-box" style={{ textDecoration: 'none' }}>
            <span className="profile-stat-number active-loans">{activeLoans}</span>
            <span className="profile-stat-label">Préstamos Activos</span>
          </Link>
          <Link to="/borrow" className="profile-stat-box" style={{ textDecoration: 'none' }}>
            <span className="profile-stat-number">{returnedBooks}</span>
            <span className="profile-stat-label">Libros Devueltos</span>
          </Link>
        </div>
        <div className="profile-separator"></div>

        <div className="profile-membership-info">
          <p className="profile-membership-item">
            <i className="fi fi-rr-calendar-lines"></i> Miembro desde: {memberSince}
          </p>
          <p className="profile-membership-item">
            <i className="fi fi-rr-clock-three"></i> Último acceso: {lastAccess}
          </p>
        </div>
      </div>

      <div className="profile-right-section">
        {/* Sección de Información Personal */}
        <div className="profile-info-section">
          <div className="profile-section-header">
            <h3><i className="fi fi-rr-user"></i> INFORMACION PERSONAL</h3>
            {!editMode ? (
              <button className="edit-button" onClick={() => setEditMode(true)}>Editar</button>
            ) : null}
          </div>
          <form onSubmit={handleSave}>
            <div className="inputGroup">
              <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder=" " readOnly={!editMode} />
              <label htmlFor="nombre">Nombre</label>
            </div>
            <div className="form-group-inline">
              <div className="inputGroup">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " readOnly={!editMode} />
                <label htmlFor="email">Correo electrónico</label>
              </div>
              <div className="inputGroup">
                <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder=" " readOnly={!editMode} />
                <label htmlFor="telefono">Teléfono</label>
              </div>
            </div>
            {editMode && (
              <div className="button-container">
                <button type="submit" className="save-password-button">Guardar Cambios</button>
                <button type="button" className="edit-button" onClick={() => setEditMode(false)}>Cancelar</button>
              </div>
            )}
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>

        {/* Sección de Seguridad */}
        <div className="profile-security-section">
          <div className="profile-section-header">
            <h3><i className="fi fi-rr-lock"></i> SEGURIDAD</h3>
          </div>
          <p className="security-description">¿Deseas cambiar la contraseña de tu cuenta?</p>
          <form onSubmit={handlePasswordSubmit}>
            <div className="inputGroup">
              <input type="password" id="current-password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder=" " />
              <label htmlFor="current-password">Contraseña actual</label>
            </div>
            <div className="form-group-inline">
              <div className="inputGroup">
                <input type="password" id="new-password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder=" " />
                <label htmlFor="new-password">Nueva contraseña</label>
              </div>
              <div className="inputGroup">
                <input type="password" id="confirm-password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder=" " />
                <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="save-password-button">Guardar Contraseña</button>
            </div>
            {passwordSuccess && <p style={{ color: "green" }}>{passwordSuccess}</p>}
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
