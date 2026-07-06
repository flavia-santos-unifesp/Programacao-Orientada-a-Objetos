import { prisma } from "../database/prisma";
import { ClienteMapper } from "../mappers/ClienteMapper";
import { CreateClienteDTO } from "../dto/CreateClienteDTO";
import { Cliente } from "../models/Cliente";
import { IRepository } from "../interfaces/IRepository";

export class ClienteRepository implements IRepository<Cliente, CreateClienteDTO> {

    /**
     * Cria um novo cliente.
     */
    public async create(dto: CreateClienteDTO): Promise<Cliente> {

        const data = ClienteMapper.fromCreateDTO(dto);

        const cliente = await prisma.cliente.create({
            data
        });

        return ClienteMapper.toDomain(cliente);

    }

    /**
     * Lista todos os clientes.
     */
    public async findAll(): Promise<Cliente[]> {

        const clientes = await prisma.cliente.findMany();

        return clientes.map(cliente =>
            ClienteMapper.toDomain(cliente)
        );

    }

    /**
     * Busca um cliente pelo ID.
     */
    public async findById(id: number): Promise<Cliente | null> {

        const cliente = await prisma.cliente.findUnique({
            where: {
                id
            }
        });

        if (!cliente) {
            return null;
        }

        return ClienteMapper.toDomain(cliente);

    }

}