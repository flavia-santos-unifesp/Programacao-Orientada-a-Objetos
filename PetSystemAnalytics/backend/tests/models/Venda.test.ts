import { describe, expect, it } from "vitest";

import { Cliente } from "../../src/models/Cliente";
import { Produto } from "../../src/models/Produto";
import { ItemVenda } from "../../src/models/ItemVenda";
import { Venda } from "../../src/models/Venda";
import { Banho } from "../../src/models/service-types/Banho";
import { Pet } from "../../src/models/Pet";
import { Especie } from "../../src/models/Especie";
import { Porte } from "../../src/models/Porte";
import { NivelFidelidade } from "../../src/models/NivelFidelidade";
import { RegrasFidelidade } from "../../src/constants/RegrasFidelidade";

describe("Venda", () => {

    function criarCliente(): Cliente {
        return new Cliente(
            1,
            "Flavia",
            "11999999999",
            "flavia@email.com"
        );
    }

    function criarPet(): Pet {
        return new Pet(
            1,
            "Thor",
            Especie.CACHORRO,
            "Golden Retriever",
            5,
            30,
            Porte.GRANDE
        );
    }

    function criarProduto(): Produto {
        return new Produto(
            1,
            "Ração",
            100,
            20
        );
    }

    it("deve criar uma venda sem itens", () => {

        const venda = new Venda(
            1,
            criarCliente(),
            new Date()
        );

        expect(venda.getItens()).toHaveLength(0);

    });

    it("deve adicionar um item à venda", () => {

        const venda = new Venda(
            1,
            criarCliente(),
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                2
            )
        );

        expect(venda.getItens()).toHaveLength(1);

    });

    it("deve calcular corretamente o subtotal", () => {

        const venda = new Venda(
            1,
            criarCliente(),
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                2
            )
        );

        expect(venda.calcularSubtotal())
            .toBe(200);

    });

    it("deve calcular corretamente o subtotal com produto e serviço", () => {

        const venda = new Venda(
            1,
            criarCliente(),
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                1
            )
        );

        venda.adicionarItem(
            new ItemVenda(
                new Banho(),
                1,
                criarPet()
            )
        );

        expect(venda.calcularSubtotal())
            .toBe(190);

    });

    it("não deve aplicar desconto para cliente Bronze", () => {

        const venda = new Venda(
            1,
            criarCliente(),
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                1
            )
        );

        expect(venda.calcularTotal())
            .toBe(100);

    });

    it("deve aplicar desconto para cliente Prata", () => {

        const cliente = criarCliente();

        cliente.registrarCompra(
            RegrasFidelidade.PONTOS_PRATA
        );

        const venda = new Venda(
            1,
            cliente,
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                1
            )
        );

        expect(venda.calcularTotal())
            .toBe(95);

    });

    it("deve aplicar desconto para cliente Ouro", () => {

        const cliente = criarCliente();

        cliente.registrarCompra(
            RegrasFidelidade.PONTOS_OURO
        );

        const venda = new Venda(
            1,
            cliente,
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                1
            )
        );

        expect(venda.calcularTotal())
            .toBe(90);

    });

    it("deve registrar pontos ao finalizar a venda", () => {

        const cliente = criarCliente();

        const venda = new Venda(
            1,
            cliente,
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                2
            )
        );

        venda.finalizarVenda();

        expect(cliente.getPontosFidelidade())
            .toBe(200);

    });

    it("deve atualizar o nível do cliente após finalizar a venda", () => {

        const cliente = criarCliente();

        const venda = new Venda(
            1,
            cliente,
            new Date()
        );

        venda.adicionarItem(
            new ItemVenda(
                criarProduto(),
                5
            )
        );

        venda.finalizarVenda();

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.PRATA);

    });

    it("deve acumular pontos em vendas diferentes", () => {

        const cliente = criarCliente();

        const venda1 = new Venda(
            1,
            cliente,
            new Date()
        );

        venda1.adicionarItem(
            new ItemVenda(
                criarProduto(),
                3
            )
        );

        venda1.finalizarVenda();

        const venda2 = new Venda(
            2,
            cliente,
            new Date()
        );

        venda2.adicionarItem(
            new ItemVenda(
                criarProduto(),
                3
            )
        );

        venda2.finalizarVenda();

        expect(cliente.getPontosFidelidade())
            .toBe(600);

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.PRATA);
        
    });

    it("deve aplicar desconto em compras após o cliente atingir o nível Prata", () => {

        const cliente = criarCliente();

        // Primeira venda: cliente atinge Prata
        const venda1 = new Venda(1, cliente, new Date());

        venda1.adicionarItem(
            new ItemVenda(
                criarProduto(),
                5 // R$500
            )
        );

        venda1.finalizarVenda();

        expect(cliente.getNivelFidelidade())
            .toBe(NivelFidelidade.PRATA);

        // Segunda venda
        const venda2 = new Venda(2, cliente, new Date());

        venda2.adicionarItem(
            new ItemVenda(
                criarProduto(),
                1 // R$100
            )
        );

        expect(venda2.calcularTotal()).toBe(95);

        venda2.finalizarVenda();

        expect(cliente.getPontosFidelidade()).toBe(595);

    });

});