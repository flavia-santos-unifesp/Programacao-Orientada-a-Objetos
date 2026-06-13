import { VendaRepository } from "./repositories/VendaRepository";

import { VendaService } from "./services/VendaService";
import { KPIService } from "./services/KPIService";

import { RelatorioKPI } from "./reports/RelatorioKPI";
import { RelatorioVendas } from "./reports/RelatorioVendas";

import { Exportador } from "./interfaces/Exportador";
import { ExportadorCSV } from "./reports/ExportadorCSV";
import { ExportadorPDF } from "./reports/ExportadorPDF";

import { vendas, racao } from "./data/DadosMock";

// REPOSITORY

const vendaRepository =
    new VendaRepository();

// SERVICE

const vendaService =
    new VendaService(vendaRepository);

// REGISTRA VENDAS
console.log(`Estoque inicial da Ração: ${racao.getEstoque()}`);

for (const venda of vendas) {
    vendaService.registrarVenda(venda);
}

console.log(`Estoque final da Ração: ${racao.getEstoque()}`);

// KPI SERVICE

const kpiService =
    new KPIService(
        vendaRepository.listar()
    );

// RELATÓRIOS

const relatorioKPI =
    new RelatorioKPI(kpiService);

relatorioKPI.gerar();

const relatorioVendas =
    new RelatorioVendas(
        vendaRepository.listar()
    );

relatorioVendas.gerar();

// POLIMORFISMO

console.log("\n===== EXPORTAÇÃO =====");

const conteudoCSV =
`Indicador,Valor
Faturamento Total,${kpiService.calcularFaturamento()}
Ticket Médio,${kpiService.calcularTicketMedio()}
Quantidade de Vendas,${kpiService.quantidadeVendas()}
Produto Mais Vendido,${kpiService.produtoMaisVendido()}
Serviço Mais Utilizado,${kpiService.servicoMaisUtilizado()}
Cliente que Mais Gastou,${kpiService.clienteQueMaisGastou()}`;

const exportadores: Exportador[] = [
    new ExportadorCSV(),
    new ExportadorPDF()
];

for (const exportador of exportadores) {
    exportador.exportar(conteudoCSV);
}