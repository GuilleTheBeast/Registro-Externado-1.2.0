import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./inicio.css";

const Recuperarcontra = ({ setShowNavbar }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      Swal.fire("Error", "Por favor, ingrese su correo electrónico", "error");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/resetPass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ externado_email: email }),
        }
      );

      const data = await response.json();
      //console.log("data", data);

      if (data.statuscode === 200 || data.statuscode === "200") {
        //console.log("Entraste al statuscode 200");
        // Contraseña reseteada exitosamente
        Swal.fire("Éxito", data.message, "success");
        // Redirigir a la página de inicio de sesión
        navigate("/inicio");
      } else if (data.statuscode === 403) {
        // Usuario no existe
        //console.log("Entraste al statuscode 403");
        Swal.fire("Error", data.message, "error");
      } else {
        //console.log("Entraste al else");
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      /*console.error(
        "Error al enviar solicitud de recuperación de contraseña:",
        error
      );*/
      // Manejar el error según sea necesario
      Swal.fire(
        "Error",
        "Error al enviar solicitud de recuperación de contraseña",
        "error"
      );
    }
  };
  const handleCancelarClick = () => {
    // Redirigir a la página de inicio de sesión
    navigate("/inicio");
  };

  return (
    <div className="pt-5">
      <Container
        fluid
        className="d-flex justify-content-center align-items-center pt-3"
      >
        <br />
        <div className="text-center login-container border rounded p-4 logincontainer">
          <div className="login-form">
            <p className="peque fs-3 pt-2 pr-4 pl-4">
              <strong>Recuperar contraseña</strong>
            </p>
            <p className="peque fs-6 pt-2 pr-4 pl-4">
              Ingrese su correo electrónico
            </p>
            <form onSubmit={handleFormSubmit}>
              <div className="login-fields pb-3">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="boton-guardar-inicio" type="submit">
                Enviar
              </button>{" "}
              <button
                className="boton-cancelar"
                type="button"
                onClick={handleCancelarClick}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Recuperarcontra;
