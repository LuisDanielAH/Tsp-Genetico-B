import { distanciaEuclidiana, detectarColisionLinea } from "./utilidades"

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

interface ResultadoEvolucion {
  ruta: number[]
  distancia: number
  fitness: number
}

function distanciaTotalRuta(ruta: number[], ciudades: [number, number][]): number {
  let distancia = 0
  for (let i = 0; i < ruta.length; i++) {
    const ciudadActual = ciudades[ruta[i]]
    const ciudadSiguiente = ciudades[ruta[(i + 1) % ruta.length]]
    distancia += distanciaEuclidiana(ciudadActual, ciudadSiguiente)
  }
  return distancia
}

function contarCrucesObstaculos(
  ruta: number[],
  ciudades: [number, number][],
  obstaculos: [number, number, number][],
): number {
  let cruces = 0
  for (let i = 0; i < ruta.length; i++) {
    const p1 = ciudades[ruta[i]]
    const p2 = ciudades[ruta[(i + 1) % ruta.length]]
    for (const obstaculo of obstaculos) {
      if (detectarColisionLinea(p1, p2, obstaculo)) {
        cruces++
      }
    }
  }
  return cruces
}

function calcularFitness(ruta: number[], ciudades: [number, number][], obstaculos: [number, number, number][]): number {
  const distancia = distanciaTotalRuta(ruta, ciudades)
  const cruces = contarCrucesObstaculos(ruta, ciudades, obstaculos)
  const penalizacion = cruces * 1000

  if (distancia === 0) return 0

  return 1 / (distancia + penalizacion)
}

function seleccionarPadres(poblacion: number[][], fitnessValores: number[], cantidad: number): number[][] {
  const sumaFitness = fitnessValores.reduce((a, b) => a + b, 0)
  if (sumaFitness === 0) {
    return Array.from({ length: cantidad }, () => poblacion[Math.floor(Math.random() * poblacion.length)].slice())
  }

  const probabilidades = fitnessValores.map((f) => f / sumaFitness)
  const padres: number[][] = []

  for (let i = 0; i < cantidad; i++) {
    const r = Math.random()
    let acumulado = 0
    for (let j = 0; j < probabilidades.length; j++) {
      acumulado += probabilidades[j]
      if (r <= acumulado) {
        padres.push(poblacion[j].slice())
        break
      }
    }
  }

  return padres
}

function cruzamientoOX(padre1: number[], padre2: number[]): number[] {
  const n = padre1.length
  const punto1 = Math.floor(Math.random() * n)
  const punto2 = Math.floor(Math.random() * (n - punto1)) + punto1

  const hijo: number[] = Array(n).fill(-1)

  for (let i = punto1; i <= punto2; i++) {
    hijo[i] = padre1[i]
  }

  const ciudadesUsadas = new Set(hijo.slice(punto1, punto2 + 1))

  let pos = 0
  for (let i = 0; i < n; i++) {
    if (pos === punto1) {
      pos = punto2 + 1
    }
    if (pos >= n) break

    if (!ciudadesUsadas.has(padre2[i])) {
      hijo[pos] = padre2[i]
      pos++
    }
  }

  return hijo
}

function mutacionIntercambio(individuo: number[], tasa: number): number[] {
  const individuoMutado = individuo.slice()
  const n = individuoMutado.length

  for (let i = 0; i < n; i++) {
    if (Math.random() < tasa) {
      const idx1 = Math.floor(Math.random() * n)
      const idx2 = Math.floor(Math.random() * n)
      ;[individuoMutado[idx1], individuoMutado[idx2]] = [individuoMutado[idx2], individuoMutado[idx1]]
    }
  }

  return individuoMutado
}

function generarPoblacionInicial(numCiudades: number, tamaño: number): number[][] {
  const poblacion: number[][] = []
  const indices = Array.from({ length: numCiudades }, (_, i) => i)

  for (let i = 0; i < tamaño; i++) {
    const ruta = [...indices]
    for (let j = ruta.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1))
      ;[ruta[j], ruta[k]] = [ruta[k], ruta[j]]
    }
    poblacion.push(ruta)
  }

  return poblacion
}

export function evolucionarGeneracion(
  ciudades: Ciudad[],
  obstaculos: Obstaculo[],
  tamanoPoblacion: number,
  tasaMutacion: number,
  generaciones: number,
  estadoPrevio?: number[],
): ResultadoEvolucion {
  const ciudadesArr = ciudades.map((c) => [c.x, c.y] as [number, number])
  const obstaculosArr = obstaculos.map((o) => [o.x, o.y, o.radio] as [number, number, number])

  let poblacion: number[][]

  if (estadoPrevio && estadoPrevio.length === ciudades.length) {
    poblacion = [estadoPrevio]
    for (let i = 1; i < tamanoPoblacion; i++) {
      const ruta = Array.from({ length: ciudades.length }, (_, i) => i)
      for (let j = ruta.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        ;[ruta[j], ruta[k]] = [ruta[k], ruta[j]]
      }
      poblacion.push(ruta)
    }
  } else {
    poblacion = generarPoblacionInicial(ciudades.length, tamanoPoblacion)
  }

  for (let gen = 0; gen < generaciones; gen++) {
    const fitnessValores = poblacion.map((ind) => calcularFitness(ind, ciudadesArr, obstaculosArr))

    const padres = seleccionarPadres(poblacion, fitnessValores, tamanoPoblacion)

    const nuevaPoblacion: number[][] = []
    for (let i = 0; i < tamanoPoblacion; i += 2) {
      const hijo1 = cruzamientoOX(padres[i], padres[(i + 1) % tamanoPoblacion])
      const hijo2 = cruzamientoOX(padres[(i + 1) % tamanoPoblacion], padres[i])

      nuevaPoblacion.push(mutacionIntercambio(hijo1, tasaMutacion))
      if (nuevaPoblacion.length < tamanoPoblacion) {
        nuevaPoblacion.push(mutacionIntercambio(hijo2, tasaMutacion))
      }
    }

    poblacion = nuevaPoblacion
  }

  const fitnessValores = poblacion.map((ind) => calcularFitness(ind, ciudadesArr, obstaculosArr))
  const mejorIndice = fitnessValores.indexOf(Math.max(...fitnessValores))
  const mejorRuta = poblacion[mejorIndice]

  const distancia = distanciaTotalRuta(mejorRuta, ciudadesArr)
  const fitnessMejor = fitnessValores[mejorIndice]

  return {
    ruta: mejorRuta,
    distancia: Math.round(distancia * 100) / 100,
    fitness: Math.round(fitnessMejor * 1000000) / 1000000,
  }
}
