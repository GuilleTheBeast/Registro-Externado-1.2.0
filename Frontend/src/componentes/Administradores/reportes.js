import React from 'react';
import { useEffect, useState } from "react";
import '../estilos/reportes.css';
import EncabezadoAdmin from "../layout/navbar/Encabezadoadmin";
import FilterComponent from './PanelFiltros'
//Faltan los estilos de la pagina reportes


const ExportModule = ({ setShowNavbar }) => {

  useEffect(() => {
    setShowNavbar(false); // Oculta el navbar en la página de inicio
    return () => {
      setShowNavbar(true); // Muestra el navbar en las demás páginas
    };
  }, []);

  return (
    <>
      <EncabezadoAdmin />
      <div className="app-container">
        <h2>Reporte de matrícula de estudiantes</h2>
        <h4>Indicaciones:</h4> {/* Subtítulo agregado aquí */}
        <ul>
            <li>
              Descargue en formato xlsx la información de matricula de estudiantes
            </li>
            <li>
              Solo de click 1 vez al botón y espere la descarga automática
            </li>
          </ul>
        <div className='FilterPanelContainer'>
           <div className='FilterGeneralContent'>
             <FilterComponent />
           </div>
        </div>

      </div>
    </>
  );
};

export default ExportModule;

