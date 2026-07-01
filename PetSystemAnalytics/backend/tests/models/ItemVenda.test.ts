import { describe, expect, it } from "vitest";

import { ItemVenda } from "../../src/models/ItemVenda";
import { Produto } from "../../src/models/Produto";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";

import { Banho } from "../../src/models/service-types/Banho";

describe("ItemVenda", () => {

    it("deve calcular corretamente o subtotal de um produto", () => {

        const produto = new Produto(
            1,
            "Ração Premium",
            100,
            10
        );

        const item = new ItemVenda(
            produto,
            2
        );

        expect(item.getSubtotal()).toBe(200);

    });

    it("deve calcular corretamente o subtotal de um serviço", () => {

        const banho = new Banho();

        const pet = new Pet(
            1,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            30,
            Porte.GRANDE
        );

        const item = new ItemVenda(
            banho,
            1,
            pet
        );

        expect(item.getSubtotal()).toBe(90);

    });

    it("deve lançar erro quando um serviço não possuir pet associado", () => {

        const banho = new Banho();

        const item = new ItemVenda(
            banho,
            1
        );

        expect(() => item.getSubtotal())
            .toThrow("Serviços devem estar associados a um pet.");

    });

    it("deve impedir banho em animais aquáticos", () => {

        const banho = new Banho();

        const pet = new Pet(
            2,
            "Nemo",
            Especie.PEIXE,
            "Betta",
            1,
            0.5,
            Porte.PEQUENO
        );

        const item = new ItemVenda(
            banho,
            1,
            pet
        );

        expect(() => item.getSubtotal())
            .toThrow("Nemo não pode receber banho por ser um animal aquático.");

    });

});