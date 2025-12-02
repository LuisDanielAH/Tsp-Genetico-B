"use client"

import { TrendingDown, Activity } from "lucide-react"

interface Props {
  estadisticas: {
    distancia: number
    fitness: number
    generacion: number
  }
  generacionActual: number
}

export default function EstadisticasEvolucion({ estadisticas, generacionActual }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Estadísticas
      </h2>

      <div className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Distancia Total</p>
          <p className="text-2xl font-bold text-blue-600">{estadisticas.distancia.toFixed(1)}</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Fitness</p>
          <p className="text-2xl font-bold text-green-600">{estadisticas.fitness.toFixed(4)}</p>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Generación Actual</p>
          <p className="text-2xl font-bold text-purple-600">{generacionActual}</p>
        </div>

        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-slate-600" />
            <p className="text-xs font-medium text-slate-600">Objetivo: Minimizar distancia</p>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((1 / estadisticas.distancia) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
