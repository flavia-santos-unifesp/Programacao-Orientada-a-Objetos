import type { VendaResponse } from "../types";

interface VendaListProps {
  vendas: VendaResponse[];
}

export function VendaList({ vendas }: VendaListProps) {
  return (
    <div style={{
      background: "var(--bg)",
      borderRadius: "8px",
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow)"
    }}>
      <h2 style={{
        color: "var(--text-h)",
        padding: "1.5rem",
        borderBottom: "1px solid var(--border)",
        margin: 0,
        fontSize: "1.25rem"
      }}>Vendas Registradas</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ background: "var(--code-bg)" }}>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>ID</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Cliente</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Data</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Subtotal</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Desconto</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr
              key={venda.id}
              style={{
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-bg)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "1rem", color: "var(--text)", fontWeight: "600" }}>{venda.id}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{venda.cliente.nome}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>
                {new Date(venda.data).toLocaleDateString("pt-BR")}
              </td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>
                R$ {venda.subtotal.toFixed(2)}
              </td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>
                R$ {venda.desconto.toFixed(2)}
              </td>
              <td style={{ padding: "1rem" }}>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  fontWeight: "600"
                }}>
                  R$ {venda.total.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}