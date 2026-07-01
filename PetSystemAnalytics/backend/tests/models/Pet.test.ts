import { describe, expect, it } from "vitest";

import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

describe("Pet", () => {

    it("deve criar um cachorro corretamente", () => {

        const pet = new Pet(
            1,
            "Rex",
            Especie.CACHORRO,
            "Labrador",
            2,
            18,
            Porte.GRANDE
        );

        expect(pet.getNome()).toBe("Rex");
        expect(pet.ehCachorro()).toBe(true);
        expect(pet.ehFilhote()).toBe(false);

    });

});