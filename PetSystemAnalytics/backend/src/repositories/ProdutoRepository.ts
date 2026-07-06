import { prisma } from "../database/prisma";
import { CreateProdutoDTO } from "../dto/CreateProdutoDTO";
import { ProdutoMapper } from "../mappers/ProdutoMapper";
import { Produto } from "../models/Produto";
import { IRepository } from "../interfaces/IRepository";

export class ProdutoRepository implements IRepository<Produto, CreateProdutoDTO> {

    /**
     * Cadastra um novo produto.
     */
    public async create(dto: CreateProdutoDTO): Promise<Produto> {

        const data = ProdutoMapper.fromCreateDTO(dto);

        const produto = await prisma.produto.create({
            data
        });

        return ProdutoMapper.toDomain(produto);

    }

    /**
     * Atualiza um produto existente.
     */
    public async update(produto: Produto): Promise<void> {

        const data = ProdutoMapper.toPersistence(produto);

        await prisma.produto.update({

            where: {
                id: produto.getId()
            },

            data: {

                nome: data.nome,

                preco: data.preco,

                estoque: data.estoque

            }

        });

    }

    /**
     * Lista todos os produtos.
     */
    public async findAll(): Promise<Produto[]> {

        const produtos = await prisma.produto.findMany();

        return produtos.map(produto =>
            ProdutoMapper.toDomain(produto)
        );

    }

    /**
     * Busca um produto pelo ID.
     */
    public async findById(id: number): Promise<Produto | null> {

        const produto = await prisma.produto.findUnique({
            where: {
                id
            }
        });

        if (!produto) {
            return null;
        }

        return ProdutoMapper.toDomain(produto);

    }

}