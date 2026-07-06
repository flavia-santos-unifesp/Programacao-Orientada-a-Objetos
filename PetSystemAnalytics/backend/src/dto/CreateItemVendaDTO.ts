import { TipoServico } from "../models/service-types/TipoServico";

export interface CreateItemVendaDTO {

    quantidade: number;

    produtoId?: number;

    servico?: TipoServico;

    petId?: number;

    dataHora?: string; // ISO 8601 format: "2026-07-06T14:30:00"

    funcionarioId?: number;

}