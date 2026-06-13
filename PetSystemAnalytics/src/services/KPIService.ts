import { Venda } from "../models/Venda";
import { Produto } from "../models/Produto";
import { Servico } from "../models/Servico";

export class KPIService {

    constructor(
        private vendas: Venda[]
    ) {}

    public calcularFaturamento(): number {

        let total = 0;

        for (const venda of this.vendas) {
            total += venda.calcularTotal();
        }

        return total;
    }

    public calcularTicketMedio(): number {

        if (this.vendas.length === 0) {
            return 0;
        }

        return this.calcularFaturamento() /
               this.vendas.length;
    }

    public quantidadeVendas(): number {

        return this.vendas.length;
    }

    public produtoMaisVendido(): string {

        const contagem = new Map<string, number>();

        for (const venda of this.vendas) {

            for (const itemVenda of venda.getItens()) {

                const item = itemVenda.getItem();

                if (item instanceof Produto) {

                    const nome = item.getNome();

                    contagem.set(
                        nome,
                        (contagem.get(nome) || 0)
                        + itemVenda.getQuantidade()
                    );
                }
            }
        }

        let produtoMaisVendido = "";
        let maiorQuantidade = 0;

        for (const [nome, quantidade] of contagem) {

            if (quantidade > maiorQuantidade) {

                maiorQuantidade = quantidade;
                produtoMaisVendido = nome;
            }
        }

        return produtoMaisVendido;
    }

    public servicoMaisUtilizado(): string {

        const contagem = new Map<string, number>();

        for (const venda of this.vendas) {

            for (const itemVenda of venda.getItens()) {

                const item = itemVenda.getItem();

                if (item instanceof Servico) {

                    const nome = item.getNome();

                    contagem.set(
                        nome,
                        (contagem.get(nome) || 0)
                        + itemVenda.getQuantidade()
                    );
                }
            }
        }

        let servicoMaisUtilizado = "";
        let maiorQuantidade = 0;

        for (const [nome, quantidade] of contagem) {

            if (quantidade > maiorQuantidade) {

                maiorQuantidade = quantidade;
                servicoMaisUtilizado = nome;
            }
        }

        return servicoMaisUtilizado;
    }

    public clienteQueMaisGastou(): string {

        const gastos = new Map<string, number>();

        for (const venda of this.vendas) {

            const nomeCliente =
                venda.getCliente().getNome();

            gastos.set(
                nomeCliente,
                (gastos.get(nomeCliente) || 0)
                + venda.calcularTotal()
            );
        }

        let melhorCliente = "";
        let maiorGasto = 0;

        for (const [nome, gasto] of gastos) {

            if (gasto > maiorGasto) {

                maiorGasto = gasto;
                melhorCliente = nome;
            }
        }

        return melhorCliente;
    }
}