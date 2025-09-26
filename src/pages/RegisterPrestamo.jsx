import React, { useState, useEffect } from 'react';
import './css/Prestamos.css';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function getEstadoClass(estado) {
  if (estado === 'Activo') return 'prestamo-estado activo';
  if (estado === 'Devuelto') return 'prestamo-estado devuelto';
  if (estado === 'Vencido') return 'prestamo-estado vencido';
  return 'prestamo-estado';
}

export default function RegisterPrestamo() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/prestamos`)
      if (!res.ok) throw new Error('Error al cargar préstamos');
      const data = await res.json();
      setPrestamos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const visiblePrestamos = prestamos.filter(p => p.libro).slice(0, visibleCount);

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

  const handleShowMore = () => {
    setVisibleCount(prestamos.length);
  };

  const downloadPDF = async () => {
    const itemsPerPage = 1; // Número de préstamos por página

    // Convertir imágenes a base64
    const prestamosWithBase64 = await Promise.all(prestamos.map(async (p) => ({
      ...p,
      libro: {
        ...p.libro,
        base64Image: await getBase64Image(p.libro.foto)
      }
    })));

    const pages = [];
    for (let i = 0; i < prestamosWithBase64.length; i += itemsPerPage) {
      pages.push(prestamosWithBase64.slice(i, i + itemsPerPage));
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pagePrestamos = pages[pageIndex];
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Biblioteca Nexus - Catálogo de Préstamos</title>
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
                .prestamo-card { border: 1.5px solid #f42535; background-color: #ffffff; padding: 1.5rem; margin-bottom: 1rem; }
                .card-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .prestamo-info { display: flex; gap: 1.5rem; align-items: center; }
                .book-cover { width: 5rem; height: 7rem; border: 2px solid #d4d4d4; background-color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: #000000; flex-shrink: 0; }
                .basic-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; }
                .info-row { margin-bottom: 1rem; }
                .label { font-weight: bold; color: #000000; display: block; }
                .value { color: #000000; margin-top: 3px; }
                .status { text-align: right; margin-left: 10px; font-weight: bold; border: 2px solid; padding: 4px 8px; border-radius: 8px; background: white; color: black; }
                .activo { border-color: #f42535; }
                .devuelto { border-color: #cccccc; }
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
                    <h2 class="directory-title">Catálogo de Préstamos</h2>
                    ${pagePrestamos.map(p => `
                        <div class="prestamo-card">
                            <div class="card-content">
                                <div class="prestamo-info">
                                    <img src="${p.libro.base64Image || ''}" style="width: 5rem; height: 7rem; object-fit: cover; border: 2px solid #d4d4d4;" />
                                </div>
                            </div>
                            <div class="basic-info">
                                <div class="info-row">
                                    <span class="label">Título</span>
                                    <div class="value">${p.libro.titulo}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Autor</span>
                                    <div class="value">${p.libro.autor.nombre} ${p.libro.autor.apellido || ''}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Usuario</span>
                                    <div class="value">${p.usuario.nombre} (${p.usuario.email})</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Fecha Préstamo</span>
                                    <div class="value">${new Date(p.fechaPrestamo).toLocaleDateString()}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Fecha Límite</span>
                                    <div class="value">${new Date(p.fechaLimite).toLocaleDateString()}</div>
                                </div>
                                <div class="info-row">
                                    <span class="label">Estado</span>
                                    <div class="value ${p.estado === 'prestado' ? 'activo' : 'devuelto'}">${p.estado === 'prestado' ? 'Activo' : 'Devuelto'}</div>
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

    doc.save('catalogo-prestamos.pdf');
  };

  if (loading) return <div>Cargando préstamos...</div>;

  return (
    <div className="page-container">
      <h1 className="main-title">Todos los Préstamos</h1>
      <div className="title-border"></div>
      <div style={{ display:"flex", justifyContent:"flex-start", width: "100%", marginBottom:"30px" }}>
        <div>
          <Link to="/borrow" className="back-button">
            <span className="back-arrow">&#8592;</span> VOLVER
          </Link>
        </div>
      </div>

      <div className="prestamos-grid">
        {visiblePrestamos.filter(p => p.libro).map((p) => (
          <div key={p._id} className="prestamo-card">

            <span className={getEstadoClass(p.estado === 'prestado' ? 'Activo' : 'Devuelto') + " prestamo-status-top"}>{p.estado === 'prestado' ? 'Activo' : 'Devuelto'}</span>

            <div className="prestamo-header">
              <div>
                <h2 className="prestamo-titulo">{p.libro.titulo}</h2>
                <p className="prestamo-autor-header">por {p.libro.autor.nombre} {p.libro.autor.apellido || ''}</p>
                <p className="prestamo-id">ID: {p.libro._id} • ISBN: {p.libro.isbn}</p>
              </div>
              <img src={p.libro.foto} alt={p.libro.titulo} className="prestamo-img" />
            </div>

            <div className="prestamo-user">
              <div>
                <i className="fi fi-rr-user" style={{ marginRight: 6 }}></i>
              </div>
              <div>
                {p.usuario.nombre}<br />
                <span className="prestamo-email">{p.usuario.email}</span>
              </div>
            </div>

            <div className="prestamo-separator"></div>

            <div className="prestamo-fechas">
              <div>
                <i className="fi fi-rr-calendar-lines"></i>
                Préstamo: {new Date(p.fechaPrestamo).toLocaleDateString()}
              </div>
              <div>
                <i className="fi fi-rr-clock-three"></i>
                Vencimiento: {new Date(p.fechaLimite).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < prestamos.length && (
        <button onClick={handleShowMore} style={{marginTop: '20px'}}>VER MÁS PRÉSTAMOS</button>
      )}

      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-box cta-register">
            <p className="cta-title">Descarga el catálogo completo de préstamos</p>
            <p className="cta-subtitle">Obtén un reporte detallado de todos los préstamos registrados en Biblioteca Nexus.</p>
            <div className="cta-form">
              <button type="button" onClick={downloadPDF}>DESCARGAR CATÁLOGO</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}