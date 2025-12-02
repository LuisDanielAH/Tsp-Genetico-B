# Problema del Viajero - Algoritmo Genético

Visualizador interactivo del Problema del Viajero (TSP) usando algoritmos genéticos implementados completamente en frontend con React y TypeScript. No requiere backend externo.

## Características

- Algoritmo genético completo implementado en JavaScript (sin dependencias externas)
- Interfaz de canvas interactiva para añadir ciudades y obstáculos
- Visualización en tiempo real de la evolución de rutas
- Sistema de detección de colisiones con obstáculos
- Parámetros genéticos ajustables
- Funciona offline y despliega sin problemas en Vercel

## Estructura del Proyecto

\`\`\`
/
├── app/                          # Frontend Next.js
│   ├── page.tsx                 # Página principal
│   ├── layout.tsx               # Layout base
│   └── globals.css              # Estilos globales
├── components/                  # Componentes React
│   ├── canvas-visualizador.tsx  # Canvas interactivo
│   ├── panel-control.tsx        # Panel de parámetros
│   ├── estadisticas-evolucion.tsx # Estadísticas en vivo
│   └── instrucciones.tsx        # Instrucciones de uso
├── lib/                         # Lógica compartida
│   ├── algoritmo-genetico.ts    # Implementación del AG
│   └── utilidades.ts            # Funciones de geometría
└── next.config.mjs              # Configuración Next.js
\`\`\`

## Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
\`\`\`

## Cómo Usar

1. **Añadir Ciudades**: Haz clic en el canvas para agregar ciudades (máximo 15)
2. **Añadir Obstáculos**: Cambia a "Modo Obstáculos" y haz clic para crear barreras circulares
3. **Eliminar Elementos**: Selecciona un elemento y presiona la tecla Suprimir
4. **Configurar Parámetros**:
   - **Tamaño Población**: Cantidad de individuos por generación (10-100)
   - **Tasa Mutación**: Probabilidad de cambios aleatorios (0.001-0.1)
   - **Generaciones por Iteración**: Evoluciones por paso (1-50)
   - **Iteraciones Totales**: Número de pasos principales (1-20)
5. **Iniciar Evolución**: Presiona el botón para comenzar

## Algoritmo Genético

### Componentes Principales

- **Población Inicial**: Rutas aleatorias entre todas las ciudades
- **Fitness**: `1 / (distancia_total + penalizaciones)`
  - Penalización: +1000 por cada cruce de obstáculo
- **Selección**: Ruleta probabilística basada en fitness
- **Cruce**: Order Crossover (OX) para mantener validez de rutas
- **Mutación**: Intercambio aleatorio de ciudades en rutas

### Proceso de Evolución

1. Se genera una población de rutas aleatorias
2. Se calcula el fitness de cada ruta
3. Se seleccionan padres usando ruleta probabilística
4. Se crean hijos combinando material genético (OX)
5. Se aplican mutaciones aleatorias
6. Se repite hasta completar generaciones solicitadas

## Despliegue en Vercel

La aplicación está lista para desplegar sin configuración adicional:

\`\`\`bash
npm run build
vercel deploy
\`\`\```

No requiere variables de entorno ni backend externo. Todo funciona en el navegador del cliente.

## Rendimiento

- Todos los cálculos se ejecutan localmente en el cliente
- No hay latencia de red
- Responsivo incluso con múltiples generaciones
- Funciona perfectamente sin conexión a internet

## Tecnologías

- **Frontend**: React 19, Next.js 16, TypeScript
- **Algoritmo**: Implementación pura en JavaScript
- **Estilos**: Tailwind CSS
- **Hosting**: Vercel (sin backend requerido)

## Limitaciones

- Máximo 15 ciudades (límite de UI para rendimiento)
- Obstáculos circulares
- Cálculos sincronos (sin workers)

## Notas

Este proyecto demuestra la implementación completa de un algoritmo genético para TSP en un entorno frontend moderno, sin dependencias en backends externos.
