import { Cliente } from "./Cliente";
import { ItemVenda } from "./ItemVenda";

export class Venda {

    private itens: ItemVenda[] = [];

    /**
     * Valores persistidos no banco.
     * Quando undefined, são calculados dinamicamente.
     */
    private subtotal?: number;
    private desconto?: number;
    private total?: number;

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

    /**
     * Define o ID da venda.
     * Utilizado pelo repositório após a persistência.
    */

    public setId(id: number): void {
        this.id = id;
    }

    public getData(): Date {
        return this.data;
    }

    /**
     * Utilizado pelo Mapper ao reconstruir uma venda
     * a partir do banco de dados.
     */
    public restaurarTotais(
        subtotal: number,
        desconto: number,
        total: number
    ): void {

        this.subtotal = subtotal;
        this.desconto = desconto;
        this.total = total;

    }

    /**
     * Calcula o valor bruto da venda,
     * antes da aplicação de descontos.
     */
    public calcularSubtotal(): number {

        if (this.subtotal !== undefined) {
            return this.subtotal;
        }

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

        if (this.desconto !== undefined) {
            return this.desconto;
        }

        return this.cliente.calcularValorDesconto(
            this.calcularSubtotal()
        );

    }

    /**
     * Calcula o valor final da venda.
     */
    public calcularTotal(): number {

        if (this.total !== undefined) {
            return this.total;
        }

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