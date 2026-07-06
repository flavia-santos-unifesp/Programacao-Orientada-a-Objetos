import { prisma } from "../database/prisma";
import { CreatePetDTO } from "../dto/CreatePetDTO";
import { PetMapper } from "../mappers/PetMapper";
import { Pet } from "../models/Pet";
import { IRepository } from "../interfaces/IRepository";

export class PetRepository implements IRepository<Pet, CreatePetDTO> {

    /**
     * Cadastra um novo pet.
     */
    public async create(dto: CreatePetDTO): Promise<Pet> {

        const data = PetMapper.fromCreateDTO(dto);

        const pet = await prisma.pet.create({
            data
        });

        return PetMapper.toDomain(pet);

    }

    /**
     * Lista todos os pets.
     */
    public async findAll(): Promise<Pet[]> {

        const pets = await prisma.pet.findMany();

        return pets.map(pet =>
            PetMapper.toDomain(pet)
        );

    }

    /**
     * Busca um pet pelo ID.
     */
    public async findById(id: number): Promise<Pet | null> {

        const pet = await prisma.pet.findUnique({
            where: {
                id
            }
        });

        if (!pet) {
            return null;
        }

        return PetMapper.toDomain(pet);

    }

}