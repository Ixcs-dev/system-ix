import jwt from 'jsonwebtoken'

export async function verifyAuth(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, username: string, rol: 'ADMIN' | 'EMPLEADO' }
  } catch  {
    return null
  }
}