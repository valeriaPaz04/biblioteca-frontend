import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MessageAlert from "../components/Common/MessageAlert";
import { validateEmail, validatePassword, validatePasswordMatch, validateResetCode } from "../utils/validators";
import "./css/ResetPassword.css";


const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { loading, error, success, resetPassword, clearMessages } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validación en tiempo real
    const newErrors = { ...validationErrors };

    switch (name) {
      case 'email':
        const emailValidation = validateEmail(value);
        if (emailValidation.isValid) {
          delete newErrors.email;
        } else {
          newErrors.email = emailValidation.error;
        }
        break;
      case 'code':
        const codeValidation = validateResetCode(value);
        if (codeValidation.isValid) {
          delete newErrors.code;
        } else {
          newErrors.code = codeValidation.error;
        }
        break;
      case 'newPassword':
        const passwordValidation = validatePassword(value);
        if (passwordValidation.isValid) {
          delete newErrors.newPassword;
        } else {
          newErrors.newPassword = passwordValidation.error;
        }
        // Revalidar confirmación si existe
        if (formData.confirmPassword) {
          const matchValidation = validatePasswordMatch(value, formData.confirmPassword);
          if (matchValidation.isValid) {
            delete newErrors.confirmPassword;
          } else {
            newErrors.confirmPassword = matchValidation.error;
          }
        }
        break;
      case 'confirmPassword':
        const matchValidation = validatePasswordMatch(formData.newPassword, value);
        if (matchValidation.isValid) {
          delete newErrors.confirmPassword;
        } else {
          newErrors.confirmPassword = matchValidation.error;
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    // Validar todos los campos
    const errors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;

    const codeValidation = validateResetCode(formData.code);
    if (!codeValidation.isValid) errors.code = codeValidation.error;

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) errors.newPassword = passwordValidation.error;

    const matchValidation = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
    if (!matchValidation.isValid) errors.confirmPassword = matchValidation.error;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await resetPassword(formData.email, formData.code, formData.newPassword);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isFormValid = formData.email && formData.code && formData.newPassword && formData.confirmPassword && !hasValidationErrors;

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
          <h3 className="login-title">Restablecer Contraseña</h3>
          <p className="login-subtitle">Ingresa el código que recibiste por email y tu nueva contraseña.</p>
        </div>

        {/* Mensajes */}
        <MessageAlert type="error" message={error} onClose={clearMessages} />
        <MessageAlert type="success" message={success} onClose={clearMessages} />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="inputGroup">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              className={validationErrors.email ? 'input-error' : ''}
            />
            <label htmlFor="email">Correo electrónico</label>
            <MessageAlert type="error" message={validationErrors.email} />
          </div>

          <div className="inputGroup">
            <input
              type="text"
              id="code"
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              maxLength="6"
              className={validationErrors.code ? 'input-error' : ''}
            />
            <label htmlFor="code">Código de recuperación</label>
            <MessageAlert type="error" message={validationErrors.code} />
          </div>

          <div className="inputGroup">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              minLength="6"
              className={validationErrors.newPassword ? 'input-error' : ''}
            />
            <label htmlFor="newPassword">Nueva contraseña</label>
            <MessageAlert type="error" message={validationErrors.newPassword} />
          </div>

          <div className="inputGroup">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              minLength="6"
              className={validationErrors.confirmPassword ? 'input-error' : ''}
            />
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <MessageAlert type="error" message={validationErrors.confirmPassword} />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <LoadingSpinner small /> Restableciendo...
              </>
            ) : (
              "Restablecer contraseña"
            )}
          </button>
        </form>

        <div className="register-link">
          <p>
            ¿No tienes un código? <Link to="/forgot-password">Solicitar código</Link>
          </p>
          <p>
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
