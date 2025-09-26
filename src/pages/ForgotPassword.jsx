import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import { validateEmail } from "../utils/validators";
import { emailExists } from "../utils/userHelpers";
import EmailJSConfig from "../components/EmailJSConfig";
import "./css/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [isEmailJSConfigured, setIsEmailJSConfigured] = useState(false);
  const { loading, error, success, requestPasswordReset, clearMessages } = useAuth();

  // Verificar si EmailJS está configurado
  React.useEffect(() => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const configured = serviceId && templateId && publicKey &&
                      serviceId !== 'tu-service-id' &&
                      templateId !== 'tu-template-id' &&
                      publicKey !== 'tu-public-key';

    setIsEmailJSConfigured(configured);
  }, []);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Limpiar errores previos
    setEmailError("");
    clearMessages();

    // Validar email en tiempo real
    if (newEmail && !validateEmail(newEmail).isValid) {
      setEmailError(validateEmail(newEmail).message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes previos
    setEmailError("");
    clearMessages();

    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      return;
    }

    // Verificar si el email existe antes de proceder
    if (!emailExists(email)) {
      setEmailError("No existe una cuenta asociada a este correo electrónico. ¿Necesitas registrarte?");
      return;
    }

    try {
      await requestPasswordReset(email);
    } catch (err) {
      // Error ya manejado en el hook
      console.error('Error en recuperación de contraseña:', err);
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
          <h3 className="login-title">Recuperar Contraseña</h3>
          <p className="login-subtitle">Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.</p>
        </div>

        {!isEmailJSConfigured && (
          <div>
            <span>⚠️</span>
            <span>EmailJS no está configurado. Se usará modo simulación.</span>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
            >
              {showConfig ? 'Ocultar' : 'Configurar'}
            </button>
          </div>
        )}

        {showConfig && (
          <EmailJSConfig
            onConfigComplete={(configured) => {
              setIsEmailJSConfigured(configured);
              if (configured) {
                setShowConfig(false);
              }
            }}
          />
        )}

        {/* Mensajes */}
        <MessageAlert type="error" message={error} onClose={clearMessages} />
        <MessageAlert type="success" message={success} onClose={clearMessages} />
        <MessageAlert type="error" message={emailError} />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="inputGroup">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder=" "
              disabled={loading}
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !email || emailError}
          >
            {loading ? (
              <>
                <LoadingSpinner small /> Enviando...
              </>
            ) : (
              "Enviar Código de Recuperación"
            )}
          </button>
        </form>

        <div className="forgot-password">
          <p>¿Ya tienes un código? <Link to="/reset-password">Restablecer contraseña</Link></p>
        </div>
        <div className="register-link">
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
