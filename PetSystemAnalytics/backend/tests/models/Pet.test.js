"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
(0, vitest_1.describe)("Pet", () => {
    (0, vitest_1.it)("deve criar um cachorro corretamente", () => {
        const pet = new Pet_1.Pet(1, "Rex", Especie_1.Especie.CACHORRO, "Labrador", 2, 18, Porte_1.Porte.GRANDE);
        (0, vitest_1.expect)(pet.getNome()).toBe("Rex");
        (0, vitest_1.expect)(pet.ehCachorro()).toBe(true);
        (0, vitest_1.expect)(pet.ehFilhote()).toBe(false);
    });
});
//# sourceMappingURL=Pet.test.js.map