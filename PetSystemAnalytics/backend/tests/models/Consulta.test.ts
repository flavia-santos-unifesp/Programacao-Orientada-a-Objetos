import { describe, expect, it } from "vitest";

import { Consulta } from "../../src/models/service-types/Consulta";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

describe("Consulta", () => {

    const consulta = new Consulta();

    it("deve cobrar R$120 para qualquer pet", () => {

        const pet = new Pet(
            1,
            "Rex",
            Especie.CACHORRO,
            "Labrador",
            3,
            28,
            Porte.GRANDE
        );

        expect(consulta.calcularPreco(pet)).toBe(120);

    });

    it("deve durar 30 minutos", () => {

        const pet = new Pet(
            2,
            "Mia",
            Especie.GATO,
            "SRD",
            2,
            4,
            Porte.PEQUENO
        );

        expect(consulta.calcularDuracao(pet)).toBe(30);

    });

    it("deve permitir consulta para qualquer espécie", () => {

        const pet = new Pet(
            3,
            "Nemo",
            Especie.PEIXE,
            "Betta",
            1,
            0.5,
            Porte.PEQUENO
        );

        expect(() => consulta.validarPet(pet)).not.toThrow();

    });

});