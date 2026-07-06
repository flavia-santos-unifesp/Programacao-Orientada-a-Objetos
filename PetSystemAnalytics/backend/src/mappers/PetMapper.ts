import type { Pet as PrismaPet } from "@prisma/client";
import {
    Especie as PrismaEspecie,
    Porte as PrismaPorte
} from "@prisma/client";

import { CreatePetDTO } from "../dto/CreatePetDTO";
import { Especie } from "../models/Especie";
import { Pet } from "../models/Pet";
import { Porte } from "../models/Porte";

export class PetMapper {

    /**
     * Converte um DTO para um objeto compatível com o Prisma.
     */
    public static fromCreateDTO(dto: CreatePetDTO) {

        return {

            nome: dto.nome,

            especie: dto.especie as PrismaEspecie,

            raca: dto.raca,

            idade: dto.idade,

            peso: dto.peso,

            porte: dto.porte as PrismaPorte,

            clienteId: dto.clienteId

        };

    }

    /**
     * Converte um Pet do domínio para um objeto compatível
     * com o Prisma.
     */
    public static toPersistence(pet: Pet) {

        return {

            id: pet.getId(),

            nome: pet.getNome(),

            especie: pet.getEspecie() as PrismaEspecie,

            raca: pet.getRaca(),

            idade: pet.getIdade(),

            peso: pet.getPeso(),

            porte: pet.getPorte() as PrismaPorte
            
        };

    }

    /**
     * Converte um registro do Prisma para um Pet do domínio.
     */
    public static toDomain(data: PrismaPet): Pet {

        return new Pet(

            data.id,

            data.nome,

            data.especie as Especie,

            data.raca,

            data.idade,

            data.peso,

            data.porte as Porte

        );

    }

}