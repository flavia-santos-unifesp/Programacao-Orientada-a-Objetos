import "dotenv/config";
import express from "express";
import { prisma } from "./database/prisma";

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Helper para mapear campos do banco para o formato do frontend
function mapCliente(c: any) {
  return {
    id: c.id,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    pontosFidelidade: c.pontos ?? 0,
    nivelFidelidade: c.nivel ?? "BRONZE",
  };
}

// ===== CLIENTES =====
app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes.map(mapCliente));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clientes" });
  }
});

app.post("/api/clientes", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    
    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: "Nome, email e telefone são obrigatórios" });
    }

    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone },
    });
    res.status(201).json(mapCliente(cliente));
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ 
      error: "Failed to create cliente",
      details: error?.message || String(error)
    });
  }
});

// ===== PETS =====
app.get("/api/pets", async (req, res) => {
  try {
    const pets = await prisma.pet.findMany();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

app.post("/api/pets", async (req, res) => {
  try {
    const { nome, especie, porte, raca, idade, peso, clienteId } = req.body;
    
    if (!nome || !especie || !porte || !clienteId || parseInt(clienteId) === 0) {
      return res.status(400).json({ error: "Nome, especie, porte e clienteId são obrigatórios" });
    }

    const pet = await prisma.pet.create({
      data: {
        nome,
        especie,
        porte,
        raca: raca || "Desconhecida",
        idade: idade || 0,
        peso: peso || 0,
        clienteId: parseInt(clienteId),
      },
    });
    res.status(201).json(pet);
  } catch (error: any) {
    console.error("Erro ao criar pet:", error);
    res.status(500).json({ 
      error: "Failed to create pet",
      details: error?.message || String(error)
    });
  }
});

// ===== PRODUTOS =====
app.get("/api/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch produtos" });
  }
});

app.post("/api/produtos", async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    
    if (!nome || preco === undefined || estoque === undefined) {
      return res.status(400).json({ error: "Nome, preco e estoque são obrigatórios" });
    }

    const produto = await prisma.produto.create({
      data: { nome, preco: parseFloat(preco), estoque: parseInt(estoque) },
    });
    res.status(201).json(produto);
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ 
      error: "Failed to create produto",
      details: error?.message || String(error)
    });
  }
});

// ===== VENDAS =====
app.get("/api/vendas", async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true,
        itens: { include: { produto: true } },
      },
      orderBy: { data: "desc" },
    });
    const mapped = vendas.map((v) => ({
      ...v,
      cliente: mapCliente(v.cliente),
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendas" });
  }
});

app.post("/api/vendas", async (req, res) => {
  try {
    const { clienteId, itens } = req.body;

    if (!clienteId || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: "clienteId e itens são obrigatórios" });
    }

    // Buscar cliente para calcular desconto por nível de fidelidade
    const cliente = await prisma.cliente.findUnique({ where: { id: parseInt(clienteId) } });
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

    const descontoMap: Record<string, number> = { BRONZE: 0, PRATA: 0.05, OURO: 0.10 };
    const percentualDesconto = descontoMap[cliente.nivel] ?? 0;

    // Calcular subtotal
    const subtotal = itens.reduce((acc: number, item: any) => {
      return acc + parseFloat(item.precoUnitario) * parseInt(item.quantidade);
    }, 0);

    const desconto = subtotal * percentualDesconto;
    const total = subtotal - desconto;

    // Criar venda com itens em uma transação
    const venda = await prisma.$transaction(async (tx) => {
      const novaVenda = await tx.venda.create({
        data: {
          clienteId: parseInt(clienteId),
          data: new Date(),
          subtotal,
          desconto,
          total,
          itens: {
            create: itens.map((item: any) => ({
              tipo: item.tipo,
              quantidade: parseInt(item.quantidade),
              precoUnitario: parseFloat(item.precoUnitario),
              produtoId: item.produtoId ? parseInt(item.produtoId) : null,
              servico: item.servico || null,
              petId: item.petId ? parseInt(item.petId) : null,
            })),
          },
        },
        include: { itens: true, cliente: true },
      });

      // Atualizar estoque dos produtos
      for (const item of itens) {
        if (item.produtoId) {
          await tx.produto.update({
            where: { id: parseInt(item.produtoId) },
            data: { estoque: { decrement: parseInt(item.quantidade) } },
          });
        }
      }

      // Adicionar pontos ao cliente (1 ponto por real gasto)
      const pontosGanhos = Math.floor(total);
      const novosPontos = cliente.pontos + pontosGanhos;
      const novoNivel = novosPontos >= 1000 ? "OURO" : novosPontos >= 500 ? "PRATA" : "BRONZE";

      await tx.cliente.update({
        where: { id: parseInt(clienteId) },
        data: { pontos: novosPontos, nivel: novoNivel },
      });

      return novaVenda;
    });

    res.status(201).json({ ...venda, cliente: mapCliente(venda.cliente) });
  } catch (error: any) {
    console.error("Erro ao criar venda:", error);
    res.status(500).json({
      error: "Failed to create venda",
      details: error?.message || String(error),
    });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
