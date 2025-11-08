# Guía Completa de Web Scraping - Lider vs Jumbo

Esta guía explica en detalle cómo funciona (o no funciona) el scraping actual y cómo implementarlo de verdad.

---

## 🔍 Estado Actual: ¿Por qué NO funciona el scraping?

### Lo que está pasando ahora:

**Archivo:** `server/scrapers/lider.js` y `server/scrapers/jumbo.js`

**Línea 19-69:**
```javascript
export async function getLiderProducts() {
  // Mock data representing typical products from Lider
  return [
    { name: 'Leche Entera Colun 1L', category: 'Lácteos', price: 1190 },
    // ... más productos hardcodeados
  ];
}
```

### El problema:

**NO ESTÁ HACIENDO SCRAPING REAL.** Solo retorna un array de datos estáticos (hardcodeados).

Es como tener un diccionario de mentira que siempre dice las mismas palabras.

### ¿Por qué hice esto?

1. **Rapidez de desarrollo** - Para que puedas ver la app funcionando inmediatamente
2. **Sin dependencias complejas** - No necesitas instalar Chrome/Chromium
3. **Legal y ético** - Evita problemas con los términos de servicio
4. **Confiabilidad** - No depende de que los sitios web estén disponibles

---

## 🎓 Entendiendo Web Scraping

### ¿Qué es Web Scraping?

Es el proceso de **extraer datos automáticamente de sitios web**.

Imagina que vas a una tienda y anotas todos los precios a mano → Eso es manual.
Web scraping es programar un robot que lo haga por ti → Eso es automático.

### Tipos de sitios web:

#### 1. **Sitios Estáticos (HTML puro)**

**Ejemplo simple:**
```html
<div class="producto">
  <h2>Leche Colun 1L</h2>
  <span class="precio">$1.990</span>
</div>
```

**Cómo scrapearlo:**
- Con Axios + Cheerio (ya instalados)
- Es fácil, rápido y confiable

#### 2. **Sitios Dinámicos (JavaScript/React/Vue)**

**Ejemplo:** Lider.cl y Jumbo.cl

Cuando visitas `www.lider.cl`, el HTML inicial está casi vacío:
```html
<div id="root"></div>
<script src="app.js"></script>
```

El contenido se **carga con JavaScript** después. Por eso Axios + Cheerio NO funcionan.

**Cómo scrapearlo:**
- Con Puppeteer o Playwright (navegadores automatizados)
- Más lento pero puede ejecutar JavaScript

---

## 🛠️ Técnicas de Scraping: Comparación

### Técnica 1: Axios + Cheerio (Simple)

**✅ Ventajas:**
- Rápido (milisegundos)
- Bajo consumo de recursos
- Simple de implementar

**❌ Desventajas:**
- Solo funciona con HTML estático
- NO ejecuta JavaScript
- NO funciona con Lider.cl ni Jumbo.cl

**Cuándo usar:**
- Blogs, noticias, sitios antiguos
- APIs públicas disfrazadas de HTML

### Técnica 2: Puppeteer (Navegador real)

**✅ Ventajas:**
- Ejecuta JavaScript completo
- Puede hacer login, clicks, scroll
- Ve el sitio exactamente como un usuario

**❌ Desventajas:**
- Lento (segundos)
- Consume mucha RAM (100-200 MB por instancia)
- Requiere Chrome/Chromium

**Cuándo usar:**
- Sitios dinámicos (React, Vue, Angular)
- Cuando necesitas interactuar (click en botones)
- Lider.cl, Jumbo.cl, Amazon, etc.

### Técnica 3: Playwright (Similar a Puppeteer)

**✅ Ventajas:**
- Todo lo de Puppeteer
- Soporta Firefox, Safari, Chrome
- Mejor API, más moderna

**❌ Desventajas:**
- Similar consumo de recursos
- Más pesado de instalar

### Técnica 4: APIs Oficiales (Ideal)

**✅ Ventajas:**
- Legal y oficial
- Rápido y confiable
- Datos estructurados

**❌ Desventajas:**
- Lider y Jumbo NO tienen APIs públicas
- Algunas requieren autenticación

---

## 🔬 Análisis: ¿Por qué Lider.cl es difícil?

Vamos a investigar el sitio web real.

### Paso 1: Abrir Lider.cl en el navegador

```bash
# Abre: https://www.lider.cl/supermercado/category/Lacteos
```

### Paso 2: Ver el código fuente

**Presiona:** `Ctrl+U` o click derecho → "Ver código fuente"

**Verás algo así:**
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <div id="root"></div>
  <script src="/static/js/main.abc123.js"></script>
  <script src="/static/js/vendor.def456.js"></script>
</body>
</html>
```

**Conclusión:** El `<div id="root">` está VACÍO. El contenido se carga después con JavaScript.

### Paso 3: Inspeccionar Network

1. Abre DevTools (`F12`)
2. Ve a pestaña "Network"
3. Recarga la página (`Ctrl+R`)
4. Filtra por "Fetch/XHR"

**Busca peticiones a APIs:**
- `https://apicatalog.lider.cl/...`
- `https://api.lider.cl/...`
- O similar

Si encuentras la API, **¡jackpot!** Puedes llamarla directamente sin scraping.

### Paso 4: Analizar la estructura del HTML renderizado

1. Inspecciona un producto (click derecho → Inspect)
2. Mira las clases CSS

**Ejemplo (puede variar):**
```html
<div class="product-card">
  <h3 class="product-title">Leche Colun 1L</h3>
  <span class="product-price">$1.990</span>
</div>
```

Estas clases las usarás en tu scraper.

---

## 💻 Implementación Real: Opción 1 - Puppeteer

### Paso 1: Instalar Puppeteer

```bash
npm install puppeteer
```

**Nota:** Esto descarga Chromium (~170 MB). Puede tomar varios minutos.

### Paso 2: Crear el scraper real

**Archivo:** `server/scrapers/lider-real-puppeteer.js`

```javascript
import puppeteer from 'puppeteer';

export async function getLiderProductsReal() {
  let browser;

  try {
    console.log('🚀 Iniciando scraping de Lider.cl con Puppeteer...');

    // 1. Lanzar navegador
    browser = await puppeteer.launch({
      headless: true,  // false para ver el navegador
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 2. Abrir nueva página
    const page = await browser.newPage();

    // 3. Configurar user agent (parecer humano)
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    // 4. Navegar a la categoría
    console.log('📄 Navegando a Lider.cl...');
    await page.goto('https://www.lider.cl/supermercado/category/Lacteos', {
      waitUntil: 'networkidle2',  // Espera a que cargue todo
      timeout: 30000
    });

    // 5. Esperar a que aparezcan los productos
    await page.waitForSelector('.product-card', { timeout: 10000 });

    // 6. Extraer datos del DOM
    console.log('📦 Extrayendo productos...');
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product-card');
      const results = [];

      productElements.forEach(el => {
        const name = el.querySelector('.product-title')?.textContent?.trim();
        const priceText = el.querySelector('.product-price')?.textContent;
        const price = priceText
          ? parseInt(priceText.replace(/[^0-9]/g, ''))
          : null;

        if (name && price) {
          results.push({
            name,
            price,
            category: 'Lácteos',
            store: 'Lider'
          });
        }
      });

      return results;
    });

    console.log(`✅ Encontrados ${products.length} productos`);
    return products;

  } catch (error) {
    console.error('❌ Error en scraping:', error.message);
    return [];
  } finally {
    // 7. Cerrar navegador
    if (browser) {
      await browser.close();
    }
  }
}

// Función helper para múltiples categorías
export async function getLiderAllCategories() {
  const categories = [
    'Lacteos',
    'Carnes-y-Pescados',
    'Frutas-y-Verduras',
    'Abarrotes'
  ];

  const allProducts = [];

  for (const category of categories) {
    const products = await getLiderProductsReal(category);
    allProducts.push(...products);

    // Esperar entre peticiones (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return allProducts;
}
```

### Paso 3: Usar el scraper real

**Archivo:** `server/scrapers/lider.js`

```javascript
// Importar la versión real
import { getLiderProductsReal } from './lider-real-puppeteer.js';

export async function getLiderProducts() {
  // Intentar scraping real, si falla usar mock data
  try {
    const realProducts = await getLiderProductsReal();

    if (realProducts.length > 0) {
      return realProducts;
    }
  } catch (error) {
    console.warn('Scraping falló, usando mock data');
  }

  // Fallback a mock data
  return [
    { name: 'Leche Entera Colun 1L', category: 'Lácteos', price: 1190 },
    // ... resto del mock data
  ];
}
```

---

## 💻 Implementación Real: Opción 2 - Playwright

### Paso 1: Instalar Playwright

```bash
npm install playwright
npx playwright install chromium
```

### Paso 2: Crear el scraper

**Archivo:** `server/scrapers/lider-real-playwright.js`

```javascript
import { chromium } from 'playwright';

export async function getLiderProductsPlaywright() {
  let browser;

  try {
    console.log('🎭 Iniciando Playwright...');

    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    });

    const page = await context.newPage();

    await page.goto('https://www.lider.cl/supermercado/category/Lacteos');

    // Esperar a que cargue
    await page.waitForSelector('.product-card');

    // Extraer productos
    const products = await page.$$eval('.product-card', elements => {
      return elements.map(el => ({
        name: el.querySelector('.product-title')?.textContent?.trim(),
        price: parseInt(
          el.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || '0'
        ),
        category: 'Lácteos'
      }));
    });

    return products.filter(p => p.name && p.price);

  } finally {
    if (browser) await browser.close();
  }
}
```

---

## 💻 Implementación Real: Opción 3 - API Directa (si existe)

### Investigar si Lider tiene API

**Pasos:**

1. Abre Lider.cl
2. Abre DevTools → Network → Fetch/XHR
3. Recarga la página
4. Busca peticiones a endpoints tipo:
   - `https://api.lider.cl/...`
   - `https://apicatalog.lider.cl/...`

**Si encuentras una API:**

```javascript
import axios from 'axios';

export async function getLiderProductsAPI() {
  try {
    // URL de ejemplo (debes encontrar la real)
    const response = await axios.get(
      'https://api.lider.cl/products/category/lacteos',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0...',
          'Accept': 'application/json'
        }
      }
    );

    // Parsear la respuesta (depende del formato)
    return response.data.products.map(p => ({
      name: p.displayName,
      price: p.price.normal,
      category: p.categoryName
    }));

  } catch (error) {
    console.error('Error llamando API:', error);
    return [];
  }
}
```

---

## 🧪 Cómo Probar Cada Método

### Test 1: Mock Data Actual

```bash
# Terminal 1
npm run server

# Terminal 2
curl http://localhost:3001/api/products | jq .
```

**Resultado esperado:** Datos estáticos siempre iguales.

### Test 2: Puppeteer

**Crear archivo de prueba:** `server/test-scraper.js`

```javascript
import { getLiderProductsReal } from './scrapers/lider-real-puppeteer.js';

console.log('Iniciando test de scraping...');

const products = await getLiderProductsReal();

console.log(`\n✅ Encontrados ${products.length} productos:\n`);
console.log(JSON.stringify(products, null, 2));

process.exit(0);
```

**Ejecutar:**
```bash
node server/test-scraper.js
```

**Tiempo esperado:** 5-15 segundos (la primera vez puede tomar más).

### Test 3: Comparar con sitio real

```bash
# 1. Ejecuta el scraper
node server/test-scraper.js > scraper-output.json

# 2. Abre Lider.cl manualmente y compara precios
# 3. Verifica que los datos coincidan
```

---

## ⚠️ Consideraciones Importantes

### Legal y Ético

**❌ EVITA:**
- Scraping masivo (miles de peticiones)
- Revender los datos
- Violar términos de servicio
- Sobrecargar servidores

**✅ BUENAS PRÁCTICAS:**
- Leer `robots.txt`: `https://www.lider.cl/robots.txt`
- Rate limiting (esperar entre peticiones)
- User agent real
- Scraping durante horas de baja carga
- Caché de resultados

### robots.txt de Lider.cl

```bash
curl https://www.lider.cl/robots.txt
```

**Si dice:**
```
User-agent: *
Disallow: /
```

Significa que **NO quieren scrapers**. Respeta esto.

### Alternativas legales:

1. **APIs oficiales** - Contacta a Lider/Jumbo
2. **Affiliates/Partners** - Programas de afiliados
3. **Datos públicos** - Open Data Chile
4. **Web services pagos** - Servicios de datos de precios

---

## 🚀 Implementación Recomendada

### Para Aprendizaje: Puppeteer en sitio de prueba

En lugar de Lider.cl (que puede bloquearte), usa sitios de prueba:

```javascript
// Scraper de ejemplo con sitio de prueba
import puppeteer from 'puppeteer';

export async function scrapePracticeWebsite() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Sitio de práctica para scraping
  await page.goto('http://quotes.toscrape.com/');

  const quotes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.quote')).map(q => ({
      text: q.querySelector('.text').textContent,
      author: q.querySelector('.author').textContent
    }));
  });

  await browser.close();
  return quotes;
}
```

### Para Producción: Caché + Fallback

```javascript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora

export async function getLiderProducts() {
  // 1. Intentar caché
  const cached = cache.get('lider-products');
  if (cached) {
    console.log('📦 Usando caché');
    return cached;
  }

  // 2. Intentar scraping real
  try {
    const products = await getLiderProductsReal();
    if (products.length > 0) {
      cache.set('lider-products', products);
      return products;
    }
  } catch (error) {
    console.warn('Scraping falló:', error.message);
  }

  // 3. Fallback a mock data
  console.log('⚠️ Usando mock data');
  return getMockData();
}
```

---

## 📊 Comparación de Rendimiento

| Método | Tiempo | RAM | Complejidad | Tasa de éxito |
|--------|--------|-----|-------------|---------------|
| Mock Data | 1 ms | 0 MB | ⭐ Trivial | 100% |
| Axios+Cheerio | 100 ms | 5 MB | ⭐⭐ Fácil | 0% (Lider) |
| Puppeteer | 5-15 s | 150 MB | ⭐⭐⭐ Media | 70-90% |
| Playwright | 3-10 s | 120 MB | ⭐⭐⭐ Media | 80-95% |
| API directa | 200 ms | 2 MB | ⭐ Fácil | 100%* |

*Si existe API pública

---

## 🎯 Ejercicio Práctico

### Nivel 1: Sitio de Práctica

```bash
# 1. Instala Puppeteer
npm install puppeteer

# 2. Crea server/scrapers/practice.js
# (código arriba con quotes.toscrape.com)

# 3. Prueba
node server/scrapers/practice.js
```

### Nivel 2: Intentar con Lider (responsablemente)

```bash
# 1. Investiga robots.txt
curl https://www.lider.cl/robots.txt

# 2. Analiza estructura en DevTools

# 3. Implementa con rate limiting

# 4. Prueba con UNA categoría pequeña
```

### Nivel 3: Sistema completo con caché

```bash
# 1. Instala node-cache
npm install node-cache

# 2. Implementa sistema híbrido (arriba)

# 3. Agrega logging y métricas
```

---

## 📚 Recursos para Aprender Más

**Documentación:**
- [Puppeteer Docs](https://pptr.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Cheerio Docs](https://cheerio.js.org/)

**Sitios de práctica:**
- http://quotes.toscrape.com/
- http://books.toscrape.com/
- https://scrapethissite.com/

**Tutoriales:**
- [Web Scraping con Node.js](https://www.scrapingbee.com/blog/web-scraping-javascript/)
- [Playwright Tutorial](https://www.youtube.com/results?search_query=playwright+tutorial)

---

## ✅ Resumen

**Estado actual:**
- ❌ NO hace scraping real
- ✅ Usa datos de muestra (mock data)
- ✅ Funciona para desarrollo/demostración

**Para implementar scraping real:**
1. **Investiga** el sitio (DevTools, Network, estructura)
2. **Elige** técnica (Puppeteer recomendado)
3. **Implementa** con buenas prácticas
4. **Prueba** en sitios de práctica primero
5. **Respeta** robots.txt y términos de servicio

**Próximos pasos:**
- Lee `SCRAPING-EXAMPLES.md` para código completo
- Prueba con sitios de práctica
- Implementa caché y rate limiting
- Considera alternativas legales (APIs)

---

¿Quieres que cree un ejemplo completo funcionando con Puppeteer?
