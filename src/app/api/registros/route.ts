import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await verifyAuth(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const registros = await prisma.registro.findMany({
      where: {
        nombrePersona: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        producto: true,
        abonos: {
          orderBy: {
            fecha: 'desc',
          },
        },
      },
    })

    return NextResponse.json(registros)
  } catch (error) {
    console.error('Error fetching registros:', error)
    return NextResponse.json({ error: 'Error al obtener los registros' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await verifyAuth(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const data = await request.json()

    const { nombrePersona, productoId, cantidadAbonada, metodoPago } = data

    if (!nombrePersona || !productoId || !cantidadAbonada || !metodoPago) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const newRegistro = await prisma.registro.create({
      data: {
        nombrePersona,
        productoId: parseInt(productoId),
        cantidadTotal: parseFloat(cantidadAbonada),
        fechaUltimoAbono: new Date(),
        abonos: {
          create: {
            cantidad: parseFloat(cantidadAbonada),
            metodoPago,
          },
        },
      },
      include: {
        producto: true,
        abonos: true,
      },
    })

    return NextResponse.json(newRegistro, { status: 201 })
  } catch (error) {
    console.error('Error creating registro:', error)
    return NextResponse.json({ error: 'Error al crear el registro' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}