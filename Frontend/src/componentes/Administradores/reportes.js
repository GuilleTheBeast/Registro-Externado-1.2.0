import React from 'react';
import { useEffect, useState } from "react";
import './reportes.css';
import DownloadButton from './DownloadButton';
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
        <h1 style={{ textAlign: 'center', fontWeight: '300' }}>Reporte de matrícula de estudiantes</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '300' }}>Indicaciones:</p>
        <p style={{ fontSize: '1.1rem', fontWeight: '300' }}> • Sino selecciona ningún filtro, se descargarán todos los registros hasta el momento</p>
        <p style={{ fontSize: '1.1rem', fontWeight: '300' }}> • Puede seleccionar cualquier combinación de filtros</p>
        <div className='FilterPanelContainer'>
        <div className='FilterGeneralContent'>
        <p className='FilterTitle'> Seleccione Periodo: </p>
        <FilterComponent />
      </div>
    <div className='FilterGeneralContent'>
      <p className='FilterTitle'> Seleccione grado: </p>
      <FilterComponent />
    </div>
  </div>
  <div className='buttomDownload-Content'>
    <DownloadButton />
  </div>
</div>
    </>
  );
};

export default ExportModule;

