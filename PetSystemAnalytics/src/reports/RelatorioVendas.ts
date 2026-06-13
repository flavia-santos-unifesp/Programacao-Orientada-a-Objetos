import { Venda } from "../models/Venda";

export class RelatorioVendas {

    constructor(
        private vendas: Venda[]
    ) {}

    public gerar(): void {

        console.log("\n===== RELATÓRIO DE VENDAS =====");

        for (const venda of this.vendas) {

            console.log(`\nVenda #${venda.getId()}`);

            console.log(
                `Cliente: ${venda.getCliente().getNome()}`
            );

            console.log(
                `Data: ${venda.getData().toLocaleDateString()}`
            );

            console.log("Itens:");

            for (const item of venda.getItens()) {

                console.log(
                    `- ${item.getItem().getNome()} (${item.getQuantidade()}x) - R$${item.getSubtotal()}`
                );
            }

            console.log(
                `Total da Venda: R$${venda.calcularTotal()}`
            );

            console.log("--------------------------------");
        }
    }
}