import { Especie } from "../models/Especie";
import { Porte } from "../models/Porte";

export interface CreatePetDTO {

    nome: string;

    especie: Especie;

    raca: string;

    idade: number;

    peso: number;

    porte: Porte;

    clienteId: number;

}