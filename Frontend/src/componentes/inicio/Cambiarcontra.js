import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "./inicio.css";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/inputs.css";

const CambioContra = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false);
    return () => {
      setShowNavbar(true);
    };
  }, []);

  const { authToken, setToken } = useAuth();
  const navigate = useNavigate();
  //const [newPassword, setNewPassword] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");
  const [redirectToFormulario, setRedirectToFormulario] = useState(false);
  const [externado_pass, setNewPassword] = useState("");
  const [externado_confirm_pass, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");

  /* useEffect(() => {
    //console.log("Valor de authToken:", authToken);

    if (
      authToken === null ||
      authToken === "" ||
      authToken === undefined ||
      authToken === "null"
    ) {
      //console.log("Token vacío, nulo o indefinido");
      navigate("/caducado");
      return;
    }
  }, [authToken, navigate]);*/

  const handleSave = async (event) => {
    event.preventDefault();

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

    //Insertando nueva pass en la base

    const dataToSubmit = {
      externado_pass,
    };

    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/api/v1/auth/setNewPass", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json ; charset=UTF-8",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((res) => res.json())
      .then((res) => {
        //console.log(res);
        //console.log(dataToSubmit);
        //console.log("Nueva contraseña:", externado_pass);
        //console.log("Confirmar contraseña:", externado_confirm_pass);
        Swal.fire({
          icon: "success",
          title: "Cambio de contraseña exitoso",
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos
        });
        setTimeout(() => {
          navigate("/inicio");
        }, 2000);
      });
  };

  const handleCancel = () => {
    if (authToken) {
      setRedirectToFormulario(true);
    }
  };

  useEffect(() => {
    if (redirectToFormulario) {
      const payloadBase64 = authToken.split(".")[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      const userRole = parseInt(payloadJson.rol, 10);

      if (userRole === 3 || userRole === "3") {
        //console.log("Entraste al if de rol 3 de contra");
        navigate("/estudianteslista");
      } else if (
        userRole === 1 ||
        userRole === "1" ||
        userRole === 2 ||
        userRole === "2"
      ) {
        navigate("/admin");
        return;
      } else {
        //console.log("El rol es " + userRole);
      }
    }
  }, [authToken, navigate, redirectToFormulario]);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center pt-4"
    >
      <div className="text-center cambio-contrasena-container border rounded p-4">
        <h5 className="text-center fs-1 pb-2 pt-2 pr-4 pl-4">
          <strong>Cambio de Contraseña</strong>
        </h5>
        <form>
          <div className="cambio-contrasena-fields pb-3">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              autoComplete="off"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
            />
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
          </div>
          <div className="cambio-contrasena-fields pb-3">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              autoComplete="off"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
            />
            <p className="error-message">{message2}</p>
          </div>
          <Button
            variant="success"
            className="boton-guardar-inicio"
            onClick={handleSave}
          >
            Guardar
          </Button>

          <Button className="boton-cancelar" onClick={handleCancel}>
            Cancelar
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CambioContra;
