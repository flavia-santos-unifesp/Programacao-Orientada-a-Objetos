"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Tosa_1 = require("../../src/models/service-types/Tosa");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
(0, vitest_1.describe)("Tosa", () => {
    const tosa = new Tosa_1.Tosa();
    (0, vitest_1.it)("deve cobrar R$50 para cães de pequeno porte", () => {
        const pet = new Pet_1.Pet(1, "Bolt", Especie_1.Especie.CACHORRO, "Pinscher", 2, 4, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(tosa.calcularPreco(pet)).toBe(50);
    });
    (0, vitest_1.it)("deve cobrar R$80 para cães de médio porte", () => {
        const pet = new Pet_1.Pet(2, "Bob", Especie_1.Especie.CACHORRO, "Border Collie", 4, 15, Porte_1.Porte.MEDIO);
        (0, vitest_1.expect)(tosa.calcularPreco(pet)).toBe(80);
    });
    (0, vitest_1.it)("deve cobrar R$110 para cães de grande porte", () => {
        const pet = new Pet_1.Pet(3, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 32, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(tosa.calcularPreco(pet)).toBe(110);
    });
    (0, vitest_1.it)("deve calcular corretamente a duração da tosa", () => {
        const pet = new Pet_1.Pet(4, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 32, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(tosa.calcularDuracao(pet)).toBe(80);
    });
    (0, vitest_1.it)("deve impedir tosa em animais que não sejam cães", () => {
        const pet = new Pet_1.Pet(5, "Mia", Especie_1.Especie.GATO, "SRD", 2, 4, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(() => tosa.validarPet(pet))
            .toThrow("Mia não pode realizar tosa porque não é um cachorro.");
    });
});
//# sourceMappingURL=Tosa.test.js.map