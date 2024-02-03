// src/components/CountrySelector.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa'; // Import the close icon

interface CountrySelectorProps {
  isOpen: boolean;
  options: { value: string; label: string }[];
  selectedValue: string | null;
  onClose: () => void;
  onSelect: (selectedOption: { value: string; label: string } | null) => void;
}

interface CustomStyles {
  content: React.CSSProperties;
  closeButton: React.CSSProperties;
}

const customStyles: CustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px', // Set your preferred fixed width here
    height: '400px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
  },
};

const CountrySelector: React.FC<CountrySelectorProps> = ({ isOpen, options, selectedValue, onClose, onSelect }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (newValue: string) => {
    setSearchValue(newValue);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Select Country"
      style={customStyles}
    >
      <div style={customStyles.closeButton} onClick={onClose}>
        <FaTimes />
      </div>
      <div className="country-selector-container">
        <label htmlFor="location">Select Country:</label>
        <Select
          id="location"
          value={options.find((country) => country.value === selectedValue)}
          options={filteredOptions}
          onChange={onSelect}
          onInputChange={handleSearchChange}
          autoFocus
          isSearchable
          placeholder="Search for a country..."
        />
      </div>
    </Modal>
  );
};

export default CountrySelector;
