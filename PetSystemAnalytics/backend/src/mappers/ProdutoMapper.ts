import type { Produto as PrismaProduto } from "@prisma/client";

import { CreateProdutoDTO } from "../dto/CreateProdutoDTO";
import { Produto } from "../models/Produto";

export class ProdutoMapper {

    /**
     * Converte um DTO em um objeto compatível com o Prisma.
     */
    public static fromCreateDTO(dto: CreateProdutoDTO) {

        return {

            nome: dto.nome,

            preco: dto.preco,

            estoque: dto.estoque

        };

    }

    /**
     * Converte um Produto do domínio em um objeto compatível
     * com o banco de dados.
     */
    public static toPersistence(produto: Produto) {

        return {

            id: produto.getId(),

            nome: produto.getNome(),

            preco: produto.getPreco(),

            estoque: produto.getEstoque()

        };

    }

    /**
     * Converte um registro do Prisma em um Produto do domínio.
     */
    public static toDomain(data: PrismaProduto): Produto {

        return new Produto(

            data.id,

            data.nome,

            data.preco,

            data.estoque

        );

    }

}