import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await verifyAuth(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const id = parseInt(params.id)
    const data = await request.json()

    const updatedProducto = await prisma.producto.update({
      where: { id },
      data
    })
    return NextResponse.json(updatedProducto)
  } catch (error) {
    console.error('Error updating producto:', error)
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await verifyAuth(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    if (user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes permiso para realizar esta acción' }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID de producto no válido' }, { status: 400 });
    }

    // Verificar si el producto existe
    const productoExistente = await prisma.producto.findUnique({
      where: { id },
    });

    if (!productoExistente) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Comprobar si el producto está asociado a registros
    const registrosCount = await prisma.registro.count({
      where: { productoId: id },
    })

    if (registrosCount > 0) {
      return NextResponse.json({ error: 'No se puede eliminar el producto porque está asociado a uno o más registros' }, { status: 400 })
    }

    // Eliminar el producto
    await prisma.producto.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting producto:', error)
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}