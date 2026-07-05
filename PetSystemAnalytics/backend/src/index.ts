import "dotenv/config";
import express from "express";
import { prisma } from "./database/prisma";

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ===== CLIENTES =====
app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clientes" });
  }
});

app.post("/api/clientes", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone },
    });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cliente" });
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create pet" });
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
    const produto = await prisma.produto.create({
      data: { nome, preco, estoque },
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: "Failed to create produto" });
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create venda" });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
