import { useEffect, useState } from "react";
import type { ClienteResponse, ProdutoResponse } from "../types";
import { fetchAPI } from "../services/api";

interface ItemForm {
  tipo: "PRODUTO";
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

interface VendaFormData {
  clienteId: number;
  itens: ItemForm[];
}

interface VendaFormProps {
  onSubmit: (data: VendaFormData) => void;
}

export function VendaForm({ onSubmit }: VendaFormProps) {
  const [clienteId, setClienteId] = useState<string>("");
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [itens, setItens] = useState<ItemForm[]>([]);
  const [produtoId, setProdutoId] = useState<string>("");
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(0);

  useEffect(() => {
    fetchAPI<ClienteResponse[]>("/clientes").then(setClientes).catch(console.error);
    fetchAPI<ProdutoResponse[]>("/produtos").then(setProdutos).catch(console.error);
  }, []);

  const clienteSelecionado = clientes.find((c) => c.id === parseInt(clienteId));
  const descontoMap: Record<string, number> = { BRONZE: 0, PRATA: 5, OURO: 10 };
  const desconto = descontoMap[clienteSelecionado?.nivelFidelidade ?? "BRONZE"] ?? 0;
  const subtotal = itens.reduce((acc, i) => acc + i.precoUnitario * i.quantidade, 0);
  const totalDesconto = subtotal * (desconto / 100);
  const total = subtotal - totalDesconto;

  const handleProdutoChange = (id: string) => {
    setProdutoId(id);
    const p = produtos.find((p) => p.id === parseInt(id));
    if (p) setPrecoUnitario(p.preco);
  };

  const adicionarItem = () => {
    if (!produtoId) { alert("Selecione um produto"); return; }
    if (precoUnitario <= 0) { alert("Preço inválido"); return; }

    const novoItem: ItemForm = {
      tipo: "PRODUTO",
      produtoId: parseInt(produtoId),
      quantidade,
      precoUnitario,
    };

    setItens([...itens, novoItem]);
    setProdutoId("");
    setQuantidade(1);
    setPrecoUnitario(0);
  };

  const removerItem = (idx: number) => setItens(itens.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) { alert("Selecione um cliente"); return; }
    if (itens.length === 0) { alert("Adicione pelo menos um item"); return; }
    onSubmit({ clienteId: parseInt(clienteId), itens });
    setClienteId("");
    setItens([]);
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "0.95rem",
    color: "var(--text)",
    background: "var(--bg)",
  };



  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--bg)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ color: "var(--text-h)", margin: 0 }}>Registrar Venda</h2>

      {/* Cliente */}
      <div>
        <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>Cliente</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={{ ...inputStyle, width: "100%" }} required>
          <option value="">Selecione um cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} — {c.nivelFidelidade} ({c.pontosFidelidade} pts)</option>
          ))}
        </select>
        {clienteSelecionado && desconto > 0 && (
          <p style={{ color: "green", fontSize: "0.85rem", margin: "0.3rem 0 0" }}>
            ✅ Desconto de {desconto}% por nível {clienteSelecionado.nivelFidelidade}
          </p>
        )}
      </div>

      {/* Adicionar item de produto */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "1rem" }}>
        <h3 style={{ color: "var(--text-h)", margin: "0 0 0.75rem" }}>Adicionar Produto</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Tipo</label>
            <input value="PRODUTO" disabled style={{ ...inputStyle, width: "100%", opacity: 0.8 }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Produto</label>
            <select value={produtoId} onChange={(e) => handleProdutoChange(e.target.value)} style={inputStyle}>
              <option value="">Selecione...</option>
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} (R$ {p.preco.toFixed(2)})</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Qtd</label>
            <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} style={{ ...inputStyle, width: "60px" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Preço Unit.</label>
            <input type="number" min="0" step="0.01" value={precoUnitario} onChange={(e) => setPrecoUnitario(parseFloat(e.target.value))} style={{ ...inputStyle, width: "100%" }} />
          </div>
          <button type="button" onClick={adicionarItem} style={{ background: "var(--accent)", color: "white", padding: "0.6rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>
            + Adicionar
          </button>
        </div>
      </div>

      {/* Lista de itens */}
      {itens.length > 0 && (
        <div>
          <h3 style={{ color: "var(--text-h)", margin: "0 0 0.5rem" }}>Itens da Venda</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "var(--code-bg)" }}>
                <th style={{ padding: "0.5rem", textAlign: "left", color: "var(--text)" }}>Tipo</th>
                <th style={{ padding: "0.5rem", textAlign: "left", color: "var(--text)" }}>Item</th>
                <th style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>Qtd</th>
                <th style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>Preço Unit.</th>
                <th style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>Subtotal</th>
                <th style={{ padding: "0.5rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => {
                const nomeItem = produtos.find((p) => p.id === item.produtoId)?.nome ?? "Produto";
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.5rem", color: "var(--text)" }}>{item.tipo}</td>
                    <td style={{ padding: "0.5rem", color: "var(--text)" }}>{nomeItem}</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>{item.quantidade}</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>R$ {item.precoUnitario.toFixed(2)}</td>
                    <td style={{ padding: "0.5rem", textAlign: "right", color: "var(--text)" }}>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      <button type="button" onClick={() => removerItem(idx)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontWeight: "bold" }}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totais */}
          <div style={{ marginTop: "0.75rem", textAlign: "right", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ color: "var(--text)" }}>Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong></span>
            {desconto > 0 && <span style={{ color: "green" }}>Desconto ({desconto}%): <strong>- R$ {totalDesconto.toFixed(2)}</strong></span>}
            <span style={{ color: "var(--text-h)", fontSize: "1.1rem" }}>Total: <strong>R$ {total.toFixed(2)}</strong></span>
          </div>
        </div>
      )}

      <button type="submit" style={{ background: "var(--accent)", color: "white", padding: "0.75rem 1.5rem", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Registrar Venda
      </button>
    </form>
  );
}