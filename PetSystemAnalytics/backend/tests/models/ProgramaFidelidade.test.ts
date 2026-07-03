import { describe, expect, it } from "vitest";

import { ProgramaFidelidade } from "../../src/models/ProgramaFidelidade";
import { NivelFidelidade } from "../../src/models/NivelFidelidade";
import { RegrasFidelidade } from "../../src/constants/RegrasFidelidade";
import { ErrorMessages } from "../../src/constants/ErrorMessages";

describe("ProgramaFidelidade", () => {

    it("deve iniciar com 0 pontos e nível Bronze", () => {

        const programa = new ProgramaFidelidade();

        expect(programa.getPontos()).toBe(0);
        expect(programa.getNivel()).toBe(NivelFidelidade.BRONZE);

    });

    it("deve permanecer Bronze até atingir a pontuação mínima para Prata", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_PRATA - 1);

        expect(programa.getNivel()).toBe(NivelFidelidade.BRONZE);

    });

    it("deve evoluir para Prata ao atingir a pontuação mínima", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_PRATA);

        expect(programa.getNivel()).toBe(NivelFidelidade.PRATA);

    });

    it("deve evoluir para Ouro ao atingir a pontuação mínima", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_OURO);

        expect(programa.getNivel()).toBe(NivelFidelidade.OURO);

    });

    it("deve retornar 0% de desconto para clientes Bronze", () => {

        const programa = new ProgramaFidelidade();

        expect(programa.calcularDesconto())
            .toBe(RegrasFidelidade.DESCONTO_BRONZE);

    });

    it("deve retornar 5% de desconto para clientes Prata", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_PRATA);

        expect(programa.calcularDesconto())
            .toBe(RegrasFidelidade.DESCONTO_PRATA);

    });

    it("deve retornar 10% de desconto para clientes Ouro", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_OURO);

        expect(programa.calcularDesconto())
            .toBe(RegrasFidelidade.DESCONTO_OURO);

    });

    it("deve calcular corretamente o valor do desconto", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_OURO);

        expect(programa.calcularValorDesconto(100))
            .toBe(10);

    });

    it("deve aplicar corretamente o desconto ao valor da compra", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(RegrasFidelidade.PONTOS_PRATA);

        expect(programa.aplicarDesconto(100))
            .toBe(95);

    });

    it("deve retornar a quantidade de pontos gerados pela compra", () => {

        const programa = new ProgramaFidelidade();

        const pontos = programa.registrarCompra(199.90);

        expect(pontos).toBe(199);

    });

    it("deve armazenar corretamente os pontos gerados", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(199.90);

        expect(programa.getPontos()).toBe(199);

    });

    it("não deve adicionar pontos para compras com valor zero", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(0);

        expect(programa.getPontos()).toBe(0);

    });

    it("não deve adicionar pontos para compras com valor negativo", () => {

        const programa = new ProgramaFidelidade();

        programa.registrarCompra(-100);

        expect(programa.getPontos()).toBe(0);

    });

    it("deve lançar erro ao calcular desconto para valor negativo", () => {

        const programa = new ProgramaFidelidade();

        expect(() => programa.calcularValorDesconto(-10))
            .toThrow(ErrorMessages.INVALID_VALUE);

    });

    it("deve lançar erro ao aplicar desconto para valor negativo", () => {

        const programa = new ProgramaFidelidade();

        expect(() => programa.aplicarDesconto(-10))
            .toThrow(ErrorMessages.INVALID_VALUE);

    });

});