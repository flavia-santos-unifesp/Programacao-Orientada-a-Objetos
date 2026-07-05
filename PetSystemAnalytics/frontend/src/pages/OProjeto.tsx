export function OProjeto() {
  const sectionStyle: React.CSSProperties = {
    background: "var(--bg)",
    padding: "2rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    marginBottom: "2rem",
    boxShadow: "var(--shadow)"
  };

  const titleStyle: React.CSSProperties = {
    color: "var(--accent)",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    borderBottom: "2px solid var(--accent)",
    paddingBottom: "0.5rem"
  };

  const textStyle: React.CSSProperties = {
    color: "var(--text)",
    lineHeight: "1.8",
    marginBottom: "1rem"
  };

  const listStyle: React.CSSProperties = {
    color: "var(--text)",
    marginLeft: "1.5rem",
    lineHeight: "1.8"
  };

  const featureItemStyle: React.CSSProperties = {
    background: "var(--accent-bg)",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    borderLeft: "4px solid var(--accent)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        📋 O Projeto
      </h1>

      {/* Sobre */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Sobre o PetSystemAnalytics</h2>
        <p style={textStyle}>
          O <strong>PetSystemAnalytics</strong> é um sistema de gestão completo para pet shops e clínicas veterinárias. 
          Desenvolvido como projeto acadêmico para a disciplina de Programação Orientada a Objetos, 
          ele demonstra a aplicação de conceitos fundamentais da POO em uma aplicação real e prática.
        </p>
        <p style={textStyle}>
          O sistema permite gerenciar clientes, pets, produtos, serviços e vendas, 
          com um programa de fidelidade integrado e análise de KPIs em tempo real.
        </p>
      </div>

      {/* Funcionalidades */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>🎯 Funcionalidades Principais</h2>
        <ul style={listStyle}>
          <li>Gestão de Clientes com programa de fidelidade</li>
          <li>Cadastro e controle de Pets</li>
          <li>Gerenciamento de estoque de Produtos</li>
          <li>Registro de Serviços (Banho, Tosa, Consulta, Hospedagem)</li>
          <li>Sistema de Vendas com desconto automático por fidelidade</li>
          <li>Dashboard com KPIs e análises</li>
          <li>Relatórios de vendas em CSV</li>
        </ul>
      </div>

      {/* Conceitos POO */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>🏗️ Conceitos de POO Aplicados</h2>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Herança</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            A classe <code>Cliente</code> herda de <code>Pessoa</code>, reutilizando atributos 
            como nome, telefone e email. Tipos de serviços (Banho, Tosa, etc.) herdam de <code>Servico</code>.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Polimorfismo</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Cada serviço implementa seus próprios cálculos de preço e duração conforme o tipo de pet. 
            O mesmo método pode ter comportamentos diferentes, permitindo flexibilidade no código.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Encapsulamento</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Atributos privados e métodos públicos controlados. O programa de fidelidade é 
            um objeto encapsulado dentro de Cliente, ocultando sua complexidade interna.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Abstração</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Classes abstratas como <code>Pessoa</code> e <code>Servico</code> definem contratos 
            que suas subclasses devem implementar.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Composição e Agregação</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            <code>Cliente</code> contém <code>ProgramaFidelidade</code> (composição) e uma 
            coleção de <code>Pet</code> (agregação).
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Padrões de Projeto</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Utiliza Repository Pattern para acesso a dados, Mapper Pattern para conversão entre camadas, 
            Factory Pattern para instanciação de serviços e Service Pattern para lógica de negócio.
          </p>
        </div>
      </div>

      {/* Arquitetura */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>🏛️ Arquitetura do Projeto</h2>
        <p style={textStyle}>
          O projeto segue uma arquitetura em camadas bem definida:
        </p>
        <ul style={listStyle}>
          <li><strong>Models:</strong> Entidades do domínio com validações e lógica de negócio</li>
          <li><strong>Repositories:</strong> Acesso aos dados com Prisma ORM</li>
          <li><strong>Services:</strong> Orquestração de regras de negócio</li>
          <li><strong>DTOs:</strong> Transferência segura de dados entre camadas</li>
          <li><strong>Mappers:</strong> Conversão entre modelos de diferentes camadas</li>
          <li><strong>Frontend:</strong> Interface intuitiva em React + TypeScript</li>
        </ul>
      </div>
    </div>
  );
}