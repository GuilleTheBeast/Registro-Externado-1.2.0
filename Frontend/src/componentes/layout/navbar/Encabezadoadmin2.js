// EncabezadoAdmin.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navadmin.css"; // Asegúrate de que la ruta sea correcta
//acceder a imagenes para la imagen del logo
import logo from "../../imagenes/icons/logo.png";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EncabezadoAdmin2 = () => {
  const { authToken, setToken } = useAuth();
  const [encabezado, setEncabezado] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Valor de authToken:", authToken);

    if (
      authToken === null ||
      authToken === "" ||
      authToken === undefined ||
      authToken === "null"
    ) {
      // Muestra una alerta si el token está vacío, nulo o indefinido
      console.log("Token vacío, nulo o indefinido");
      navigate("/caducado");
      return;
      // Redirige o toma otras acciones según sea necesario
      // Puedes agregar un redireccionamiento, por ejemplo: history.push('/login');
    } else {
      const payloadBase64 = authToken.split(".")[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      const userRole = parseInt(payloadJson.rol, 10);
      console.log("El rol es " + payloadJson.rol);
      if (userRole === 1 || userRole === "1") {
        console.log("Entraste al if de rol 1");
      } else if (userRole === 2 || userRole === "2") {
        console.log("Entraste al if de rol 2");
      } else if (userRole === 3 || userRole === "3") {
        console.log("Entraste al if de rol 3");
        navigate("/negado");
      }else if (userRole === 4 || userRole === "4") {
        navigate("/negado");
      } else {
        console.log("El rol es " + payloadJson.rol);
      }
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    // Muestra una alerta de cerrar sesión exitoso con SweetAlert
    Swal.fire({
      icon: "success",
      title: "Cierre de sesión exitoso",
      text: "¡Hasta luego!",
      showConfirmButton: false,
      timer: 2000, // Cierra automáticamente después de 2 segundos
    });
    // Limpia el token almacenado al cerrar sesión
    setToken(null);

    // Muestra la alerta
    //alert("token eliminado: " + authToken);

    // Redirige a la página de inicio después de 1 segundo (puedes ajustar el tiempo según tus necesidades)
    navigate("/inicio");
  };
  return (
    <div className="sidebar-admin">
      {/* Añade la imagen del logo aquí */}
      <div className="logo-container-admin">
        <img src={logo} alt="Logo" className="logo-admin" />
      </div>
      <nav className="nav-admin">
        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            isActive ? "nav-link-admin active" : "nav-link-admin"
          }
        >
          Usuarios
        </NavLink>
        <NavLink
          to="/estudiantessistema"
          className={({ isActive }) =>
            isActive ? "nav-link-admin active" : "nav-link-admin"
          }
        >
          Estudiantes
        </NavLink>

        <button onClick={handleLogout} className="nav-link-admin logout-button">
          Cerrar Sesión
        </button>

        {/* Más enlaces de navegación según sea necesario */}
      </nav>
    </div>
  );
};

export default EncabezadoAdmin2;
