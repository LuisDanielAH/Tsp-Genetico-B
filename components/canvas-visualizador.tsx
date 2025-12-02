"use client";

import { useRef, useEffect, useState } from "react";

interface Ciudad {
  x: number;
  y: number;
  id: number;
}

interface Obstaculo {
  x: number;
  y: number;
  radio: number;
  id: number;
}

interface Props {
  ciudades: Ciudad[];
  obstaculos: Obstaculo[];
  ruta: number[];
  onClickCiudad: (x: number, y: number) => void;
  onClickObstaculo: (x: number, y: number) => void;
  onEliminarCiudad: (id: number) => void;
  onEliminarObstaculo: (id: number) => void;
}

const dibujarEdificio = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  const ancho = size;
  const alto = size * 1.2;

  ctx.fillStyle = color;
  ctx.fillRect(x - ancho / 2, y - alto / 2, ancho, alto);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - ancho / 2, y - alto / 2, ancho, alto);

  const ventanaSize = size / 3;
  const espacioVentana = size / 6;

  for (let fila = 0; fila < 2; fila++) {
    for (let col = 0; col < 2; col++) {
      const ventX =
        x - ancho / 2 + espacioVentana + col * (ventanaSize + espacioVentana);
      const ventY =
        y - alto / 2 + espacioVentana + fila * (ventanaSize + espacioVentana);

      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(ventX, ventY, ventanaSize, ventanaSize);
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1;
      ctx.strokeRect(ventX, ventY, ventanaSize, ventanaSize);
    }
  }

  const puertaAncho = size / 4;
  const puertaAlto = size / 3;
  ctx.fillStyle = "#78350f";
  ctx.fillRect(
    x - puertaAncho / 2,
    y + alto / 2 - puertaAlto,
    puertaAncho,
    puertaAlto
  );
};

export default function CanvasVisualizador({
  ciudades,
  obstaculos,
  ruta,
  onClickCiudad,
  onClickObstaculo,
  onEliminarCiudad,
  onEliminarObstaculo,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [modo, setModo] = useState<"ciudades" | "obstaculos">("ciudades");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<number | null>(
    null
  );
  const [obstaculoSeleccionado, setObstaculoSeleccionado] = useState<
    number | null
  >(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ancho = canvas.width;
    const alto = canvas.height;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, ancho, alto);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;

    for (let i = 0; i <= ancho; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, alto);
      ctx.stroke();
    }
    for (let i = 0; i <= alto; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(ancho, i);
      ctx.stroke();
    }

    if (ruta.length > 0) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;

      for (let i = 0; i < ruta.length; i++) {
        const ciudadActual = ciudades[ruta[i]];
        const ciudadSiguiente = ciudades[ruta[(i + 1) % ruta.length]];

        if (ciudadActual && ciudadSiguiente) {
          ctx.beginPath();
          ctx.moveTo(ciudadActual.x, ciudadActual.y);
          ctx.lineTo(ciudadSiguiente.x, ciudadSiguiente.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    }

    obstaculos.forEach((obstaculo) => {
      ctx.fillStyle =
        obstaculoSeleccionado === obstaculo.id ? "#ef4444" : "#dc2626";
      ctx.beginPath();
      ctx.arc(obstaculo.x, obstaculo.y, obstaculo.radio, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ciudades.forEach((ciudad, idx) => {
      const colorEdificio =
        ciudadSeleccionada === ciudad.id ? "#10b981" : "#0ea5e9";

      dibujarEdificio(ctx, ciudad.x, ciudad.y, 16, colorEdificio);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${idx + 1}`, ciudad.x, ciudad.y - 28);

    });
  }, [ciudades, obstaculos, ruta, ciudadSeleccionada, obstaculoSeleccionado]);

  const manejarClickCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (modo === "ciudades") {
      const ciudadClickeada = ciudades.find(
        (c) => Math.hypot(c.x - x, c.y - y) < 16
      );

      if (ciudadClickeada) {
        setCiudadSeleccionada(ciudadClickeada.id);
        return;
      }

      onClickCiudad(x, y);
    } else {
      const obstaculoClickeado = obstaculos.find(
        (o) => Math.hypot(o.x - x, o.y - y) < o.radio + 5
      );

      if (obstaculoClickeado) {
        setObstaculoSeleccionado(obstaculoClickeado.id);
        return;
      }

      onClickObstaculo(x, y);
    }
  };

  const manejarTecla = (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      if (ciudadSeleccionada !== null) {
        onEliminarCiudad(ciudadSeleccionada);
        setCiudadSeleccionada(null);
      } else if (obstaculoSeleccionado !== null) {
        onEliminarObstaculo(obstaculoSeleccionado);
        setObstaculoSeleccionado(null);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [ciudadSeleccionada, obstaculoSeleccionado]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex gap-2 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200">
        <button
          onClick={() => {
            setModo("ciudades");
            setCiudadSeleccionada(null);
            setObstaculoSeleccionado(null);
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            modo === "ciudades"
              ? "bg-indigo-600 text-white shadow-md scale-105"
              : "bg-white text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-50"
          }`}
        >
          Ciudades
        </button>
        <button
          onClick={() => {
            setModo("obstaculos");
            setCiudadSeleccionada(null);
            setObstaculoSeleccionado(null);
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            modo === "obstaculos"
              ? "bg-orange-600 text-white shadow-md scale-105"
              : "bg-white text-orange-700 border-2 border-orange-200 hover:bg-orange-50"
          }`}
        >
          Obstáculos
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          onClick={manejarClickCanvas}
          className="w-full bg-slate-800 cursor-crosshair"
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 text-sm border-t border-indigo-200">
        <p className="font-semibold text-indigo-900 mb-2">
          {modo === "ciudades"
            ? `Ciudades: ${ciudades.length}/15`
            : `Obstáculos: ${obstaculos.length}`}
        </p>
        <p className="text-indigo-700">
          Seleccionado:{" "}
          {ciudadSeleccionada || obstaculoSeleccionado || "Ninguno"}
        </p>
        <p className="text-xs text-indigo-600 mt-1">
          Presiona Supr para eliminar seleccionado
        </p>
      </div>
    </div>
  );
}
