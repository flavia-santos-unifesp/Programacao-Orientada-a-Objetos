import type { ClienteResponse } from "../types";

interface ClienteListProps {
  clientes: ClienteResponse[];
}

export function ClienteList({ clientes }: ClienteListProps) {
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
        margin: 0
      }}>Clientes</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ background: "var(--code-bg)" }}>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Nome</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Email</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Telefone</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Nível</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} style={{
              borderBottom: "1px solid var(--border)",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-bg)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "1rem", color: "var(--text)" }}>{cliente.nome}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{cliente.email}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{cliente.telefone}</td>
              <td style={{ padding: "1rem" }}>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  fontWeight: "600"
                }}>
                  {cliente.nivelFidelidade}
                </span>
              </td>
              <td style={{ padding: "1rem", color: "var(--text)", fontWeight: "600" }}>
                {cliente.pontosFidelidade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}