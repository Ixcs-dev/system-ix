import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('stan789', 10);
    const user = await prisma.usuario.create({
      data: {
        username: 'ixcs',
        password: hashedPassword,
        rol: 'ADMIN',
      },
    });
    console.log('Usuario creado:', user);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
