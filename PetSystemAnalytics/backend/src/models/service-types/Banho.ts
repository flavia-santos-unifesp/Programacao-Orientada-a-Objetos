import { Pet } from "../Pet";
import { Servico } from "../Servico";

export class Banho extends Servico {

    private static readonly PRECO_PEQUENO = 40;
    private static readonly PRECO_MEDIO = 60;
    private static readonly PRECO_GRANDE = 90;

    private static readonly DURACAO_PEQUENO = 30;
    private static readonly DURACAO_MEDIO = 45;
    private static readonly DURACAO_GRANDE = 60;

    constructor() {
        super(1, "Banho");
    }

    public calcularPreco(pet: Pet): number {

        const peso = pet.getPeso();

        if (peso <= 5) {
            return Banho.PRECO_PEQUENO;
        }

        if (peso <= 15) {
            return Banho.PRECO_MEDIO;
        }

        return Banho.PRECO_GRANDE;
    }

    public calcularDuracao(pet: Pet): number {

        const peso = pet.getPeso();

        if (peso <= 5) {
            return Banho.DURACAO_PEQUENO;
        }

        if (peso <= 15) {
            return Banho.DURACAO_MEDIO;
        }

        return Banho.DURACAO_GRANDE;
    }

    public validarPet(pet: Pet): void {

        if (pet.ehAquatico()) {
            throw new Error(
                `${pet.getNome()} não pode receber banho por ser um animal aquático.`
            );
        }

    }

}