import type { ClienteResponse } from "../types";

interface ClienteListProps {
  clientes: ClienteResponse[];
}

const estilosNivel = {
  BRONZE: {
    color: "#CD7F32",
    background: "#fef3e2"
  },
  PRATA: {
    color: "#9ca3af",
    background: "#f3f4f6"
  },
  OURO: {
    color: "#d9b206",
    background: "#fef9c3"
  }
};

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
        margin: 0,
        fontSize: "1.25rem"
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
                  background: estilosNivel[cliente.nivelFidelidade].background,
                  color: estilosNivel[cliente.nivelFidelidade].color,
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