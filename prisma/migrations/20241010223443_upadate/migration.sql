/*
  Warnings:

  - Added the required column `fechaUltimoAbono` to the `Registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registro" ADD COLUMN     "fechaUltimoAbono" TIMESTAMP(3) NOT NULL;
