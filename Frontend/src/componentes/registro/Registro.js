import { Container } from "react-bootstrap";
import "../estilos/inputs.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import icon from "../imagenes/icons/usuario.png";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import banner from "../imagenes/banner/banner.jpg";
import "./registro.css";
import "../inicio/inicio.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export let reloadpage = false;
const Registro = ({ setShowNavbar }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  useEffect(() => {
    setShowNavbar(false); //Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const [captchaValido, setCaptchaValido] = useState(null); // Estado para almacenar si el captcha es válido o no
  const captcha = useRef(null);
  function handleRe(value) {
    if (captcha.current.getValue()) {
      //console.log("Captcha válido");
      setCaptchaValido(true);
    }
  }
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // Estado para los valores de usuario y contraseña

  /*const [values, setValues] = useState({
    email: "",
    contra: "",
  });*/

  //Estado para el email y su validacion
  const [externado_email, setEmail] = useState("");
  const [emailValido, setEmailValido] = useState(true); //Inicialmente, asumimos que el correo es valido
  const [externado_pass, setPassword] = useState("");
  const [externado_confirm_pass, setConfirmPassword] = useState("");
  const [externado_generic_pass, setAccessCode] = useState("");
  const [message0, setMessage0] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  //Expresion regular
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //Manejador de cambio para el campo de email
  const handleEmailChange = (e) => {
    const nuevoEmail = e.target.value;
    setEmail(nuevoEmail);
    setEmailValido(emailRegex.test(nuevoEmail)); //Validamos el nuevo email
  };

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });

  // Función para enviar los datos al servidor
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!captchaValido) {
      //console.log("Captcha inválido");
      setCaptchaValido(false);
      return;
    } else {
      //alert("Captcha válido");
      setCaptchaValido(true);
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //console.log("Correo electrónico:", externado_email); //se cambió value.email por email, ya que no se estaba obteniendo el correo electrónico ingresado
    //console.log("Coincide con el patrón:", emailPattern.test(externado_email));
    if (!emailPattern.test(externado_email)) {
      Swal.fire({
        icon: "error",
        title: "Correo Electrónico Inválido",
        text: "Por favor, ingresa una dirección de correo electrónico válida.",
        confirmButtonText: "Aceptar",
      });
      return; // Detener el proceso si el correo no es válido
    } else if (!externado_email) {
      Swal.fire({
        icon: "error",
        title: "Correo Electrónico Inválido",
        text: "Por favor, ingresa una dirección de correo electrónico.",
        confirmButtonText: "Aceptar",
      });
      return; // Detener el proceso si el correo no es válido
    } else {
      //console.log("El formato del correo electrónico es válido.");
      // Aquí puedes agregar código para enviar los datos al servidor
    }

    //Validando campos

    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/;
    if (externado_pass === "") {
      setMessage("Por favor ingrese una contraseña");
      return;
    } else if (regExp.test(externado_pass)) {
      setMessage("");
    } else if (!regExp.test(externado_pass)) {
      document.getElementById("validatepass").hidden = true;
      setMessage(
        "La contraseña debe cumplir el siguiente formato:\n* Entre 8 y 15 caracteres.\n* Al menos una letra mayúscula y una minúscula.\n* Al menos un número.\n* Al menos un símbolo.\n* Sin espacios."
      );

      return;
    } else {
      setMessage("");
    }

    if (externado_confirm_pass === "") {
      setMessage2("Por favor ingrese una contraseña");
      return;
    } else if (externado_pass !== externado_confirm_pass) {
      setMessage2("Las contraseñas deben coincidir");
      return;
    }

    if (externado_generic_pass === "") {
      setMessage("");
      setMessage2("");
      setMessage3("Por favor ingrese el código de acceso");
      return;
    }

    /* 
   //para mostrar errores debajo de inputs

   let inputError = {
      confirmPassword: "",
      password: "",
    };

   if (!externado_pass) {  
      setFormError({
        ...inputError,
        password: "Debe ingresar una contraseña",
      });
      return
    }
    
    if (externado_confirm_pass !== externado_pass) {  
      setFormError({
        ...inputError,
        password: "Las contraseñas deben coincidir",
      });
      return
    }

    setFormError(inputError);
  */

    //Insertando datos en la base

    /* try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3001/api/v1/auth/register", {
        externado_pass,
        externado_email,
        externado_generic_pass,
      },  
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
      
      )
      .then((response) => {
        set(response.data);
      });

      return response.data;
  } catch (error) {
    throw new Error("Error al eliminar responsable: " + error.message);
  }
}*/

    const dataToSubmit = {
      externado_pass,
      externado_email,
      externado_generic_pass,
    };

    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/api/v1/auth/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json ; charset=UTF-8",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((res) => res.json())

      .then((res) => {
        if (res.status < 200 || res.status > 299 ) {
          //console.log("status: ", res.status);
          //console.log("mensaje: ", res.message);

          Swal.fire({
            icon: "error",
            title: "Error al registrarse",
            text: res.message,
          });

          return;
        } else {
          //console.log("status: ", res.status);
          //console.log(res);
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Revisa tu correo electrónico para verificar tu cuenta",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              reloadpage = true;
              navigate("/inicio");
            }
          });
        }
      });
  };

  // Manejadores de cambios en los campos de usuario y contraseña
  return (
    <div>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center pt-4"
      >
        {/*Colocar banner principal del colegio */}
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
        {/*Colocar banner principal del colegio */}

        <br />
        <div className="text-center login-container  border rounded p-4 logincontainer">
          {/*<img src={icon} alt="Icono" width="40px" height="40px" />*/}
          <div className="login-form">
            {" "}
            {/* Añadido el borde y padding */}
            <h5 className="text-center fs-3 pb-2 pt-2 pr-4 pl-4">
              <strong>Registrarse</strong>
            </h5>
            <form method="post" onSubmit={handleSubmit}>
              <div className="form-floating  mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  name="email"
                  value={externado_email}
                  onChange={handleEmailChange} //usamos el manejador de cambios
                  className={'form-control ${!emailValido ? "is-invalid" : ""}'} //Si el email no es valido, agregamos la clase is-invalid
                />
                <label htmlFor="password">Email</label>
                {!emailValido && (
                  <div className="invalid-feedback">
                    El correo electrónico es inválido
                  </div>
                )}
              </div>
              <div className="form-floating" mt-3>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Contraseña"
                  name="password"
                  id="password"
                  maxlength="15"
                  value={externado_pass}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-control"
                  required
                />

                <label htmlFor="password">Contraseña</label>
                <div
                  className="position-absolute pointer pwd-icon"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height={"1.2rem"}
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height={"1.2rem"}
                    >
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  )}
                </div>
              </div>
              <p id="validatepass" className="validatePass" style={{}}>
                La contraseña debe cumplir el siguiente formato:
                <br />* Entre 8 y 15 caracteres.
                <br />* Al menos una letra mayúscula y una minúscula.
                <br />* Al menos un número.
                <br />* Al menos un símbolo.
                <br />* Sin espacios.
              </p>
              <p className="error-message" style={{ whiteSpace: "pre" }}>
                {message}
              </p>
              <div className="form-floating" mt-3>
                <input
                  type={showPwd2 ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  name="confirmPassword"
                  id="confirmPassword"
                  maxlength="15"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="form-control"
                />
                <label htmlFor="password">Confirmar Contraseña</label>
                <div
                  className="position-absolute pointer pwd-icon"
                  onClick={() => setShowPwd2(!showPwd2)}
                >
                  {showPwd2 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height={"1.2rem"}
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height={"1.2rem"}
                    >
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="error-message">{message2}</p>
              <div className="form-floating" mt-3>
                <input
                  type="text"
                  placeholder="Código de acceso"
                  name="accessCode"
                  maxlength="15"
                  value={externado_generic_pass}
                  onChange={(event) => setAccessCode(event.target.value)}
                  className="form-control"
                />
                <label htmlFor="password">Código de acceso</label>
                <p className="error-message">{message3}</p>
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
              <button className="botonlogin">REGISTRAR</button>{" "}
              {/* Colocar linea gris abajo */}
              <hr className="pb-2" />
              <div className="text-center">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/inicio"
                  onClick={() => {
                    reloadpage = true;
                  }}
                >
                  Inicia sesión
                </Link>
              </div>
            </form>
            {/* Botón de entrada */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Registro;
