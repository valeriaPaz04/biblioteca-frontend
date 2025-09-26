import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./css/Forms.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Backend (único)
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      });
      if (res.ok) {
        const userBackend = await res.json();
        login(userBackend);
        navigate("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Usuario no encontrado.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <div className="login-logo">
            <svg
              className="nexus-logo"
              viewBox="0 0 120 53"
              width="120"
              height="53"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Biblioteca Nexus Logo"
            >
              <path
                className="svg-path-color"
                d="M81.167 11.151l1.293 2.909.645-3.07 3.071-.323-2.746-1.616.646-2.908-2.264 1.939-2.583-1.455 1.13 2.747-2.261 2.101zM98.456 28.117l2.101-2.424 2.748 1.293-1.455-2.585 1.938-2.424-2.908.647-1.616-2.586-.325 3.07-3.068.646 2.908 1.293zM57.738 7.597l2.585-1.939 2.424 1.939-.97-3.07 2.584-1.777h-3.068l-.97-2.909-.969 2.909h-3.07l2.424 1.777zM37.379 10.99l.646 3.07 1.293-2.909 3.07.324-2.424-2.101 1.293-2.747-2.586 1.455-2.423-1.939.646 2.908-2.585 1.616zM17.182 26.986l2.746-1.293 2.101 2.424-.323-3.07 2.747-1.293-2.909-.646-.323-3.07-1.616 2.586-3.07-.647 2.101 2.424zM119.784 49.932l-1.454-2.425H62.585c0-1.938 2.101-1.938 3.231-1.938h51.543l-1.453-2.424H67.109c-1.293 0-3.555.162-4.201.322.646-2.262 4.361-2.424 9.533-2.424h42.172l-1.454-2.423H73.411c-4.04 0-8.079.161-10.181 1.614 1.938-2.745 5.334-3.555 13.572-3.555h35.225l-1.453-2.424H76.966C64.848 34.257 60 37.328 60 47.021c0-9.693-4.847-12.766-16.966-12.766H9.426L7.972 36.68h35.062c8.24 0 11.634.81 13.573 3.555-2.101-1.453-5.979-1.614-10.18-1.614H6.841l-1.454 2.423h42.171c5.333 0 8.887.162 9.533 2.424-.646-.16-2.908-.322-4.201-.322H4.094l-1.454 2.42h51.543c1.131 0 3.232 0 3.232 1.939H1.67L.216 49.93h57.36v1.454h5.009V49.93h57.199v.002z"
              />
            </svg>
          </div>
          <h3 className="login-title">INICIO DE SESIÓN</h3>
          <p className="login-subtitle">Bienvenido a Biblioteca Nexus</p>
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="inputGroup">
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="username">Email</label>
          </div>
          <div className="inputGroup">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="login-button">
            LOGIN
          </button>
          <div className="forgot-password">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="register-link">
            <p>
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
