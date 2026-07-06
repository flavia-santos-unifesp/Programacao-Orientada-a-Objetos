import { prisma } from "../database/prisma";
import { CreateAgendamentoDTO } from "../dto/CreateAgendamentoDTO";
import { Agendamento } from "../models/Agendamento";
import { IRepository } from "../interfaces/IRepository";
import { StatusAgendamento } from "../models/StatusAgendamento";

export class AgendamentoRepository implements IRepository<Agendamento, CreateAgendamentoDTO> {

    /**
     * Cria um novo agendamento.
     */
    public async create(dto: CreateAgendamentoDTO): Promise<Agendamento> {

        const agendamento = await prisma.agendamento.create({
            data: {
                dataHora: dto.dataHora,
                duracao: dto.duracao,
                funcionarioId: dto.funcionarioId,
                itemVendaId: dto.itemVendaId
            },
            include: {
                funcionario: true,
                itemVenda: true
            }
        });

        return this.toDomain(agendamento);

    }

    /**
     * Lista todos os agendamentos.
     */
    public async findAll(): Promise<Agendamento[]> {

        const agendamentos = await prisma.agendamento.findMany({
            include: {
                funcionario: true,
                itemVenda: true
            }
        });

        return agendamentos.map(ag => this.toDomain(ag));

    }

    /**
     * Busca um agendamento pelo ID.
     */
    public async findById(id: number): Promise<Agendamento | null> {

        const agendamento = await prisma.agendamento.findUnique({
            where: { id },
            include: {
                funcionario: true,
                itemVenda: true
            }
        });

        if (!agendamento) {
            return null;
        }

        return this.toDomain(agendamento);

    }

    /**
     * Busca agendamentos de um funcionário em um intervalo de tempo.
     */
    public async findByFuncionarioAndPeriodo(
        funcionarioId: number,
        dataInicio: Date,
        dataFim: Date
    ): Promise<Agendamento[]> {

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                funcionarioId,
                dataHora: {
                    gte: dataInicio,
                    lte: dataFim
                },
                status: { not: "CANCELADO" as any }
            },
            include: {
                funcionario: true,
                itemVenda: true
            }
        });

        return agendamentos.map(ag => this.toDomain(ag));

    }

    /**
     * Converte registro Prisma para domínio.
     */
    private toDomain(agendamento: any): Agendamento {

        const { Funcionario } = require("../models/Funcionario");
        const { ItemVenda } = require("../models/ItemVenda");

        const funcionario = new Funcionario(
            agendamento.funcionario.id,
            agendamento.funcionario.nome,
            agendamento.funcionario.telefone,
            agendamento.funcionario.email,
            agendamento.funcionario.cargo
        );

        const itemVenda = new ItemVenda(
            agendamento.itemVenda.id,
            agendamento.itemVenda.tipo,
            agendamento.itemVenda.quantidade,
            agendamento.itemVenda.precoUnitario
        );

        const statusMap: Record<string, StatusAgendamento> = {
            "PENDENTE": StatusAgendamento.PENDENTE,
            "CONFIRMADO": StatusAgendamento.CONFIRMADO,
            "REALIZADO": StatusAgendamento.REALIZADO,
            "CANCELADO": StatusAgendamento.CANCELADO
        };

        return new Agendamento(
            agendamento.id,
            new Date(agendamento.dataHora),
            agendamento.duracao,
            statusMap[agendamento.status],
            funcionario,
            itemVenda
        );

    }
}
