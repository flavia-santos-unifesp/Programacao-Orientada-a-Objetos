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
        return [...this.itens];
    }

    public getCliente(): Cliente {
        return this.cliente;
    }

    public getId(): number {
        return this.id;
    }

    public getData(): Date {
        return this.data;
    }

    /**
     * Calcula o valor bruto da venda,
     * antes da aplicação de descontos.
     */
    public calcularSubtotal(): number {

        let subtotal = 0;

        for (const item of this.itens) {
            subtotal += item.getSubtotal();
        }

        return subtotal;

    }

    /**
     * Calcula o valor do desconto aplicado
     * ao cliente de acordo com seu programa
     * de fidelidade.
     */
    public calcularValorDesconto(): number {

        return this.cliente.calcularValorDesconto(
            this.calcularSubtotal()
        );

    }

    /**
     * Calcula o valor final da venda
     * após a aplicação do desconto.
     */
    public calcularTotal(): number {

        return this.cliente.aplicarDesconto(
            this.calcularSubtotal()
        );

    }

    /**
     * Finaliza a venda registrando a compra
     * no programa de fidelidade do cliente.
     */
    public finalizarVenda(): void {

        const total = this.calcularTotal();

        this.cliente.registrarCompra(total);

    }

}