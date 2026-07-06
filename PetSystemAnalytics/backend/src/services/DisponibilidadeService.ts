import { prisma } from "../database/prisma";
import { getCargosParaServico } from "../constants/ServicoCargoMapping";
import { HorarioComercialValidator } from "../utils/HorarioComercialValidator";
import { TipoServico } from "../models/service-types/TipoServico";
import { Funcionario } from "../models/Funcionario";

export interface FuncionarioDisponivel {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

/**
 * Serviço de gerenciamento de disponibilidade de funcionários.
 * 
 * Responsabilidades:
 * - Listar funcionários disponíveis para um tipo de serviço
 * - Validar se um funcionário está disponível em uma data/hora
 * - Sugerir próximos horários disponíveis
 */
export class DisponibilidadeService {

  /**
   * Lista funcionários disponíveis para um serviço em uma data/hora.
   */
  async listarFuncionariosDisponiveis(
    tipoServico: TipoServico,
    dataHora: Date,
    duracao: number
  ): Promise<FuncionarioDisponivel[]> {
    // Valida se o horário é comercial
    if (!HorarioComercialValidator.isHorarioComercial(dataHora)) {
      return [];
    }

    // Obtém os cargos necessários para o serviço
    const cargos = getCargosParaServico(tipoServico);
    if (cargos.length === 0) {
      throw new Error(`Tipo de serviço não mapeado: ${tipoServico}`);
    }

    // Busca funcionários com cargo apropriado
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        cargo: {
          in: cargos,
        },
      },
      orderBy: { nome: "asc" },
    });

    // Filtra apenas os que estão disponíveis
    const disponíveis: FuncionarioDisponivel[] = [];
    for (const func of funcionarios) {
      if (await this.estaDisponivel(func.id, dataHora, duracao)) {
        disponíveis.push({
          id: func.id,
          nome: func.nome,
          cargo: func.cargo,
          email: func.email,
          telefone: func.telefone,
        });
      }
    }

    return disponíveis;
  }

  /**
   * Verifica se um funcionário está disponível em uma data/hora.
   */
  async estaDisponivel(
    funcionarioId: number,
    dataHora: Date,
    duracao: number
  ): Promise<boolean> {
    // Valida se o horário é comercial
    if (!HorarioComercialValidator.isHorarioComercial(dataHora)) {
      return false;
    }

    // Calcula o fim do agendamento
    const dataFim = new Date(dataHora);
    dataFim.setMinutes(dataFim.getMinutes() + duracao);

    // Valida se o fim também está dentro do horário comercial
    if (dataFim.getHours() > 17) {
      return false;
    }

    // Busca agendamentos conflitantes
    const conflitos = await prisma.agendamento.findMany({
      where: {
        funcionarioId,
        status: {
          not: "CANCELADO", // Ignora agendamentos cancelados
        },
        dataHora: {
          lt: dataFim, // Começa antes do fim desejado
        },
      },
    });

    // Verifica se há sobreposição
    for (const agendamento of conflitos) {
      const agendamentoFim = new Date(agendamento.dataHora);
      agendamentoFim.setMinutes(
        agendamentoFim.getMinutes() + agendamento.duracao
      );

      // Se o agendamento existente termina depois do início desejado, há conflito
      if (agendamentoFim > dataHora) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sugerє próximos horários disponíveis para um serviço.
   */
  async sugerirProximosHorarios(
    tipoServico: TipoServico,
    duracao: number,
    quantidade: number = 5
  ): Promise<Date[]> {
    const horarios: Date[] = [];
    let dataHora = HorarioComercialValidator.proximaDataComercial();

    while (horarios.length < quantidade) {
      // Incrementa de 30 em 30 minutos
      dataHora.setMinutes(dataHora.getMinutes() + 30);

      // Se passou das 17h, vai para o próximo dia
      if (dataHora.getHours() >= 17) {
        dataHora.setDate(dataHora.getDate() + 1);
        dataHora.setHours(8, 0, 0, 0);
        continue;
      }

      // Se está em fim de semana, vai para segunda-feira
      if (dataHora.getDay() === 0 || dataHora.getDay() === 6) {
        const diasAoLunedi =
          dataHora.getDay() === 0 ? 1 : 2;
        dataHora.setDate(dataHora.getDate() + diasAoLunedi);
        dataHora.setHours(8, 0, 0, 0);
        continue;
      }

      // Verifica se há algum funcionário disponível
      const disponíveis = await this.listarFuncionariosDisponiveis(
        tipoServico,
        dataHora,
        duracao
      );

      if (disponíveis.length > 0) {
        horarios.push(new Date(dataHora));
      }
    }

    return horarios;
  }
}
