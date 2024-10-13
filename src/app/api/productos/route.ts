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

    const productos = await prisma.producto.findMany()
    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error fetching productos:', error)
    return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 })
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
    const producto = await prisma.producto.create({ data })
    return NextResponse.json(producto)
  } catch (error) {
    console.error('Error creating producto:', error)
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Remove PUT and DELETE methods from this file