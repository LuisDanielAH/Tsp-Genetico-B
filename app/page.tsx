"use client"

import { useState } from "react"
import CanvasVisualizador from "@/components/canvas-visualizador"
import PanelControl from "@/components/panel-control"
import EstadisticasEvolucion from "@/components/estadisticas-evolucion"
import Instrucciones from "@/components/instrucciones"
import { evolucionarGeneracion } from "@/lib/algoritmo-genetico"

interface Ciudad {
  x: number
  y: number
  id: number
}

interface Obstaculo {
  x: number
  y: number
  radio: number
  id: number
}

export default function PaginaTSP() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [obstaculos, setObstaculos] = useState<Obstaculo[]>([])
  const [rutaMejor, setRutaMejor] = useState<number[]>([])
  const [evolucionando, setEvolucionando] = useState(false)
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [generacionActual, setGeneracionActual] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const manejarClickCanvas = (x: number, y: number) => {
    if (ciudades.length < 15) {
      setCiudades([...ciudades, { x, y, id: Date.now() }])
      setError(null)
    } else {
      setError("Máximo 15 ciudades permitidas")
    }
  }

  const manejarClickObstaculo = (x: number, y: number) => {
    setObstaculos([...obstaculos, { x, y, radio: 30, id: Date.now() }])
  }

  const eliminarCiudad = (id: number) => {
    setCiudades(ciudades.filter((c) => c.id !== id))
  }

  const eliminarObstaculo = (id: number) => {
    setObstaculos(obstaculos.filter((o) => o.id !== id))
  }

  const limpiarMapa = () => {
    setCiudades([])
    setObstaculos([])
    setRutaMejor([])
    setEstadisticas(null)
    setGeneracionActual(0)
    setError(null)
  }

  const iniciarEvolucion = async (parametros: any) => {
    if (ciudades.length < 2) {
      setError("Se necesitan al menos 2 ciudades")
      return
    }

    setEvolucionando(true)
    setError(null)
    setGeneracionActual(0)

    let rutaActual = rutaMejor.length > 0 ? rutaMejor : undefined

    for (let i = 0; i < parametros.iteraciones; i++) {
      try {
        const resultado = evolucionarGeneracion(
          ciudades,
          obstaculos,
          parametros.tamaño_poblacion,
          parametros.tasa_mutacion,
          parametros.generacionesPorIteracion,
          rutaActual,
        )

        rutaActual = resultado.ruta

        setRutaMejor(resultado.ruta)
        setEstadisticas({
          distancia: resultado.distancia,
          fitness: resultado.fitness,
          generacion: (i + 1) * parametros.generacionesPorIteracion,
        })

        setGeneracionActual((i + 1) * parametros.generacionesPorIteracion)

        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error("Error durante evolución:", error)
        setError(`Error: ${error instanceof Error ? error.message : "desconocido"}`)
        setEvolucionando(false)
        return
      }
    }

    setEvolucionando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Problema del Viajero - Algoritmo Genético</h1>
          <p className="text-slate-300">
            Visualizador interactivo que utiliza evolución biológica simulada para encontrar rutas óptimas entre
            ciudades.
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">{error}</div>}

        <Instrucciones />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CanvasVisualizador
              ciudades={ciudades}
              obstaculos={obstaculos}
              ruta={rutaMejor}
              onClickCiudad={manejarClickCanvas}
              onClickObstaculo={manejarClickObstaculo}
              onEliminarCiudad={eliminarCiudad}
              onEliminarObstaculo={eliminarObstaculo}
            />
          </div>

          <div className="space-y-4">
            <PanelControl
              ciudadesCount={ciudades.length}
              obstaculosCount={obstaculos.length}
              evolucionando={evolucionando}
              onIniciarEvolucion={iniciarEvolucion}
              onLimpiar={limpiarMapa}
            />

            {estadisticas && <EstadisticasEvolucion estadisticas={estadisticas} generacionActual={generacionActual} />}
          </div>
        </div>
      </div>
    </div>
  )
}
