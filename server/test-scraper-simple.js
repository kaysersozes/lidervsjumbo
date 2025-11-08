#!/usr/bin/env node

/**
 * Script simple para probar scraping
 * Ejecuta: node server/test-scraper-simple.js
 */

console.log('🧪 Test de Scraping - Lider vs Jumbo\n');
console.log('═'.repeat(50) + '\n');

// Importar scrapers actuales
import { getLiderProducts } from './scrapers/lider.js';
import { getJumboProducts } from './scrapers/jumbo.js';

console.log('📦 Test 1: Scraper actual (Mock Data)\n');

try {
  // Test scraper de Lider
  console.log('1️⃣  Obteniendo productos de Lider...');
  const liderProducts = await getLiderProducts();
  console.log(`   ✅ ${liderProducts.length} productos obtenidos`);
  console.log(`   📝 Primer producto:`, liderProducts[0]);

  // Test scraper de Jumbo
  console.log('\n2️⃣  Obteniendo productos de Jumbo...');
  const jumboProducts = await getJumboProducts();
  console.log(`   ✅ ${jumboProducts.length} productos obtenidos`);
  console.log(`   📝 Primer producto:`, jumboProducts[0]);

  // Análisis
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Análisis:\n');

  // Categorías únicas
  const liderCategories = [...new Set(liderProducts.map(p => p.category))];
  const jumboCategories = [...new Set(jumboProducts.map(p => p.category))];

  console.log(`Categorías Lider: ${liderCategories.length}`);
  liderCategories.forEach(cat => {
    const count = liderProducts.filter(p => p.category === cat).length;
    console.log(`  - ${cat}: ${count} productos`);
  });

  console.log(`\nCategorías Jumbo: ${jumboCategories.length}`);
  jumboCategories.forEach(cat => {
    const count = jumboProducts.filter(p => p.category === cat).length;
    console.log(`  - ${cat}: ${count} productos`);
  });

  // Comparar precios de productos comunes
  console.log('\n' + '═'.repeat(50));
  console.log('💰 Comparación de Precios (Mock Data):\n');

  const compareProducts = [
    'Leche Entera Colun 1L',
    'Coca Cola 2L',
    'Pan Hallulla 6 unidades'
  ];

  compareProducts.forEach(productName => {
    const lider = liderProducts.find(p => p.name === productName);
    const jumbo = jumboProducts.find(p => p.name === productName);

    if (lider && jumbo) {
      const diff = lider.price - jumbo.price;
      const cheaper = diff > 0 ? 'Jumbo' : 'Lider';
      const symbol = diff > 0 ? '▼' : '▲';

      console.log(`📦 ${productName}`);
      console.log(`   Lider: $${lider.price.toLocaleString('es-CL')}`);
      console.log(`   Jumbo: $${jumbo.price.toLocaleString('es-CL')}`);
      console.log(`   ${symbol} Más barato: ${cheaper} (diferencia: $${Math.abs(diff)})\n`);
    }
  });

  // Advertencia
  console.log('═'.repeat(50));
  console.log('⚠️  IMPORTANTE:\n');
  console.log('Estos son DATOS DE EJEMPLO (mock data).');
  console.log('NO son precios reales de los supermercados.\n');

  console.log('Para obtener precios reales, necesitas:');
  console.log('  1. Implementar scraping con Puppeteer');
  console.log('  2. O encontrar APIs públicas');
  console.log('  3. O usar servicios de datos de terceros\n');

  console.log('📚 Lee SCRAPING-GUIDE.md para aprender cómo.');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

// Test Puppeteer (si está instalado)
console.log('\n' + '═'.repeat(50));
console.log('🎭 Test 2: Puppeteer (Scraping Real)\n');

try {
  // Intentar importar Puppeteer
  const puppeteer = await import('puppeteer').catch(() => null);

  if (puppeteer) {
    console.log('✅ Puppeteer está instalado\n');
    console.log('Para ejecutar ejemplos de scraping real:');
    console.log('  node server/scrapers/example-puppeteer.js\n');
  } else {
    console.log('❌ Puppeteer NO está instalado\n');
    console.log('Para instalarlo:');
    console.log('  npm install puppeteer\n');
    console.log('⚠️  Nota: Descargará Chromium (~170 MB)');
  }
} catch {
  console.log('❌ Error verificando Puppeteer');
}

console.log('\n' + '═'.repeat(50));
console.log('✅ Test completado\n');
