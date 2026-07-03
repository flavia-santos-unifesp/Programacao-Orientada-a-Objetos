import { CreateVendaDTO } from "../dto/CreateVendaDTO";

import { Venda } from "../models/Venda";
import { ItemVenda } from "../models/ItemVenda";

import { ServicoFactory } from "../factories/ServicoFactory";

import { VendaRepository } from "../repositories/VendaRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { ProdutoRepository } from "../repositories/ProdutoRepository";
import { PetRepository } from "../repositories/PetRepository";

export class VendaService {

    constructor(
        private vendaRepository: VendaRepository,
        private clienteRepository: ClienteRepository,
        private produtoRepository: ProdutoRepository,
        private petRepository: PetRepository
    ) {}

    public async registrarVenda(
        dto: CreateVendaDTO
    ): Promise<Venda> {

        // Busca o cliente
        const cliente = await this.clienteRepository.findById(
            dto.clienteId
        );

        if (!cliente) {
            throw new Error("Cliente não encontrado.");
        }

        // Cria a venda
        const venda = new Venda(
            0,
            cliente,
            new Date()
        );

        // Processa os itens
        for (const itemDTO of dto.itens) {

            // Produto
            if (itemDTO.produtoId !== undefined) {

                const produto =
                    await this.produtoRepository.findById(
                        itemDTO.produtoId
                    );

                if (!produto) {
                    throw new Error("Produto não encontrado.");
                }

                // Regra de negócio:
                // reduz o estoque antes da venda
                produto.reduzirEstoque(
                    itemDTO.quantidade
                );

                await this.produtoRepository.update(
                    produto
                );

                const itemVenda = new ItemVenda(
                    produto,
                    itemDTO.quantidade
                );

                venda.adicionarItem(itemVenda);

                continue;
            }

            // Serviço
            if (itemDTO.servico !== undefined) {

                if (itemDTO.petId === undefined) {
                    throw new Error("Pet não informado.");
                }

                const pet =
                    await this.petRepository.findById(
                        itemDTO.petId
                    );

                if (!pet) {
                    throw new Error("Pet não encontrado.");
                }

                const servico =
                    ServicoFactory.criar(itemDTO.servico);

                const itemVenda = new ItemVenda(
                    servico,
                    itemDTO.quantidade,
                    pet
                );

                venda.adicionarItem(itemVenda);

            }

        }

        // Calcula totais e registra a compra
        venda.finalizarVenda();

        // Persiste a venda
        return await this.vendaRepository.create(venda);

    }

}