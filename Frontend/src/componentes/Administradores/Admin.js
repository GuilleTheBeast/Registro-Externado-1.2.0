import React from "react";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/administradores.css"; // Importa el archivo de estilos
//importar EncabezadoAdmin
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";

const HolaAdmin = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const { authToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {

    if (
      authToken === null ||
      authToken === "" ||
      authToken === undefined ||
      authToken === "null"
    ) {
      // Muestra una alerta si el token está vacío, nulo o indefinido
      navigate("/caducado");
      return;
      // Redirige o toma otras acciones según sea necesario
      // Puedes agregar un redireccionamiento, por ejemplo: history.push('/login');
    } else {
      const payloadBase64 = authToken.split(".")[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      const userRole = parseInt(payloadJson.rol, 10);
      if (userRole === 4 || userRole === "4") {
      } else if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3");
        navigate("/negado");
      }else if (userRole === 1 || userRole === "1") {
        //console.log("Entraste al if de rol 1");
        navigate("/negado");
      } else {
        //console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  return (
    <>
      <EncabezadoAdmin />
      <div className="container-hola">
        <h1 className="h1-hola">Hola administrador</h1>
      </div>
    </>
  );
};

export default HolaAdmin;
