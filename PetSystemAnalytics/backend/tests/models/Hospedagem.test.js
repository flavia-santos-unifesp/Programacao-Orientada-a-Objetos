"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Hospedagem_1 = require("../../src/models/service-types/Hospedagem");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
(0, vitest_1.describe)("Hospedagem", () => {
    const hospedagem = new Hospedagem_1.Hospedagem();
    (0, vitest_1.it)("deve cobrar R$80 para pets de pequeno porte", () => {
        const pet = new Pet_1.Pet(1, "Mia", Especie_1.Especie.GATO, "SRD", 2, 4, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(hospedagem.calcularPreco(pet)).toBe(80);
    });
    (0, vitest_1.it)("deve cobrar R$100 para pets de médio porte", () => {
        const pet = new Pet_1.Pet(2, "Bob", Especie_1.Especie.CACHORRO, "Border Collie", 4, 15, Porte_1.Porte.MEDIO);
        (0, vitest_1.expect)(hospedagem.calcularPreco(pet)).toBe(100);
    });
    (0, vitest_1.it)("deve cobrar R$140 para pets de grande porte", () => {
        const pet = new Pet_1.Pet(3, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 32, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(hospedagem.calcularPreco(pet)).toBe(140);
    });
    (0, vitest_1.it)("deve ter duração de 24 horas", () => {
        const pet = new Pet_1.Pet(4, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 32, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(hospedagem.calcularDuracao(pet)).toBe(1440);
    });
    (0, vitest_1.it)("deve permitir hospedagem para qualquer espécie", () => {
        const pet = new Pet_1.Pet(5, "Nemo", Especie_1.Especie.PEIXE, "Betta", 1, 0.5, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(() => hospedagem.validarPet(pet)).not.toThrow();
    });
});
//# sourceMappingURL=Hospedagem.test.js.map