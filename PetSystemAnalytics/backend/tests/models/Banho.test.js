"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Banho_1 = require("../../src/models/service-types/Banho");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
(0, vitest_1.describe)("Banho", () => {
    const banho = new Banho_1.Banho();
    (0, vitest_1.it)("deve cobrar R$40 para pets até 5kg", () => {
        const pet = new Pet_1.Pet(1, "Bolt", Especie_1.Especie.CACHORRO, "Pinscher", 2, 4, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(banho.calcularPreco(pet)).toBe(40);
    });
    (0, vitest_1.it)("deve cobrar R$60 para pets entre 5kg e 15kg", () => {
        const pet = new Pet_1.Pet(2, "Bob", Especie_1.Especie.CACHORRO, "Border Collie", 3, 10, Porte_1.Porte.MEDIO);
        (0, vitest_1.expect)(banho.calcularPreco(pet)).toBe(60);
    });
    (0, vitest_1.it)("deve cobrar R$90 para pets acima de 15kg", () => {
        const pet = new Pet_1.Pet(3, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 30, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(banho.calcularPreco(pet)).toBe(90);
    });
    (0, vitest_1.it)("deve calcular corretamente a duração do banho", () => {
        const pet = new Pet_1.Pet(4, "Luna", Especie_1.Especie.GATO, "SRD", 2, 3, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(banho.calcularDuracao(pet)).toBe(30);
    });
    (0, vitest_1.it)("deve impedir banho em animais aquáticos", () => {
        const pet = new Pet_1.Pet(5, "Nemo", Especie_1.Especie.PEIXE, "Betta", 1, 0.5, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(() => banho.validarPet(pet))
            .toThrow("Nemo não pode receber banho por ser um animal aquático.");
    });
});
//# sourceMappingURL=Banho.test.js.map