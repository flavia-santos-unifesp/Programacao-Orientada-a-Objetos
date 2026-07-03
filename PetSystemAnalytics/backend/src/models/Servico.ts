import { Pet } from "./Pet";
import { TipoServico } from "./service-types/TipoServico";

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

    /**
     * Retorna o tipo do serviço.
     */
    public abstract getTipo(): TipoServico;

    public abstract calcularPreco(pet: Pet): number;

    public abstract calcularDuracao(pet: Pet): number;

    public abstract validarPet(pet: Pet): void;

}