import { Cliente } from "../models/Cliente";

export class ClienteRepository {

    private clientes: Cliente[] = [];

    public adicionar(cliente: Cliente): void {
        this.clientes.push(cliente);
    }

    public listar(): Cliente[] {
        return this.clientes;
    }

    public buscarPorId(id: number): Cliente | undefined {
        return this.clientes.find(
            cliente => cliente.getId() === id
        );
    }
}