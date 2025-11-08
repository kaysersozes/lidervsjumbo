/**
 * EJEMPLO: Scraping con Cheerio (Sin navegador)
 * Cheerio es más liviano - perfecto para sitios estáticos
 */

import * as cheerio from 'cheerio';
import axios from 'axios';

console.log('🧪 Ejemplo: Scraping con Cheerio\n');
console.log('═'.repeat(50) + '\n');

// HTML de ejemplo (simulando lo que vendría de un sitio web)
const htmlMock = `
<!DOCTYPE html>
<html>
<head><title>Supermercado Virtual</title></head>
<body>
    <h1>Productos en Oferta</h1>

    <div class="product" data-id="1">
        <h3 class="product-title">Leche Entera Colun 1L</h3>
        <span class="category">Lácteos</span>
        <span class="price">$1,990</span>
        <span class="store">Lider</span>
    </div>

    <div class="product" data-id="2">
        <h3 class="product-title">Yogurt Natural 1kg</h3>
        <span class="category">Lácteos</span>
        <span class="price">$2,490</span>
        <span class="store">Lider</span>
    </div>

    <div class="product" data-id="3">
        <h3 class="product-title">Coca Cola 2L</h3>
        <span class="category">Bebidas</span>
        <span class="price">$1,890</span>
        <span class="store">Jumbo</span>
    </div>

    <div class="product" data-id="4">
        <h3 class="product-title">Pan Hallulla 6 un</h3>
        <span class="category">Panadería</span>
        <span class="price">$1,290</span>
        <span class="store">Jumbo</span>
    </div>
</body>
</html>
`;

console.log('📄 HTML de ejemplo cargado (simulando respuesta de servidor)\n');

// PASO 1: Cargar HTML en Cheerio
console.log('1️⃣  Cargando HTML en Cheerio...');
const $ = cheerio.load(htmlMock);
console.log('   ✅ HTML parseado\n');

// PASO 2: Extraer título
console.log('2️⃣  Extrayendo título...');
const title = $('title').text();
console.log(`   📝 Título: "${title}"\n`);

// PASO 3: Extraer encabezado
console.log('3️⃣  Extrayendo encabezado...');
const heading = $('h1').text();
console.log(`   📝 Encabezado: "${heading}"\n`);

// PASO 4: Scrapear productos
console.log('4️⃣  Scrapeando productos...\n');
const products = [];

$('.product').each((index, element) => {
  // Seleccionar elementos dentro de cada producto
  const name = $(element).find('.product-title').text();
  const category = $(element).find('.category').text();
  const priceText = $(element).find('.price').text();
  const store = $(element).find('.store').text();

  // Convertir "$1,990" a 1990
  const price = parseInt(priceText.replace(/[^0-9]/g, ''));

  // Agregar al array
  products.push({ name, category, price, store });

  console.log(`   📦 Producto ${index + 1}:`);
  console.log(`      Nombre: ${name}`);
  console.log(`      Categoría: ${category}`);
  console.log(`      Precio: $${price.toLocaleString('es-CL')}`);
  console.log(`      Tienda: ${store}\n`);
});

// PASO 5: Análisis de datos
console.log('5️⃣  Análisis de datos:\n');
console.log(`   Total de productos: ${products.length}`);

// Agrupar por categoría
const byCategory = products.reduce((acc, p) => {
  if (!acc[p.category]) acc[p.category] = [];
  acc[p.category].push(p);
  return acc;
}, {});

console.log(`   Categorías: ${Object.keys(byCategory).length}`);
Object.keys(byCategory).forEach(cat => {
  console.log(`     - ${cat}: ${byCategory[cat].length} productos`);
});

// Agrupar por tienda
const byStore = products.reduce((acc, p) => {
  if (!acc[p.store]) acc[p.store] = [];
  acc[p.store].push(p);
  return acc;
}, {});

console.log(`\n   Productos por tienda:`);
Object.keys(byStore).forEach(store => {
  console.log(`     - ${store}: ${byStore[store].length} productos`);
});

// Precio promedio
const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
console.log(`\n   Precio promedio: $${Math.round(avgPrice).toLocaleString('es-CL')}`);

console.log('\n' + '═'.repeat(50));
console.log('✅ SCRAPING COMPLETADO CON CHEERIO!\n');

console.log('📚 Lo que aprendiste con Cheerio:');
console.log('  ✅ Cargar y parsear HTML');
console.log('  ✅ Seleccionar elementos con selectores CSS');
console.log('  ✅ Extraer texto de elementos');
console.log('  ✅ Iterar sobre múltiples elementos (.each)');
console.log('  ✅ Procesar y limpiar datos');
console.log('  ✅ Agrupar y analizar resultados\n');

console.log('💡 Ventajas de Cheerio:');
console.log('  ✅ Muy rápido (milisegundos)');
console.log('  ✅ No requiere navegador');
console.log('  ✅ Bajo consumo de memoria');
console.log('  ❌ NO ejecuta JavaScript\n');

console.log('⚠️  Cheerio NO funciona con Lider.cl/Jumbo.cl porque:');
console.log('   - Usan React (JavaScript para cargar contenido)');
console.log('   - El HTML inicial está vacío');
console.log('   - Necesitas Puppeteer/Playwright para esos sitios\n');

// PASO 6: Comparar con sitio real
console.log('6️⃣  Comparando con sitio real...\n');

console.log('   Para hacer scraping REAL de Lider.cl:');
console.log('   1. Necesitas Puppeteer/Playwright (navegador real)');
console.log('   2. O encontrar su API pública');
console.log('   3. Cheerio solo sirve para HTML estático\n');

console.log('   Ejemplo de uso real de Cheerio:');
console.log('   - Blogs, noticias (contenido estático)');
console.log('   - Sitios simples sin JavaScript');
console.log('   - Parsear HTML que ya obtuviste\n');

console.log('═'.repeat(50) + '\n');
