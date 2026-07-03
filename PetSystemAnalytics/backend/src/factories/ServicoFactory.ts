import { Servico } from "../models/Servico";

import { TipoServico } from "../models/service-types/TipoServico";

import { Banho } from "../models/service-types/Banho";
import { Tosa } from "../models/service-types/Tosa";
import { Consulta } from "../models/service-types/Consulta";
import { Hospedagem } from "../models/service-types/Hospedagem";

export class ServicoFactory {

    /**
     * Cria uma instância do serviço
     * correspondente ao tipo informado.
     */
    public static criar(tipo: TipoServico): Servico {

        switch (tipo) {

            case TipoServico.BANHO:
                return new Banho();

            case TipoServico.TOSA:
                return new Tosa();

            case TipoServico.CONSULTA:
                return new Consulta();

            case TipoServico.HOSPEDAGEM:
                return new Hospedagem();

            default:
                throw new Error("Tipo de serviço inválido.");

        }

    }

}