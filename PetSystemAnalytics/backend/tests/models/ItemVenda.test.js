"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ItemVenda_1 = require("../../src/models/ItemVenda");
const Produto_1 = require("../../src/models/Produto");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
const Banho_1 = require("../../src/models/service-types/Banho");
(0, vitest_1.describe)("ItemVenda", () => {
    (0, vitest_1.it)("deve calcular corretamente o subtotal de um produto", () => {
        const produto = new Produto_1.Produto(1, "Ração Premium", 100, 10);
        const item = new ItemVenda_1.ItemVenda(produto, 2);
        (0, vitest_1.expect)(item.getSubtotal()).toBe(200);
    });
    (0, vitest_1.it)("deve calcular corretamente o subtotal de um serviço", () => {
        const banho = new Banho_1.Banho();
        const pet = new Pet_1.Pet(1, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 30, Porte_1.Porte.GRANDE);
        const item = new ItemVenda_1.ItemVenda(banho, 1, pet);
        (0, vitest_1.expect)(item.getSubtotal()).toBe(90);
    });
    (0, vitest_1.it)("deve lançar erro quando um serviço não possuir pet associado", () => {
        const banho = new Banho_1.Banho();
        const item = new ItemVenda_1.ItemVenda(banho, 1);
        (0, vitest_1.expect)(() => item.getSubtotal())
            .toThrow("Serviços devem estar associados a um pet.");
    });
    (0, vitest_1.it)("deve impedir banho em animais aquáticos", () => {
        const banho = new Banho_1.Banho();
        const pet = new Pet_1.Pet(2, "Nemo", Especie_1.Especie.PEIXE, "Betta", 1, 0.5, Porte_1.Porte.PEQUENO);
        const item = new ItemVenda_1.ItemVenda(banho, 1, pet);
        (0, vitest_1.expect)(() => item.getSubtotal())
            .toThrow("Nemo não pode receber banho por ser um animal aquático.");
    });
});
//# sourceMappingURL=ItemVenda.test.js.map