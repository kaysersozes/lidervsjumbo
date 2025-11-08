#!/bin/bash

# Script para probar diferentes métodos de scraping
# Ejecuta: chmod +x scripts/test-scraping.sh && ./scripts/test-scraping.sh

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║    TEST DE SCRAPING - Lider vs Jumbo                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Función para mostrar menú
show_menu() {
    echo ""
    echo -e "${YELLOW}Selecciona qué probar:${NC}"
    echo ""
    echo "  1) Mock Data Actual (lo que funciona ahora)"
    echo "  2) Verificar si Puppeteer está instalado"
    echo "  3) Ejecutar ejemplos de scraping con Puppeteer"
    echo "  4) Investigar estructura de Lider.cl"
    echo "  5) Investigar estructura de Jumbo.cl"
    echo "  6) Comparar Mock Data vs Precios Reales"
    echo "  7) Ver guía de scraping completa"
    echo "  0) Salir"
    echo ""
    echo -n "Opción: "
}

# Test 1: Mock Data Actual
test_mock_data() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 1: Mock Data Actual${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    echo "🔍 Verificando si el servidor está corriendo..."

    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Servidor corriendo${NC}\n"

        echo "📦 Obteniendo productos..."
        response=$(curl -s http://localhost:3001/api/products)

        # Contar categorías
        categories=$(echo "$response" | grep -o '"[^"]*":' | sort -u | wc -l)
        echo -e "  ${GREEN}→ Categorías encontradas: $categories${NC}"

        # Mostrar primera categoría
        echo -e "\n📋 Muestra de datos:\n"
        echo "$response" | head -c 500
        echo "..."
        echo ""
        echo -e "${YELLOW}💡 Estos son DATOS ESTÁTICOS (mock data)${NC}"
        echo -e "${YELLOW}   No son precios reales de los supermercados${NC}"

    else
        echo -e "${RED}✗ Servidor NO está corriendo${NC}"
        echo ""
        echo "Por favor, ejecuta en otra terminal:"
        echo "  npm run server"
    fi
}

# Test 2: Verificar Puppeteer
test_puppeteer_installed() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 2: Verificar Puppeteer${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    if [ -d "node_modules/puppeteer" ]; then
        echo -e "${GREEN}✓ Puppeteer está instalado${NC}"

        # Verificar versión
        version=$(npm list puppeteer 2>/dev/null | grep puppeteer@ | sed 's/.*puppeteer@//')
        echo -e "  Versión: ${GREEN}$version${NC}"

        echo -e "\n${GREEN}✅ Listo para hacer scraping real${NC}"
    else
        echo -e "${RED}✗ Puppeteer NO está instalado${NC}\n"

        echo "Para instalarlo, ejecuta:"
        echo -e "${YELLOW}  npm install puppeteer${NC}"
        echo ""
        echo "⚠️  Nota: Descargará Chromium (~170 MB)"
        echo "    Puede tomar varios minutos"
        echo ""
        echo -n "¿Quieres instalarlo ahora? (s/n): "
        read -r response

        if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
            echo ""
            echo "📥 Instalando Puppeteer..."
            npm install puppeteer
        fi
    fi
}

# Test 3: Ejecutar ejemplos
test_run_examples() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 3: Ejemplos de Scraping${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    if [ ! -d "node_modules/puppeteer" ]; then
        echo -e "${RED}✗ Puppeteer no está instalado${NC}"
        echo "Ejecuta la opción 2 primero"
        return
    fi

    echo "🚀 Ejecutando ejemplos con sitios de práctica..."
    echo "   (Esto puede tomar 10-20 segundos)"
    echo ""

    node server/scrapers/example-puppeteer.js
}

# Test 4: Investigar Lider.cl
test_investigate_lider() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 4: Investigar Lider.cl${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    echo "📋 Guía para investigar Lider.cl:\n"

    echo "1️⃣  Revisa robots.txt:"
    echo -e "   ${YELLOW}https://www.lider.cl/robots.txt${NC}\n"

    echo "   Verificando robots.txt..."
    curl -s https://www.lider.cl/robots.txt | head -20

    echo -e "\n2️⃣  Pasos para investigar estructura:\n"
    echo "   a) Abre en tu navegador:"
    echo -e "      ${YELLOW}https://www.lider.cl/supermercado/category/Lacteos${NC}"
    echo ""
    echo "   b) Presiona F12 (DevTools)"
    echo ""
    echo "   c) Ve a pestaña 'Network' → 'Fetch/XHR'"
    echo ""
    echo "   d) Recarga la página (Ctrl+R)"
    echo ""
    echo "   e) Busca peticiones a APIs:"
    echo "      - api.lider.cl"
    echo "      - apicatalog.lider.cl"
    echo "      - Cualquier que devuelva JSON con productos"
    echo ""
    echo "   f) Click derecho en un producto → 'Inspect'"
    echo "      Anota las clases CSS (ej: .product-card, .price)"
    echo ""

    echo -e "${YELLOW}💡 TIP: Si encuentras una API, ¡úsala directamente!${NC}"
    echo -e "${YELLOW}   Es más rápido y confiable que scraping HTML${NC}\n"
}

# Test 5: Investigar Jumbo.cl
test_investigate_jumbo() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 5: Investigar Jumbo.cl${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    echo "📋 Guía para investigar Jumbo.cl:\n"

    echo "1️⃣  Revisa robots.txt:"
    echo -e "   ${YELLOW}https://www.jumbo.cl/robots.txt${NC}\n"

    echo "   Verificando robots.txt..."
    curl -s https://www.jumbo.cl/robots.txt | head -20

    echo -e "\n2️⃣  Sigue los mismos pasos que para Lider.cl"
    echo "   (Ver opción 4 para detalles)\n"
}

# Test 6: Comparar datos
test_compare_prices() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 6: Comparar Mock Data vs Real${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    echo "📊 Para comparar datos mock vs reales:\n"

    echo "1️⃣  Obtén datos mock actuales:"
    echo -e "   ${YELLOW}curl http://localhost:3001/api/products > mock-data.json${NC}\n"

    echo "2️⃣  Abre Lider.cl y Jumbo.cl manualmente"
    echo "   Busca los mismos productos\n"

    echo "3️⃣  Compara precios:"
    echo "   Mock Data:  Leche Colun 1L = $1.190"
    echo "   Lider.cl:   Leche Colun 1L = $????"
    echo "   Jumbo.cl:   Leche Colun 1L = $????\n"

    echo -e "${YELLOW}💡 Verás que los precios NO coinciden${NC}"
    echo -e "${YELLOW}   porque los datos mock son inventados${NC}\n"

    echo "Para obtener precios reales, necesitas:"
    echo "  - Implementar scraping con Puppeteer"
    echo "  - O encontrar APIs públicas"
    echo "  - O usar servicios de datos de terceros"
}

# Test 7: Ver guía
test_show_guide() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}Test 7: Guía de Scraping${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

    if [ -f "SCRAPING-GUIDE.md" ]; then
        echo "📚 Abriendo guía completa...\n"
        echo "Ubicación: SCRAPING-GUIDE.md"
        echo ""
        echo "Contenido:"
        echo "  - Estado actual del proyecto"
        echo "  - Técnicas de scraping explicadas"
        echo "  - Ejemplos con Puppeteer, Playwright, APIs"
        echo "  - Consideraciones legales y éticas"
        echo "  - Ejercicios prácticos"
        echo ""
        echo -n "¿Abrir en tu editor? (s/n): "
        read -r response

        if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
            if command -v code > /dev/null; then
                code SCRAPING-GUIDE.md
            elif command -v nano > /dev/null; then
                nano SCRAPING-GUIDE.md
            else
                less SCRAPING-GUIDE.md
            fi
        else
            echo ""
            echo "Puedes leerlo manualmente:"
            echo "  cat SCRAPING-GUIDE.md | less"
        fi
    else
        echo -e "${RED}✗ SCRAPING-GUIDE.md no encontrado${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read -r option

    case $option in
        1) test_mock_data ;;
        2) test_puppeteer_installed ;;
        3) test_run_examples ;;
        4) test_investigate_lider ;;
        5) test_investigate_jumbo ;;
        6) test_compare_prices ;;
        7) test_show_guide ;;
        0)
            echo -e "\n${GREEN}👋 ¡Hasta luego!${NC}\n"
            exit 0
            ;;
        *)
            echo -e "\n${RED}Opción inválida${NC}"
            ;;
    esac

    echo ""
    echo -e "${YELLOW}Presiona Enter para continuar...${NC}"
    read -r
done
