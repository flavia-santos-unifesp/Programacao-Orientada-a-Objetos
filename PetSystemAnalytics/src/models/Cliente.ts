import { Pessoa } from "./Pessoa";
import { Pet } from "./Pet";

export class Cliente extends Pessoa {
    private pets: Pet[] = [];

    public getNome(): string {
    return this.nome;
}
    public adicionarPet(pet: Pet): void {
        this.pets.push(pet);
    }

    public getPets(): Pet[] {
        return this.pets;
    }
}