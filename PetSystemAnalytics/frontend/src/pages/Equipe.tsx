export function Equipe() {
  const teamMembers = [
    {
      id: 1,
      nome: "Andrey Prado",
      funcao: "Developer",
      github: "https://github.com/AndreyPradoAP",
      contribuicoes: [
        "",
      ]
    },
    {
      id: 2,
      nome: "Flavia Santos",
      funcao: "Backend & Banco & Frontend",
      github: "https://github.com/flavia-santos-unifesp",
      contribuicoes: [
        "API REST",
        "Banco de Dados",
        "Frontend",
      ]
    },
    {
      id: 3,
      nome: "Rennan Britto",
      funcao: "Arquitertura & Backend",
      github: "https://github.com/rennanbritto",
      contribuicoes: [
        "Arquitertura do Sistema",
        "Modelagem do domínio",
        "Backend",
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

  const githubStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    textDecoration: "none",
    fontWeight: 500,
    marginBottom: "1rem",
    transition: "all 0.2s ease",
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
          Somos alunos da UNIFESP e desenvolvemos o Pet System Analytics como projeto da disciplina de 
          Programação Orientada a Objetos.
          <br />
          Conheça a equipe que tornou este projeto possível:
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
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              style={githubStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              GitHub
              <span
                style={{
                  fontSize: "0.8rem",
                  transform: "translateY(-1px)"
                }}
              >
                ↗
              </span>
            </a>
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