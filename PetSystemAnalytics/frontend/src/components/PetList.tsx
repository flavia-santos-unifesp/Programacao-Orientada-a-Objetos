import type { PetResponse } from "../types";

interface PetListProps {
  pets: PetResponse[];
}

export function PetList({ pets }: PetListProps) {
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
      }}>Pets Cadastrados</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ background: "var(--code-bg)" }}>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Nome</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Tutor</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Espécie</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Raça</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Idade</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Peso</th>
            <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Porte</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr
              key={pet.id}
              style={{
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-bg)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.nome}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.cliente.nome}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.especie}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.raca}</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.idade} ano(s)</td>
              <td style={{ padding: "1rem", color: "var(--text)" }}>{pet.peso} kg</td>
              <td style={{ padding: "1rem" }}>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  fontWeight: "600"
                }}>
                  {pet.porte}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}