import { Especie } from "./Especie";
import { Porte } from "./Porte";

export class Pet {
    constructor(
        private id: number,
        private nome: string,
        private especie: Especie,
        private raca: string,
        private idade: number,
        private peso: number,
        private porte: Porte
    ) {
        if (idade < 0) {
            throw new Error("A idade do pet não pode ser negativa.");
        }

        if (peso <= 0) {
            throw new Error("O peso do pet deve ser maior que zero.");
        }

        if (!nome.trim()) {
            throw new Error("O nome do pet é obrigatório.");
        }
    }

    // Getters

    public getId(): number {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public getEspecie(): Especie {
        return this.especie;
    }

    public getRaca(): string {
        return this.raca;
    }

    public getIdade(): number {
        return this.idade;
    }

    public getPeso(): number {
        return this.peso;
    }

    public getPorte(): Porte {
        return this.porte;
    }

    // Comportamentos do domínio

    public ehFilhote(): boolean {
        return this.idade < 1;
    }

    public ehIdoso(): boolean {
        return this.idade >= 10;
    }

    public ehGrandePorte(): boolean {
        return this.porte === Porte.GRANDE;
    }

    public ehAquatico(): boolean {
        return this.especie === Especie.PEIXE;
    }

    public ehCachorro(): boolean {
        return this.especie === Especie.CACHORRO;
    }

    public ehGato(): boolean {
        return this.especie === Especie.GATO;
    }
}