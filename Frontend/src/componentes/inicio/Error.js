import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import authService, { API_URL, getDepartments } from "../../authService";
import icon from "../imagenes/icons/usuario.png";
import { Link } from "react-router-dom";
import banner from "../imagenes/banner/banner.jpg";
import "./inicio.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RepresentantesForm from "../Representantes/RepresentantesForm";
import { useAuth } from "../AuthContext";


const Error = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  const { authToken, setToken } = useAuth();
  const { state } = useLocation();
  setToken(null);
  return (
    <body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      {state === null ? (
        <div className="container-verificado">
          <h1
            className="tittle"
            style={{
              marginBottom: "60px",
            }}
          >
            Oops ¡Lo sentimos! No encontramos la página que estas buscando. 
          </h1>
          <h3
            className="tittle"
            style={{
              marginBottom: "60px",
            }}
          >
            Por motivos de seguridad, será regresado al login 
          </h3>
         
          <Link to={".."} className="button">
           Salir
          </Link>
        </div>
      ) : (
        <div className="container-verificado"
        style={{
          textAlign: 'center',
          borderRadius: '5px',
          padding: '20px',
          backgroundColor: '#fff',
        }}
        >
          <h1 className="tittle"
          style={{
            fontSize: '5rem', 
            color: 'black',
          }}
          >{Number(state.code)}</h1>
          <h4 className="subtittle"
           style={{
            
            color: 'gray', 
            
       
          }}>
            {JSON.stringify(state.name).replace(/['"]+/g, "")}
          </h4>

          <p className="message"
            style={{
              fontSize: '1.5rem', 
              color: '#333', 
              marginBottom: '60px', 
         
            }}
          >
            Oops ¡Lo sentimos! No encontramos la página que estas buscando. 
          </p>

          <p
            className="tittle"
            style={{
              fontSize: '1.3rem', 
              color: '#333', 
              marginBottom: '65px',
            }}
          >
            Por motivos de seguridad, será regresado al login. 
          </p>
          
          <Link to={".."} className="button">
           Salir
          </Link>
        </div>
      )}
    </body>
  );
};

export default Error;
