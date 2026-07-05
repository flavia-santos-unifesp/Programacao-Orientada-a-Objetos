"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Cliente_1 = require("../../src/models/Cliente");
const Pet_1 = require("../../src/models/Pet");
const Especie_1 = require("../../src/models/Especie");
const Porte_1 = require("../../src/models/Porte");
const NivelFidelidade_1 = require("../../src/models/NivelFidelidade");
const RegrasFidelidade_1 = require("../../src/constants/RegrasFidelidade");
(0, vitest_1.describe)("Cliente", () => {
    (0, vitest_1.it)("deve retornar corretamente os dados herdados da classe Pessoa", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        (0, vitest_1.expect)(cliente.getId()).toBe(1);
        (0, vitest_1.expect)(cliente.getNome()).toBe("Flavia");
        (0, vitest_1.expect)(cliente.getTelefone()).toBe("11999999999");
        (0, vitest_1.expect)(cliente.getEmail()).toBe("flavia@email.com");
    });
    (0, vitest_1.it)("deve criar um cliente sem pets", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        (0, vitest_1.expect)(cliente.getPets()).toHaveLength(0);
    });
    (0, vitest_1.it)("deve adicionar um pet ao cliente", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        const pet = new Pet_1.Pet(1, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 30, Porte_1.Porte.GRANDE);
        cliente.adicionarPet(pet);
        const pets = cliente.getPets();
        (0, vitest_1.expect)(pets).toHaveLength(1);
        const primeiroPet = pets[0];
        (0, vitest_1.expect)(primeiroPet).toBeDefined();
        (0, vitest_1.expect)(primeiroPet.getNome()).toBe("Thor");
    });
    (0, vitest_1.it)("deve proteger a lista de pets contra alterações externas", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        const pet1 = new Pet_1.Pet(1, "Thor", Especie_1.Especie.CACHORRO, "Golden Retriever", 5, 30, Porte_1.Porte.GRANDE);
        const pet2 = new Pet_1.Pet(2, "Mia", Especie_1.Especie.GATO, "SRD", 2, 4, Porte_1.Porte.PEQUENO);
        cliente.adicionarPet(pet1);
        const pets = cliente.getPets();
        pets.push(pet2);
        (0, vitest_1.expect)(cliente.getPets()).toHaveLength(1);
    });
    (0, vitest_1.it)("deve iniciar com 0 pontos de fidelidade", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        (0, vitest_1.expect)(cliente.getPontosFidelidade()).toBe(0);
    });
    (0, vitest_1.it)("deve iniciar no nível Bronze", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.BRONZE);
    });
    (0, vitest_1.it)("deve registrar uma compra e acumular pontos", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        const pontos = cliente.registrarCompra(250);
        (0, vitest_1.expect)(pontos).toBe(250);
        (0, vitest_1.expect)(cliente.getPontosFidelidade()).toBe(250);
    });
    (0, vitest_1.it)("deve evoluir para o nível Prata", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
    });
    (0, vitest_1.it)("deve evoluir para o nível Ouro", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        (0, vitest_1.expect)(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade_1.NivelFidelidade.OURO);
    });
    (0, vitest_1.it)("deve aplicar corretamente o desconto", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        (0, vitest_1.expect)(cliente.aplicarDesconto(100))
            .toBe(95);
    });
    (0, vitest_1.it)("deve calcular corretamente o valor do desconto", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        (0, vitest_1.expect)(cliente.calcularValorDesconto(100))
            .toBe(10);
    });
    (0, vitest_1.it)("não deve adicionar pontos para compras inválidas", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(-100);
        (0, vitest_1.expect)(cliente.getPontosFidelidade()).toBe(0);
    });
    (0, vitest_1.it)("deve acumular pontos de compras diferentes", () => {
        const cliente = new Cliente_1.Cliente(1, "Flavia", "11999999999", "flavia@email.com");
        cliente.registrarCompra(200);
        cliente.registrarCompra(350);
        (0, vitest_1.expect)(cliente.getPontosFidelidade()).toBe(550);
        (0, vitest_1.expect)(cliente.getNivelFidelidade()).toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
    });
});
//# sourceMappingURL=Cliente.test.js.map