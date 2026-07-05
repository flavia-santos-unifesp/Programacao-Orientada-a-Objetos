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
      include: { itens: true, cliente: true },
    });
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendas" });
  }
});

app.post("/api/vendas", async (req, res) => {
  try {
    const { clienteId, data, subtotal = 0, desconto = 0, total = 0 } = req.body;
    
    if (!clienteId) {
      return res.status(400).json({ error: "clienteId é obrigatório" });
    }

    const venda = await prisma.venda.create({
      data: {
        clienteId: parseInt(clienteId),
        data: data ? new Date(data) : new Date(),
        subtotal: parseFloat(subtotal),
        desconto: parseFloat(desconto),
        total: parseFloat(total),
      },
    });
    res.status(201).json(venda);
  } catch (error: any) {
    console.error("Erro ao criar venda:", error);
    res.status(500).json({ 
      error: "Failed to create venda",
      details: error?.message || String(error)
    });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
