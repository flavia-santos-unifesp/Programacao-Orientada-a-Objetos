import { useState } from "react";
import type { ProdutoResponse } from "../types";
import { mockProdutos } from "../data/mockData";

export function Produtos() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>(mockProdutos);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const handleAddProduto = (e: React.FormEvent) => {
    e.preventDefault();
    const novoProduto: ProdutoResponse = {
      id: Math.max(...produtos.map(p => p.id), 0) + 1,
      nome,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
    };
    setProdutos([...produtos, novoProduto]);
    setNome("");
    setPreco("");
    setEstoque("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Gestão de Produtos</h1>

      <form onSubmit={handleAddProduto} className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Novo Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Preço"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Adicionar Produto
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Produtos</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Preço</th>
              <th className="px-6 py-3 text-left">Estoque</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{produto.nome}</td>
                <td className="px-6 py-3">R$ {produto.preco.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded ${
                    produto.estoque > 20 ? "bg-green-200 text-green-800" :
                    produto.estoque > 5 ? "bg-yellow-200 text-yellow-800" :
                    "bg-red-200 text-red-800"
                  }`}>
                    {produto.estoque}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}