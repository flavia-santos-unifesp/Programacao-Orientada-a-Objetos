import { describe, expect, it } from "vitest";

import { Tosa } from "../../src/models/service-types/Tosa";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

describe("Tosa", () => {

    const tosa = new Tosa();

    it("deve cobrar R$50 para cães de pequeno porte", () => {

        const pet = new Pet(
            1,
            "Bolt",
            Especie.CACHORRO,
            "Pinscher",
            2,
            4,
            Porte.PEQUENO
        );

        expect(tosa.calcularPreco(pet)).toBe(50);

    });

    it("deve cobrar R$80 para cães de médio porte", () => {

        const pet = new Pet(
            2,
            "Bob",
            Especie.CACHORRO,
            "Border Collie",
            4,
            15,
            Porte.MEDIO
        );

        expect(tosa.calcularPreco(pet)).toBe(80);

    });

    it("deve cobrar R$110 para cães de grande porte", () => {

        const pet = new Pet(
            3,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            32,
            Porte.GRANDE
        );

        expect(tosa.calcularPreco(pet)).toBe(110);

    });

    it("deve calcular corretamente a duração da tosa", () => {

        const pet = new Pet(
            4,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            32,
            Porte.GRANDE
        );

        expect(tosa.calcularDuracao(pet)).toBe(80);

    });

    it("deve impedir tosa em animais que não sejam cães", () => {

        const pet = new Pet(
            5,
            "Mia",
            Especie.GATO,
            "SRD",
            2,
            4,
            Porte.PEQUENO
        );

        expect(() => tosa.validarPet(pet))
            .toThrow("Mia não pode realizar tosa porque não é um cachorro.");

    });

});