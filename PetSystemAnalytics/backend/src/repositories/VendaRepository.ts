import { TipoItem } from "@prisma/client";

import { prisma } from "../database/prisma";

import { Produto } from "../models/Produto";
import { Venda } from "../models/Venda";

export class VendaRepository {

    /**
     * Persiste uma venda e seus itens em uma transação.
     */
    public async create(
        venda: Venda
    ): Promise<Venda> {

        const vendaPersistida = await prisma.$transaction(async (tx) => {

            const vendaCriada = await tx.venda.create({

                data: {

                    data: venda.getData(),

                    subtotal: venda.calcularSubtotal(),

                    desconto: venda.calcularValorDesconto(),

                    total: venda.calcularTotal(),

                    clienteId: venda.getCliente().getId()

                }

            });

            for (const itemVenda of venda.getItens()) {

                const item = itemVenda.getItem();

                if (item instanceof Produto) {

                    await tx.itemVenda.create({

                        data: {

                            tipo: TipoItem.PRODUTO,

                            quantidade: itemVenda.getQuantidade(),

                            precoUnitario: itemVenda.getPrecoUnitario(),

                            vendaId: vendaCriada.id,

                            produtoId: item.getId()

                        }

                    });

                } else {

                    await tx.itemVenda.create({

                        data: {

                            tipo: TipoItem.SERVICO,

                            quantidade: itemVenda.getQuantidade(),

                            precoUnitario: itemVenda.getPrecoUnitario(),

                            vendaId: vendaCriada.id,

                            servico: item.getTipo(),

                            petId: itemVenda.getPet()!.getId()

                        }

                    });

                }

            }

            return vendaCriada;

        });

        venda.setId(vendaPersistida.id);

        console.log(
            "Venda persistida:",
            vendaPersistida.id
        );

        return venda;

    }

    /**
     * Busca uma venda pelo ID.
     */
    public async findById(
        id: number
    ): Promise<Venda | null> {

        throw new Error("Método não implementado.");

    }

    /**
     * Lista todas as vendas.
     */
    public async findAll(): Promise<Venda[]> {

        throw new Error("Método não implementado.");

    }

}