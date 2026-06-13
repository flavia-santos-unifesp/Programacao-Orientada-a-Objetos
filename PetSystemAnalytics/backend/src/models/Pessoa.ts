export abstract class Pessoa {
    constructor(
        protected id: number,
        protected nome: string,
        protected telefone: string,
        protected email: string
    ) {}

    public getId(): number {
        return this.id;
    }

    public getNome(): string {
        return this.nome;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public getEmail(): string {
        return this.email;
    }
}