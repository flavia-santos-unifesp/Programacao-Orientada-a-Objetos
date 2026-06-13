import { Cliente } from "./Cliente";
import { ItemVenda } from "./ItemVenda";

export class Venda {
    private itens: ItemVenda[] = [];

    constructor(
        private id: number,
        private cliente: Cliente,
        private data: Date
    ) {}

    public adicionarItem(item: ItemVenda): void {
        this.itens.push(item);
    }

    public getItens(): ItemVenda[] {
        return this.itens;
    }

    public getCliente() {
        return this.cliente;
    }

    public getId(): number {
         return this.id;
    }

    public getData(): Date {
         return this.data;
    }

    public calcularTotal(): number {
        let total = 0;

        for (const item of this.itens) {
            total += item.getSubtotal();
        }

        return total;
        }
}