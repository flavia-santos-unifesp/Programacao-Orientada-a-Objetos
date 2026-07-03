import { Pet } from "../Pet";
import { Porte } from "../Porte";
import { Servico } from "../Servico";
import { TipoServico } from "./TipoServico";
import { ErrorMessages } from "../../constants/ErrorMessages";

export class Tosa extends Servico {

    private static readonly PRECO_PEQUENO = 50;
    private static readonly PRECO_MEDIO = 80;
    private static readonly PRECO_GRANDE = 110;

    private static readonly DURACAO_PEQUENO = 40;
    private static readonly DURACAO_MEDIO = 60;
    private static readonly DURACAO_GRANDE = 80;

    constructor() {
        super(2, "Tosa");
    }

    public getTipo(): TipoServico {
        return TipoServico.TOSA;
    }

    public calcularPreco(pet: Pet): number {

        switch (pet.getPorte()) {

            case Porte.PEQUENO:
                return Tosa.PRECO_PEQUENO;

            case Porte.MEDIO:
                return Tosa.PRECO_MEDIO;

            case Porte.GRANDE:
                return Tosa.PRECO_GRANDE;

            default:
                throw new Error(ErrorMessages.INVALID_PORTE);
        }

    }

    public calcularDuracao(pet: Pet): number {

        switch (pet.getPorte()) {

            case Porte.PEQUENO:
                return Tosa.DURACAO_PEQUENO;

            case Porte.MEDIO:
                return Tosa.DURACAO_MEDIO;

            case Porte.GRANDE:
                return Tosa.DURACAO_GRANDE;

            default:
                throw new Error(ErrorMessages.INVALID_PORTE);
        }

    }

    public validarPet(pet: Pet): void {

        if (!pet.ehCachorro()) {
            throw new Error(
                `${pet.getNome()} não pode realizar tosa porque não é um cachorro.`
            );
        }

    }

}