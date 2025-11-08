import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLiderProducts } from './scrapers/lider.js';
import { getJumboProducts } from './scrapers/jumbo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const [liderProducts, jumboProducts] = await Promise.all([
      getLiderProducts(),
      getJumboProducts()
    ]);

    // Merge and organize products by category
    const allProducts = mergeProducts(liderProducts, jumboProducts);

    res.json({
      success: true,
      data: allProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve static files from the React app build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// The "catchall" handler: for any request that doesn't
// match an API route, send back the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Helper function to merge products from both stores
function mergeProducts(liderProducts, jumboProducts) {
  const productMap = new Map();

  // Add Lider products
  liderProducts.forEach(product => {
    const key = normalizeProductName(product.name);
    if (!productMap.has(key)) {
      productMap.set(key, {
        name: product.name,
        category: product.category,
        liderPrice: product.price,
        jumboPrice: null
      });
    }
  });

  // Add Jumbo products
  jumboProducts.forEach(product => {
    const key = normalizeProductName(product.name);
    if (productMap.has(key)) {
      const existing = productMap.get(key);
      existing.jumboPrice = product.price;
    } else {
      productMap.set(key, {
        name: product.name,
        category: product.category,
        liderPrice: null,
        jumboPrice: product.price
      });
    }
  });

  // Group by category
  const categorizedProducts = {};
  productMap.forEach(product => {
    const category = product.category || 'Sin Categoría';
    if (!categorizedProducts[category]) {
      categorizedProducts[category] = [];
    }
    categorizedProducts[category].push(product);
  });

  return categorizedProducts;
}

// Normalize product names for matching
function normalizeProductName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim();
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Serving static files from ${distPath}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
});
