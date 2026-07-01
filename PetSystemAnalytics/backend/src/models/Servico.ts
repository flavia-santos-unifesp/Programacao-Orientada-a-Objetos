import { Pet } from "./Pet";

export abstract class Servico {

    constructor(
        protected id: number,
        protected nome: string
    ) {}

    public getId(): number {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public abstract calcularPreco(pet: Pet): number;

    public abstract calcularDuracao(pet: Pet): number;

    public abstract validarPet(pet: Pet): void;
}