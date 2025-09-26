import React, { useState, useEffect } from 'react';
import './css/Escritores.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Escritores() {
  const [autores, setAutores] = useState([]);
  const [filteredAutores, setFilteredAutores] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedAutorSemana, setSelectedAutorSemana] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

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
      setFilteredAutores(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (letter) => {
    setSelectedLetter(letter);
    if (letter === '') {
      setFilteredAutores(autores);
    } else {
      setFilteredAutores(autores.filter(autor => autor.nombre.toUpperCase().startsWith(letter)));
    }
    setVisibleCount(6); // Reset on filter
  };

  const visibleAutores = filteredAutores.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(filteredAutores.length);
  };

  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  const downloadPDF = async () => {
    const itemsPerPage = 1; // Número de autores por página

    // Convertir imágenes a base64
    const autoresWithBase64 = await Promise.all(autores.map(async (autor) => ({
      ...autor,
      base64Image: await getBase64Image(autor.foto)
    })));

    const pages = [];
    for (let i = 0; i < autoresWithBase64.length; i += itemsPerPage) {
      pages.push(autoresWithBase64.slice(i, i + itemsPerPage));
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pageAutores = pages[pageIndex];
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Biblioteca Nexus - Catálogo de Autores</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background-color: #141414; color: #000000; font-family: 'Times New Roman', Times, serif; min-height: 100vh; padding: 2rem; }
                .container { max-width: 64rem; margin: 0 auto; }
                .header { margin-bottom: 2rem; text-align: center; background-color: #141414; padding-top: 50px; padding-bottom: 30px; }
                .logo-container { display: flex; align-items: center; justify-content: center; gap: 3rem; }
                .book-icon img { width: 250px; }
                .library-title { font-size: 2.6rem; color: #ffffff; font-family: Georgia, serif; font-weight: normal; }
                .main-content { background-color: #ffffff; padding: 2rem; border: 20px solid #000000; }
                .directory-title { font-size: 2rem; font-weight: bold; color: #f42535; text-align: center; margin-bottom: 2rem; }
                .author-card { border: 1.5px solid #f42535; background-color: #ffffff; padding: 1.5rem; margin-bottom: 1rem; }
                .card-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .author-info { display: flex; gap: 1.5rem; align-items: center; }
                .avatar { width: 5rem; height: 5rem; border-radius: 50%; border: 2px solid #d4d4d4; background-color: white; display: flex; align-items: center; justify-content: center; font-size: 2.1rem; font-weight: bold; color: #000000; flex-shrink: 0; }
                .basic-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; }
                .info-row { margin-bottom: 1rem; }
                .label { font-weight: bold; color: #000000; display: block; }
                .value { color: #000000; margin-top: 3px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <div class="logo-container">
                        <div class="book-icon">
                            <img src="/src/assets/logoBiblioteca.png" alt="Logo de la Biblioteca"/>
                        </div>
                        <h1 class="library-title">Biblioteca Nexus</h1>
                    </div>
                </header>
                <main class="main-content">
                    <h2 class="directory-title">Catálogo de Autores</h2>
                    ${pageAutores.map(autor => `
                        <div class="author-card">
                            <div class="card-content">
                                <div class="author-info">
                                    <img src="${autor.base64Image || ''}" style="width: 5rem; height: 5rem; object-fit: cover; border: 2px solid #cccccc;" />
                                </div>
                            </div>
                            <div class="basic-info">
                                <div class="info-row">
                                    <span class="label">Nombre</span>
                                    <div class="value">${autor.nombre} ${autor.apellido}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Nacionalidad</span>
                                    <div class="value">${autor.nacionalidad}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Fecha Nacimiento</span>
                                    <div class="value">${autor.fechaNacimiento ? new Date(autor.fechaNacimiento).toLocaleDateString() : ''}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Género Literario</span>
                                    <div class="value">${autor.generoLiterario}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Idioma Principal</span>
                                    <div class="value">${autor.idiomaPrincipal}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Biografía</span>
                                    <div class="value">${autor.biografia}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </main>
            </div>
        </body>
        </html>
      `;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, { scale: 2 });
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (pageIndex > 0) doc.addPage();
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }

    doc.save('catalogo-autores.pdf');
  };
  return (
    <>
      <div className="escritores-container">
        <h1 className="main-title">Las mentes brillantes detrás de grandes historias</h1>
        <div className="title-border"></div>

        <h2 className="section-title">ESCRITOR DE LA SEMANA</h2>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="autor-semana">Seleccionar Autor de la Semana: </label>
          <select
            id="autor-semana"
            value={selectedAutorSemana ? selectedAutorSemana._id : ''}
            onChange={(e) => {
              const autor = autores.find(a => a._id === e.target.value);
              setSelectedAutorSemana(autor);
            }}
          >
            <option value="">Selecciona un autor</option>
            {autores.map(autor => (
              <option key={autor._id} value={autor._id}>
                {autor.nombre} {autor.apellido}
              </option>
            ))}
          </select>
        </div>

        {selectedAutorSemana && (
          <div className="author-feature">
            <div className="author-info">
              <Link to={`/authors/${selectedAutorSemana._id}`} className="author-name-link">
                <h3 className="author-name">{selectedAutorSemana.nombre} {selectedAutorSemana.apellido}</h3>
              </Link>
              <p className="author-description">
                {selectedAutorSemana.biografia || "Biografía no disponible."}
              </p>
              <Link to={`/authors/${selectedAutorSemana._id}`} className="more-info-boton">Más información</Link>
            </div>
            <div className="author-image-container">
              <img src={selectedAutorSemana.foto} alt={`Foto de ${selectedAutorSemana.nombre}`} className="author-image" />
            </div>
          </div>
        )}

        <div className="title-border"></div>

        <div className="filter-container">
          <p>Filtrar por</p>
          <div className="alphabet-filter">
            <span
              className={`alphabet-letter ${selectedLetter === '' ? 'active' : ''}`}
              onClick={() => handleFilter('')}
            >
              Todos
            </span>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
              <span
                key={letter}
                className={`alphabet-letter ${selectedLetter === letter ? 'active' : ''}`}
                onClick={() => handleFilter(letter)}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="author-grid">
           {visibleAutores.map(autor => (
             <div key={autor._id} className="writer-item">
               <Link to={`/authors/${autor._id}`}><img src={autor.foto} alt={`${autor.nombre} ${autor.apellido}`} /></Link>
               <Link to={`/authors/${autor._id}`} className="writer-name">{autor.nombre} {autor.apellido}</Link>
               <Link to={`/authors/${autor._id}`} className="more-info">Más información</Link>
             </div>
           ))}
         </div>

        {visibleCount < filteredAutores.length && (
          <button onClick={handleShowMore}>VER MÁS AUTORES</button>
        )}
      </div>

      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-box cta-register">
            <p className="cta-title">¡Lleva nuestros autores contigo!</p>
            <p className="cta-subtitle">Obtén el listado completo de todos los autores disponibles en<br/> Biblioteca Nexus.</p>
            <div className="cta-form">
              <button type="button" onClick={downloadPDF}>DESCARGAR CATÁLOGO</button>
            </div>
          </div>
          <div className="cta-box cta-login">
            <div className="cta-login-content">
              <svg
                className="cta-logo"
                viewBox="0 0 120 53" 
                width="120"
                height="53"
                xmlns="http://www.w3.org/2000/svg" 
              >
                <path 
                  className="svg-path-color"
                  d="M81.167 11.151l1.293 2.909.645-3.07 3.071-.323-2.746-1.616.646-2.908-2.264 1.939-2.583-1.455 1.13 2.747-2.261 2.101zM98.456 28.117l2.101-2.424 2.748 1.293-1.455-2.585 1.938-2.424-2.908.647-1.616-2.586-.325 3.07-3.068.646 2.908 1.293zM57.738 7.597l2.585-1.939 2.424 1.939-.97-3.07 2.584-1.777h-3.068l-.97-2.909-.969 2.909h-3.07l2.424 1.777zM37.379 10.99l.646 3.07 1.293-2.909 3.07.324-2.424-2.101 1.293-2.747-2.586 1.455-2.423-1.939.646 2.908-2.585 1.616zM17.182 26.986l2.746-1.293 2.101 2.424-.323-3.07 2.747-1.293-2.909-.646-.323-3.07-1.616 2.586-3.07-.647 2.101 2.424zM119.784 49.932l-1.454-2.425H62.585c0-1.938 2.101-1.938 3.231-1.938h51.543l-1.453-2.424H67.109c-1.293 0-3.555.162-4.201.322.646-2.262 4.361-2.424 9.533-2.424h42.172l-1.454-2.423H73.411c-4.04 0-8.079.161-10.181 1.614 1.938-2.745 5.334-3.555 13.572-3.555h35.225l-1.453-2.424H76.966C64.848 34.257 60 37.328 60 47.021c0-9.693-4.847-12.766-16.966-12.766H9.426L7.972 36.68h35.062c8.24 0 11.634.81 13.573 3.555-2.101-1.453-5.979-1.614-10.18-1.614H6.841l-1.454 2.423h42.171c5.333 0 8.887.162 9.533 2.424-.646-.16-2.908-.322-4.201-.322H4.094l-1.454 2.42h51.543c1.131 0 3.232 0 3.232 1.939H1.67L.216 49.93h57.36v1.454h5.009V49.93h57.199v.002z"
                />
              </svg>
              <p className="cta-login-text">¿Deseas registrar un nuevo autor? Comparte nuevos escritores con nuestra comunidad.</p>
            </div>
            <Link to="/register-escritor" className="cta-login-button">AÑADIR ESCRITOR</Link>
          </div>
        </div>
      </section>
    </>
  );
}