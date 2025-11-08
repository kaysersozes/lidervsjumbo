/**
 * EJEMPLO 2: Scraping de HTML local
 * Crea HTML y lo scrapea - Sin depender de internet
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🧪 Ejemplo 2: Scraping de HTML Local\n');
console.log('═'.repeat(50) + '\n');

// Crear un HTML de ejemplo (simulando una página de supermercado)
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Supermercado Test - Productos</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .product { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 18px; }
        .product-price { color: green; font-size: 20px; }
        .product-category { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <h1>Productos del Supermercado</h1>

    <div class="product" data-id="1">
        <div class="product-category">Lácteos</div>
        <div class="product-name">Leche Entera Colun 1L</div>
        <div class="product-price">$1.990</div>
    </div>

    <div class="product" data-id="2">
        <div class="product-category">Lácteos</div>
        <div class="product-name">Yogurt Natural Quillayes 1kg</div>
        <div class="product-price">$2.490</div>
    </div>

    <div class="product" data-id="3">
        <div class="product-category">Bebidas</div>
        <div class="product-name">Coca Cola 2L</div>
        <div class="product-price">$1.890</div>
    </div>

    <div class="product" data-id="4">
        <div class="product-category">Panadería</div>
        <div class="product-name">Pan Hallulla 6 unidades</div>
        <div class="product-price">$1.290</div>
    </div>

    <div class="product" data-id="5">
        <div class="product-category">Frutas</div>
        <div class="product-name">Manzana Roja por kg</div>
        <div class="product-price">$1.490</div>
    </div>
</body>
</html>
`;

try {
  // Paso 1: Crear archivo HTML
  console.log('1️⃣  Creando archivo HTML local...');
  const htmlPath = join(__dirname, 'test-products.html');
  writeFileSync(htmlPath, htmlContent);
  console.log(`   ✅ Archivo creado: ${htmlPath}`);

  // Paso 2: Lanzar navegador
  console.log('\n2️⃣  Lanzando navegador Chromium...');
  const browser = await chromium.launch({ headless: true });
  console.log('   ✅ Navegador lanzado');

  // Paso 3: Crear página
  console.log('\n3️⃣  Creando página...');
  const page = await browser.newPage();
  console.log('   ✅ Página creada');

  // Paso 4: Cargar HTML local
  console.log('\n4️⃣  Cargando HTML local...');
  await page.goto(`file://${htmlPath}`);
  console.log('   ✅ HTML cargado');

  // Paso 5: Extraer título
  console.log('\n5️⃣  Extrayendo título...');
  const title = await page.title();
  console.log(`   📄 Título: "${title}"`);

  // Paso 6: Extraer encabezado
  console.log('\n6️⃣  Extrayendo encabezado...');
  const heading = await page.locator('h1').textContent();
  console.log(`   📝 Encabezado: "${heading}"`);

  // Paso 7: Scrapear productos
  console.log('\n7️⃣  Scrapeando productos...\n');

  const products = await page.evaluate(() => {
    const productElements = document.querySelectorAll('.product');
    const results = [];

    productElements.forEach(el => {
      const category = el.querySelector('.product-category')?.textContent || '';
      const name = el.querySelector('.product-name')?.textContent || '';
      const priceText = el.querySelector('.product-price')?.textContent || '';

      // Convertir "$1.990" a 1990
      const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

      results.push({ category, name, price });
    });

    return results;
  });

  console.log(`   ✅ Encontrados ${products.length} productos:\n`);

  products.forEach((p, i) => {
    console.log(`   ${i + 1}. [${p.category}] ${p.name}`);
    console.log(`      Precio: $${p.price.toLocaleString('es-CL')}\n`);
  });

  // Paso 8: Agrupar por categoría
  console.log('8️⃣  Agrupando por categoría...\n');

  const byCategory = products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = [];
    }
    acc[p.category].push(p);
    return acc;
  }, {});

  Object.entries(byCategory).forEach(([category, items]) => {
    console.log(`   📦 ${category}: ${items.length} productos`);
    items.forEach(item => {
      console.log(`      - ${item.name}: $${item.toLocaleString('es-CL')}`);
    });
    console.log('');
  });

  // Paso 9: Screenshot
  console.log('9️⃣  Tomando screenshot...');
  await page.screenshot({ path: 'test-local-products.png', fullPage: true });
  console.log('   📸 Screenshot: test-local-products.png');

  // Paso 10: Cerrar
  console.log('\n🔟 Cerrando navegador...');
  await browser.close();
  console.log('   ✅ Navegador cerrado');

  console.log('\n' + '═'.repeat(50));
  console.log('✅ SCRAPING EXITOSO!\n');
  console.log('📚 Lo que aprendiste:');
  console.log('  - Cómo lanzar un navegador con Playwright');
  console.log('  - Cómo cargar HTML (local o remoto)');
  console.log('  - Cómo seleccionar elementos con selectores CSS');
  console.log('  - Cómo ejecutar JavaScript en la página (page.evaluate)');
  console.log('  - Cómo extraer y procesar datos');
  console.log('  - Cómo tomar screenshots');
  console.log('\n💡 Próximo paso: Scrapear un sitio web real\n');

} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error);
  process.exit(1);
}
