import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import ProductTable from './components/ProductTable';
import './App.css';

function App() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/products');

        if (response.data.success) {
          setProducts(response.data.data);

          // Set first category as active
          const categories = Object.keys(response.data.data);
          if (categories.length > 0) {
            setActiveCategory(categories[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos. Asegúrate de que el servidor esté ejecutándose.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get categories
  const categories = Object.keys(products);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!activeCategory || !products[activeCategory]) {
      return [];
    }

    const categoryProducts = products[activeCategory];

    if (!searchTerm.trim()) {
      return categoryProducts;
    }

    const searchLower = searchTerm.toLowerCase();
    return categoryProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower)
    );
  }, [products, activeCategory, searchTerm]);

  // Count total products in active category
  const totalProducts = products[activeCategory]?.length || 0;

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <p className="error-hint">
            Ejecuta <code>npm run server</code> en otra terminal para iniciar el servidor backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Comparador de Precios</h1>
        <p className="subtitle">Lider vs Jumbo - Encuentra los mejores precios</p>
      </header>

      <main className="app-main">
        {categories.length > 0 ? (
          <>
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalProducts={totalProducts}
              filteredProducts={filteredProducts.length}
            />

            <ProductTable products={filteredProducts} />
          </>
        ) : (
          <div className="no-data">
            <p>No hay datos de productos disponibles.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Datos actualizados en tiempo real desde Lider.cl y Jumbo.cl</p>
      </footer>
    </div>
  );
}

export default App;
