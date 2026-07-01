import { Produto } from "./Produto";
import { Servico } from "./Servico";
import { Pet } from "./Pet";
import { ErrorMessages } from "../constants/ErrorMessages";

export class ItemVenda {

    constructor(
        private item: Produto | Servico,
        private quantidade: number,
        private pet?: Pet
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

    public getSubtotal(): number {

        if (this.item instanceof Produto) {
            return this.item.getPreco() * this.quantidade;
        }

        if (!this.pet) {
            throw new Error(ErrorMessages.SERVICE_REQUIRES_PET);
        }

        this.item.validarPet(this.pet);

        const precoServico = this.item.calcularPreco(this.pet);

        return precoServico * this.quantidade;
    }

}