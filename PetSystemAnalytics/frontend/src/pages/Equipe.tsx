export function Equipe() {
  const teamMembers = [
    {
      id: 1,
      nome: "Nome do Membro 1",
      funcao: "Full Stack Developer",
      contribuicoes: [
        "Arquitetura do Backend",
        "Modelos e Lógica de Negócio",
        "API REST",
      ]
    },
    {
      id: 2,
      nome: "Nome do Membro 2",
      funcao: "Backend Developer",
      contribuicoes: [
        "Banco de Dados (Prisma)",
        "Repositories e Services",
        "Validações",
      ]
    },
    {
      id: 3,
      nome: "Nome do Membro 3",
      funcao: "Frontend Developer",
      contribuicoes: [
        "Interface de Usuário",
        "Componentes React",
        "Integração com API",
      ]
    },
  ];

  const sectionStyle: React.CSSProperties = {
    background: "var(--bg)",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    marginBottom: "2rem",
    boxShadow: "var(--shadow)"
  };

  const titleStyle: React.CSSProperties = {
    color: "var(--accent)",
    fontSize: "1.5rem",
    marginBottom: "2rem",
    borderBottom: "2px solid var(--accent)",
    paddingBottom: "0.5rem"
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--accent-bg)",
    border: "1px solid var(--accent-border)",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    transition: "all 0.3s"
  };

  const nameStyle: React.CSSProperties = {
    color: "var(--text-h)",
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.5rem"
  };

  const funcaoStyle: React.CSSProperties = {
    color: "var(--accent)",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "1rem"
  };

  const listStyle: React.CSSProperties = {
    color: "var(--text)",
    margin: 0,
    paddingLeft: "1.5rem",
    lineHeight: "1.8"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "1.5rem", margin: 0 }}>
        Equipe do Projeto
      </h1>

      {/* Descrição */}
      <div style={sectionStyle}>
        <p style={{
          color: "var(--text)",
          lineHeight: "1.8",
          margin: 0
        }}>
          Somos uma equipe dedicada de desenvolvedores e testadores trabalhando juntos 
          para criar uma solução completa e robusta. Abaixo estão os membros da equipe 
          e suas contribuições principais:
        </p>
      </div>

      {/* Equipe */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Membros da Equipe</h2>

        {teamMembers.map((member) => (
          <div
            key={member.id}
            style={cardStyle}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            <div style={nameStyle}>{member.nome}</div>
            <div style={funcaoStyle}>{member.funcao}</div>
            <div style={{ color: "var(--text)", marginBottom: "0.5rem", fontWeight: "600" }}>
              Contribuições:
            </div>
            <ul style={listStyle}>
              {member.contribuicoes.map((contrib, idx) => (
                <li key={idx}>{contrib}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
}