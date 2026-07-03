import { Produto } from "./Produto";
import { Servico } from "./Servico";
import { Pet } from "./Pet";
import { ErrorMessages } from "../constants/ErrorMessages";

export class ItemVenda {

    constructor(
        private item: Produto | Servico,
        private quantidade: number,
        private pet?: Pet,
        private precoUnitario?: number
    ) {

        if (quantidade <= 0) {
            throw new Error(ErrorMessages.INVALID_QUANTITY);
        }

    }

    public getItem(): Produto | Servico {
        return this.item;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }

    public getPet(): Pet | undefined {
        return this.pet;
    }

    /**
     * Retorna o preço unitário do item.
     *
     * Quando o item foi reconstruído do banco,
     * utiliza o preço persistido.
     */
    public getPrecoUnitario(): number {

        if (this.precoUnitario !== undefined) {
            return this.precoUnitario;
        }

        if (this.item instanceof Produto) {
            return this.item.getPreco();
        }

        if (!this.pet) {
            throw new Error(ErrorMessages.SERVICE_REQUIRES_PET);
        }

        this.item.validarPet(this.pet);

        return this.item.calcularPreco(this.pet);

    }

    /**
     * Calcula o subtotal do item.
     */
    public getSubtotal(): number {

        return this.getPrecoUnitario() * this.quantidade;

    }

}