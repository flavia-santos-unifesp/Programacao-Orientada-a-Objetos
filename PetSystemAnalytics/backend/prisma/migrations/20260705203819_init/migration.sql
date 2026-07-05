-- CreateEnum
CREATE TYPE "NivelFidelidade" AS ENUM ('BRONZE', 'PRATA', 'OURO');

-- CreateEnum
CREATE TYPE "Especie" AS ENUM ('CACHORRO', 'GATO', 'AVE', 'PEIXE', 'ROEDOR', 'REPTIL', 'OUTRO');

-- CreateEnum
CREATE TYPE "Porte" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('BANHO', 'TOSA', 'CONSULTA', 'HOSPEDAGEM');

-- CreateEnum
CREATE TYPE "TipoItem" AS ENUM ('PRODUTO', 'SERVICO');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "nivel" "NivelFidelidade" NOT NULL DEFAULT 'BRONZE',

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" "Especie" NOT NULL,
    "raca" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "porte" "Porte" NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "desconto" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemVenda" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoItem" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "produtoId" INTEGER,
    "servico" "TipoServico",
    "petId" INTEGER,

    CONSTRAINT "ItemVenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_nome_idx" ON "Cliente"("nome");

-- CreateIndex
CREATE INDEX "Pet_nome_idx" ON "Pet"("nome");

-- CreateIndex
CREATE INDEX "Produto_nome_idx" ON "Produto"("nome");

-- CreateIndex
CREATE INDEX "Venda_data_idx" ON "Venda"("data");

-- CreateIndex
CREATE INDEX "ItemVenda_tipo_idx" ON "ItemVenda"("tipo");

-- CreateIndex
CREATE INDEX "ItemVenda_servico_idx" ON "ItemVenda"("servico");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVenda" ADD CONSTRAINT "ItemVenda_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVenda" ADD CONSTRAINT "ItemVenda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVenda" ADD CONSTRAINT "ItemVenda_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
