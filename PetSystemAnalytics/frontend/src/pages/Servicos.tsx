import type { TipoServico } from "../types";

interface ServicoInfo {
  tipo: TipoServico;
  icon: string;
  descricao: string;
  preco: number;
  duracao: string;
}

const SERVICOS: ServicoInfo[] = [
  {
    tipo: "BANHO",
    icon: "🛁",
    descricao: "Banho completo com shampoo e condicionador especiais para pets.",
    preco: 50,
    duracao: "1-2 horas",
  },
  {
    tipo: "TOSA",
    icon: "✂️",
    descricao: "Tosa higiênica ou estética conforme necessidade do pet.",
    preco: 70,
    duracao: "1-3 horas",
  },
  {
    tipo: "CONSULTA",
    icon: "🩺",
    descricao: "Consulta veterinária com avaliação completa de saúde.",
    preco: 120,
    duracao: "30-60 min",
  },
  {
    tipo: "HOSPEDAGEM",
    icon: "🏨",
    descricao: "Hospedagem diária com alimentação, passeios e cuidados.",
    preco: 80,
    duracao: "Por diária",
  },
];

const NIVEL_DESCONTO: Record<string, number> = {
  BRONZE: 0,
  PRATA: 5,
  OURO: 10,
};

export function Servicos() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>🐾 Gestão de Serviços</h1>

      <p style={{ color: "var(--text)", margin: 0 }}>
        Os serviços oferecidos pelo petshop. Os preços podem ter desconto conforme o nível de fidelidade do cliente.
      </p>

      {/* Cards de serviços */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {SERVICOS.map((s) => (
          <div key={s.tipo} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", boxShadow: "var(--shadow)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <h2 style={{ color: "var(--text-h)", margin: "0 0 0.5rem" }}>{s.tipo}</h2>
            <p style={{ color: "var(--text)", fontSize: "0.9rem", margin: "0 0 1rem" }}>{s.descricao}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--accent)", fontWeight: "700", fontSize: "1.2rem" }}>
                R$ {s.preco.toFixed(2)}
              </span>
              <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>⏱ {s.duracao}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de descontos por fidelidade */}
      <div style={{ background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
        <h2 style={{ color: "var(--text-h)", padding: "1.5rem", borderBottom: "1px solid var(--border)", margin: 0 }}>
          🏆 Descontos por Nível de Fidelidade
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--code-bg)" }}>
              <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Nível</th>
              <th style={{ padding: "1rem", textAlign: "left", color: "var(--text)" }}>Pontos Necessários</th>
              <th style={{ padding: "1rem", textAlign: "center", color: "var(--text)" }}>Desconto</th>
              {SERVICOS.map((s) => (
                <th key={s.tipo} style={{ padding: "1rem", textAlign: "right", color: "var(--text)" }}>{s.icon} {s.tipo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { nivel: "BRONZE", pontos: "0 – 499", cor: "#CD7F32", bg: "#fef3e2" },
              { nivel: "PRATA", pontos: "500 – 999", cor: "#9ca3af", bg: "#f3f4f6" },
              { nivel: "OURO", pontos: "1000+", cor: "#d97706", bg: "#fef9c3" },
            ].map(({ nivel, pontos, cor, bg }) => (
              <tr key={nivel} style={{ borderBottom: "1px solid var(--border)", background: bg }}>
                <td style={{ padding: "1rem" }}>
                  <span style={{ fontWeight: "700", color: cor }}>{nivel}</span>
                </td>
                <td style={{ padding: "1rem", color: "var(--text)" }}>{pontos}</td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <span style={{ fontWeight: "700", color: NIVEL_DESCONTO[nivel] > 0 ? "green" : "var(--text)" }}>
                    {NIVEL_DESCONTO[nivel]}%
                  </span>
                </td>
                {SERVICOS.map((s) => {
                  const desc = NIVEL_DESCONTO[nivel];
                  const precoFinal = s.preco * (1 - desc / 100);
                  return (
                    <td key={s.tipo} style={{ padding: "1rem", textAlign: "right", color: "var(--text)" }}>
                      R$ {precoFinal.toFixed(2)}
                      {desc > 0 && (
                        <span style={{ fontSize: "0.75rem", color: "green", marginLeft: "0.3rem" }}>
                          (-{desc}%)
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
