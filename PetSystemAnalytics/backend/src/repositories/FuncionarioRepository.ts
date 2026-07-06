import { prisma } from "../database/prisma";
import { CreateClienteDTO } from "../dto/CreateClienteDTO";
import { Funcionario } from "../models/Funcionario";
import { IRepository } from "../interfaces/IRepository";

export class FuncionarioRepository implements IRepository<Funcionario, CreateClienteDTO> {

    /**
     * Cria um novo funcionário.
     */
    public async create(dto: any): Promise<Funcionario> {

        const funcionario = await prisma.funcionario.create({
            data: {
                nome: dto.nome,
                telefone: dto.telefone,
                email: dto.email,
                cargo: dto.cargo
            }
        });

        return new Funcionario(
            funcionario.id,
            funcionario.nome,
            funcionario.telefone,
            funcionario.email,
            funcionario.cargo
        );

    }

    /**
     * Lista todos os funcionários.
     */
    public async findAll(): Promise<Funcionario[]> {

        const funcionarios = await prisma.funcionario.findMany();

        return funcionarios.map(f =>
            new Funcionario(f.id, f.nome, f.telefone, f.email, f.cargo)
        );

    }

    /**
     * Busca um funcionário pelo ID.
     */
    public async findById(id: number): Promise<Funcionario | null> {

        const funcionario = await prisma.funcionario.findUnique({
            where: { id }
        });

        if (!funcionario) {
            return null;
        }

        return new Funcionario(
            funcionario.id,
            funcionario.nome,
            funcionario.telefone,
            funcionario.email,
            funcionario.cargo
        );

    }

    /**
     * Busca funcionários pelo cargo.
     */
    public async findByCargo(cargo: string): Promise<Funcionario[]> {

        const funcionarios = await prisma.funcionario.findMany({
            where: { cargo }
        });

        return funcionarios.map(f =>
            new Funcionario(f.id, f.nome, f.telefone, f.email, f.cargo)
        );

    }
}
