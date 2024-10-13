import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const user = await verifyAuth(token)
  if (!user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  try {
    const registros = await prisma.registro.findMany({
      include: {
        producto: true,
        abonos: true,
      },
    })

    let totalDebt = 0
    let debtorCount = 0
    const debtors: { nombrePersona: string; deuda: number }[] = []
    const incomeByMonth: { [key: string]: number } = {}

    registros.forEach((registro) => {
      const deuda = registro.producto.precio - registro.cantidadTotal
      if (deuda > 0) {
        totalDebt += deuda
        debtorCount++
        debtors.push({ nombrePersona: registro.nombrePersona, deuda })
      }

      registro.abonos.forEach((abono) => {
        const monthKey = new Date(abono.fecha).toISOString().slice(0, 7) // YYYY-MM
        incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + abono.cantidad
      })
    })

    const incomeData = Object.entries(incomeByMonth).map(([fecha, ingreso]) => ({ fecha, ingreso }))

    return NextResponse.json({
      totalDebt,
      debtorCount,
      debtors,
      incomeData,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Error al obtener los datos del dashboard' }, { status: 500 })
  }
}