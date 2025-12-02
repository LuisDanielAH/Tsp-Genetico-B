# Guía de Desarrollo

## Estructura de Código

### Backend (api/index.py)

#### Modelos Pydantic
- `Ciudad`: Coordenadas x, y
- `Obstaculo`: Posición y radio
- `SolicitudEvolucion`: Parámetros de evolución

#### Funciones Principales

**Geometría:**
- `distancia_euclidiana(p1, p2)`: Calcula distancia entre dos puntos
- `linea_cruza_obstaculo(p1, p2, obstaculo)`: Verifica colisión línea-círculo
- `contar_cruces_obstaculos(ruta, ciudades, obstaculos)`: Cuenta penalizaciones

**Algoritmo Genético:**
- `calcular_fitness(ruta, ciudades, obstaculos)`: Calcula calidad de ruta
- `seleccionar_padres(población, fitness, cantidad)`: Selección por ruleta
- `cruzamiento_ox(padre1, padre2)`: Genera descendencia válida
- `mutacion_intercambio(individuo, tasa)`: Introduce variabilidad

**Pipeline:**
- `generar_poblacion_inicial(num_ciudades, tamaño)`: Crea población aleatoria
- `/api/evolve`: Endpoint que ejecuta el pipeline completo

### Frontend (React)

#### Componentes

**app/page.tsx**
- Estado global: ciudades, obstáculos, ruta mejor, estadísticas
- Manejo de ciclo evolutivo iterativo
- Gestión de UI principal

**components/canvas-visualizador.tsx**
- Dibuja grid, ciudades, obstáculos y ruta
- Interactividad: click para añadir, seleccionar, eliminar
- Dos modos: Ciudades y Obstáculos
- Tecla Suprimir para eliminar elemento seleccionado

**components/panel-control.tsx**
- Sliders para parámetros genéticos
- Botón de inicio y limpieza
- Contador de elementos

**components/estadisticas-evolucion.tsx**
- Muestra distancia, fitness y generación
- Barra de progreso visual

## Flujo de Datos

\`\`\`
Usuario añade ciudades/obstáculos
         ↓
Usuario ajusta parámetros
         ↓
Inicia evolución
         ↓
Frontend enía solicitud a /api/evolve
         ↓
Backend procesa generaciones
         ↓
Backend retorna mejor ruta + estadísticas
         ↓
Frontend dibuja ruta mejorada
         ↓
Frontend envía nueva iteración si hay más iteraciones
         ↓
Repite hasta terminar
\`\`\`

## Optimizaciones Posibles

### Backend
- Implementar caché de distancias (memoización)
- Usar NumPy para operaciones matriciales
- Paralelizar evaluación de fitness
- Implementar estrategias elitistas

### Frontend
- Web Workers para canvas rendering
- Virtual scrolling si hay muchos elementos
- Animaciones suaves de ruta

## Testing

Para probar el backend localmente:
\`\`\`bash
curl -X POST http://localhost:8000/api/evolve \
  -H "Content-Type: application/json" \
  -d '{
    "ciudades": [{"x": 100, "y": 100}, {"x": 200, "y": 100}, {"x": 150, "y": 200}],
    "obstaculos": [],
    "tamaño_poblacion": 50,
    "tasa_mutacion": 0.02,
    "generaciones": 10
  }'
