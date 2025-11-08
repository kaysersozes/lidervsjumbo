# Guía de Despliegue - Lider vs Jumbo

Esta guía te mostrará cómo desplegar la aplicación en diferentes plataformas.

## Tabla de Contenidos
- [Opción 1: Render (Recomendado - Gratis)](#opción-1-render-recomendado)
- [Opción 2: Railway](#opción-2-railway)
- [Opción 3: Vercel](#opción-3-vercel)
- [Opción 4: Docker](#opción-4-docker)
- [Opción 5: VPS (DigitalOcean, AWS, etc.)](#opción-5-vps)

---

## Opción 1: Render (Recomendado)

### Por qué Render:
- ✅ **Gratis** (750 horas/mes en plan free)
- ✅ Despliegue automático desde GitHub
- ✅ SSL gratis
- ✅ Fácil configuración
- ✅ Soporta Node.js nativamente

### Pasos:

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Regístrate con tu cuenta de GitHub

2. **Conectar repositorio**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub: `kaysersozes/lidervsjumbo`
   - Autoriza a Render para acceder a tu repo

3. **Configurar el servicio**
   - **Name**: `lidervsjumbo` (o el nombre que prefieras)
   - **Region**: Oregon (o el más cercano)
   - **Branch**: `claude/supermarket-price-comparison-011CUub5zmcEV85XytGmsx8z`
   - **Root Directory**: (dejar vacío)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Variables de entorno** (opcional)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render lo asigna automáticamente)

5. **Deploy**
   - Click en "Create Web Service"
   - Render comenzará a construir y desplegar tu aplicación
   - Espera 2-3 minutos

6. **Acceder a tu aplicación**
   - Render te dará una URL como: `https://lidervsjumbo.onrender.com`
   - ¡Listo! Tu aplicación está en vivo

### Nota sobre el plan gratuito de Render:
- El servicio gratuito se "duerme" después de 15 minutos de inactividad
- La primera carga después de dormirse puede tomar 30-60 segundos
- Esto es normal y no afecta la funcionalidad

---

## Opción 2: Railway

### Por qué Railway:
- ✅ $5 USD de crédito gratis al mes
- ✅ Muy fácil de usar
- ✅ Despliegue automático
- ✅ Sin tarjeta de crédito para empezar

### Pasos:

1. **Crear cuenta**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio

3. **Configuración automática**
   - Railway detectará automáticamente que es una app Node.js
   - No necesitas configurar nada más

4. **Variables de entorno** (se configuran automáticamente)
   - Railway asigna el PORT automáticamente

5. **Deploy**
   - Railway desplegará automáticamente
   - Te dará una URL como: `https://lidervsjumbo.up.railway.app`

---

## Opción 3: Vercel

### Nota importante:
Vercel está optimizado para frontend. Para esta app necesitarás:
- Desplegar el frontend en Vercel
- Desplegar el backend en otro servicio (Render, Railway, etc.)

### Pasos para Vercel (Solo Frontend):

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configurar API**
   - Despliega el backend en Render/Railway
   - Actualiza `src/App.jsx` con la URL del backend en producción

### Alternativa (Full-stack en Vercel):
El archivo `vercel.json` ya está configurado, pero Vercel tiene limitaciones con Node.js backends persistentes.

---

## Opción 4: Docker

### Construir y ejecutar localmente:

```bash
# Construir la imagen
docker build -t lidervsjumbo .

# Ejecutar el contenedor
docker run -p 3001:3001 lidervsjumbo

# Acceder en: http://localhost:3001
```

### Desplegar en servicios que soportan Docker:

#### Google Cloud Run:
```bash
# Instalar gcloud CLI
# Autenticar
gcloud auth login

# Configurar proyecto
gcloud config set project YOUR_PROJECT_ID

# Build y push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/lidervsjumbo

# Deploy
gcloud run deploy lidervsjumbo \
  --image gcr.io/YOUR_PROJECT_ID/lidervsjumbo \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### AWS ECS / Azure Container Instances:
Sigue la documentación de cada plataforma para desplegar contenedores Docker.

---

## Opción 5: VPS (DigitalOcean, Linode, AWS EC2)

### Requisitos:
- Servidor con Ubuntu 20.04+ o similar
- Acceso SSH
- Dominio (opcional)

### Pasos:

1. **Conectar al servidor**
   ```bash
   ssh user@your-server-ip
   ```

2. **Instalar Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clonar repositorio**
   ```bash
   git clone https://github.com/kaysersozes/lidervsjumbo.git
   cd lidervsjumbo
   git checkout claude/supermarket-price-comparison-011CUub5zmcEV85XytGmsx8z
   ```

4. **Instalar dependencias y construir**
   ```bash
   npm install
   npm run build
   ```

5. **Instalar PM2 (process manager)**
   ```bash
   sudo npm install -g pm2
   ```

6. **Iniciar aplicación**
   ```bash
   pm2 start npm --name "lidervsjumbo" -- start
   pm2 save
   pm2 startup
   ```

7. **Configurar Nginx (opcional pero recomendado)**
   ```bash
   sudo apt install nginx
   ```

   Crear archivo de configuración:
   ```bash
   sudo nano /etc/nginx/sites-available/lidervsjumbo
   ```

   Contenido:
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;  # o tu IP

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Activar configuración:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lidervsjumbo /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Configurar SSL con Let's Encrypt (opcional)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com
   ```

---

## Comparación de Opciones

| Plataforma | Costo | Facilidad | Rendimiento | Recomendado para |
|------------|-------|-----------|-------------|------------------|
| **Render** | Gratis* | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Principiantes, MVPs |
| **Railway** | $5/mes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Proyectos pequeños/medianos |
| **Vercel** | Gratis* | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Solo frontend |
| **Docker** | Varía | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | DevOps con experiencia |
| **VPS** | $5-50/mes | ⭐⭐ | ⭐⭐⭐⭐⭐ | Control total, escalabilidad |

*Con limitaciones

---

## Recomendación Final

**Para empezar rápido**: Usa **Render** (opción 1)
- Zero configuración
- Gratis
- Perfecto para demos y prototipos

**Para producción**: Usa **Railway** o **VPS**
- Mejor rendimiento
- Sin "sleep" del servidor
- Más control

---

## Verificar que funciona

Una vez desplegado, verifica:

1. **Health check**:
   ```bash
   curl https://tu-app.com/api/health
   # Debería responder: {"status":"OK"}
   ```

2. **API de productos**:
   ```bash
   curl https://tu-app.com/api/products
   # Debería devolver JSON con productos
   ```

3. **Frontend**: Abre en el navegador y prueba:
   - Navegación entre categorías
   - Búsqueda de productos
   - Visualización de precios

---

## Solución de Problemas

### "Cannot GET /"
- Verifica que `npm run build` se ejecutó correctamente
- Verifica que la carpeta `dist` existe

### "Error al cargar productos"
- Verifica que el backend está ejecutándose
- Verifica la URL del API en producción
- Revisa los logs del servidor

### "Module not found"
- Verifica que todas las dependencias están en `dependencies` (no `devDependencies`)
- Ejecuta `npm install` de nuevo

### Puerto ocupado
- Cambia el puerto en `server/production.js`
- O usa la variable de entorno `PORT`

---

## Mantenimiento

### Actualizar la aplicación:

**Render/Railway** (automático):
- Solo haz push a GitHub
- Se desplegará automáticamente

**VPS** (manual):
```bash
cd lidervsjumbo
git pull
npm install
npm run build
pm2 restart lidervsjumbo
```

### Monitorear logs:

**Render**: Dashboard → Logs
**Railway**: Dashboard → Logs
**VPS con PM2**:
```bash
pm2 logs lidervsjumbo
```

---

## Seguridad

Antes de producción:
- [ ] Agrega rate limiting
- [ ] Configura CORS apropiadamente
- [ ] Agrega variables de entorno para secretos
- [ ] Implementa HTTPS (SSL)
- [ ] Agrega logging apropiado
- [ ] Implementa manejo de errores robusto

---

¿Necesitas ayuda? Abre un issue en el repositorio.
