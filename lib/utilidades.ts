export function distanciaEuclidiana(p1: [number, number], p2: [number, number]): number {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

export function detectarColisionLinea(
  p1: [number, number],
  p2: [number, number],
  obstaculo: [number, number, number],
): boolean {
  const [cx, cy, radio] = obstaculo

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]

  if (dx === 0 && dy === 0) {
    return distanciaEuclidiana(p1, [cx, cy]) < radio
  }

  const t = Math.max(0, Math.min(1, ((cx - p1[0]) * dx + (cy - p1[1]) * dy) / (dx * dx + dy * dy)))

  const puntoMasCercano: [number, number] = [p1[0] + t * dx, p1[1] + t * dy]
  const distancia = distanciaEuclidiana(puntoMasCercano, [cx, cy])

  return distancia < radio
}
