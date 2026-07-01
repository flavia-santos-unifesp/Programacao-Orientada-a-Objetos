import { Pet } from "../Pet";
import { Porte } from "../Porte";
import { Servico } from "../Servico";
import { ErrorMessages } from "../../constants/ErrorMessages";

export class Hospedagem extends Servico {

    private static readonly DIARIA_PEQUENO = 80;
    private static readonly DIARIA_MEDIO = 100;
    private static readonly DIARIA_GRANDE = 140;

    private static readonly DURACAO = 1440;

    constructor() {
        super(4, "Hospedagem");
    }

    public calcularPreco(pet: Pet): number {

        switch (pet.getPorte()) {

            case Porte.PEQUENO:
                return Hospedagem.DIARIA_PEQUENO;

            case Porte.MEDIO:
                return Hospedagem.DIARIA_MEDIO;

            case Porte.GRANDE:
                return Hospedagem.DIARIA_GRANDE;
            
            default:
                throw new Error(ErrorMessages.INVALID_PORTE);
        }

    }

    public calcularDuracao(pet: Pet): number {
        return Hospedagem.DURACAO;
    }

    public validarPet(pet: Pet): void {
        // Todo pet pode ser hospedado.
    }

}