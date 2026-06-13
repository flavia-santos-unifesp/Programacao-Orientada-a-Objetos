import { Produto } from "./Produto";
import { Servico } from "./Servico";

export class ItemVenda {
    constructor(
        private item: Produto | Servico,
        private quantidade: number
    ) {}

    public getItem(): Produto | Servico {
        return this.item;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }

    public getSubtotal(): number {
        return this.item.getPreco() * this.quantidade;
    }
}