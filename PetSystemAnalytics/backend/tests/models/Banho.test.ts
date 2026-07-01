import { describe, expect, it } from "vitest";

import { Banho } from "../../src/models/service-types/Banho";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

describe("Banho", () => {

    const banho = new Banho();

    it("deve cobrar R$40 para pets até 5kg", () => {

        const pet = new Pet(
            1,
            "Bolt",
            Especie.CACHORRO,
            "Pinscher",
            2,
            4,
            Porte.PEQUENO
        );

        expect(banho.calcularPreco(pet)).toBe(40);

    });

    it("deve cobrar R$60 para pets entre 5kg e 15kg", () => {

        const pet = new Pet(
            2,
            "Bob",
            Especie.CACHORRO,
            "Border Collie",
            3,
            10,
            Porte.MEDIO
        );

        expect(banho.calcularPreco(pet)).toBe(60);

    });

    it("deve cobrar R$90 para pets acima de 15kg", () => {

        const pet = new Pet(
            3,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            30,
            Porte.GRANDE
        );

        expect(banho.calcularPreco(pet)).toBe(90);

    });

    it("deve calcular corretamente a duração do banho", () => {

        const pet = new Pet(
            4,
            "Luna",
            Especie.GATO,
            "SRD",
            2,
            3,
            Porte.PEQUENO
        );

        expect(banho.calcularDuracao(pet)).toBe(30);

    });

    it("deve impedir banho em animais aquáticos", () => {

        const pet = new Pet(
            5,
            "Nemo",
            Especie.PEIXE,
            "Betta",
            1,
            0.5,
            Porte.PEQUENO
        );

        expect(() => banho.validarPet(pet))
            .toThrow("Nemo não pode receber banho por ser um animal aquático.");

    });

});