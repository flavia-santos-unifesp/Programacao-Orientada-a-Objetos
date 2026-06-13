import { KPIService } from "../services/KPIService";

export class RelatorioKPI {

    constructor(
        private kpiService: KPIService
    ) {}

    public gerar(): void {

        console.log("\n===== RELATÓRIO DE KPIs =====");

        console.log(
            "Faturamento Total: R$",
            this.kpiService.calcularFaturamento()
        );

        console.log(
            "Ticket Médio: R$",
            this.kpiService.calcularTicketMedio()
        );

        console.log(
            "Quantidade de Vendas:",
            this.kpiService.quantidadeVendas()
        );

        console.log(
            "Produto Mais Vendido:",
            this.kpiService.produtoMaisVendido()
        );

        console.log(
            "Serviço Mais Utilizado:",
            this.kpiService.servicoMaisUtilizado()
        );

        console.log(
            "Cliente que Mais Gastou:",
            this.kpiService.clienteQueMaisGastou()
        );
    }
}