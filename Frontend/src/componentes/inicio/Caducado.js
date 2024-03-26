import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import authService, { API_URL, getDepartments } from "../../authService";
import icon from "../imagenes/icons/usuario.png";
import { Link } from "react-router-dom";
import banner from "../imagenes/banner/banner.jpg";
import "./inicio.css";
import { useNavigate } from "react-router-dom";
import RepresentantesForm from "../Representantes/RepresentantesForm";
import { useAuth } from "../AuthContext";
const Caducado = ({ setShowNavbar }) => {
  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);
  return (
    <div className="container-verificado">
      <h1 className="tittle">Se ha expirado la sesión</h1>
      <p className="message">Por favor, inicie sesión para continuar.</p>
      <Link to="/inicio" className="button">
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default Caducado;
