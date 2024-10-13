-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "nombrePersona" TEXT NOT NULL,
    "producto" TEXT NOT NULL,
    "cantidadTotal" DOUBLE PRECISION NOT NULL,
    "fechaUltimoAbono" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abono" (
    "id" SERIAL NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registroId" INTEGER NOT NULL,

    CONSTRAINT "Abono_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
