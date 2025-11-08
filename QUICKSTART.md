# Inicio Rápido - 5 Minutos

Esta guía te llevará de 0 a aplicación funcionando en 5 minutos.

## 🚀 Pasos Rápidos

### 1. Instalar Dependencias (solo la primera vez)

```bash
npm install
```

Espera 1-2 minutos mientras se descargan las librerías.

### 2. Ejecutar Backend

**Abre una terminal** y ejecuta:

```bash
npm run server
```

Deberías ver:
```
🚀 Server running on http://localhost:3001
```

**✅ Prueba:** Abre http://localhost:3001/api/health en tu navegador
- Deberías ver: `{"status":"OK"}`

### 3. Ejecutar Frontend

**Abre OTRA terminal** (deja la anterior corriendo) y ejecuta:

```bash
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:5173/
```

**✅ Abre:** http://localhost:5173

---

## ✨ ¡Listo!

Deberías ver tu aplicación corriendo con:
- Pestañas de categorías
- Tabla de productos
- Barra de búsqueda funcionando

---

## 🎯 Qué Hacer Ahora

### Prueba la Aplicación:

1. **Navega entre categorías** - Click en las pestañas
2. **Busca productos** - Escribe "leche" en el buscador
3. **Compara precios** - Observa los badges de "mejor precio"

### Experimenta con el Código:

**Cambio fácil #1:** Modifica el título

Archivo: `src/App.jsx`
Línea: ~94

```javascript
<h1>Mi Super Comparador 🛒</h1>
```

Guarda y ve el cambio instantáneo en el navegador.

**Cambio fácil #2:** Agrega un producto

Archivo: `server/scrapers/lider.js`
Al final del array:

```javascript
{ name: 'Tu Producto Favorito', category: 'Tu Categoría', price: 1990 },
```

Reinicia el backend (Ctrl+C → `npm run server`)
Recarga el navegador

---

## 🐛 Problemas Comunes

### "Port 3001 is already in use"

**Solución:** Cierra otros servidores o usa otro puerto:

```bash
PORT=3002 npm run server
```

### "Cannot GET /api/products"

**Causa:** El backend no está corriendo
**Solución:** Ejecuta `npm run server` en una terminal

### La página está en blanco

**Solución:**
1. Abre las Dev Tools (F12)
2. Ve a la pestaña "Console"
3. Lee el error y busca en Google

---

## 📚 Aprender Más

Lee el tutorial completo en [TUTORIAL.md](TUTORIAL.md) para entender:
- Cómo funciona la arquitectura
- Qué hace cada archivo
- Cómo debuggear problemas
- Ejercicios prácticos

---

## 🚀 Siguiente Paso: Desplegar

Cuando estés listo para publicar tu aplicación en internet:

```bash
npm run build  # Construye para producción
```

Luego sigue la guía en [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Ayuda

¿Tienes problemas? Revisa:
1. [TUTORIAL.md](TUTORIAL.md) - Guía completa
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Despliegue
3. [README.md](README.md) - Documentación general

---

¡Disfruta construyendo! 🎉
