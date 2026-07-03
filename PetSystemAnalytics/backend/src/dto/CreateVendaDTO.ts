import { CreateItemVendaDTO } from "./CreateItemVendaDTO";

export interface CreateVendaDTO {

    clienteId: number;

    itens: CreateItemVendaDTO[];

}