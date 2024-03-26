import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const VerificacionExitosa = ({ setShowNavbar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowNavbar(false);

    // Obtén el código de la URL
    const codigoVerificacion = new URLSearchParams(location.search).get("c");

    // Realiza la llamada al endpoint con el código de verificación
    axios
      .get(
        `http://localhost:3001/api/v1/externado-users/activateEmail/${codigoVerificacion}`
      )
      .then((response) => {
        //console.log("Cuenta verificada. Respuesta del servidor:", response);
        // Puedes mostrar un mensaje en la página si es necesario
      })
      .catch((error) => {
        // console.error("Error al verificar la cuenta:", error);
      });
  }, [location, setShowNavbar]);

  return (
    <div className="container-verificado">
      <h1 className="tittle">Su cuenta ha sido verificada</h1>
      <p className="message">Por favor, inicie sesión para continuar.</p>
      <button onClick={() => navigate("/inicio")} className="button-verificado">
        Iniciar Sesión
      </button>
    </div>
  );
};

export default VerificacionExitosa;
