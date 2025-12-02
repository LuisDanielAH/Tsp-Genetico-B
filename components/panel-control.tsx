"use client"

import { useState } from "react"
import { Zap, Trash2, Sliders } from "lucide-react"

interface Props {
  ciudadesCount: number
  obstaculosCount: number
  evolucionando: boolean
  onIniciarEvolucion: (parametros: any) => void
  onLimpiar: () => void
}

export default function PanelControl({
  ciudadesCount,
  obstaculosCount,
  evolucionando,
  onIniciarEvolucion,
  onLimpiar,
}: Props) {
  const [tamaño_poblacion, setTamaño] = useState(50)
  const [tasa_mutacion, setTasaMutacion] = useState(0.02)
  const [generacionesPorIteracion, setGeneraciones] = useState(50)
  const [iteraciones, setIteraciones] = useState(5)

  const handleEvolucionar = () => {
    onIniciarEvolucion({
      tamaño_poblacion,
      tasa_mutacion,
      generacionesPorIteracion,
      iteraciones,
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Configuración</h2>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-slate-700">Tamaño Población</label>
              <span className="text-sm font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                {tamaño_poblacion}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={tamaño_poblacion}
              onChange={(e) => setTamaño(Number(e.target.value))}
              disabled={evolucionando}
              className="w-full h-2 bg-gradient-to-r from-violet-300 to-purple-300 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <p className="text-xs text-slate-500 mt-2">Número de individuos por generación</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-slate-700">Tasa Mutación</label>
              <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {tasa_mutacion.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={tasa_mutacion}
              onChange={(e) => setTasaMutacion(Number(e.target.value))}
              disabled={evolucionando}
              className="w-full h-2 bg-gradient-to-r from-orange-300 to-red-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <p className="text-xs text-slate-500 mt-2">Probabilidad de cambios aleatorios</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-slate-700">Generaciones/Paso</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {generacionesPorIteracion}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={generacionesPorIteracion}
              onChange={(e) => setGeneraciones(Number(e.target.value))}
              disabled={evolucionando}
              className="w-full h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-500 mt-2">Generaciones por iteración</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-slate-700">Iteraciones</label>
              <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                {iteraciones}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={iteraciones}
              onChange={(e) => setIteraciones(Number(e.target.value))}
              disabled={evolucionando}
              className="w-full h-2 bg-gradient-to-r from-green-300 to-emerald-300 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-slate-500 mt-2">Número de ciclos de evolución</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleEvolucionar}
            disabled={evolucionando || ciudadesCount < 2}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              evolucionando || ciudadesCount < 2
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            
            {evolucionando ? "Evolucionando..." : "Iniciar Evolución"}
          </button>

          <button
            onClick={onLimpiar}
            disabled={evolucionando}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              evolucionando
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            
            Limpiar Todo
          </button>
        </div>

      </div>
    </div>
  )
}
