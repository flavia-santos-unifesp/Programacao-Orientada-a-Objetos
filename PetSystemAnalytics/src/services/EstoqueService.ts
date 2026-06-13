import { Produto } from "../models/Produto";

export class EstoqueService {

    public atualizarEstoque(
        produto: Produto,
        quantidade: number
    ): void {

        if (produto.getEstoque() < quantidade) {
            throw new Error("Estoque insuficiente.");
        }

        produto.reduzirEstoque(quantidade);
    }
}