# Comparador de Precios: Lider vs Jumbo

Aplicación web interactiva desarrollada en React para visualizar y comparar precios de productos entre los supermercados Lider.cl y Jumbo.cl en Chile.

## Características

- **Comparación de Precios**: Visualiza precios de productos de Lider y Jumbo lado a lado
- **Navegación por Categorías**: Pestañas organizadas por categorías de productos (Lácteos, Carnes, Frutas y Verduras, Abarrotes, Bebidas, Panadería, Limpieza)
- **Búsqueda en Tiempo Real**: Filtra productos instantáneamente mientras escribes
- **Contador de Productos**: Muestra productos filtrados vs totales en la categoría
- **Formato Chileno**: Precios formateados en pesos chilenos (CLP)
- **Indicadores Visuales**: Destaca automáticamente el mejor precio
- **Diferencias de Precio**: Calcula y muestra diferencias absolutas y porcentuales
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil

## Tecnologías Utilizadas

### Frontend
- React 19
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (estilos personalizados)

### Backend
- Node.js
- Express
- Cheerio (HTML parsing)
- CORS

## Estructura del Proyecto

```
lidervsjumbo/
├── server/
│   ├── server.js              # Servidor Express
│   └── scrapers/
│       ├── lider.js           # Scraper para Lider.cl
│       └── jumbo.js           # Scraper para Jumbo.cl
├── src/
│   ├── components/
│   │   ├── CategoryTabs.jsx   # Pestañas de categorías
│   │   ├── CategoryTabs.css
│   │   ├── SearchBar.jsx      # Barra de búsqueda
│   │   ├── SearchBar.css
│   │   ├── ProductTable.jsx   # Tabla de productos
│   │   └── ProductTable.css
│   ├── utils/
│   │   └── formatters.js      # Funciones de formato
│   ├── App.jsx                # Componente principal
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- npm (v7 o superior)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/kaysersozes/lidervsjumbo.git
   cd lidervsjumbo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

## Uso

### Opción 1: Ejecutar Backend y Frontend Juntos

```bash
npm run dev:all
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:5173`

### Opción 2: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Acceder a la Aplicación

Abre tu navegador y visita: `http://localhost:5173`

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo frontend (Vite) |
| `npm run server` | Inicia el servidor backend (Express) |
| `npm run dev:all` | Inicia backend y frontend simultáneamente |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Preview de la build de producción |
| `npm run lint` | Ejecuta el linter |

## Funcionalidades Principales

### 1. Visualización por Categorías
La aplicación organiza los productos en pestañas por categoría:
- Lácteos
- Carnes
- Frutas y Verduras
- Abarrotes
- Bebidas
- Panadería
- Limpieza

### 2. Búsqueda en Tiempo Real
Escribe en la barra de búsqueda para filtrar productos instantáneamente. El contador se actualiza automáticamente mostrando "X de Y productos".

### 3. Comparación de Precios
Para cada producto, la tabla muestra:
- Nombre del producto
- Precio en Lider
- Precio en Jumbo
- Diferencia de precio (absoluta y porcentual)
- Indicador del mejor precio (badge destacado)

### 4. Formato de Precios
Todos los precios se muestran en formato chileno:
- Símbolo: $
- Separador de miles: .
- Sin decimales
- Ejemplo: $1.990

## Datos de Productos

### Nota Importante sobre Web Scraping

Actualmente, la aplicación utiliza **datos de muestra** (mock data) para demostración. Los archivos de scraping (`server/scrapers/lider.js` y `server/scrapers/jumbo.js`) contienen la estructura y comentarios para implementar scraping real, pero esto requiere:

1. **Análisis del sitio web**: Identificar selectores CSS/HTML correctos
2. **Manejo de contenido dinámico**: Lider.cl y Jumbo.cl usan JavaScript para cargar contenido
3. **Herramientas adicionales**: Puppeteer o Playwright para sitios con JS
4. **Consideraciones legales**: Revisar términos de servicio y robots.txt
5. **Rate limiting**: Implementar delays para no sobrecargar los servidores

### Implementar Scraping Real

Para implementar scraping real, modifica los archivos en `server/scrapers/`:

```javascript
// Ejemplo con Puppeteer (requiere instalación)
import puppeteer from 'puppeteer';

async function scrapeLiderReal() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.lider.cl/catalogo/...');

  const products = await page.evaluate(() => {
    // Extraer productos del DOM
    return Array.from(document.querySelectorAll('.product')).map(el => ({
      name: el.querySelector('.name').textContent,
      price: parseInt(el.querySelector('.price').textContent.replace(/\D/g, '')),
      category: el.querySelector('.category').textContent
    }));
  });

  await browser.close();
  return products;
}
```

## API Backend

### Endpoints

#### GET `/api/products`
Obtiene todos los productos organizados por categoría.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "Lácteos": [
      {
        "name": "Leche Entera Colun 1L",
        "category": "Lácteos",
        "liderPrice": 1190,
        "jumboPrice": 1150
      }
    ],
    "Carnes": [...],
    ...
  }
}
```

#### GET `/api/health`
Health check del servidor.

**Respuesta:**
```json
{
  "status": "OK"
}
```

## Personalización

### Agregar Nuevas Categorías
Simplemente agrega productos con la nueva categoría en los scrapers, el sistema las detectará automáticamente.

### Cambiar Estilos
Modifica los archivos CSS en `src/` y `src/components/`.

### Agregar Nuevas Funcionalidades
El código está modularizado para facilitar extensiones:
- Nuevos cálculos en `src/utils/formatters.js`
- Nuevos componentes en `src/components/`
- Nuevos endpoints en `server/server.js`

## Solución de Problemas

### Error: "Error al cargar los productos"
- Asegúrate de que el servidor backend esté ejecutándose
- Verifica que el puerto 3001 esté disponible
- Revisa la consola del navegador para más detalles

### Puerto en uso
Si el puerto 3001 o 5173 están ocupados, puedes cambiarlos:
- Backend: Modifica `PORT` en `server/server.js`
- Frontend: Usa `--port` flag: `vite --port 3000`

### Problemas de CORS
El backend ya tiene CORS habilitado. Si experimentas problemas, verifica que las URLs coincidan.

## Despliegue en Producción

La aplicación está lista para ser desplegada en producción. Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas.

### Despliegue rápido en Render (Gratis):

1. Crea una cuenta en [render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Deploy

Tu aplicación estará en vivo en minutos en una URL como: `https://tu-app.onrender.com`

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más opciones (Railway, Vercel, Docker, VPS).

## Mejoras Futuras

- [ ] Implementar scraping real con Puppeteer
- [ ] Caché de datos para reducir requests
- [ ] Gráficos de tendencias de precios
- [ ] Exportar comparaciones a PDF/Excel
- [ ] Modo oscuro
- [ ] Guardar productos favoritos
- [ ] Alertas de precios
- [ ] Más supermercados (Santa Isabel, Unimarc, etc.)

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Nota Legal**: Este proyecto es solo para fines educativos. Asegúrate de cumplir con los términos de servicio de los sitios web al implementar web scraping.
