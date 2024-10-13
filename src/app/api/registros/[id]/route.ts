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

    const updatedRegistro = await prisma.registro.update({
      where: { id },
      data: {
        nombrePersona: data.nombrePersona,
        productoId: data.productoId,
        cantidadTotal: {
          increment: data.cantidadAbonada,
        },
        fechaUltimoAbono: new Date(),
        abonos: {
          create: {
            cantidad: data.cantidadAbonada,
            metodoPago: data.metodoPago,
          },
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

    return NextResponse.json(updatedRegistro)
  } catch (error) {
    console.error('Error updating registro:', error)
    return NextResponse.json({ error: 'Error al actualizar el registro' }, { status: 500 })
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

    // First, delete all related abonos
    await prisma.abono.deleteMany({
      where: { registroId: id },
    })

    // Then, delete the registro
    await prisma.registro.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: 'Registro y abonos relacionados eliminados correctamente' })
  } catch (error) {
    console.error('Error deleting registro:', error)
    return NextResponse.json({ error: 'Error al eliminar el registro' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}