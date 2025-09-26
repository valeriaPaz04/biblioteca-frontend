import './Footer.css';

const Footer = () => {
  return (
    <footer className="minimalist-footer">
      <div className='follow-right'>
        <p>SÍGANOS</p>
        <div className='follow-icons'>
          <i class="fi fi-brands-facebook"></i>
          <i class="fi fi-brands-instagram"></i>
          <i class="fi fi-brands-youtube"></i>
          <i class="fi fi-brands-twitter"></i>
        </div>
      </div>
      
      <div>
        <p style={{ color:'#999999' }}>© {new Date().getFullYear()} Biblioteca Nexus. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
