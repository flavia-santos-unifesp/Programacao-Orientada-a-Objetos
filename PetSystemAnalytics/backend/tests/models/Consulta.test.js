"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Consulta_1 = require("../../src/models/service-types/Consulta");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
(0, vitest_1.describe)("Consulta", () => {
    const consulta = new Consulta_1.Consulta();
    (0, vitest_1.it)("deve cobrar R$120 para qualquer pet", () => {
        const pet = new Pet_1.Pet(1, "Rex", Especie_1.Especie.CACHORRO, "Labrador", 3, 28, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(consulta.calcularPreco(pet)).toBe(120);
    });
    (0, vitest_1.it)("deve durar 30 minutos", () => {
        const pet = new Pet_1.Pet(2, "Mia", Especie_1.Especie.GATO, "SRD", 2, 4, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(consulta.calcularDuracao(pet)).toBe(30);
    });
    (0, vitest_1.it)("deve permitir consulta para qualquer espécie", () => {
        const pet = new Pet_1.Pet(3, "Nemo", Especie_1.Especie.PEIXE, "Betta", 1, 0.5, Porte_1.Porte.PEQUENO);
        (0, vitest_1.expect)(() => consulta.validarPet(pet)).not.toThrow();
    });
});
//# sourceMappingURL=Consulta.test.js.map