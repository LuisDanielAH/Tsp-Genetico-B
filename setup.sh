echo "Configurando Proyecto TSP - Algoritmos Genéticos"
echo "=================================================="
echo ""

echo "1. Instalando dependencias de Node.js..."
npm install

echo ""
echo "2. Instalando dependencias de Python..."
pip install -r api/requirements.txt

echo ""
echo "3. Generando estructura de carpetas..."
mkdir -p api

echo ""
echo "Configuración completada."
echo ""
echo "Para desarrollo:"
echo "  npm run dev:all    (Frontend + Backend simultáneamente)"
echo "  npm run dev        (Solo Frontend)"
echo "  npm run dev:api    (Solo Backend)"
echo ""
echo "Para producción:"
echo "  npm run build      (Construir proyecto)"
echo "  npm start          (Iniciar en producción)"
