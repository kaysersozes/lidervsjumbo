# Guía Práctica: Probar Scraping en Tu PC Local

Esta guía te enseña cómo hacer scraping REAL en tu propia máquina, paso a paso.

---

## ✅ Lo Que Acabas de Aprender

### Prueba con Cheerio (Exitosa)

Acabas de ejecutar `test-cheerio-1-basic.js` y funcionó perfectamente. **Aprendiste:**

1. **Cómo funciona el scraping**: Selectores CSS, extracción de texto, procesamiento de datos
2. **Cheerio es rápido**: Milisegundos vs segundos con Puppeteer
3. **Limitación de Cheerio**: NO ejecuta JavaScript, solo parsea HTML estático

### Por Qué No Funcionó Playwright Aquí

El entorno donde probamos tiene restricciones:
- No puede descargar Chromium (~170 MB)
- Problemas de red/permisos
- Esto es NORMAL - es un entorno limitado

**En tu PC local funcionará perfectamente.**

---

## 🚀 Cómo Hacer Scraping REAL en Tu PC

### Opción A: Con Puppeteer (Recomendado)

#### Paso 1: Instalar Puppeteer en Tu PC

```bash
cd ~/lidervsjumbo  # O donde clonaste el repo
npm install puppeteer
```

**Qué hace:** Descarga Chromium (~170 MB). Puede tardar 3-5 minutos.

**Verificar instalación:**
```bash
npm list puppeteer
# Deberías ver: puppeteer@X.X.X
```

#### Paso 2: Crear Tu Primer Scraper Real

Crea un archivo `mi-primer-scraper.js`:

```javascript
import puppeteer from 'puppeteer';

console.log('🚀 Mi Primer Scraper con Puppeteer\n');

const browser = await puppeteer.launch({
  headless: false  // false = VER el navegador (útil para aprender)
});

const page = await browser.newPage();

// Ir a un sitio de práctica
console.log('📄 Navegando a quotes.toscrape.com...');
await page.goto('http://quotes.toscrape.com/');

// Extraer citas
const quotes = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.quote')).map(q => ({
    text: q.querySelector('.text')?.textContent,
    author: q.querySelector('.author')?.textContent
  }));
});

console.log(`\n✅ Encontradas ${quotes.length} citas:\n`);
quotes.forEach((q, i) => {
  console.log(`${i + 1}. ${q.text}`);
  console.log(`   - ${q.author}\n`);
});

await browser.close();
console.log('✅ Scraping completado!');
```

#### Paso 3: Ejecutar

```bash
node mi-primer-scraper.js
```

**Qué verás:**
- Se abre una ventana de Chrome
- Navega al sitio
- Extrae las citas
- Cierra el navegador
- Muestra los resultados

**Tiempo:** 5-10 segundos

---

### Opción B: Investigar Lider.cl Manualmente

Antes de scrapear Lider.cl, investiguemos si tiene API pública (más fácil).

#### Paso 1: Abrir DevTools

1. Abre https://www.lider.cl/supermercado/category/Lacteos en Chrome
2. Presiona `F12` (DevTools)
3. Ve a pestaña **Network**
4. Ve a sub-pestaña **Fetch/XHR**
5. Recarga la página (`Ctrl+R`)

#### Paso 2: Buscar APIs

Busca peticiones a endpoints como:
- `api.lider.cl`
- `apicatalog.lider.cl`
- Cualquier que devuelva JSON

**Si encuentras una API:**

```javascript
// Ejemplo si encuentras: https://apicatalog.lider.cl/products?category=lacteos

import axios from 'axios';

const response = await axios.get('https://apicatalog.lider.cl/products?category=lacteos', {
  headers: {
    'User-Agent': 'Mozilla/5.0...',
    'Accept': 'application/json'
  }
});

const products = response.data.products.map(p => ({
  name: p.displayName,
  price: p.price.BasePriceReference,
  category: 'Lácteos'
}));

console.log(products);
```

**Ventajas de usar API:**
- ✅ Más rápido (100-200ms vs 5-10s)
- ✅ Datos estructurados (JSON)
- ✅ Menos probable que te bloqueen
- ✅ No necesitas Puppeteer

#### Paso 3: Si NO hay API - Inspeccionar HTML

1. En la página de Lider, **click derecho en un producto** → `Inspect`
2. Observa las clases CSS:

```html
<!-- Ejemplo (puede variar) -->
<div class="product-card">
  <h3 class="product-name">Leche Colun 1L</h3>
  <span class="price">$1.990</span>
</div>
```

3. Anota los selectores:
   - Producto: `.product-card`
   - Nombre: `.product-name`
   - Precio: `.price`

#### Paso 4: Crear Scraper para Lider

```javascript
import puppeteer from 'puppeteer';

async function scrapeLider() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // User agent (parecer navegador real)
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...');

  console.log('📄 Navegando a Lider.cl...');
  await page.goto('https://www.lider.cl/supermercado/category/Lacteos', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('⏳ Esperando productos...');
  await page.waitForSelector('.product-card', { timeout: 10000 });

  console.log('📦 Extrayendo productos...');
  const products = await page.evaluate(() => {
    // ADAPTA ESTOS SELECTORES según lo que encontraste
    return Array.from(document.querySelectorAll('.product-card')).map(el => ({
      name: el.querySelector('.product-name')?.textContent?.trim(),
      price: parseInt(
        el.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || '0'
      )
    }));
  });

  console.log(`✅ Encontrados ${products.length} productos:`);
  products.forEach(p => console.log(`  - ${p.name}: $${p.price}`));

  await browser.close();
  return products;
}

// Ejecutar
scrapeLider();
```

---

## 🧪 Ejercicios Prácticos

### Ejercicio 1: Sitio de Práctica (Fácil)

**Objetivo:** Scrapear http://books.toscrape.com/

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('http://books.toscrape.com/');

const books = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.product_pod')).map(book => ({
    title: book.querySelector('h3 a')?.getAttribute('title'),
    price: book.querySelector('.price_color')?.textContent
  }));
});

console.log('📚 Libros encontrados:', books.length);
console.log('Primeros 5:', books.slice(0, 5));

await browser.close();
```

### Ejercicio 2: Con Screenshot (Debugging)

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1280, height: 720 });

await page.goto('http://quotes.toscrape.com/');

// Screenshot ANTES de scrapear (para debug)
await page.screenshot({ path: 'antes.png' });

const quotes = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.quote')).length;
});

console.log(`Encontradas ${quotes} citas`);

// Screenshot DESPUÉS
await page.screenshot({ path: 'despues.png' });

await browser.close();
```

### Ejercicio 3: Manejo de Paginación

```javascript
import puppeteer from 'puppeteer';

async function scrapeMultiplePages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const allBooks = [];

  for (let pageNum = 1; pageNum <= 3; pageNum++) {
    console.log(`📄 Página ${pageNum}...`);

    await page.goto(`http://books.toscrape.com/catalogue/page-${pageNum}.html`);

    const books = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.product_pod')).map(book => ({
        title: book.querySelector('h3 a')?.getAttribute('title')
      }));
    });

    allBooks.push(...books);

    // IMPORTANTE: Esperar entre páginas (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`✅ Total: ${allBooks.length} libros de 3 páginas`);

  await browser.close();
  return allBooks;
}

scrapeMultiplePages();
```

---

## 🎯 Prueba PASO A PASO en Tu PC

### Test Completo - 15 Minutos

**1. Preparación (5 min)**

```bash
cd ~/tu-proyecto
npm install puppeteer   # Espera 3-5 min
```

**2. Test Básico (2 min)**

Crea `test-puppeteer-local.js`:

```javascript
import puppeteer from 'puppeteer';

console.log('Iniciando test...');

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://example.com');

const title = await page.title();
console.log('Título:', title);

await page.screenshot({ path: 'test.png' });

await browser.close();

console.log('✅ Test exitoso! Screenshot guardado.');
```

Ejecuta:
```bash
node test-puppeteer-local.js
```

**Resultado esperado:**
- Se abre Chrome
- Navega a example.com
- Toma screenshot
- Cierra navegador
- Archivo `test.png` creado

**3. Sitio de Práctica (3 min)**

Usa los ejemplos de arriba con:
- http://quotes.toscrape.com/
- http://books.toscrape.com/

**4. Investigar Lider.cl (5 min)**

Sigue los pasos de "Opción B" arriba.

---

## ⚠️ Consideraciones Importantes

### Legal y Ético

**ANTES de scrapear Lider.cl/Jumbo.cl:**

1. **Lee robots.txt:**
   ```bash
   curl https://www.lider.cl/robots.txt
   ```

2. **Revisa términos de servicio**

3. **Implementa rate limiting:**
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 2000)); // 2s entre requests
   ```

4. **Usa User Agent real:**
   ```javascript
   await page.setUserAgent('Mozilla/5.0...');
   ```

5. **Considera alternativas:**
   - APIs oficiales
   - Programas de afiliados
   - Servicios de datos de terceros

### Mejores Prácticas

```javascript
// ✅ BUENO
async function scrapeResponsablemente() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 30000 });
    await page.waitForSelector('.product', { timeout: 10000 });

    const data = await page.evaluate(() => {
      // Extraer datos
    });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    return data;

  } catch (error) {
    console.error('Error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
}
```

```javascript
// ❌ MALO
// Scraping masivo sin delays
for (let i = 0; i < 1000; i++) {
  await scrape(); // Sin delay!
}
```

---

## 📊 Comparación de Herramientas

| Herramienta | Cuándo Usar | Velocidad | Dificultad |
|-------------|-------------|-----------|------------|
| **Cheerio** | HTML estático, blogs | ⚡ Muy rápido (10ms) | ⭐ Fácil |
| **Puppeteer** | Sitios con JavaScript | 🐌 Lento (5-15s) | ⭐⭐⭐ Media |
| **API directa** | Si existe API pública | ⚡ Rápido (100ms) | ⭐ Fácil |

---

## ✅ Checklist de Aprendizaje

Marca lo que ya dominas:

- [ ] Entiendo qué es web scraping
- [ ] Sé usar Cheerio para HTML estático
- [ ] Instalé Puppeteer en mi PC local
- [ ] Hice scraping de un sitio de práctica
- [ ] Investigué estructura de Lider.cl con DevTools
- [ ] Entiendo la diferencia entre scraping y APIs
- [ ] Conozco consideraciones legales/éticas
- [ ] Implementé rate limiting
- [ ] Sé manejar errores
- [ ] Puedo tomar screenshots para debugging

---

## 🚀 Próximos Pasos

1. **Hoy:**
   - Instala Puppeteer en tu PC
   - Ejecuta ejemplos con sitios de práctica
   - Toma screenshots para aprender

2. **Esta semana:**
   - Investiga Lider.cl con DevTools
   - Busca APIs públicas
   - Crea tu primer scraper real

3. **Después:**
   - Implementa caché
   - Agrega manejo de errores robusto
   - Considera alternativas legales (APIs oficiales)

---

## 📚 Recursos

**Documentación:**
- [Puppeteer Docs](https://pptr.dev/)
- [Cheerio Docs](https://cheerio.js.org/)

**Sitios de Práctica:**
- http://quotes.toscrape.com/
- http://books.toscrape.com/
- https://scrapethissite.com/

**Tutoriales:**
- [Web Scraping con Puppeteer](https://blog.logrocket.com/web-scraping-node-js-puppeteer/)
- [Cheerio Tutorial](https://www.freecodecamp.org/news/web-scraping-with-node-js/)

---

¿Preguntas? Revisa `SCRAPING-GUIDE.md` para más detalles.
