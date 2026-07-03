import { RegrasFidelidade } from "../constants/RegrasFidelidade";
import { ErrorMessages } from "../constants/ErrorMessages";
import { NivelFidelidade } from "./NivelFidelidade";

export class ProgramaFidelidade {

    private pontos: number;
    private nivel: NivelFidelidade;

    constructor() {
        this.pontos = 0;
        this.nivel = NivelFidelidade.BRONZE;
    }

    public getPontos(): number {
        return this.pontos;
    }

    public getNivel(): NivelFidelidade {
        return this.nivel;
    }

    /**
     * Restaura o estado persistido do programa de fidelidade.
     * Utilizado pelos mappers ao reconstruir entidades vindas do banco.
     */
    public restaurar(
        pontos: number,
        nivel: NivelFidelidade
    ): void {

        this.pontos = pontos;
        this.nivel = nivel;

    }

    /**
     * Registra uma compra no programa de fidelidade.
     * Regra atual: cada R$ 1,00 gasto gera 1 ponto.
     *
     * @returns quantidade de pontos gerados pela compra
     */
    public registrarCompra(valorCompra: number): number {

        if (valorCompra <= 0) {
            return 0;
        }

        const pontosGanhos = Math.floor(valorCompra);

        this.pontos += pontosGanhos;

        this.atualizarNivel();

        return pontosGanhos;

    }

    /**
     * Retorna o percentual de desconto do cliente.
     * Ex.: 0.05 representa 5%.
     */
    public calcularDesconto(): number {

        switch (this.nivel) {

            case NivelFidelidade.BRONZE:
                return RegrasFidelidade.DESCONTO_BRONZE;

            case NivelFidelidade.PRATA:
                return RegrasFidelidade.DESCONTO_PRATA;

            case NivelFidelidade.OURO:
                return RegrasFidelidade.DESCONTO_OURO;

            default:
                throw new Error(ErrorMessages.INVALID_LOYALTY_LEVEL);

        }

    }

    /**
     * Calcula quanto será descontado da compra.
     */
    public calcularValorDesconto(valor: number): number {

        if (valor < 0) {
            throw new Error(ErrorMessages.INVALID_VALUE);
        }

        return valor * this.calcularDesconto();

    }

    /**
     * Retorna o valor final da compra após aplicar o desconto.
     */
    public aplicarDesconto(valor: number): number {

        if (valor < 0) {
            throw new Error(ErrorMessages.INVALID_VALUE);
        }

        return valor - this.calcularValorDesconto(valor);

    }

    private atualizarNivel(): void {

        if (this.pontos >= RegrasFidelidade.PONTOS_OURO) {
            this.nivel = NivelFidelidade.OURO;
        }

        else if (this.pontos >= RegrasFidelidade.PONTOS_PRATA) {
            this.nivel = NivelFidelidade.PRATA;
        }

        else {
            this.nivel = NivelFidelidade.BRONZE;
        }

    }

}