import "./css/Home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [selectedAutorSemana, setSelectedAutorSemana] = useState(null);

  useEffect(() => {
    fetchLibros();
    fetchAutores();
  }, []);

  const fetchLibros = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/libros`);
      if (!res.ok) throw new Error('Error al cargar libros');
      const data = await res.json();
      setLibros(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAutores = async () => {
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/autores`);
      if (!res.ok) throw new Error('Error al cargar autores');
      const data = await res.json();
      setAutores(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      {/* ... Tu código de grid y libros se mantiene ... */}
      <div className="home-grid">
        <div className="grid-item grid-area-top-left">
          <img src="https://www.loa.org/wp-content/uploads/2023/09/LOA-LIVE-logo-1-260x195.png" alt="Grid image 1" className="grid-img" />
          <div className="grid-item-content">
            <p className="news-tag">VIDEO</p>
            <p className="description">LOA LIVE: Programas en línea inspirados en las publicaciones de la Biblioteca Nexus</p>
            <p className="date">1 de septiembre de 2025</p>
          </div>
        </div>
        <div className="grid-item grid-area-top-right">
          <img src="https://www.loa.org/wp-content/uploads/2025/08/Didion-Register-Now-560-x-420-px-260x195.png" alt="Grid image 2" className="grid-img" />
          <div className="grid-item-content">
            <p className="news-tag">NEWS</p>
            <p className="description">LOA LIVE: Programas en línea inspirados en las publicaciones de la Biblioteca Nexus</p>
            <p className="date">1 de septiembre de 2025</p>
          </div>
        </div>
        <div className="grid-item grid-area-bottom-left">
          <img src="https://www.loa.org/wp-content/uploads/2025/09/Tocqueville-LOA-LIVE-HP-260x195.png" alt="Grid image 3" className="grid-img" />
          <div className="grid-item-content">
            <p className="news-tag">VIDEO</p>
            <p className="description">Leyendo La democracia en América ahora de Alexis de Tocqueville</p>
            <p className="date">11 de septiembre de 2025</p>
          </div>
        </div>
        <div className="grid-item grid-area-bottom-right">
          <img src="https://www.loa.org/wp-content/uploads/2025/09/Fawcett-detail-260x195.jpg" alt="Grid image 4" className="grid-img" />
          <div className="grid-item-content">
            <p className="news-tag">HISTORIA DE LA SEMANA</p>
            <p className="description">“Déjame sentir tu pulso”, O. Henry</p>
            <p className="date">11 de septiembre de 2025</p>
          </div>
        </div>
        <div className="grid-item grid-area-center">
          <img src="https://www.loa.org/wp-content/uploads/2025/09/Menashe-HP-art.png" alt="Grid image 5" className="grid-img" />
          <div className="grid-item-content">
            <p className="news-tag">NOTICIAS</p>
            <p className="description" style={{ fontSize: '42px', lineHeight: '55px' }}>“Un lenguaje intenso y claro como el diamante”: el centenario del poeta Samuel Menashe</p>
          </div>
        </div>
      </div>

      <section className="new-books-section">
        <h2 className="section-title">NUEVO Y DIGNO DE MENCIÓN</h2>
        <div className="books-list">
          {libros.map(libro => (
            <div key={libro._id} className="book-item">
              <Link to={`/book/${libro._id}`}>
                <img src={libro.foto} alt={libro.titulo} />
                <p className="book-title">{libro.titulo}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- Nueva sección de Escritores --- */}
      <section className="featured-writers-section">
        <h2 className="section-title">ESCRITORES DESTACADOS</h2>
        <div className="featured-writers-container">
          
          {/* Grid de 5 escritores */}
          <div className="writer-grid">
            {autores.map(autor => (
              <div key={autor._id} className="writer-item">
                <Link to={`/authors/${autor._id}`}><img src={autor.foto} alt={`${autor.nombre} ${autor.apellido}`} /></Link>
                <Link to={`/authors/${autor._id}`} className="writer-name">{autor.nombre} {autor.apellido}</Link>
                <Link to={`/authors/${autor._id}`} className="more-info">Más información</Link>
              </div>
            ))}
          </div>

          {/* Columna Derecha: Escritor de la semana */}
          <div className="writer-of-the-week">
            <h3 className="wow-subtitle">ESCRITOR DE LA SEMANA</h3>
            <div style={{ marginBottom: '10px' }}>
              <select
                value={selectedAutorSemana ? selectedAutorSemana._id : ''}
                onChange={(e) => {
                  const autor = autores.find(a => a._id === e.target.value);
                  setSelectedAutorSemana(autor);
                }}
                style={{ width: '100%', padding: '5px' }}
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
              <>
                <Link to={`/authors/${selectedAutorSemana._id}`} className="wow-name-link">
                  <h4 className="wow-name">{selectedAutorSemana.nombre} {selectedAutorSemana.apellido}</h4>
                </Link>
                <p className="wow-description">{selectedAutorSemana.biografia || "Biografía no disponible."}</p>
                <Link to={`/authors/${selectedAutorSemana._id}`} className="wow-more-info">Más información</Link>
              </>
            )}
          </div>

        </div>
      </section>

      {/* --- Biblioteca Nexus Section --- */}
      <section className="nexus-section">
        <div className="nexus-header">
        <svg 
            className="nexus-logo"
            viewBox="0 0 120 53" 
            width="120"
            height="53"
            xmlns="http://www.w3.org/2000/svg" 
            aria-label="Biblioteca Nexus Logo"
          >
            <path 
              fill="red"
              d="M81.167 11.151l1.293 2.909.645-3.07 3.071-.323-2.746-1.616.646-2.908-2.264 1.939-2.583-1.455 1.13 2.747-2.261 2.101zM98.456 28.117l2.101-2.424 2.748 1.293-1.455-2.585 1.938-2.424-2.908.647-1.616-2.586-.325 3.07-3.068.646 2.908 1.293zM57.738 7.597l2.585-1.939 2.424 1.939-.97-3.07 2.584-1.777h-3.068l-.97-2.909-.969 2.909h-3.07l2.424 1.777zM37.379 10.99l.646 3.07 1.293-2.909 3.07.324-2.424-2.101 1.293-2.747-2.586 1.455-2.423-1.939.646 2.908-2.585 1.616zM17.182 26.986l2.746-1.293 2.101 2.424-.323-3.07 2.747-1.293-2.909-.646-.323-3.07-1.616 2.586-3.07-.647 2.101 2.424zM119.784 49.932l-1.454-2.425H62.585c0-1.938 2.101-1.938 3.231-1.938h51.543l-1.453-2.424H67.109c-1.293 0-3.555.162-4.201.322.646-2.262 4.361-2.424 9.533-2.424h42.172l-1.454-2.423H73.411c-4.04 0-8.079.161-10.181 1.614 1.938-2.745 5.334-3.555 13.572-3.555h35.225l-1.453-2.424H76.966C64.848 34.257 60 37.328 60 47.021c0-9.693-4.847-12.766-16.966-12.766H9.426L7.972 36.68h35.062c8.24 0 11.634.81 13.573 3.555-2.101-1.453-5.979-1.614-10.18-1.614H6.841l-1.454 2.423h42.171c5.333 0 8.887.162 9.533 2.424-.646-.16-2.908-.322-4.201-.322H4.094l-1.454 2.42h51.543c1.131 0 3.232 0 3.232 1.939H1.67L.216 49.93h57.36v1.454h5.009V49.93h57.199v.002z"
            />
          </svg>
          <h2 className="nexus-title">Biblioteca Nexus</h2>
        </div>
        <div className="nexus-columns">
          <div className="nexus-column">
            <h3 className="nexus-column-title">LIBROS</h3>
            <p>Explora un universo de historias. Nuestra colección digital abarca desde los grandes clásicos hasta las novedades más recientes. Encuentra tu próxima lectura buscando por título, autor o género.</p>
            <Link to="/books" className="nexus-link">Explorar catálogo</Link>
          </div>
          <div className="nexus-column">
            <h3 className="nexus-column-title">AUTORES</h3>
            <p>Descubre las mentes detrás de las grandes obras. Conoce la vida y el legado de los escritores que han definido la literatura, desde los maestros del pasado hasta las voces del presente.</p>
            <Link to="/authors" className="nexus-link">Ver autores</Link>
          </div>
          <div className="nexus-column">
            <h3 className="nexus-column-title">PRÉSTAMOS</h3>
            <p>Leer nunca fue tan fácil. Con nuestro sistema de préstamos digitales, puedes llevar tus libros favoritos a donde vayas. Gestiona tus lecturas y devoluciones de forma simple y rápida.</p>
            <Link to="/borrow" className="nexus-link">Mis préstamos</Link>
          </div>
        </div>
      </section>

      {/* Section para registrar/ingresar */}
      <section className="cta-section">
        <div className="cta-container">
          {user ? (
            <>
              <div className="cta-box cta-register">
                <p className="cta-title">¡Bienvenido de nuevo, {user.username}!</p>
                <p className="cta-subtitle">Gracias por ser parte de la comunidad Biblioteca Nexus.</p>
                <div className="cta-form">
                  <Link to="/dashboard">
                    <button type="button">IR AL DASHBOARD</button>
                  </Link>
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
                  <p className="cta-login-text">Explora nuevas lecturas y gestiona tus préstamos.</p>
                </div>
                <Link to="/books" className="cta-login-button">EXPLORAR LIBROS</Link>
              </div>
            </>
          ) : (
            <>
              <div className="cta-box cta-register">
                <p className="cta-title">Regístrese para entrar a la Biblioteca Nexus</p>
                <p className="cta-subtitle">Accede a un mundo de conocimiento y aventura. ¡Es gratis!</p>
                <div className="cta-form">
                  <input type="email" placeholder="usuario@email.com" />
                  <Link to="/register">
                    <button type="button">REGISTRARSE</button>
                  </Link>
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
                  <p className="cta-login-text">¿Ya tienes una cuenta? Inicia sesión para acceder a tus préstamos y lecturas.</p>
                </div>
                <a href="/login" className="cta-login-button">INICIAR SESIÓN</a>
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
