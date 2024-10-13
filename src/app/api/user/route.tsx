import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, username: string, rol: 'ADMIN' | 'EMPLEADO' }
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const user = await verifyToken(token)

  if (!user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  try {
    const userData = await prisma.usuario.findUnique({
      where: { id: user.userId },
      select: { username: true, rol: true }
    })

    if (!userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}