export class Pet {
    constructor(
        private id: number,
        private nome: string,
        private especie: string,
        private raca: string,
        private idade: number
    ) {}

    public getNome(): string {
        return this.nome;
    }

    public getEspecie(): string {
        return this.especie;
    }

    public getId(): number {
        return this.id;
    }

}