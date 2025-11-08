#!/bin/bash

# Script para probar el backend localmente
# Este script hace verificaciones básicas del servidor

echo "🧪 Probando Backend - Lider vs Jumbo"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si el servidor está corriendo
echo -n "1. Verificando si el servidor está corriendo... "

if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Servidor corriendo${NC}"
else
    echo -e "${RED}✗ Servidor NO está corriendo${NC}"
    echo ""
    echo "Por favor, ejecuta en otra terminal:"
    echo "  npm run server"
    echo ""
    exit 1
fi

# Test health endpoint
echo -n "2. Test /api/health... "
HEALTH_RESPONSE=$(curl -s http://localhost:3001/api/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FALLO${NC}"
    echo "   Respuesta: $HEALTH_RESPONSE"
fi

# Test products endpoint
echo -n "3. Test /api/products... "
PRODUCTS_RESPONSE=$(curl -s http://localhost:3001/api/products)
if [[ $PRODUCTS_RESPONSE == *"success"* ]] && [[ $PRODUCTS_RESPONSE == *"Lácteos"* ]]; then
    echo -e "${GREEN}✓ OK${NC}"

    # Contar categorías
    CATEGORIES=$(echo $PRODUCTS_RESPONSE | grep -o '"Lácteos"\|"Carnes"\|"Abarrotes"\|"Bebidas"\|"Panadería"\|"Limpieza"' | sort -u | wc -l)
    echo -e "   ${YELLOW}→ Categorías encontradas: $CATEGORIES${NC}"

    # Contar productos en Lácteos
    LACTEOS_COUNT=$(echo $PRODUCTS_RESPONSE | grep -o '"category":"Lácteos"' | wc -l)
    echo -e "   ${YELLOW}→ Productos en Lácteos: $LACTEOS_COUNT${NC}"
else
    echo -e "${RED}✗ FALLO${NC}"
    echo "   Respuesta: ${PRODUCTS_RESPONSE:0:100}..."
fi

# Test CORS
echo -n "4. Test CORS headers... "
CORS_HEADER=$(curl -s -I http://localhost:3001/api/health | grep -i "access-control-allow-origin")
if [[ ! -z "$CORS_HEADER" ]]; then
    echo -e "${GREEN}✓ CORS habilitado${NC}"
else
    echo -e "${YELLOW}⚠ CORS no detectado${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Tests completados${NC}"
echo ""
echo "Próximo paso:"
echo "  1. Abre http://localhost:3001/api/products en tu navegador"
echo "  2. Ejecuta 'npm run dev' en otra terminal para el frontend"
echo ""
