import { describe, expect, it } from "vitest";

import { Cliente } from "../../src/models/Cliente";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";
import { NivelFidelidade } from "../../src/models/NivelFidelidade";
import { RegrasFidelidade } from "../../src/constants/RegrasFidelidade";

describe("Cliente", () => {

    it("deve retornar corretamente os dados herdados da classe Pessoa", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        expect(cliente.getId()).toBe(1);
        expect(cliente.getNome()).toBe("Flavia");
        expect(cliente.getTelefone()).toBe("11999999999");
        expect(cliente.getEmail()).toBe("flavia@email.com");

    });

    it("deve criar um cliente sem pets", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        expect(cliente.getPets()).toHaveLength(0);

    });

    it("deve adicionar um pet ao cliente", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        const pet = new Pet(
            1,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            30,
            Porte.GRANDE
        );

        cliente.adicionarPet(pet);

        const pets = cliente.getPets();

        expect(pets).toHaveLength(1);

        const primeiroPet = pets[0];

        expect(primeiroPet).toBeDefined();
        expect(primeiroPet!.getNome()).toBe("Thor");

    });

    it("deve proteger a lista de pets contra alterações externas", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        const pet1 = new Pet(
            1,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            30,
            Porte.GRANDE
        );

        const pet2 = new Pet(
            2,
            "Mia",
            Especie.GATO,
            "SRD",
            2,
            4,
            Porte.PEQUENO
        );

        cliente.adicionarPet(pet1);

        const pets = cliente.getPets();

        pets.push(pet2);

        expect(cliente.getPets()).toHaveLength(1);

    });

    it("deve iniciar com 0 pontos de fidelidade", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        expect(cliente.getPontosFidelidade()).toBe(0);

    });

    it("deve iniciar no nível Bronze", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.BRONZE);

    });

    it("deve registrar uma compra e acumular pontos", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        const pontos = cliente.registrarCompra(250);

        expect(pontos).toBe(250);
        expect(cliente.getPontosFidelidade()).toBe(250);

    });

    it("deve evoluir para o nível Prata", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(RegrasFidelidade.PONTOS_PRATA);

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.PRATA);

    });

    it("deve evoluir para o nível Ouro", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(RegrasFidelidade.PONTOS_OURO);

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.OURO);

    });

    it("deve aplicar corretamente o desconto", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(RegrasFidelidade.PONTOS_PRATA);

        expect(cliente.aplicarDesconto(100))
            .toBe(95);

    });

    it("deve calcular corretamente o valor do desconto", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(RegrasFidelidade.PONTOS_OURO);

        expect(cliente.calcularValorDesconto(100))
            .toBe(10);

    });

    it("não deve adicionar pontos para compras inválidas", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(-100);

        expect(cliente.getPontosFidelidade()).toBe(0);

    });

    it("deve acumular pontos de compras diferentes", () => {

        const cliente = new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );

        cliente.registrarCompra(200);
        cliente.registrarCompra(350);

        expect(cliente.getPontosFidelidade()).toBe(550);
        expect(cliente.getNivelFidelidade()).toBe(NivelFidelidade.PRATA);

    });

});