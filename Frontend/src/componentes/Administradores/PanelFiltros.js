import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Asegúrate de tener el contexto de autenticación importado
import { fetchHistorico, fetchGrado } from '../AuthContext'; // Asegúrate de tener estas funciones importadas correctamente
import '../estilos/FilterComponent.css';
import Swal from "sweetalert2";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



const FilterComponent = () => {
  const [error, setError] = useState(null);
  const { authToken } = useAuth(); // Usa el hook de autenticación
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [levels, setLevels] = useState([]);
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await fetchGrado(authToken);
        setLevels(data.map(item => ({ id: item.id, label: item.externado_level })));
      } catch (error) {
        console.error('Error fetching levels:', error.message);
      }
    };

    const fetchPeriods = async () => {
      try {
        const data = await fetchHistorico(authToken);
        setPeriods(data.map(item => ({ id: item.id, label: item.externado_range_period })));
      } catch (error) {
        console.error('Error fetching periods:', error.message);
      }
    };

    if (authToken) {
      fetchLevels();
      fetchPeriods();
    }
  }, [authToken]);

  const handleLevelSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePeriodSelectChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const  DownloadXLSX = async () => {
    const params = new URLSearchParams();
    if (selectedOption) params.append('level', selectedOption);
    if (selectedPeriod) params.append('period', selectedPeriod);

    if(selectedPeriod ==='Todos'){
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Desea descargar toda la información de matriculas?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, descargar",
      });

      if (result.isConfirmed) {
          try {
            const response = await axios.get(`http://localhost:3001/api/v1/sheetjs/download?${params.toString()}`, {
              headers: {
                'Authorization': `Bearer ${authToken}`, // Incluye el token de autenticación
                'Content-Type': 'application/json'
              },
              responseType: 'blob',
            });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'MatriculaExternado.xlsx');
              document.body.appendChild(link);
              link.click();
              link.remove();
              setError(null);

           } catch(err){
                  if (err.response && err.response.data) {
                    setError(err.response.data.message); // Mensaje de error del backend
                  } else {
                    setError('Eror. Intente de nuevo');
              }
            }
        } 
   } else {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/sheetjs/download?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Incluye el token de autenticación
            'Content-Type': 'application/json'
          },
          responseType: 'blob',
        });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'MetriculaExternado.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Mensaje de error del backend
      } else {
        setError('Error. Intente de nuevo.');
      }
    }
   }
  };

  const DownloadPdf = async () => {
    const params = new URLSearchParams();
    if (selectedOption) params.append('level', selectedOption);
    if (selectedPeriod) params.append('period', selectedPeriod);
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/externado-student/pdfMatricual?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`, // Incluye el token de autenticación
          'Content-Type': 'application/json'
        },
      });
      const students = response.data;

      const doc = new jsPDF();  
      // Agrega un título al PDF
      const title = `Hoja de estudiantes inscritos ${selectedOption || 'Todos los grados'}   ${selectedPeriod || 'Todos los periodos'}`;
      doc.setFontSize(16);
      doc.setFont('times', 'normal'); // Establecer la fuente a Times New Roman
      doc.text(title, 105, 20, null, null, 'center');

      // Configuración para la tabla
      const tableColumn = ["No.", "Apellidos", "Nombres"];
      const tableRows = [];

      students.forEach((student, index) => {
        const studentData = [
          index + 1, // Número correlativo
          student.externado_student_lastname,
          student.externado_student_firstname
        ];
        tableRows.push(studentData);
      });

      // Añadir la tabla al PDF
      doc.autoTable({
        startY: 30, // Ajustar según sea necesario para dejar espacio para el título
        head: [tableColumn],
        body: tableRows,
        styles: {
          font: 'times', // Establecer la fuente a Times New Roman
        },
        headStyles: {
          fontStyle: 'bold', // Encabezados en negrita
        },
      });

      doc.save('MatriculaExternado.pdf');
      setError(null);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Mensaje de error del backend
      } else {
        setError('Error. Intente de nuevo');
      }
    }
  };

  return (
    <div className='filter-section'>
    <div className="filter-container">
      <div className='filter-panel'>
        <select className="filter-select" value={selectedOption} onChange={handleLevelSelectChange}>
          {levels.map(option => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='filter-panel'>
        <select className="filter-select" value={selectedPeriod} onChange={handlePeriodSelectChange}>
          {periods.map(period => (
            <option key={period.id} value={period.label}>
              {period.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className='buttoms-container'>
      <button className='buttom-download-xlsx' onClick={DownloadXLSX}>Descargar .XLSX</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button className='buttom-download-pdf' onClick={DownloadPdf}>Descargar .PDF</button>
    </div>
   </div>
  );
};

export default FilterComponent;
