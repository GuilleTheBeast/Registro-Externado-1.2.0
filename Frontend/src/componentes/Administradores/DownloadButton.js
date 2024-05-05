import React from 'react';
import "./buttomDownload.css"; 

const DownloadButton = () => {
  const downloadFile = () => {
    // Construye la URL de descarga
    const downloadUrl = 'http://localhost:3002/sheetjs/download';

    // Crea un enlace temporal
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'Matricula.xlsx'); // Establece el nombre del archivo a descargar
    document.body.appendChild(link);

    // Simula el clic en el enlace para iniciar la descarga
    link.click();

    // Limpia el enlace temporal
    document.body.removeChild(link);
  };

  return (
    <button className='buttom-download-xlsx' onClick={downloadFile}>Descargar .XLSX</button>
  );
};

export default DownloadButton;
