import "dotenv/config";
import express from "express";
import { prisma } from "./database/prisma";
import { RelatorioAgenda } from "./reports/RelatorioAgenda";
import { DisponibilidadeService } from "./services/DisponibilidadeService";

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
      return acc + parseFloat(item.precoUnitario || item.preco || 0) * parseInt(item.quantidade);
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
              precoUnitario: parseFloat(item.precoUnitario || item.preco || 0),
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

      // Criar agendamentos para serviços
      for (let i = 0; i < novaVenda.itens.length; i++) {
        const item = itens[i];
        const itemVendaCriado = novaVenda.itens[i];
        
        if (item.servico && item.dataHora && item.funcionarioId && itemVendaCriado) {
          const dataHora = new Date(item.dataHora);
          const duracao = item.duracao || 60; // Padrão 60 minutos

          await tx.agendamento.create({
            data: {
              dataHora,
              duracao,
              status: "PENDENTE",
              funcionarioId: parseInt(item.funcionarioId),
              itemVendaId: itemVendaCriado.id,
            },
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

// ===== FUNCIONARIOS =====
app.get("/api/funcionarios", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch funcionarios" });
  }
});

app.get("/api/funcionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: parseInt(id) },
    });
    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }
    res.json(funcionario);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch funcionario" });
  }
});

app.get("/api/funcionarios/cargo/:cargo", async (req, res) => {
  try {
    const { cargo } = req.params;
    const funcionarios = await prisma.funcionario.findMany({
      where: { cargo },
    });
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch funcionarios by cargo" });
  }
});

app.post("/api/funcionarios", async (req, res) => {
  try {
    const { nome, email, telefone, cargo } = req.body;
    
    if (!nome || !email || !telefone || !cargo) {
      return res.status(400).json({ error: "Nome, email, telefone e cargo são obrigatórios" });
    }

    const funcionario = await prisma.funcionario.create({
      data: { nome, email, telefone, cargo },
    });
    res.status(201).json(funcionario);
  } catch (error: any) {
    console.error("Erro ao criar funcionário:", error);
    res.status(500).json({ 
      error: "Failed to create funcionario",
      details: error?.message || String(error)
    });
  }
});

app.delete("/api/funcionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.funcionario.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    console.error("Erro ao deletar funcionário:", error);
    res.status(500).json({ 
      error: "Failed to delete funcionario",
      details: error?.message || String(error)
    });
  }
});

// ===== AGENDAMENTOS =====
app.get("/api/agendamentos", async (req, res) => {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            produto: true,
            pet: { include: { cliente: true } },
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agendamentos" });
  }
});

app.get("/api/agendamentos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            produto: true,
            pet: { include: { cliente: true } },
          },
        },
      },
    });
    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agendamento" });
  }
});

app.get("/api/agendamentos/funcionario/:funcionarioId/data/:data", async (req, res) => {
  try {
    const { funcionarioId, data } = req.params;
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        funcionarioId: parseInt(funcionarioId),
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: { not: "CANCELADO" },
      },
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            produto: true,
            pet: { include: { cliente: true } },
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agendamentos" });
  }
});

// Endpoint de disponibilidade - DEVE VIR ANTES de /:id
app.get("/api/agendamentos/disponibilidade/:tipoServico", async (req, res) => {
  try {
    const { tipoServico } = req.params;
    const { dataHora, duracao } = req.query;

    if (!dataHora || !duracao) {
      return res.status(400).json({ 
        error: "dataHora e duracao são obrigatórios (query parameters)"
      });
    }

    const disponibilidadeService = new DisponibilidadeService();
    const dataHoraDate = new Date(dataHora as string);
    const durationMinutes = parseInt(duracao as string);

    const funcionariosDisponiveis = await disponibilidadeService.listarFuncionariosDisponiveis(
      tipoServico as any,
      dataHoraDate,
      durationMinutes
    );

    res.json(funcionariosDisponiveis);
  } catch (error: any) {
    console.error("Erro ao listar disponibilidade:", error);
    res.status(500).json({ 
      error: "Failed to list available employees",
      details: error?.message || String(error)
    });
  }
});

app.get("/api/agendamentos/sugerir-horarios/:tipoServico", async (req, res) => {
  try {
    const { tipoServico } = req.params;
    const { duracao, quantidade } = req.query;

    if (!duracao) {
      return res.status(400).json({ 
        error: "duracao é obrigatória (query parameter)"
      });
    }

    const disponibilidadeService = new DisponibilidadeService();
    const durationMinutes = parseInt(duracao as string);
    const qtd = quantidade ? parseInt(quantidade as string) : 5;

    const horarios = await disponibilidadeService.sugerirProximosHorarios(
      tipoServico as any,
      durationMinutes,
      qtd
    );

    res.json({ horarios });
  } catch (error: any) {
    console.error("Erro ao sugerir horários:", error);
    res.status(500).json({ 
      error: "Failed to suggest time slots",
      details: error?.message || String(error)
    });
  }
});

app.post("/api/agendamentos/verificar-disponibilidade", async (req, res) => {
  try {
    const { funcionarioId, dataHora, duracao } = req.body;

    if (!funcionarioId || !dataHora || !duracao) {
      return res.status(400).json({ error: "funcionarioId, dataHora e duracao são obrigatórios" });
    }

    const dataInicio = new Date(dataHora);
    const dataFim = new Date(dataInicio);
    dataFim.setMinutes(dataFim.getMinutes() + duracao);

    const agendamentosConflitantes = await prisma.agendamento.findMany({
      where: {
        funcionarioId: parseInt(funcionarioId),
        status: { not: "CANCELADO" },
        dataHora: {
          lt: dataFim,
        },
      },
      select: { dataHora: true, duracao: true },
    });

    let disponivel = true;
    for (const ag of agendamentosConflitantes) {
      const agFim = new Date(ag.dataHora);
      agFim.setMinutes(agFim.getMinutes() + ag.duracao);
      
      if (dataInicio < agFim) {
        disponivel = false;
        break;
      }
    }

    res.json({ disponivel });
  } catch (error: any) {
    console.error("Erro ao verificar disponibilidade:", error);
    res.status(500).json({ 
      error: "Failed to verify availability",
      details: error?.message || String(error)
    });
  }
});

app.post("/api/agendamentos", async (req, res) => {
  try {
    const { funcionarioId, dataHora, duracao, itemVendaId } = req.body;

    if (!funcionarioId || !dataHora || !duracao || !itemVendaId) {
      return res.status(400).json({ error: "funcionarioId, dataHora, duracao e itemVendaId são obrigatórios" });
    }

    const dataInicio = new Date(dataHora);
    const dataFim = new Date(dataInicio);
    dataFim.setMinutes(dataFim.getMinutes() + duracao);

    // Verificar disponibilidade
    const agendamentosConflitantes = await prisma.agendamento.findMany({
      where: {
        funcionarioId: parseInt(funcionarioId),
        status: { not: "CANCELADO" },
        dataHora: {
          lt: dataFim,
        },
      },
      select: { dataHora: true, duracao: true },
    });

    for (const ag of agendamentosConflitantes) {
      const agFim = new Date(ag.dataHora);
      agFim.setMinutes(agFim.getMinutes() + ag.duracao);
      
      if (dataInicio < agFim) {
        return res.status(400).json({ error: "Funcionário não está disponível neste horário" });
      }
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        funcionarioId: parseInt(funcionarioId),
        dataHora: dataInicio,
        duracao: parseInt(duracao),
        itemVendaId: parseInt(itemVendaId),
      },
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            produto: true,
            pet: { include: { cliente: true } },
          },
        },
      },
    });
    res.status(201).json(agendamento);
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ 
      error: "Failed to create agendamento",
      details: error?.message || String(error)
    });
  }
});

app.patch("/api/agendamentos/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["PENDENTE", "CONFIRMADO", "REALIZADO", "CANCELADO"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const agendamento = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            produto: true,
            pet: { include: { cliente: true } },
          },
        },
      },
    });
    res.json(agendamento);
  } catch (error: any) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ 
      error: "Failed to update agendamento",
      details: error?.message || String(error)
    });
  }
});

// ===== RELATÓRIOS DE AGENDA =====
app.get("/api/relatorios/agenda", async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: "dataInicio e dataFim são obrigatórios" });
    }

    const inicio = new Date(dataInicio as string);
    const fim = new Date(dataFim as string);

    const relatorio = new RelatorioAgenda();
    const dados = await relatorio.gerarPorPeriodo(inicio, fim);

    res.json(dados);
  } catch (error: any) {
    console.error("Erro ao gerar relatório de agenda:", error);
    res.status(500).json({ 
      error: "Failed to generate agenda report",
      details: error?.message || String(error)
    });
  }
});

app.get("/api/relatorios/agenda/funcionario/:funcionarioId", async (req, res) => {
  try {
    const { funcionarioId } = req.params;
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: "dataInicio e dataFim são obrigatórios" });
    }

    const inicio = new Date(dataInicio as string);
    const fim = new Date(dataFim as string);

    const relatorio = new RelatorioAgenda();
    const dados = await relatorio.gerarPorFuncionario(
      parseInt(funcionarioId),
      inicio,
      fim
    );

    res.json(dados);
  } catch (error: any) {
    console.error("Erro ao gerar relatório de agenda por funcionário:", error);
    res.status(500).json({ 
      error: "Failed to generate employee agenda report",
      details: error?.message || String(error)
    });
  }
});

app.get("/api/relatorios/agenda/data/:data", async (req, res) => {
  try {
    const { data } = req.params;

    const dataRelatorio = new Date(data);
    const relatorio = new RelatorioAgenda();
    const dados = await relatorio.gerarPorData(dataRelatorio);

    res.json(dados);
  } catch (error: any) {
    console.error("Erro ao gerar relatório de agenda por data:", error);
    res.status(500).json({ 
      error: "Failed to generate daily agenda report",
      details: error?.message || String(error)
    });
  }
});

app.get("/api/relatorios/agenda/texto", async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({ error: "dataInicio e dataFim são obrigatórios" });
    }

    const inicio = new Date(dataInicio as string);
    const fim = new Date(dataFim as string);

    const relatorio = new RelatorioAgenda();
    const texto = await relatorio.gerarTexto(inicio, fim);

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(texto);
  } catch (error: any) {
    console.error("Erro ao gerar relatório de agenda em texto:", error);
    res.status(500).json({ 
      error: "Failed to generate text agenda report",
      details: error?.message || String(error)
    });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
