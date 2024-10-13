/*
  Warnings:

  - You are about to drop the column `producto` on the `Registro` table. All the data in the column will be lost.
  - Added the required column `productoId` to the `Registro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Abono" DROP CONSTRAINT "Abono_registroId_fkey";

-- AlterTable
ALTER TABLE "Registro" DROP COLUMN "producto",
ADD COLUMN     "productoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
