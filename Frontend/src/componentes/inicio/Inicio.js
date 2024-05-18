import { Container } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import authService, { API_URL } from "../../authService";
import icon from "../imagenes/icons/usuario.png";
import { Link } from "react-router-dom";
import banner from "../imagenes/banner/banner.jpg";
import ReCAPTCHA from "react-google-recaptcha";
import "./inicio.css";
import { useNavigate } from "react-router-dom";
import RepresentantesForm from "../Representantes/RepresentantesForm";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import { reloadpage } from "../registro/Registro";

const Inicio = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  useEffect(() => {
    if (reloadpage === true) {
      //console.log("Recargando página");
      window.location.reload();
    }
  }, []);

  const [captchaValido, setCaptchaValido] = useState(null); // Estado para almacenar si el captcha es válido o no
  const captcha = useRef(null);

  function handleRe(value) {
    if (captcha.current.getValue()) {
      //console.log("Captcha válido");
      setCaptchaValido(true);
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [componentToRender, setComponentToRender] = useState(null);
  const { setToken } = useAuth();
  const { authToken } = useAuth();
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // Llamada a la función que verifica el token

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captcha.current.getValue()) {
      setCaptchaValido(true);
    } else {
      //alert("Captcha inválido");
      setCaptchaValido(false);
      return;
    }

    try {
      const { token, status, responseData } = await authService.login(
        email,
        password
      );

      setToken(token);

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "¡Bienvenido!",
        showConfirmButton: false,
        timer: 2000,
      });

      const payloadBase64 = token.split(".")[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      const userRole = parseInt(payloadJson.rol, 10);
      if (
        responseData.statuscode === 202 ||
        responseData.statuscode === "202"
      ) {
        navigate("/cambiar");
        return;
      }

      if (userRole === 1 || userRole === "1") {
        navigate("/sistema");
        return;
      } else if (userRole === 2 || userRole === "2") {
        navigate("/usuarios");
        return;
      } else if (userRole === 4 || userRole === "4") {
        navigate("/consultarinfo");
        return;
      }

      if (
        responseData.statuscode === 200 ||
        responseData.statuscode === "200"
      ) {
        navigate("/estudianteslista");
        return;
      } else if (
        responseData.statuscode === 202 ||
        responseData.statuscode === "202"
      ) {
        navigate("/cambiar");
      } else if (
        responseData.message ===
        "No existe ningun usuario activo con ese correo"
      ) {
        // Alerta específica para cuentas no verificadas
        Swal.fire({
          icon: "error",
          title: "Cuenta no verificada",
          text: "Revisa tu correo electrónico para validar la cuenta",
        });
        return;
      } else {
        // Otros casos
      }

      //console.log("Respuesta completa:", responseData);
      //alert("Inicio de sesión exitoso");
      //Veo los mensajes en console.log y compaar con los if el mensaje y tirar alerta
    } catch (error) {
      //console.log("Error de inicio de sesión en inicio:", error);
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: "Error de inicio de sesión",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de inicio de sesión",
          text: "Hubo un problema durante el inicio de sesión. Si solicitaste reiniciar la contraseña ingresa la enviada al correo.",
        });
      }
    }
  };

  return (
    <div>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center pt-4"
      >
        {/* Colocar banner principal del colegio */}
        <img
          src={banner}
          alt="Icono"
          width="450px"
          height="200px"
          className="banner"
        />
        <br />
      </Container>

      <Container
        fluid
        className="d-flex justify-content-center align-items-center pt-3"
      >
        <br />
        <div className="text-center login-container border rounded p-4 logincontainer">
          <img src={icon} alt="Icono" width="40px" height="40px" />
          <div className="login-form">
            <p className="peque fs-3  pt-2 pr-4 pl-4">
              <strong>Iniciar Sesión</strong>
            </p>
            <form onSubmit={handleLogin}>
              <div className="login-fields pb-3">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="login-fields passwordfield">
                <input
                  type="password"
                  placeholder="Contraseña"
                  name="contra"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
                <div className="text-center pt-3">
                  <Link to="/recuperar"> ¿Olvidaste tu contraseña?</Link>
                </div>
              </div>
              <ReCAPTCHA
                sitekey="6LeCRRkpAAAAAOgn1vm8VHWdlJzqOu_KdIYCykm-"
                onChange={handleRe}
                ref={captcha}
              />
              {captchaValido === false && (
                <div className="error-captcha">
                  Por favor, acepta el captcha
                </div>
              )}
              <button className="boton-guardar-inicio" type="submit">
                ENTRAR
              </button>{" "}
              <hr className="pb-1" />
              <div className="text-center">
                ¿No tienes cuenta? <Link to="/registro"> Regístrate</Link>
              </div>
            </form>
          </div>
        </div>
      </Container>
      {/* Renderiza el componente RepresentantesForm */}
      {componentToRender}
    </div>
  );
};

export default Inicio;
