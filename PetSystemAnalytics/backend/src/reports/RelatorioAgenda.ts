import { prisma } from "../database/prisma";

export interface RelatorioAgendaData {
  dataRelatorio: Date;
  totalAgendamentos: number;
  agendamentoPorStatus: Record<string, number>;
  agendamentoPorFuncionario: Array<{
    funcionarioId: number;
    funcionarioNome: string;
    cargo: string;
    totalAgendamentos: number;
    agendamentoPorStatus: Record<string, number>;
  }>;
  agendamentoPorServico: Array<{
    servico: string;
    quantidade: number;
  }>;
}

export class RelatorioAgenda {

  /**
   * Gera relatório de agendamentos para um período.
   */
  public async gerarPorPeriodo(
    dataInicio: Date,
    dataFim: Date
  ): Promise<RelatorioAgendaData> {

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        funcionario: true,
        itemVenda: {
          include: {
            pet: true,
          },
        },
      },
    });

    // Contagem por status
    const agendamentoPorStatus: Record<string, number> = {
      PENDENTE: 0,
      CONFIRMADO: 0,
      REALIZADO: 0,
      CANCELADO: 0,
    };

    agendamentos.forEach((ag) => {
      if (ag.status && (ag.status in agendamentoPorStatus)) {
        (agendamentoPorStatus as any)[ag.status]++;
      }
    });

    // Contagem por funcionário
    const agendamentoPorFuncionarioMap = new Map<
      number,
      {
        funcionarioId: number;
        funcionarioNome: string;
        cargo: string;
        agendamentos: typeof agendamentos;
      }
    >();

    agendamentos.forEach((ag) => {
      if (!agendamentoPorFuncionarioMap.has(ag.funcionario.id)) {
        agendamentoPorFuncionarioMap.set(ag.funcionario.id, {
          funcionarioId: ag.funcionario.id,
          funcionarioNome: ag.funcionario.nome,
          cargo: ag.funcionario.cargo,
          agendamentos: [],
        });
      }

      agendamentoPorFuncionarioMap
        .get(ag.funcionario.id)!
        .agendamentos.push(ag);
    });

    const agendamentoPorFuncionario = Array.from(
      agendamentoPorFuncionarioMap.values()
    ).map((item) => {
      const statusCount: Record<string, number> = {
        PENDENTE: 0,
        CONFIRMADO: 0,
        REALIZADO: 0,
        CANCELADO: 0,
      };

      item.agendamentos.forEach((ag) => {
        if (ag.status && (ag.status in statusCount)) {
          (statusCount as any)[ag.status]++;
        }
      });

      return {
        funcionarioId: item.funcionarioId,
        funcionarioNome: item.funcionarioNome,
        cargo: item.cargo,
        totalAgendamentos: item.agendamentos.length,
        agendamentoPorStatus: statusCount,
      };
    });

    // Contagem por serviço
    const agendamentoPorServicoMap = new Map<string, number>();

    agendamentos.forEach((ag) => {
      const tipoServico = ag.itemVenda.servico || "Produto";
      const count = agendamentoPorServicoMap.get(tipoServico) || 0;
      agendamentoPorServicoMap.set(tipoServico, count + 1);
    });

    const agendamentoPorServico = Array.from(
      agendamentoPorServicoMap.entries()
    )
      .map(([servico, quantidade]) => ({
        servico,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      dataRelatorio: new Date(),
      totalAgendamentos: agendamentos.length,
      agendamentoPorStatus,
      agendamentoPorFuncionario,
      agendamentoPorServico,
    };

  }

  /**
   * Gera relatório de agendamentos para um funcionário em um período.
   */
  public async gerarPorFuncionario(
    funcionarioId: number,
    dataInicio: Date,
    dataFim: Date
  ): Promise<{
    funcionario: {
      id: number;
      nome: string;
      cargo: string;
    };
    dataRelatorio: Date;
    totalAgendamentos: number;
    agendamentoPorStatus: Record<string, number>;
    agendamentos: Array<{
      id: number;
      dataHora: Date;
      duracao: number;
      status: string;
      cliente: string;
      pet: string;
      servico: string;
    }>;
  }> {

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
    });

    if (!funcionario) {
      throw new Error("Funcionário não encontrado");
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        funcionarioId,
        dataHora: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        itemVenda: {
          include: {
            pet: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });

    const agendamentoPorStatus: Record<string, number> = {
      PENDENTE: 0,
      CONFIRMADO: 0,
      REALIZADO: 0,
      CANCELADO: 0,
    };

    const agendamentosFormatados = agendamentos.map((ag) => {
      if (ag.status && (ag.status in agendamentoPorStatus)) {
        (agendamentoPorStatus as any)[ag.status]++;
      }

      return {
        id: ag.id,
        dataHora: ag.dataHora,
        duracao: ag.duracao,
        status: ag.status,
        cliente: ag.itemVenda.pet?.cliente?.nome || "Cliente desconhecido",
        pet: ag.itemVenda.pet?.nome || "Pet desconhecido",
        servico: ag.itemVenda.servico || "Serviço desconhecido",
      };
    });

    return {
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        cargo: funcionario.cargo,
      },
      dataRelatorio: new Date(),
      totalAgendamentos: agendamentos.length,
      agendamentoPorStatus,
      agendamentos: agendamentosFormatados,
    };

  }

  /**
   * Gera relatório de agendamentos para uma data específica.
   */
  public async gerarPorData(data: Date): Promise<RelatorioAgendaData> {

    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    return this.gerarPorPeriodo(dataInicio, dataFim);

  }

  /**
   * Gera texto formatado do relatório de agendamentos.
   */
  public async gerarTexto(
    dataInicio: Date,
    dataFim: Date
  ): Promise<string> {

    const relatorio = await this.gerarPorPeriodo(dataInicio, dataFim);

    let texto = "\n===== RELATÓRIO DE AGENDAMENTOS =====\n";
    texto += `Data do Relatório: ${relatorio.dataRelatorio.toLocaleDateString("pt-BR")}\n`;
    texto += `Período: ${dataInicio.toLocaleDateString("pt-BR")} a ${dataFim.toLocaleDateString(
      "pt-BR"
    )}\n`;

    texto += `\nTotal de Agendamentos: ${relatorio.totalAgendamentos}\n`;

    texto += "\n--- Agendamentos por Status ---\n";
    Object.entries(relatorio.agendamentoPorStatus).forEach(([status, count]) => {
      texto += `${status}: ${count}\n`;
    });

    texto += "\n--- Agendamentos por Funcionário ---\n";
    relatorio.agendamentoPorFuncionario.forEach((func) => {
      texto += `\n${func.funcionarioNome} (${func.cargo})\n`;
      texto += `Total: ${func.totalAgendamentos}\n`;
      Object.entries(func.agendamentoPorStatus).forEach(([status, count]) => {
        if (count > 0) {
          texto += `  ${status}: ${count}\n`;
        }
      });
    });

    texto += "\n--- Agendamentos por Serviço ---\n";
    relatorio.agendamentoPorServico.forEach((servico) => {
      texto += `${servico.servico}: ${servico.quantidade}\n`;
    });

    texto += "\n=====================================\n";

    return texto;

  }
}
