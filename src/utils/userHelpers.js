/**
 * Verifica si un email existe en el sistema
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} - true si el email existe, false si no
 */
export const emailExists = async (email) => {
  try {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/api/usuarios/email/${email}`);
    return response.ok;
  } catch (error) {
    console.error('Error al verificar email:', error);
    return false;
  }
};

/**
 * Obtiene un usuario por su email
 * @param {string} email - Email del usuario
 * @returns {Promise<object|null>} - Usuario encontrado o null
 */
export const getUserByEmail = async (email) => {
  try {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/api/usuarios/email/${email}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

/**
 * Obtiene todos los usuarios registrados
 * @returns {Promise<array>} - Array de usuarios
 */
export const getAllUsers = async () => {
  try {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/api/usuarios`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};