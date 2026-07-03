import { TipoServico } from "../models/service-types/TipoServico";

export interface CreateItemVendaDTO {

    quantidade: number;

    produtoId?: number;

    servico?: TipoServico;

    petId?: number;

}