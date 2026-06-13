import { Produto } from "../models/Produto";

export class ProdutoRepository {

    private produtos: Produto[] = [];

    public adicionar(produto: Produto): void {
        this.produtos.push(produto);
    }

    public listar(): Produto[] {
        return this.produtos;
    }

    public buscarPorId(id: number): Produto | undefined {

        return this.produtos.find(
            produto => produto.getId() === id
        );
    }
}