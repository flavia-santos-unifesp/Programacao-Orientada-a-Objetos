import type { Cliente as PrismaCliente } from "@prisma/client";
import { NivelFidelidade as PrismaNivelFidelidade } from "@prisma/client";

import { CreateClienteDTO } from "../dto/CreateClienteDTO";
import { Cliente } from "../models/Cliente";
import { NivelFidelidade } from "../models/NivelFidelidade";

export class ClienteMapper {

    /**
     * Converte um DTO em um objeto compatível com o Prisma.
     */
    public static fromCreateDTO(dto: CreateClienteDTO) {

        return {

            nome: dto.nome,

            telefone: dto.telefone,

            email: dto.email,

            pontos: 0,

            nivel: PrismaNivelFidelidade.BRONZE

        };

    }

    /**
     * Converte um Cliente do domínio para um objeto compatível com o Prisma.
     */
    public static toPersistence(cliente: Cliente) {

        return {

            id: cliente.getId(),

            nome: cliente.getNome(),

            telefone: cliente.getTelefone(),

            email: cliente.getEmail(),

            pontos: cliente.getPontosFidelidade(),

            nivel: cliente.getNivelFidelidade() as PrismaNivelFidelidade

        };

    }

    /**
     * Converte um registro do Prisma em um objeto do domínio.
     */
    public static toDomain(data: PrismaCliente): Cliente {

        const cliente = new Cliente(
            data.id,
            data.nome,
            data.telefone,
            data.email
        );

        cliente.restaurarProgramaFidelidade(
            data.pontos,
            data.nivel as NivelFidelidade
        );

        return cliente;

    }

}