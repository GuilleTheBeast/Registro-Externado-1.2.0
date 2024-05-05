import React, { useState } from 'react';
import './FilterComponent.css'; // Importa el archivo CSS para el estilo

const FilterComponent = () => {
  const options = [
    { id: 1, label: '2020-2021' },
    { id: 2, label: '2021-2022' },
    { id: 3, label: '2022-2023' }
  ];

  const [selectedOption, setSelectedOption] = useState(null);

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

export default FilterComponent;
