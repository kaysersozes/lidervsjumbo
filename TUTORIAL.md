# Tutorial: Ejecutar y Entender la Aplicación Localmente

Esta guía te llevará paso a paso por el proceso de ejecutar la aplicación en tu computadora, explicando qué hace cada parte y cómo funciona todo el sistema.

---

## 📚 Tabla de Contenidos

1. [Arquitectura de la Aplicación](#arquitectura)
2. [Prerrequisitos](#prerrequisitos)
3. [Instalación Paso a Paso](#instalación)
4. [Ejecutar la Aplicación](#ejecutar)
5. [Entender el Flujo de Datos](#flujo-de-datos)
6. [Explorar el Código](#explorar-el-código)
7. [Hacer Cambios y Ver Resultados](#hacer-cambios)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura de la Aplicación {#arquitectura}

Antes de empezar, es importante entender cómo está construida la aplicación:

```
┌─────────────────────────────────────────────────────┐
│                  NAVEGADOR (Frontend)                │
│  ┌───────────────────────────────────────────────┐  │
│  │         React App (Puerto 5173)               │  │
│  │  - Componentes (Tabs, Table, Search)          │  │
│  │  - Estado (useState, useEffect)               │  │
│  │  - Estilos (CSS)                              │  │
│  └─────────────────┬─────────────────────────────┘  │
└────────────────────┼────────────────────────────────┘
                     │
                     │ HTTP Request
                     │ GET /api/products
                     ▼
┌─────────────────────────────────────────────────────┐
│              SERVIDOR (Backend)                      │
│  ┌───────────────────────────────────────────────┐  │
│  │       Express Server (Puerto 3001)            │  │
│  │  - API Endpoints (/api/products)              │  │
│  │  - CORS (permite peticiones del frontend)    │  │
│  └─────────────────┬─────────────────────────────┘  │
│                    │                                 │
│                    ▼                                 │
│  ┌───────────────────────────────────────────────┐  │
│  │            Scrapers                           │  │
│  │  - lider.js (datos de Lider)                 │  │
│  │  - jumbo.js (datos de Jumbo)                 │  │
│  │  - Retorna arrays de productos               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Componentes Clave:

1. **Frontend (React + Vite)**
   - Corre en `http://localhost:5173`
   - Se recarga automáticamente cuando cambias código
   - Hace peticiones HTTP al backend

2. **Backend (Express)**
   - Corre en `http://localhost:3001`
   - Provee API REST
   - Procesa datos de los scrapers

3. **Scrapers**
   - Funciones que obtienen datos de productos
   - Actualmente usan datos de ejemplo (mock data)
   - En producción harían scraping real

---

## ✅ Prerrequisitos {#prerrequisitos}

### 1. Verificar que tienes Node.js instalado

```bash
node --version
```

**Qué hace este comando:**
- Muestra la versión de Node.js instalada
- Necesitas versión 16 o superior

**Si no tienes Node.js:**
- Windows/Mac: Descarga desde [nodejs.org](https://nodejs.org)
- Linux (Ubuntu/Debian):
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 2. Verificar que tienes npm (viene con Node.js)

```bash
npm --version
```

**Qué hace este comando:**
- npm es el gestor de paquetes de Node.js
- Necesitas versión 7 o superior

### 3. Verificar que tienes git

```bash
git --version
```

---

## 📥 Instalación Paso a Paso {#instalación}

### Paso 1: Clonar el Repositorio

```bash
# Navega a donde quieres guardar el proyecto
cd ~/Documentos  # o donde prefieras

# Clona el repositorio
git clone https://github.com/kaysersozes/lidervsjumbo.git

# Entra al directorio del proyecto
cd lidervsjumbo
```

**Qué hace esto:**
- `git clone`: Descarga todo el código del repositorio
- `cd lidervsjumbo`: Entra a la carpeta del proyecto

**Verificar:**
```bash
ls -la
```

Deberías ver:
- `package.json` (lista de dependencias)
- `src/` (código del frontend)
- `server/` (código del backend)
- `README.md` (documentación)

### Paso 2: Cambiar a la rama correcta

```bash
git checkout claude/supermarket-price-comparison-011CUub5zmcEV85XytGmsx8z
```

**Qué hace esto:**
- Cambia a la rama con el código completo
- Las ramas son como "versiones" del código

**Verificar:**
```bash
git branch
```

Deberías ver un asterisco (*) junto a la rama actual.

### Paso 3: Instalar Dependencias

```bash
npm install
```

**Qué hace este comando:**
- Lee el archivo `package.json`
- Descarga todas las librerías necesarias
- Las guarda en la carpeta `node_modules/`

**Paquetes principales que se instalan:**

**Frontend:**
- `react` - Librería para construir interfaces
- `react-dom` - Conecta React con el navegador
- `axios` - Para hacer peticiones HTTP
- `vite` - Herramienta de build ultra-rápida

**Backend:**
- `express` - Framework de servidor web
- `cors` - Permite peticiones entre dominios
- `cheerio` - Parser de HTML (para scraping)

**Este paso puede tomar 1-2 minutos.**

**Verificar:**
```bash
ls node_modules | wc -l
```

Deberías ver ~200-300 carpetas (todas las dependencias y sus dependencias).

---

## 🚀 Ejecutar la Aplicación {#ejecutar}

Hay **dos formas** de ejecutar la aplicación. Vamos a usar la primera para aprender.

### Opción 1: Ejecutar Frontend y Backend Separados (RECOMENDADO para aprender)

Esta opción te permite ver cada parte funcionando independientemente.

#### Terminal 1 - Backend

```bash
npm run server
```

**Qué hace este comando:**
1. Ejecuta `node server/server.js`
2. Inicia un servidor Express en puerto 3001
3. Carga los scrapers de Lider y Jumbo
4. Espera peticiones HTTP

**Deberías ver:**
```
🚀 Server running on http://localhost:3001
```

**Probar que funciona:**

En otra terminal (o en tu navegador):
```bash
# Health check
curl http://localhost:3001/api/health

# Debería responder: {"status":"OK"}

# Ver productos
curl http://localhost:3001/api/products | jq .

# Si no tienes jq, usa:
curl http://localhost:3001/api/products
```

O abre en tu navegador: `http://localhost:3001/api/products`

**Qué estás viendo:**
- JSON con todos los productos organizados por categoría
- Datos que vienen de `server/scrapers/lider.js` y `server/scrapers/jumbo.js`

#### Terminal 2 - Frontend

**Abre una NUEVA terminal** (deja la del backend corriendo):

```bash
npm run dev
```

**Qué hace este comando:**
1. Ejecuta `vite` (el servidor de desarrollo)
2. Compila tu código React
3. Inicia un servidor en puerto 5173
4. Activa "Hot Module Replacement" (HMR)

**Deberías ver:**
```
  VITE v7.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Abrir la aplicación:**

Abre tu navegador en: `http://localhost:5173`

**¡Deberías ver tu aplicación corriendo!** 🎉

### Opción 2: Ejecutar Todo Junto (Más rápido)

```bash
npm run dev:all
```

**Qué hace:**
- Ejecuta backend Y frontend en el mismo terminal
- Usa `&` para correr en background

**Nota:** Los logs de ambos se mezclan, por eso la Opción 1 es mejor para aprender.

---

## 🔄 Entender el Flujo de Datos {#flujo-de-datos}

Ahora que la app está corriendo, veamos qué pasa cuando la usas:

### 1. Cargar la Página

```
Usuario                     Frontend                   Backend
   |                           |                          |
   |-- Abre navegador -------->|                          |
   |                           |                          |
   |                           |-- GET /api/products ---->|
   |                           |                          |
   |                           |                          |-- Llama scrapers
   |                           |                          |   (lider + jumbo)
   |                           |                          |
   |                           |<----- JSON con datos ----|
   |                           |                          |
   |                           |-- Renderiza componentes  |
   |                           |   (Tabs, Table, Search)  |
   |                           |                          |
   |<-- Ve la interfaz --------|                          |
```

### 2. Cambiar de Categoría

```
Usuario clicks "Carnes"
   |
   ▼
useState actualiza (sin llamar backend)
   |
   ▼
Componente se re-renderiza
   |
   ▼
Muestra productos de categoría "Carnes"
```

**Importante:** No hay petición al backend, todo es local.

### 3. Buscar un Producto

```
Usuario escribe "leche"
   |
   ▼
onChange dispara función
   |
   ▼
useState actualiza searchTerm
   |
   ▼
useMemo filtra productos
   |
   ▼
Tabla se actualiza en tiempo real
```

**También local, sin backend.**

---

## 🔍 Explorar el Código {#explorar-el-código}

Abre el proyecto en tu editor favorito (VS Code, Sublime, etc.):

```bash
code .  # Si tienes VS Code
```

### Estructura de Archivos

```
lidervsjumbo/
├── src/                          # FRONTEND
│   ├── App.jsx                   # Componente principal
│   ├── App.css                   # Estilos principales
│   ├── components/               # Componentes reutilizables
│   │   ├── CategoryTabs.jsx      # Pestañas de categorías
│   │   ├── CategoryTabs.css
│   │   ├── SearchBar.jsx         # Barra de búsqueda
│   │   ├── SearchBar.css
│   │   ├── ProductTable.jsx      # Tabla de productos
│   │   └── ProductTable.css
│   └── utils/
│       └── formatters.js         # Funciones helper
│
├── server/                       # BACKEND
│   ├── server.js                 # Servidor Express (dev)
│   ├── production.js             # Servidor Express (prod)
│   └── scrapers/
│       ├── lider.js              # Mock data Lider
│       └── jumbo.js              # Mock data Jumbo
│
├── package.json                  # Dependencias y scripts
└── vite.config.js               # Configuración de Vite
```

### Archivos Clave para Explorar

#### 1. `src/App.jsx` - El cerebro del frontend

**Abre este archivo y busca estas secciones:**

```javascript
// ESTADO - Datos que cambian
const [products, setProducts] = useState({});
const [searchTerm, setSearchTerm] = useState('');
const [activeCategory, setActiveCategory] = useState('');
```

**Qué hace:**
- `useState`: Hook de React para manejar datos que cambian
- Cada vez que estos valores cambian, la UI se actualiza automáticamente

```javascript
// EFECTO - Se ejecuta al cargar la página
useEffect(() => {
  const fetchProducts = async () => {
    // Llama al backend
    const response = await axios.get(apiUrl);
    setProducts(response.data.data);
  };
  fetchProducts();
}, []); // [] significa "solo una vez al cargar"
```

**Qué hace:**
- `useEffect`: Hook para efectos secundarios (llamadas API, etc.)
- Se ejecuta cuando se monta el componente
- `axios.get`: Hace una petición HTTP al backend

```javascript
// MEMO - Cálculo optimizado
const filteredProducts = useMemo(() => {
  // Filtra productos según búsqueda
  return categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchLower)
  );
}, [products, activeCategory, searchTerm]);
```

**Qué hace:**
- `useMemo`: Optimización - solo recalcula cuando cambian las dependencias
- Evita filtrar en cada render, solo cuando cambia algo relevante

#### 2. `server/server.js` - El servidor backend

**Busca esta sección:**

```javascript
app.get('/api/products', async (req, res) => {
  // 1. Obtiene datos de ambos scrapers
  const [liderProducts, jumboProducts] = await Promise.all([
    getLiderProducts(),
    getJumboProducts()
  ]);

  // 2. Combina y organiza los datos
  const allProducts = mergeProducts(liderProducts, jumboProducts);

  // 3. Envía JSON al cliente
  res.json({ success: true, data: allProducts });
});
```

**Qué hace:**
- `app.get`: Define una ruta GET
- `Promise.all`: Ejecuta ambos scrapers en paralelo
- `res.json`: Envía respuesta en formato JSON

#### 3. `server/scrapers/lider.js` - Datos de productos

```javascript
export async function getLiderProducts() {
  return [
    { name: 'Leche Entera Colun 1L', category: 'Lácteos', price: 1190 },
    // ... más productos
  ];
}
```

**Qué hace:**
- Retorna un array de productos
- En producción, esto haría scraping real del sitio web
- Por ahora usa datos de ejemplo (mock data)

---

## 🛠️ Hacer Cambios y Ver Resultados {#hacer-cambios}

### Experimento 1: Cambiar el Título

**Archivo:** `src/App.jsx`

**Busca:**
```javascript
<h1>Comparador de Precios</h1>
```

**Cambia a:**
```javascript
<h1>Mi Super Comparador 🛒</h1>
```

**Guarda el archivo.**

**Qué pasa:**
- Vite detecta el cambio automáticamente
- El navegador se actualiza SIN recargar (HMR - Hot Module Replacement)
- Ves el cambio instantáneamente

**Esto es magia de Vite:** No pierdes el estado de la app.

### Experimento 2: Agregar un Producto Nuevo

**Archivo:** `server/scrapers/lider.js`

**Al final del array, antes del `];`, agrega:**

```javascript
{ name: 'Chocolate Sahne-Nuss 100g', category: 'Dulces', price: 1590 },
```

**Guarda el archivo.**

**Qué pasa:**
- El servidor Express NO se recarga automáticamente
- Necesitas reiniciar el backend

**En la terminal del backend:**
- Presiona `Ctrl+C` para detener
- Ejecuta `npm run server` de nuevo

**En el navegador:**
- Recarga la página
- Verás una nueva categoría "Dulces" con tu producto

### Experimento 3: Cambiar Colores

**Archivo:** `src/App.css`

**Busca:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Cambia a:**
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

**Guarda.**

**Qué pasa:**
- El fondo cambia de morado a rosa
- Cambio instantáneo sin recargar

### Experimento 4: Agregar Console Logs

**Archivo:** `src/App.jsx`

**Dentro del `useEffect`, después de `setProducts`, agrega:**

```javascript
console.log('📦 Productos cargados:', response.data.data);
console.log('📊 Total de categorías:', Object.keys(response.data.data).length);
```

**Guarda y abre las Dev Tools del navegador:**
- `F12` o `Right Click → Inspect → Console`

**Qué verás:**
- Logs mostrando los datos que llegaron del backend
- Número de categorías

**Esto es útil para debugging.**

---

## 🧪 Entender el Código en Profundidad

### React Hooks Explicados

#### useState - Guardar Datos

```javascript
const [searchTerm, setSearchTerm] = useState('');
//     ↑valor      ↑función      ↑valor inicial
```

**Cómo usarlo:**
```javascript
// Leer
console.log(searchTerm);  // ''

// Actualizar
setSearchTerm('leche');   // searchTerm ahora es 'leche'
```

**Cuándo se re-renderiza:**
- Cada vez que llamas `setSearchTerm` con un valor diferente

#### useEffect - Efectos Secundarios

```javascript
useEffect(() => {
  // Este código se ejecuta...
}, [dependencias]);
```

**Casos de uso:**

```javascript
// 1. Solo al montar (cargar la página)
useEffect(() => {
  fetchProducts();
}, []);  // Array vacío

// 2. Cuando cambia una variable
useEffect(() => {
  console.log('Búsqueda cambió:', searchTerm);
}, [searchTerm]);  // Se ejecuta si searchTerm cambia

// 3. En cada render (¡evitar!)
useEffect(() => {
  console.log('Cada render');
});  // Sin array de dependencias
```

#### useMemo - Optimización

```javascript
const result = useMemo(() => {
  // Cálculo costoso
  return heavyComputation();
}, [dependencies]);
```

**Cuándo usar:**
- Operaciones costosas (filtros, sorts en arrays grandes)
- Evita recalcular en cada render

**Cuándo NO usar:**
- Cálculos simples
- Puede ser contraproducente si se abusa

### Express Endpoints Explicados

```javascript
app.get('/ruta', (req, res) => {
  // req = request (petición del cliente)
  // res = response (respuesta del servidor)
});
```

**Ejemplo completo:**

```javascript
app.get('/api/products', async (req, res) => {
  try {
    const data = await getData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Partes importantes:**
- `app.get`: Método HTTP GET
- `/api/products`: La ruta (URL)
- `async`: Permite usar `await` dentro
- `try/catch`: Manejo de errores
- `res.json()`: Envía respuesta JSON
- `res.status(500)`: Código de error HTTP

---

## 🐛 Troubleshooting {#troubleshooting}

### Problema: "Port 3001 is already in use"

**Causa:** Ya tienes algo corriendo en ese puerto.

**Solución 1:** Mata el proceso:
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

**Solución 2:** Usa otro puerto:

Edita `server/server.js`:
```javascript
const PORT = process.env.PORT || 3002;  // Cambiar a 3002
```

### Problema: "Cannot GET /api/products"

**Causa:** El backend no está corriendo.

**Verificar:**
```bash
curl http://localhost:3001/api/health
```

**Si falla:**
- Revisa que la terminal del backend esté corriendo
- Busca errores en los logs
- Reinicia con `npm run server`

### Problema: La página está en blanco

**Abre la consola del navegador** (`F12` → Console)

**Si ves: "CORS policy error":**
- El backend no tiene CORS habilitado
- Revisa que `app.use(cors())` esté en `server.js`

**Si ves: "Network Error":**
- El backend no está corriendo
- La URL del API está mal

**Si ves: "Cannot read property of undefined":**
- Error en el código JavaScript
- Revisa la línea que indica el error

### Problema: Los cambios no se reflejan

**Frontend:**
- Vite debería recargar automáticamente
- Si no, presiona `Ctrl+R` en el navegador
- O reinicia con `npm run dev`

**Backend:**
- Express NO se recarga automáticamente
- Debes reiniciar manualmente (`Ctrl+C` → `npm run server`)
- Para auto-reload, instala `nodemon`:
  ```bash
  npm install -D nodemon
  # package.json: "server": "nodemon server/server.js"
  ```

---

## 📊 Monitorear la Aplicación

### Ver Logs del Backend

**En la terminal del backend verás:**
```
🚀 Server running on http://localhost:3001
GET /api/products 200 45.123 ms - 2048
GET /api/health 200 1.234 ms - 15
```

**Qué significa:**
- `GET`: Método HTTP
- `/api/products`: Ruta solicitada
- `200`: Código de éxito (OK)
- `45.123 ms`: Tiempo que tomó
- `2048`: Bytes enviados

### Ver Logs del Frontend

**En la consola del navegador:**
- `console.log()` que agregaste
- Errores de React (si los hay)
- Peticiones de red (pestaña "Network")

### Ver Peticiones HTTP

**En Dev Tools → Network:**
1. Abre Dev Tools (`F12`)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verás todas las peticiones HTTP
5. Click en `products` para ver detalles:
   - Headers (cabeceras)
   - Response (datos que llegaron)
   - Preview (vista bonita del JSON)

---

## 🎓 Conceptos Aprendidos

Al ejecutar esta aplicación, has trabajado con:

### Frontend
- ✅ React components y JSX
- ✅ React Hooks (useState, useEffect, useMemo)
- ✅ HTTP requests con Axios
- ✅ Event handling (onChange, onClick)
- ✅ Conditional rendering
- ✅ CSS modules y styling
- ✅ Hot Module Replacement (HMR)

### Backend
- ✅ Node.js y módulos ES6
- ✅ Express server y routing
- ✅ REST API endpoints
- ✅ CORS y middleware
- ✅ Async/await y Promises
- ✅ JSON responses
- ✅ Error handling

### Herramientas
- ✅ Vite (bundler y dev server)
- ✅ npm (gestor de paquetes)
- ✅ Git (control de versiones)
- ✅ Browser Dev Tools

### Arquitectura
- ✅ Client-Server model
- ✅ Frontend-Backend separation
- ✅ API-first design
- ✅ Component-based architecture

---

## 🚀 Próximos Pasos

1. **Personaliza la aplicación:**
   - Cambia colores, textos, logos
   - Agrega más categorías
   - Modifica el algoritmo de comparación

2. **Agrega funcionalidades:**
   - Ordenar por precio
   - Filtrar por rango de precio
   - Exportar a Excel
   - Guardar favoritos en localStorage

3. **Aprende más sobre:**
   - React Router (múltiples páginas)
   - Context API (estado global)
   - React Query (cache de datos)
   - TypeScript (tipos estáticos)

4. **Implementa scraping real:**
   - Instala Puppeteer
   - Analiza el HTML de Lider.cl y Jumbo.cl
   - Implementa los scrapers reales
   - Agrega cache para no sobrecargar los sitios

5. **Despliega:**
   - Sigue la guía en `DEPLOYMENT.md`
   - Comparte tu app con amigos

---

## 📝 Ejercicios Prácticos

### Ejercicio 1: Contador de Productos Totales

**Objetivo:** Mostrar el total de productos de TODAS las categorías.

**Pistas:**
- Usa `Object.values(products)`
- Usa `reduce()` para sumar
- Muestra en el header

**Solución:** Crea un nuevo archivo `SOLUCIONES.md` y resuélvelo tú mismo primero.

### Ejercicio 2: Ordenar por Precio

**Objetivo:** Botón para ordenar productos por precio (menor a mayor).

**Pistas:**
- Agrega un `useState` para el orden
- Usa `.sort()` en los productos filtrados
- Agrega un botón en el componente

### Ejercicio 3: Destacar Grandes Diferencias

**Objetivo:** Resaltar en rojo cuando la diferencia de precio es >20%.

**Pistas:**
- Modifica `ProductTable.jsx`
- Usa clases CSS condicionales
- Calcula el porcentaje de diferencia

---

## 🆘 Obtener Ayuda

Si te atascas:

1. **Lee los mensajes de error** - Suelen decirte exactamente qué está mal
2. **Usa console.log** - Imprime variables para ver su valor
3. **Revisa la documentación:**
   - [React Docs](https://react.dev)
   - [Express Docs](https://expressjs.com)
   - [Vite Docs](https://vitejs.dev)
4. **Busca en Google/Stack Overflow** - Alguien probablemente tuvo el mismo error
5. **Usa las Dev Tools** - Inspecciona elementos, ve la consola, monitorea red

---

## ✨ Conclusión

¡Felicidades! Ahora tienes una comprensión sólida de cómo funciona una aplicación full-stack moderna.

**Lo que has aprendido:**
- Cómo funciona la arquitectura cliente-servidor
- Cómo React maneja el estado y la UI
- Cómo Express sirve una API REST
- Cómo debuggear problemas
- Cómo hacer cambios y ver resultados

**Siguiente nivel:**
- Despliega la app (ve `DEPLOYMENT.md`)
- Agrega funcionalidades nuevas
- Implementa scraping real
- Comparte tu proyecto

¡Sigue experimentando y construyendo! 🚀
