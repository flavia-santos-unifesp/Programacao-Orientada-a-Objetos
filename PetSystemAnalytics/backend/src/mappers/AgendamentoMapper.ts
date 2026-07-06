import type { Agendamento as PrismaAgendamento } from "@prisma/client";
import { StatusAgendamento as PrismaStatusAgendamento } from "@prisma/client";

import { CreateAgendamentoDTO } from "../dto/CreateAgendamentoDTO";
import { Agendamento } from "../models/Agendamento";
import { StatusAgendamento } from "../models/StatusAgendamento";

export class AgendamentoMapper {

    /**
     * Converte um DTO em um objeto compatível com o Prisma.
     */
    public static fromCreateDTO(dto: CreateAgendamentoDTO) {

        return {
            dataHora: dto.dataHora,
            duracao: dto.duracao,
            funcionarioId: dto.funcionarioId,
            itemVendaId: dto.itemVendaId,
            status: PrismaStatusAgendamento.PENDENTE
        };

    }

    /**
     * Converte um Agendamento do domínio para um objeto compatível com o Prisma.
     */
    public static toPersistence(agendamento: Agendamento) {

        return {
            id: agendamento.getId(),
            dataHora: agendamento.getDataHora(),
            duracao: agendamento.getDuracao(),
            status: agendamento.getStatus() as PrismaStatusAgendamento,
            funcionarioId: agendamento.getFuncionario().getId(),
            itemVendaId: agendamento.getItemVenda().getId()
        };

    }
}
