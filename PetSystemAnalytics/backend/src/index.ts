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

// ===== CALCULAR PREÇOS DE SERVIÇOS =====
app.get("/api/servicos/preco/:petId/:tipo", async (req, res) => {
  try {
    const { petId, tipo } = req.params;
    const pet = await prisma.pet.findUnique({ where: { id: parseInt(petId) } });
    
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }

    let preco = 0;
    let duracao = 0;

    // Tabela de preços baseada em peso/porte
    if (tipo === "BANHO") {
      // Banho usa PESO
      if (pet.peso <= 5) {
        preco = 40; duracao = 30;
      } else if (pet.peso <= 15) {
        preco = 60; duracao = 45;
      } else {
        preco = 90; duracao = 60;
      }
    } else if (tipo === "TOSA") {
      // Tosa usa PORTE
      if (pet.porte === "PEQUENO") {
        preco = 50; duracao = 40;
      } else if (pet.porte === "MEDIO") {
        preco = 80; duracao = 60;
      } else if (pet.porte === "GRANDE") {
        preco = 110; duracao = 80;
      }
    } else if (tipo === "CONSULTA") {
      preco = 120; duracao = 30;
    } else if (tipo === "HOSPEDAGEM") {
      // Hospedagem usa PORTE (por dia)
      if (pet.porte === "PEQUENO") {
        preco = 80;
      } else if (pet.porte === "MEDIO") {
        preco = 100;
      } else if (pet.porte === "GRANDE") {
        preco = 140;
      }
    }

    res.json({ preco, duracao, pet: { nome: pet.nome, porte: pet.porte, peso: pet.peso } });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate service price" });
  }
});

// Helper function to filter vendas by month/year
function filterVendasByMonth(vendas: any[], mes?: number, ano?: number) {
  if (!mes || !ano) return vendas;
  
  return vendas.filter((venda) => {
    const vendaDate = new Date(venda.data);
    return vendaDate.getMonth() === mes - 1 && vendaDate.getFullYear() === ano;
  });
}

// Helper function to filter vendas by year only
function filterVendasByYear(vendas: any[], ano?: number) {
  if (!ano) return vendas;
  
  return vendas.filter((venda) => {
    const vendaDate = new Date(venda.data);
    return vendaDate.getFullYear() === ano;
  });
}

// ===== KPIs DASHBOARD =====
app.get("/api/kpis", async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const mesNum = mes ? parseInt(mes as string) : undefined;
    const anoNum = ano ? parseInt(ano as string) : undefined;

    // Fetch all vendas with their items and cliente
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Filter by month/year if provided
    const vendasFiltradas = filterVendasByMonth(vendas, mesNum, anoNum);

    // Calculate KPIs
    const totalVendas = vendasFiltradas.length;
    const faturamento = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);
    const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

    // Find best-selling product
    const produtoContagem: Record<number, { nome: string; count: number }> = {};
    const servicoContagem: Record<string, number> = {};
    const clienteGasto: Record<number, { nome: string; total: number }> = {};

    vendasFiltradas.forEach((venda) => {
      // Track client spending
      if (!clienteGasto[venda.clienteId]) {
        clienteGasto[venda.clienteId] = {
          nome: venda.cliente!.nome,
          total: 0,
        };
      }
      clienteGasto[venda.clienteId]!.total += venda.total;

      // Track products and services
      venda.itens.forEach((item: any) => {
        if (item.tipo === "PRODUTO" && item.produtoId) {
          if (!produtoContagem[item.produtoId]) {
            produtoContagem[item.produtoId] = {
              nome: item.produto?.nome || "Produto desconhecido",
              count: 0,
            };
          }
          produtoContagem[item.produtoId]!.count += item.quantidade;
        } else if (item.tipo === "SERVICO" && item.servico) {
          servicoContagem[item.servico] = (servicoContagem[item.servico] || 0) + item.quantidade;
        }
      });
    });

    // Find top product, service, and client
    let produtoMaisVendido = "N/A";
    let servicoMaisUtilizado = "N/A";
    let clienteQueMaisGastou = "N/A";

    const topProducts = Object.entries(produtoContagem).sort(([, a], [, b]) => b.count - a.count);
    if (topProducts.length > 0 && topProducts[0] && topProducts[0][1]) {
      produtoMaisVendido = topProducts[0][1]!.nome;
    }

    const topServices = Object.entries(servicoContagem).sort(([, a], [, b]) => b - a);
    if (topServices.length > 0 && topServices[0]) {
      servicoMaisUtilizado = topServices[0][0]!;
    }

    const topClients = Object.entries(clienteGasto).sort(([, a], [, b]) => b.total - a.total);
    if (topClients.length > 0 && topClients[0] && topClients[0][1]) {
      clienteQueMaisGastou = topClients[0][1]!.nome;
    }

    res.json({
      faturamento,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      quantidadeVendas: totalVendas,
      produtoMaisVendido,
      servicoMaisUtilizado,
      clienteQueMaisGastou,
    });
  } catch (error: any) {
    console.error("Erro ao calcular KPIs:", error);
    res.status(500).json({ error: "Failed to calculate KPIs", details: error?.message });
  }
});

// Endpoint para evolução de faturamento por mês
app.get("/api/kpis/evolucao-faturamento", async (req, res) => {
  try {
    const { ano } = req.query;
    const anoNum = ano ? parseInt(ano as string) : new Date().getFullYear();

    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Organize by month
    const faturamentoPorMes: Record<number, number> = {};
    for (let i = 1; i <= 12; i++) {
      faturamentoPorMes[i] = 0;
    }

    vendas.forEach((venda) => {
      const vendaDate = new Date(venda.data);
      if (vendaDate.getFullYear() === anoNum) {
        const mes = vendaDate.getMonth() + 1;
        if (faturamentoPorMes[mes] !== undefined) {
          faturamentoPorMes[mes] += venda.total;
        }
      }
    });

    const data = Object.entries(faturamentoPorMes).map(([mes, valor]) => ({
      mes: parseInt(mes),
      mesNome: new Date(anoNum, parseInt(mes) - 1).toLocaleString("pt-BR", { month: "short" }),
      faturamento: Math.round(valor * 100) / 100,
    }));

    res.json(data);
  } catch (error: any) {
    console.error("Erro ao calcular evolução de faturamento:", error);
    res.status(500).json({ error: "Failed to calculate faturamento evolution", details: error?.message });
  }
});

// Endpoint para serviços mais vendidos (ano inteiro se mês não for especificado)
app.get("/api/kpis/servicos-mais-vendidos", async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const mesNum = mes ? parseInt(mes as string) : undefined;
    const anoNum = ano ? parseInt(ano as string) : new Date().getFullYear();

    const vendas = await prisma.venda.findMany({
      include: {
        itens: true,
      },
    });

    // Se mês não for especificado, filtra por ano inteiro
    const vendasFiltradas = mesNum ? filterVendasByMonth(vendas, mesNum, anoNum) : filterVendasByYear(vendas, anoNum);

    const servicoContagem: Record<string, number> = {};
    vendasFiltradas.forEach((venda) => {
      venda.itens.forEach((item: any) => {
        if (item.tipo === "SERVICO" && item.servico) {
          servicoContagem[item.servico] = (servicoContagem[item.servico] || 0) + item.quantidade;
        }
      });
    });

    const data = Object.entries(servicoContagem)
      .map(([servico, quantidade]) => ({ nome: servico, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    res.json(data);
  } catch (error: any) {
    console.error("Erro ao calcular serviços mais vendidos:", error);
    res.status(500).json({ error: "Failed to calculate top services", details: error?.message });
  }
});

// Endpoint para produtos mais vendidos (ano inteiro se mês não for especificado)
app.get("/api/kpis/produtos-mais-vendidos", async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const mesNum = mes ? parseInt(mes as string) : undefined;
    const anoNum = ano ? parseInt(ano as string) : new Date().getFullYear();

    const vendas = await prisma.venda.findMany({
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Se mês não for especificado, filtra por ano inteiro
    const vendasFiltradas = mesNum ? filterVendasByMonth(vendas, mesNum, anoNum) : filterVendasByYear(vendas, anoNum);

    const produtoContagem: Record<number, { nome: string; quantidade: number }> = {};
    vendasFiltradas.forEach((venda) => {
      venda.itens.forEach((item: any) => {
        if (item.tipo === "PRODUTO" && item.produtoId) {
          if (!produtoContagem[item.produtoId]) {
            produtoContagem[item.produtoId] = {
              nome: item.produto?.nome || "Produto desconhecido",
              quantidade: 0,
            };
          }
          produtoContagem[item.produtoId]!.quantidade += item.quantidade;
        }
      });
    });

    const data = Object.entries(produtoContagem)
      .map(([, { nome, quantidade }]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    res.json(data);
  } catch (error: any) {
    console.error("Erro ao calcular produtos mais vendidos:", error);
    res.status(500).json({ error: "Failed to calculate top products", details: error?.message });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
