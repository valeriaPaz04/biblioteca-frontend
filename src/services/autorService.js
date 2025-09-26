
const API_URL = 'http://localhost:3000/api/autores'; // Ajusta la URL si es necesario

export const registrarAutor = async (autorData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(autorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar el autor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registrarAutor:', error);
    throw error;
  }
};
