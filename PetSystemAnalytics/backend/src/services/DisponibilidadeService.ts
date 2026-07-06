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
    quantidade: number = 30,
    dataEspecifica?: string
  ): Promise<Date[]> {
    const horarios: Date[] = [];
    let dataHora: Date;
    const dataOriginal = dataEspecifica ?? null;

    // Se uma data específica foi fornecida, começar nela às 8h
    if (dataEspecifica) {
      const dataInicial = HorarioComercialValidator.parseDateUtcMinus3(
        dataEspecifica,
        8,
        0
      );

      if (!dataInicial) {
        return [];
      }

      dataHora = dataInicial;

      // Se a data é fim de semana, retornar vazio
      const dia = HorarioComercialValidator.getDiaSemanaUtcMinus3(dataHora);
      if (dia === 0 || dia === 6) { // Domingo ou sábado
        return [];
      }
    } else {
      dataHora = HorarioComercialValidator.proximaDataComercial();
    }

    while (horarios.length < quantidade) {
      // Se foi fornecida uma data específica, verificar se ainda estamos nela
      if (dataOriginal) {
        const diaAtual = HorarioComercialValidator.formatDateUtcMinus3(dataHora);
        
        // Se mudou de dia, parar
        if (diaAtual !== dataOriginal) {
          break;
        }
        
        // Se passou das 17h, parar
        if (HorarioComercialValidator.getHoraUtcMinus3(dataHora) >= 17) {
          break;
        }
      } else {
        // Sem data específica: continuar para próximo dia
        if (HorarioComercialValidator.getHoraUtcMinus3(dataHora) >= 17) {
          const proximoDia = HorarioComercialValidator.parseDateUtcMinus3(
            HorarioComercialValidator.formatDateUtcMinus3(
              new Date(dataHora.getTime() + 24 * 60 * 60 * 1000)
            ),
            8,
            0
          );
          if (!proximoDia) {
            break;
          }
          dataHora = proximoDia;
          continue;
        }

        // Se está em fim de semana, ir para segunda
        const diaSemana = HorarioComercialValidator.getDiaSemanaUtcMinus3(dataHora);
        if (diaSemana === 0 || diaSemana === 6) {
          const diasAoLunedi = diaSemana === 0 ? 1 : 2;
          const proximoDia = HorarioComercialValidator.parseDateUtcMinus3(
            HorarioComercialValidator.formatDateUtcMinus3(
              new Date(dataHora.getTime() + diasAoLunedi * 24 * 60 * 60 * 1000)
            ),
            8,
            0
          );
          if (!proximoDia) {
            break;
          }
          dataHora = proximoDia;
          continue;
        }
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

      // Incrementar de 15 em 15 minutos
      dataHora.setMinutes(dataHora.getMinutes() + 15);
    }

    return horarios;
  }
}
