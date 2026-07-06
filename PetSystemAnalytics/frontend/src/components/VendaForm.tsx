import { useEffect, useState } from "react";
import type { ClienteResponse, ProdutoResponse, TipoServico, PetResponse } from "../types";
import { fetchAPI } from "../services/api";

interface ItemForm {
  tipo: "PRODUTO" | "SERVICO";
  produtoId?: number;
  servico?: TipoServico;
  petId?: number;
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

const PRECOS_SERVICOS_PADRAO: Record<TipoServico, { min: number; max: number; fixo?: number }> = {
  BANHO: { min: 40, max: 90 },
  TOSA: { min: 50, max: 110 },
  CONSULTA: { min: 120, max: 120, fixo: 120 },
  HOSPEDAGEM: { min: 80, max: 140 },
};

export function VendaForm({ onSubmit }: VendaFormProps) {
  const [clienteId, setClienteId] = useState<string>("");
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [itens, setItens] = useState<ItemForm[]>([]);
  const [tipoItem, setTipoItem] = useState<"PRODUTO" | "SERVICO">("PRODUTO");
  const [produtoId, setProdutoId] = useState<string>("");
  const [servico, setServico] = useState<TipoServico>("BANHO");
  const [petId, setPetId] = useState<string>("");
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [loadingPreco, setLoadingPreco] = useState(false);

  useEffect(() => {
    fetchAPI<ClienteResponse[]>("/clientes").then(setClientes).catch(console.error);
    fetchAPI<ProdutoResponse[]>("/produtos").then(setProdutos).catch(console.error);
  }, []);

  // Carregar pets quando cliente mudar
  useEffect(() => {
    if (clienteId) {
      fetchAPI<PetResponse[]>(`/pets`)
        .then(allPets => setPets(allPets.filter(p => p.clienteId === parseInt(clienteId))))
        .catch(console.error);
    } else {
      setPets([]);
    }
  }, [clienteId]);

  // Calcular preço dinâmico quando serviço e pet mudarem
  useEffect(() => {
    if (tipoItem === "SERVICO" && petId && servico) {
      setLoadingPreco(true);
      fetchAPI<{ preco: number; duracao: number }>(`/servicos/preco/${petId}/${servico}`)
        .then(result => setPrecoUnitario(result.preco))
        .catch(err => {
          console.error("Erro ao calcular preço:", err);
          setPrecoUnitario(0);
        })
        .finally(() => setLoadingPreco(false));
    }
  }, [petId, servico, tipoItem]);

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

  const handleServicoChange = (s: TipoServico) => {
    setServico(s);
    setPetId(""); // Reset petId quando serviço mudar
    setPrecoUnitario(0); // Reset até que um pet seja selecionado
  };

  const adicionarItem = () => {
    if (tipoItem === "PRODUTO" && !produtoId) { alert("Selecione um produto"); return; }
    if (tipoItem === "SERVICO" && !petId) { alert("Selecione um pet para o serviço"); return; }
    if (precoUnitario <= 0) { alert("Preço inválido"); return; }
    const novoItem: ItemForm = {
      tipo: tipoItem,
      produtoId: tipoItem === "PRODUTO" ? parseInt(produtoId) : undefined,
      servico: tipoItem === "SERVICO" ? servico : undefined,
      petId: tipoItem === "SERVICO" ? parseInt(petId) : undefined,
      quantidade,
      precoUnitario,
    };
    setItens([...itens, novoItem]);
    setProdutoId("");
    setPetId("");
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

      {/* Adicionar item */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "6px", padding: "1rem" }}>
        <h3 style={{ color: "var(--text-h)", margin: "0 0 0.75rem" }}>Adicionar Item</h3>
        <div style={{ display: "grid", gridTemplateColumns: tipoItem === "SERVICO" ? "1fr 1fr 1fr 1fr 1fr auto" : "1fr 2fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Tipo</label>
            <select value={tipoItem} onChange={(e) => { setTipoItem(e.target.value as any); setProdutoId(""); setPetId(""); setPrecoUnitario(0); }} style={inputStyle}>
              <option value="PRODUTO">Produto</option>
              <option value="SERVICO">Serviço</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>{tipoItem === "PRODUTO" ? "Produto" : "Serviço"}</label>
            {tipoItem === "PRODUTO" ? (
              <select value={produtoId} onChange={(e) => handleProdutoChange(e.target.value)} style={inputStyle}>
                <option value="">Selecione...</option>
                {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} (R$ {p.preco.toFixed(2)})</option>)}
              </select>
            ) : (
              <select value={servico} onChange={(e) => handleServicoChange(e.target.value as TipoServico)} style={inputStyle}>
                {(["BANHO", "TOSA", "CONSULTA", "HOSPEDAGEM"] as TipoServico[]).map((s) => {
                  const precoInfo = PRECOS_SERVICOS_PADRAO[s];
                  const displayText = precoInfo.fixo ? `${s} (R$ ${precoInfo.fixo})` : `${s} (R$ ${precoInfo.min}-${precoInfo.max})`;
                  return <option key={s} value={s}>{displayText}</option>;
                })}
              </select>
            )}
          </div>
          {tipoItem === "SERVICO" && (
            <div>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Pet</label>
              <select value={petId} onChange={(e) => setPetId(e.target.value)} style={inputStyle} disabled={!clienteId}>
                <option value="">Selecione...</option>
                {pets.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Qtd</label>
            <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} style={{ ...inputStyle, width: "60px" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.3rem", fontSize: "0.85rem" }}>Preço Unit.</label>
            <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
              <input type="number" min="0" step="0.01" value={precoUnitario} onChange={(e) => setPrecoUnitario(parseFloat(e.target.value))} style={{ ...inputStyle, flex: 1 }} disabled={tipoItem === "SERVICO"} />
              {tipoItem === "SERVICO" && loadingPreco && <span style={{ fontSize: "0.75rem", color: "var(--text)" }}>...</span>}
            </div>
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
                const nomeItem = item.tipo === "PRODUTO"
                  ? produtos.find((p) => p.id === item.produtoId)?.nome ?? "Produto"
                  : item.servico ?? "Serviço";
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