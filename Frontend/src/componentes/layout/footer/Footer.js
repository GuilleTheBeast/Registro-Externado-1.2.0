// Footer.js

import React from "react";
import "./footer.css"; // Puedes crear un archivo CSS para estilos específicos del pie de página

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© Colegio Externado de San José, 2023.</p>
        <p>33ª av. norte, final pje. San José, res. Decápolis.</p>
        <p>San Salvador, República de El Salvador.</p>
        <p>Teléfono: 2261-4000 Fax: 2260-4008</p>
        <p>Correo general: webmaster@externado.edu.sv</p>
      </div>
    </footer>
  );
};

export default Footer;
