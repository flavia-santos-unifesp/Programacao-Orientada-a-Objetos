import { Pet } from "../models/Pet";

export class PetRepository {

    private pets: Pet[] = [];

    public adicionar(pet: Pet): void {
        this.pets.push(pet);
    }

    public listar(): Pet[] {
        return this.pets;
    }
}