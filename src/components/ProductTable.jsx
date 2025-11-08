import React from 'react';
import { formatPrice, getBestPrice, calculateDifference } from '../utils/formatters';
import './ProductTable.css';

export default function ProductTable({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        No se encontraron productos en esta categoría.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th className="product-name-col">Producto</th>
            <th className="price-col">Lider</th>
            <th className="price-col">Jumbo</th>
            <th className="difference-col">Diferencia</th>
            <th className="best-price-col">Mejor Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const bestPrice = getBestPrice(product.liderPrice, product.jumboPrice);
            const diff = calculateDifference(product.liderPrice, product.jumboPrice);

            return (
              <tr key={index}>
                <td className="product-name">{product.name}</td>
                <td className={`price ${bestPrice === 'lider' ? 'best-price' : ''}`}>
                  {formatPrice(product.liderPrice)}
                </td>
                <td className={`price ${bestPrice === 'jumbo' ? 'best-price' : ''}`}>
                  {formatPrice(product.jumboPrice)}
                </td>
                <td className="difference">
                  {product.liderPrice && product.jumboPrice ? (
                    <span className={diff.difference > 0 ? 'negative' : 'positive'}>
                      {formatPrice(Math.abs(diff.difference))} ({Math.abs(diff.percentage)}%)
                    </span>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="best-store">
                  {bestPrice === 'lider' && (
                    <span className="badge badge-lider">Lider</span>
                  )}
                  {bestPrice === 'jumbo' && (
                    <span className="badge badge-jumbo">Jumbo</span>
                  )}
                  {bestPrice === 'same' && (
                    <span className="badge badge-same">Igual</span>
                  )}
                  {bestPrice === 'none' && (
                    <span className="badge badge-none">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
