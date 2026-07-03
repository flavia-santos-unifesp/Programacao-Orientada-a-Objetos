import { Pet } from "../Pet";
import { Servico } from "../Servico";
import { TipoServico } from "./TipoServico";

export class Consulta extends Servico {

    private static readonly PRECO = 120;
    private static readonly DURACAO = 30;

    constructor() {
        super(3, "Consulta Veterinária");
    }

    public getTipo(): TipoServico {
        return TipoServico.CONSULTA;
    }

    public calcularPreco(pet: Pet): number {
        return Consulta.PRECO;
    }

    public calcularDuracao(pet: Pet): number {
        return Consulta.DURACAO;
    }

    public validarPet(pet: Pet): void {
        // Todo pet pode realizar consulta.
    }

}