import { Servico } from "../models/Servico";

export class ServicoRepository {

    private servicos: Servico[] = [];

    public adicionar(servico: Servico): void {
        this.servicos.push(servico);
    }

    public listar(): Servico[] {
        return this.servicos;
    }
}