import { useEffect, useState } from "react";
import type { ProdutoResponse } from "../types";
import { fetchAPI } from "../services/api";

export function Produtos() {
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  useEffect(() => {
    fetchAPI<ProdutoResponse[]>("/produtos")
      .then(setProdutos)
      .catch(() => setError("Erro ao carregar produtos"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novo = await fetchAPI<ProdutoResponse>("/produtos", {
        method: "POST",
        body: JSON.stringify({ nome, preco: parseFloat(preco), estoque: parseInt(estoque) }),
      });
      setProdutos([...produtos, novo]);
      setNome("");
      setPreco("");
      setEstoque("");
      setError(null);
    } catch {
      setError("Erro ao adicionar produto");
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "1rem",
    color: "var(--text)",
    background: "var(--bg)",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "1.5rem", margin: 0 }}>Gestão de Produtos</h1>

      {error && <div style={{ color: "red", padding: "0.5rem" }}>{error}</div>}

      <form onSubmit={handleAddProduto} style={{ background: "var(--bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <h2 style={{ color: "var(--text-h)", marginBottom: "1rem", marginTop: 0, fontSize: "1.25rem" }}>Novo Produto</h2>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Ração Premium" required />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>Preço (R$)</label>
            <input type="number" step="0.01" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} placeholder="0,00" required />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>Estoque</label>
            <input type="number" min="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} style={inputStyle} placeholder="0" required />
          </div>
          <button type="submit" style={{ background: "var(--accent)", color: "white", padding: "0.75rem 1.5rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" }}>
            Adicionar
          </button>
        </div>
      </form>

      <div style={{ background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
        <h2 style={{ color: "var(--text-h)", padding: "1.5rem", borderBottom: "1px solid var(--border)", margin: 0, fontSize: "1.25rem" }}>Produtos Cadastrados</h2>
        {loading ? <p style={{ padding: "1rem" }}>Carregando...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--code-bg)" }}>
                <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Nome</th>
                <th style={{ padding: "1rem", textAlign: "right", color: "var(--text)" }}>Preço</th>
                <th style={{ padding: "1rem", textAlign: "center", color: "var(--text)" }}>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: "1rem", color: "var(--text)", textAlign: "center" }}>Nenhum produto cadastrado</td></tr>
              ) : produtos.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-bg)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "1rem", color: "var(--text)" }}>{p.nome}</td>
                  <td style={{ padding: "1rem", textAlign: "right", color: "var(--text)" }}>R$ {p.preco.toFixed(2)}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: "4px", fontWeight: "600",
                      background: p.estoque > 20 ? "#d1fae5" : p.estoque > 5 ? "#fef3c7" : "#fee2e2",
                      color: p.estoque > 20 ? "#065f46" : p.estoque > 5 ? "#92400e" : "#991b1b" }}>
                      {p.estoque}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
