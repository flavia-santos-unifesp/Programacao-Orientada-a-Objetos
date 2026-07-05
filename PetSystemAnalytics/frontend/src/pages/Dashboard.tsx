import type { KPIResponse } from "../types";

interface DashboardProps {
  kpis: KPIResponse;
}

export function Dashboard({ kpis }: DashboardProps) {
  const cardStyle: React.CSSProperties = {
    background: "var(--bg)",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    textAlign: "center" as const,
  };

  const cardTitleStyle: React.CSSProperties = {
    color: "var(--text)",
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  };

  const cardValueStyle: React.CSSProperties = {
    color: "var(--accent)",
    fontSize: "2rem",
    fontWeight: "bold",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem" }}>📊 Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem"
      }}>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Faturamento</h3>
          <p style={cardValueStyle}>
            R$ {kpis.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Ticket Médio</h3>
          <p style={cardValueStyle}>
            R$ {kpis.ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Qtd. Vendas</h3>
          <p style={cardValueStyle}>{kpis.quantidadeVendas}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Produto Mais Vendido</h3>
          <p style={{ ...cardValueStyle, fontSize: "1.5rem" }}>{kpis.produtoMaisVendido}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Serviço Mais Utilizado</h3>
          <p style={{ ...cardValueStyle, fontSize: "1.5rem" }}>{kpis.servicoMaisUtilizado}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Cliente Destaque</h3>
          <p style={{ ...cardValueStyle, fontSize: "1.5rem" }}>{kpis.clienteQueMaisGastou}</p>
        </div>
      </div>
    </div>
  );
}