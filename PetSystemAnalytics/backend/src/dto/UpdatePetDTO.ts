import { Especie } from "../models/Especie";
import { Porte } from "../models/Porte";

export interface UpdatePetDTO {

    nome?: string;

    especie?: Especie;

    raca?: string;

    idade?: number;

    peso?: number;

    porte?: Porte;

}