import React from 'react';
import './SearchBar.css';

export default function SearchBar({ searchTerm, onSearchChange, totalProducts, filteredProducts }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="search-counter">
        Mostrando {filteredProducts} de {totalProducts} productos
      </div>
    </div>
  );
}
