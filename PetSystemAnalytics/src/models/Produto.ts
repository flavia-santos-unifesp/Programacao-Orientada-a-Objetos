export class Produto {
    constructor(
        private id: number,
        private nome: string,
        private preco: number,
        private estoque: number
    ) {}

    public getNome(): string {
        return this.nome;
    }

    public getPreco(): number {
        return this.preco;
    }

    public getEstoque(): number {
        return this.estoque;
    }

    public reduzirEstoque(qtd: number): void {

            if (qtd > this.estoque) {
                throw new Error("Estoque insuficiente.");
            }

            this.estoque -= qtd;
        }

    public getId(): number {
    return this.id;
    }
}