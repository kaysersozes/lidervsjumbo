/**
 * EJEMPLO REAL DE SCRAPING CON PUPPETEER
 *
 * Este archivo muestra cómo implementar scraping REAL de un sitio web.
 *
 * IMPORTANTE:
 * - Este es un EJEMPLO EDUCATIVO
 * - Usa sitios de práctica permitidos
 * - NO uses esto sin permiso del sitio objetivo
 * - Siempre revisa robots.txt y términos de servicio
 */

// Para usar este ejemplo, instala Puppeteer:
// npm install puppeteer

import puppeteer from 'puppeteer';

/**
 * Ejemplo 1: Scraping de sitio de práctica
 * quotes.toscrape.com - Sitio diseñado PARA practicar scraping
 */
export async function scrapeQuotesExample() {
  console.log('🎯 Ejemplo 1: Scraping de quotes.toscrape.com');
  console.log('Este sitio está diseñado PARA practicar scraping\n');

  let browser;

  try {
    // Paso 1: Lanzar navegador
    console.log('1️⃣  Lanzando navegador Chromium...');
    browser = await puppeteer.launch({
      headless: true,  // Cambiar a false para VER el navegador
      args: ['--no-sandbox']
    });

    // Paso 2: Abrir nueva página
    const page = await browser.newPage();

    // Paso 3: Navegar al sitio
    console.log('2️⃣  Navegando a quotes.toscrape.com...');
    await page.goto('http://quotes.toscrape.com/', {
      waitUntil: 'networkidle0'  // Espera a que termine de cargar
    });

    // Paso 4: Extraer datos
    console.log('3️⃣  Extrayendo citas...\n');
    const quotes = await page.evaluate(() => {
      // Este código se ejecuta EN EL NAVEGADOR
      const quoteElements = document.querySelectorAll('.quote');
      const results = [];

      quoteElements.forEach(el => {
        const text = el.querySelector('.text')?.textContent;
        const author = el.querySelector('.author')?.textContent;
        const tags = Array.from(el.querySelectorAll('.tag')).map(
          tag => tag.textContent
        );

        results.push({ text, author, tags });
      });

      return results;
    });

    // Paso 5: Mostrar resultados
    console.log(`✅ Encontradas ${quotes.length} citas:\n`);
    quotes.forEach((q, i) => {
      console.log(`${i + 1}. ${q.text}`);
      console.log(`   - ${q.author}`);
      console.log(`   - Tags: ${q.tags.join(', ')}\n`);
    });

    return quotes;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    // Paso 6: Cerrar navegador
    if (browser) {
      console.log('6️⃣  Cerrando navegador...');
      await browser.close();
    }
  }
}

/**
 * Ejemplo 2: Scraping con screenshots (para debugging)
 */
export async function scrapeWithScreenshot() {
  console.log('🎯 Ejemplo 2: Scraping con screenshot\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Configurar viewport
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto('http://books.toscrape.com/');

  // Tomar screenshot ANTES de extraer datos
  await page.screenshot({ path: 'debug-before.png' });
  console.log('📸 Screenshot guardado: debug-before.png');

  // Extraer libros
  const books = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product_pod')).map(book => ({
      title: book.querySelector('h3 a')?.getAttribute('title'),
      price: book.querySelector('.price_color')?.textContent
    }));
  });

  console.log(`✅ Encontrados ${books.length} libros`);
  console.log('Primeros 3:', books.slice(0, 3));

  await browser.close();
  return books;
}

/**
 * Ejemplo 3: Manejo de paginación
 */
export async function scrapeMultiplePages() {
  console.log('🎯 Ejemplo 3: Scraping con paginación\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const allBooks = [];
  let currentPage = 1;
  const maxPages = 3;  // Limitar a 3 páginas para ejemplo

  while (currentPage <= maxPages) {
    console.log(`📄 Scrapeando página ${currentPage}...`);

    await page.goto(`http://books.toscrape.com/catalogue/page-${currentPage}.html`);

    const books = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product_pod')).map(book => ({
        title: book.querySelector('h3 a')?.getAttribute('title'),
        price: book.querySelector('.price_color')?.textContent,
        inStock: book.querySelector('.instock')?.textContent?.trim()
      }));
    });

    allBooks.push(...books);
    console.log(`   ✅ ${books.length} libros en página ${currentPage}`);

    currentPage++;

    // IMPORTANTE: Esperar entre páginas (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📚 Total: ${allBooks.length} libros de ${maxPages} páginas`);

  await browser.close();
  return allBooks;
}

/**
 * Ejemplo 4: Simulación de interacción (clicks, scroll)
 */
export async function scrapeWithInteraction() {
  console.log('🎯 Ejemplo 4: Scraping con interacción\n');

  const browser = await puppeteer.launch({ headless: false });  // Ver el navegador
  const page = await browser.newPage();

  await page.goto('http://quotes.toscrape.com/');

  // Hacer click en "Login"
  console.log('🖱️  Haciendo click en Login...');
  await page.click('a[href="/login"]');

  // Esperar a que cargue la página de login
  await page.waitForSelector('#username');

  // Llenar formulario
  console.log('⌨️  Llenando formulario...');
  await page.type('#username', 'usuario-ejemplo');
  await page.type('#password', 'password123');

  // Tomar screenshot
  await page.screenshot({ path: 'login-form.png' });

  // Click en submit (comentado para no hacer login real)
  // await page.click('input[type="submit"]');

  console.log('✅ Interacción completada');

  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
}

/**
 * Ejemplo 5: Manejo de errores robusto
 */
export async function scrapeWithErrorHandling(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Timeout de 10 segundos
  page.setDefaultTimeout(10000);

  try {
    // Intentar cargar página
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });

    // Esperar selector con timeout
    const selector = '.product';
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
    } catch {
      console.log(`⚠️  Selector "${selector}" no encontrado, intentando alternativa...`);
      // Intentar selector alternativo
      await page.waitForSelector('.item', { timeout: 5000 });
    }

    // Extraer datos con validación
    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll('.product, .item');
      return Array.from(elements).map(el => {
        const name = el.querySelector('.name, .title')?.textContent?.trim() || 'Sin nombre';
        const priceText = el.querySelector('.price')?.textContent || '0';
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

        return { name, price };
      }).filter(item => item.price > 0);  // Filtrar inválidos
    });

    console.log(`✅ Extraídos ${data.length} items válidos`);
    return data;

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Tomar screenshot del error
    try {
      await page.screenshot({ path: 'error-screenshot.png' });
      console.log('📸 Screenshot del error guardado');
    } catch {}

    return [];  // Retornar array vacío en caso de error

  } finally {
    await browser.close();
  }
}

/**
 * Ejemplo 6: Scraper con User Agent y headers
 */
export async function scrapeWithHeaders() {
  console.log('🎯 Ejemplo 6: Scraping con User Agent real\n');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Configurar User Agent (parecer navegador real)
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  );

  // Configurar headers adicionales
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'es-CL,es;q=0.9',
    'Accept': 'text/html,application/xhtml+xml'
  });

  await page.goto('http://quotes.toscrape.com/');

  const quotes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.quote')).map(q => ({
      text: q.querySelector('.text')?.textContent,
      author: q.querySelector('.author')?.textContent
    }));
  });

  console.log(`✅ ${quotes.length} citas extraídas con headers personalizados`);

  await browser.close();
  return quotes;
}

/**
 * PLANTILLA PARA LIDER.CL (ADAPTARLA)
 *
 * IMPORTANTE: Revisa robots.txt primero!
 * https://www.lider.cl/robots.txt
 */
export async function scrapeLiderTemplate() {
  console.log('🎯 Plantilla para Lider.cl (ADAPTARLA)\n');
  console.log('⚠️  IMPORTANTE:');
  console.log('1. Revisa robots.txt primero');
  console.log('2. Usa rate limiting (espera entre peticiones)');
  console.log('3. No hagas scraping masivo');
  console.log('4. Respeta términos de servicio\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // User agent real
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  );

  try {
    // PASO 1: Investigar la estructura
    console.log('📋 PASO 1: Primero debes investigar:');
    console.log('  - Abre Lider.cl en tu navegador');
    console.log('  - F12 → Network → XHR');
    console.log('  - Busca APIs (apicatalog, api, etc.)');
    console.log('  - Inspect → Copia selectores CSS\n');

    // PASO 2: Navegar (ADAPTAR URL)
    console.log('📋 PASO 2: Navegar (adaptar URL real)');
    // await page.goto('https://www.lider.cl/supermercado/category/Lacteos', {
    //   waitUntil: 'networkidle2',
    //   timeout: 30000
    // });

    // PASO 3: Esperar a que cargue (ADAPTAR SELECTOR)
    console.log('📋 PASO 3: Esperar selector (adaptarlo según el sitio)');
    // await page.waitForSelector('.product-card', { timeout: 10000 });

    // PASO 4: Extraer datos (ADAPTAR SELECTORES)
    console.log('📋 PASO 4: Extraer datos (adaptar selectores)');
    // const products = await page.evaluate(() => {
    //   return Array.from(document.querySelectorAll('.product-card')).map(el => ({
    //     name: el.querySelector('.product-title')?.textContent?.trim(),
    //     price: parseInt(
    //       el.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || '0'
    //     ),
    //     category: 'Lácteos'
    //   }));
    // });

    console.log('\n📝 Para implementar:');
    console.log('1. Investiga la estructura HTML real');
    console.log('2. Encuentra los selectores correctos');
    console.log('3. Adapta este código');
    console.log('4. Prueba con UNA página primero');
    console.log('5. Agrega rate limiting');
    console.log('6. Implementa caché\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Rate limiter - Esperar entre peticiones
 */
export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry con backoff exponencial
 */
export async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const waitTime = Math.pow(2, i) * 1000;  // 1s, 2s, 4s
      console.log(`⚠️  Reintento ${i + 1}/${maxRetries} en ${waitTime}ms...`);
      await sleep(waitTime);
    }
  }
}

// ============================================
// EJECUTAR EJEMPLOS
// ============================================

// Si ejecutas este archivo directamente:
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('🚀 EJEMPLOS DE WEB SCRAPING CON PUPPETEER\n');
  console.log('Ejecutando ejemplos...\n');

  try {
    // Ejecutar ejemplo 1
    await scrapeQuotesExample();

    console.log('\n' + '='.repeat(50) + '\n');

    // Ejecutar ejemplo 2
    await scrapeWithScreenshot();

    console.log('\n✅ Ejemplos completados!');
    console.log('\n📚 Próximos pasos:');
    console.log('1. Revisa los screenshots generados');
    console.log('2. Cambia headless: false para VER el navegador');
    console.log('3. Adapta el código para tu sitio objetivo');
    console.log('4. Lee SCRAPING-GUIDE.md para más info\n');

  } catch (error) {
    console.error('Error ejecutando ejemplos:', error);
  } finally {
    process.exit(0);
  }
}
