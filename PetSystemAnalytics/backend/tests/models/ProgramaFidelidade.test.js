"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ProgramaFidelidade_1 = require("../../src/models/ProgramaFidelidade");
const NivelFidelidade_1 = require("../../src/models/NivelFidelidade");
const RegrasFidelidade_1 = require("../../src/constants/RegrasFidelidade");
const ErrorMessages_1 = require("../../src/constants/ErrorMessages");
(0, vitest_1.describe)("ProgramaFidelidade", () => {
    (0, vitest_1.it)("deve iniciar com 0 pontos e nível Bronze", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        (0, vitest_1.expect)(programa.getPontos()).toBe(0);
        (0, vitest_1.expect)(programa.getNivel()).toBe(NivelFidelidade_1.NivelFidelidade.BRONZE);
    });
    (0, vitest_1.it)("deve permanecer Bronze até atingir a pontuação mínima para Prata", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA - 1);
        (0, vitest_1.expect)(programa.getNivel()).toBe(NivelFidelidade_1.NivelFidelidade.BRONZE);
    });
    (0, vitest_1.it)("deve evoluir para Prata ao atingir a pontuação mínima", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        (0, vitest_1.expect)(programa.getNivel()).toBe(NivelFidelidade_1.NivelFidelidade.PRATA);
    });
    (0, vitest_1.it)("deve evoluir para Ouro ao atingir a pontuação mínima", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        (0, vitest_1.expect)(programa.getNivel()).toBe(NivelFidelidade_1.NivelFidelidade.OURO);
    });
    (0, vitest_1.it)("deve retornar 0% de desconto para clientes Bronze", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        (0, vitest_1.expect)(programa.calcularDesconto())
            .toBe(RegrasFidelidade_1.RegrasFidelidade.DESCONTO_BRONZE);
    });
    (0, vitest_1.it)("deve retornar 5% de desconto para clientes Prata", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        (0, vitest_1.expect)(programa.calcularDesconto())
            .toBe(RegrasFidelidade_1.RegrasFidelidade.DESCONTO_PRATA);
    });
    (0, vitest_1.it)("deve retornar 10% de desconto para clientes Ouro", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        (0, vitest_1.expect)(programa.calcularDesconto())
            .toBe(RegrasFidelidade_1.RegrasFidelidade.DESCONTO_OURO);
    });
    (0, vitest_1.it)("deve calcular corretamente o valor do desconto", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_OURO);
        (0, vitest_1.expect)(programa.calcularValorDesconto(100))
            .toBe(10);
    });
    (0, vitest_1.it)("deve aplicar corretamente o desconto ao valor da compra", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(RegrasFidelidade_1.RegrasFidelidade.PONTOS_PRATA);
        (0, vitest_1.expect)(programa.aplicarDesconto(100))
            .toBe(95);
    });
    (0, vitest_1.it)("deve retornar a quantidade de pontos gerados pela compra", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        const pontos = programa.registrarCompra(199.90);
        (0, vitest_1.expect)(pontos).toBe(199);
    });
    (0, vitest_1.it)("deve armazenar corretamente os pontos gerados", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(199.90);
        (0, vitest_1.expect)(programa.getPontos()).toBe(199);
    });
    (0, vitest_1.it)("não deve adicionar pontos para compras com valor zero", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(0);
        (0, vitest_1.expect)(programa.getPontos()).toBe(0);
    });
    (0, vitest_1.it)("não deve adicionar pontos para compras com valor negativo", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        programa.registrarCompra(-100);
        (0, vitest_1.expect)(programa.getPontos()).toBe(0);
    });
    (0, vitest_1.it)("deve lançar erro ao calcular desconto para valor negativo", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        (0, vitest_1.expect)(() => programa.calcularValorDesconto(-10))
            .toThrow(ErrorMessages_1.ErrorMessages.INVALID_VALUE);
    });
    (0, vitest_1.it)("deve lançar erro ao aplicar desconto para valor negativo", () => {
        const programa = new ProgramaFidelidade_1.ProgramaFidelidade();
        (0, vitest_1.expect)(() => programa.aplicarDesconto(-10))
            .toThrow(ErrorMessages_1.ErrorMessages.INVALID_VALUE);
    });
});
//# sourceMappingURL=ProgramaFidelidade.test.js.map