import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterComponent.css'; // Importa el archivo CSS para el estilo

const FilterComponent2 = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Realizar solicitud GET al endpoint proporcionado por el controlador en NestJS
    axios.get('http://localhost:3001/api/v1/externado-admin-system/historicalPeriod2')
      .then(response => {
        setOptions(response.data.map(item => ({ id: item.id, label: item.externado_range_period })));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="filter-container">
      <select className="filter-select" value={selectedOption} onChange={handleSelectChange}>
        <option value=""></option>
        {options.map(option => (
          <option key={option.id} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterComponent2;
