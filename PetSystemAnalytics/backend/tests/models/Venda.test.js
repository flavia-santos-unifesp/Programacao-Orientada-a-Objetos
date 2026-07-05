"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Cliente_1 = require("../../src/models/Cliente");
const Produto_1 = require("../../src/models/Produto");
const ItemVenda_1 = require("../../src/models/ItemVenda");
const Venda_1 = require("../../src/models/Venda");
const Banho_1 = require("../../src/models/service-types/Banho");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
const NivelFidelidade_1 = require("../../src/models/NivelFidelidade");
const RegrasFidelidade_1 = require("../../src/constants/RegrasFidelidade");
(0, vitest_1.describe)("Venda", () => {
    function criarCliente() {
        return new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
    }
    function criarPet() {
        return new Pet_1.Pet(1, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 30, Porte_1.Porte.GRANDE);
    }
    function criarProduto() {
        return new Produto_1.Produto(1, "Ração", 100, 20);
    }
    (0, vitest_1.it)("deve criar uma venda sem itens", () => {
        const venda = new Venda_1.Venda(1, criarCliente(), new Date());
        (0, vitest_1.expect)(venda.getItens()).toHaveLength(0);
    });
    (0, vitest_1.it)("deve adicionar um item à venda", () => {
        const venda = new Venda_1.Venda(1, criarCliente(), new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 2));
        (0, vitest_1.expect)(venda.getItens()).toHaveLength(1);
    });
    (0, vitest_1.it)("deve calcular corretamente o subtotal", () => {
        const venda = new Venda_1.Venda(1, criarCliente(), new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 2));
        (0, vitest_1.expect)(venda.calcularSubtotal())
            .toBe(200);
    });
    (0, vitest_1.it)("deve calcular corretamente o subtotal com produto e serviço", () => {
        const venda = new Venda_1.Venda(1, criarCliente(), new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 1));
        venda.adicionarItem(new ItemVenda_1.ItemVenda(new Banho_1.Banho(), 1, criarPet()));
        (0, vitest_1.expect)(venda.calcularSubtotal())
            .toBe(190);
    });
    (0, vitest_1.it)("não deve aplicar desconto para cliente Bronze", () => {
        const venda = new Venda_1.Venda(1, criarCliente(), new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 1));
        (0, vitest_1.expect)(venda.calcularTotal())
            .toBe(100);
    });
    (0, vitest_1.it)("deve aplicar desconto para cliente Prata", () => {
        const cliente = criarCliente();
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        const venda = new Venda_1.Venda(1, cliente, new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 1));
        (0, vitest_1.expect)(venda.calcularTotal())
            .toBe(95);
    });
    (0, vitest_1.it)("deve aplicar desconto para cliente Ouro", () => {
        const cliente = criarCliente();
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        const venda = new Venda_1.Venda(1, cliente, new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 1));
        (0, vitest_1.expect)(venda.calcularTotal())
            .toBe(90);
    });
    (0, vitest_1.it)("deve registrar pontos ao finalizar a venda", () => {
        const cliente = criarCliente();
        const venda = new Venda_1.Venda(1, cliente, new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 2));
        venda.finalizarVenda();
        (0, vitest_1.expect)(cliente.getPontosFidelidade())
            .toBe(200);
    });
    (0, vitest_1.it)("deve atualizar o nível do cliente após finalizar a venda", () => {
        const cliente = criarCliente();
        const venda = new Venda_1.Venda(1, cliente, new Date());
        venda.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 5));
        venda.finalizarVenda();
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
    });
    (0, vitest_1.it)("deve acumular pontos em vendas diferentes", () => {
        const cliente = criarCliente();
        const venda1 = new Venda_1.Venda(1, cliente, new Date());
        venda1.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 3));
        venda1.finalizarVenda();
        const venda2 = new Venda_1.Venda(2, cliente, new Date());
        venda2.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 3));
        venda2.finalizarVenda();
        (0, vitest_1.expect)(cliente.getPontosFidelidade())
            .toBe(600);
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
    });
    (0, vitest_1.it)("deve aplicar desconto em compras após o cliente atingir o nível Prata", () => {
        const cliente = criarCliente();
        // Primeira venda: cliente atinge Prata
        const venda1 = new Venda_1.Venda(1, cliente, new Date());
        venda1.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 5 // R$500
        ));
        venda1.finalizarVenda();
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
        // Segunda venda
        const venda2 = new Venda_1.Venda(2, cliente, new Date());
        venda2.adicionarItem(new ItemVenda_1.ItemVenda(criarProduto(), 1 // R$100
        ));
        (0, vitest_1.expect)(venda2.calcularTotal()).toBe(95);
        venda2.finalizarVenda();
        (0, vitest_1.expect)(cliente.getPontosFidelidade()).toBe(595);
    });
});
//# sourceMappingURL=Venda.test.js.map