import { Pessoa } from "./Pessoa";
import { Pet } from "./Pet";
import { ProgramaFidelidade } from "./ProgramaFidelidade";
import { NivelFidelidade } from "./NivelFidelidade";

export class Cliente extends Pessoa {

    private pets: Pet[] = [];
    private programaFidelidade: ProgramaFidelidade;

    constructor(
        id: number,
        nome: string,
        telefone: string,
        email: string
    ) {
        super(id, nome, telefone, email);

        this.programaFidelidade = new ProgramaFidelidade();
    }

    public adicionarPet(pet: Pet): void {
        this.pets.push(pet);
    }

    public getPets(): Pet[] {
        return [...this.pets];
    }

    /**
     * Registra uma compra no programa de fidelidade.
     * Retorna a quantidade de pontos obtidos.
     */
    public registrarCompra(valorCompra: number): number {
        return this.programaFidelidade.registrarCompra(valorCompra);
    }

    /**
     * Retorna o valor final após aplicar o desconto.
     */
    public aplicarDesconto(valor: number): number {
        return this.programaFidelidade.aplicarDesconto(valor);
    }

    /**
     * Retorna apenas o valor descontado.
     */
    public calcularValorDesconto(valor: number): number {
        return this.programaFidelidade.calcularValorDesconto(valor);
    }

    public getPontosFidelidade(): number {
        return this.programaFidelidade.getPontos();
    }

    public getNivelFidelidade(): NivelFidelidade {
        return this.programaFidelidade.getNivel();
    }

    public getProgramaFidelidade(): ProgramaFidelidade {
        return this.programaFidelidade;
    }

}