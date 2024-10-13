import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const user = await prisma.usuario.findUnique({ where: { username } })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      console.log('Login failed: Invalid credentials')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    console.log('Login successful for user:', username)
    return NextResponse.json({ token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}