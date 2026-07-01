import { describe, expect, it } from "vitest";

import { Hospedagem } from "../../src/models/service-types/Hospedagem";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

describe("Hospedagem", () => {

    const hospedagem = new Hospedagem();

    it("deve cobrar R$80 para pets de pequeno porte", () => {

        const pet = new Pet(
            1,
            "Mia",
            Especie.GATO,
            "SRD",
            2,
            4,
            Porte.PEQUENO
        );

        expect(hospedagem.calcularPreco(pet)).toBe(80);

    });

    it("deve cobrar R$100 para pets de médio porte", () => {

        const pet = new Pet(
            2,
            "Bob",
            Especie.CACHORRO,
            "Border Collie",
            4,
            15,
            Porte.MEDIO
        );

        expect(hospedagem.calcularPreco(pet)).toBe(100);

    });

    it("deve cobrar R$140 para pets de grande porte", () => {

        const pet = new Pet(
            3,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            32,
            Porte.GRANDE
        );

        expect(hospedagem.calcularPreco(pet)).toBe(140);

    });

    it("deve ter duração de 24 horas", () => {

        const pet = new Pet(
            4,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            32,
            Porte.GRANDE
        );

        expect(hospedagem.calcularDuracao(pet)).toBe(1440);

    });

    it("deve permitir hospedagem para qualquer espécie", () => {

        const pet = new Pet(
            5,
            "Nemo",
            Especie.PEIXE,
            "Betta",
            1,
            0.5,
            Porte.PEQUENO
        );

        expect(() => hospedagem.validarPet(pet)).not.toThrow();

    });

});