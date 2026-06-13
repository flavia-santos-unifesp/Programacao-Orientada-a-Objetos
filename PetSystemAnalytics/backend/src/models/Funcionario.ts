import { Pessoa } from "./Pessoa";

export class Funcionario extends Pessoa {
    constructor(
        id: number,
        nome: string,
        telefone: string,
        email: string,
        private cargo: string
    ) {
        super(id, nome, telefone, email);
    }

    public getCargo(): string {
        return this.cargo;
    }
}