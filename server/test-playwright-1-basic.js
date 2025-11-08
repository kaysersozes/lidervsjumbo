/**
 * EJEMPLO 1: Test básico de Playwright
 * Verifica que todo funcione correctamente
 */

import { chromium } from 'playwright';

console.log('🧪 Ejemplo 1: Test Básico de Playwright\n');
console.log('═'.repeat(50) + '\n');

try {
  console.log('1️⃣  Lanzando navegador Chromium...');
  const browser = await chromium.launch({
    headless: true,  // true = no abre ventana, false = ver el navegador
    args: ['--ignore-certificate-errors']
  });

  console.log('   ✅ Navegador lanzado exitosamente');

  console.log('\n2️⃣  Creando contexto del navegador...');
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  console.log('   ✅ Contexto creado');

  console.log('\n3️⃣  Abriendo nueva página...');
  const page = await context.newPage();
  console.log('   ✅ Página creada');

  console.log('\n4️⃣  Navegando a example.com...');
  await page.goto('https://example.com');
  console.log('   ✅ Navegación exitosa');

  console.log('\n5️⃣  Extrayendo título de la página...');
  const title = await page.title();
  console.log(`   📄 Título: "${title}"`);

  console.log('\n6️⃣  Extrayendo contenido...');
  const heading = await page.locator('h1').textContent();
  console.log(`   📝 Encabezado: "${heading}"`);

  const paragraph = await page.locator('p').first().textContent();
  console.log(`   📝 Primer párrafo: "${paragraph}"`);

  console.log('\n7️⃣  Tomando screenshot...');
  await page.screenshot({ path: 'test-example.png' });
  console.log('   📸 Screenshot guardado: test-example.png');

  console.log('\n8️⃣  Cerrando navegador...');
  await browser.close();
  console.log('   ✅ Navegador cerrado');

  console.log('\n' + '═'.repeat(50));
  console.log('✅ TEST EXITOSO - Playwright funciona correctamente!\n');

} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('\nDetalles:', error);
  process.exit(1);
}
