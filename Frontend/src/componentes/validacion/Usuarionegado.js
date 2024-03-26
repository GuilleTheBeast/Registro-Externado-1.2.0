import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../estilos/administradores.css"; // Importa el archivo de estilos

const Usuarionegado = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const { authToken } = useAuth();
  const payloadBase64 = authToken.split(".")[1];
  const payloadDecoded = atob(payloadBase64);
  const payloadJson = JSON.parse(payloadDecoded);
  const userRole = parseInt(payloadJson.rol, 10);
  //console.log("El rol es " + payloadJson.rol);

  let regresarLink = null;

  switch (userRole) {
    case 1:
      regresarLink = (
        <Link to="/sistema" className="button">
          Regresar
        </Link>
      );
      break;
    case 2:
      regresarLink = (
        <Link to="/usuarios" className="button">
          Regresar
        </Link>
      );
      break;
    case 3:
      regresarLink = (
        <Link to="/representanteslista" className="button">
          Regresar
        </Link>
      );
      break;
    default:
      regresarLink = (
        <Link to="/" className="button">
          Regresar
        </Link>
      );
  }

  return (
    <div className="acceso-denegado-container">
      <h1 className="h1-hola">Acceso Denegado</h1>
      <p className="p-hola">
        No tienes los permisos necesarios para acceder a esta página.
      </p>

      {regresarLink}
    </div>
  );
};

export default Usuarionegado;
