import { Venda } from "../models/Venda";

export class VendaRepository {

    private vendas: Venda[] = [];

    public salvar(venda: Venda): void {
        this.vendas.push(venda);
    }

    public listar(): Venda[] {
        return this.vendas;
    }
}