import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const SQL = `
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'confirmado', 'REALIZADO', 'CANCELADO');

CREATE TABLE IF NOT EXISTS "Funcionario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Agendamento" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
    "funcionarioId" INTEGER NOT NULL,
    "itemVendaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Agendamento_itemVendaId_key" ON "Agendamento"("itemVendaId");
CREATE INDEX IF NOT EXISTS "Agendamento_funcionarioId_idx" ON "Agendamento"("funcionarioId");
CREATE INDEX IF NOT EXISTS "Agendamento_status_idx" ON "Agendamento"("status");

ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

async function main() {
  try {
    await client.connect();
    console.log('✓ Conectado ao banco de dados');
    
    const statements = SQL.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✓ Executado:', statement.split('\n')[0]!.substring(0, 50) + '...');
        } catch (err: any) {
          if (err.message.includes('already exists') || err.message.includes('already defined')) {
            console.log('⚠ Já existe:', statement.split('\n')[0]!.substring(0, 50) + '...');
          } else {
            throw err;
          }
        }
      }
    }
    
    console.log('\n✓ Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('✗ Erro:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
