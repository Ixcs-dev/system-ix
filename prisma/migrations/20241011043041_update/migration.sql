/*
  Warnings:

  - Added the required column `categoria` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Abono" DROP CONSTRAINT "Abono_registroId_fkey";

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "categoria" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
