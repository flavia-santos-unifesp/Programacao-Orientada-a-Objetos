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
          com programa de fidelidade, agendamento de serviços e análise de KPIs em tempo real.
        </p>
        <p style={textStyle}>
          No fluxo atual, a tela <strong>Vendas</strong> é dedicada a produtos,
          enquanto a tela <strong>Agendar Serviço</strong> concentra a venda de serviços
          com seleção de data/hora, funcionário apto e validações de disponibilidade.
        </p>
      </div>

      {/* Funcionalidades */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>🎯 Funcionalidades Principais</h2>
        <ul style={listStyle}>
          <li>Gestão de Clientes com programa de fidelidade</li>
          <li>Cadastro e controle de Pets</li>
          <li>Cadastro de Funcionários com alocação por cargo</li>
          <li>Gerenciamento de estoque de Produtos com validação automática</li>
          <li>Venda de Produtos na tela Vendas, com desconto automático por fidelidade</li>
          <li>Venda e Agendamento de Serviços (Banho, Tosa, Consulta e Hospedagem) na tela Agendar Serviço</li>
          <li>Validação de horário comercial e disponibilidade de funcionário no agendamento</li>
          <li>Agenda semanal em formato calendário por funcionário</li>
          <li>Dashboard com KPIs e análises em tempo real</li>
        </ul>
      </div>

      {/* Conceitos POO */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>🏗️ Conceitos de POO Aplicados</h2>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Herança</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            As classes <code>Cliente</code> e <code>Funcionario</code> herdam de <code>Pessoa</code>,
            reutilizando atributos como nome, telefone e email. Os tipos de serviço
            (Banho, Tosa, Consulta, Hospedagem) herdam de <code>Servico</code>.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Polimorfismo</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            O domínio de serviços reutiliza contratos comuns para representar Banho, Tosa,
            Consulta e Hospedagem, aplicando regras específicas por tipo de serviço e
            características do pet (como peso e porte) sem alterar o fluxo principal da aplicação.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Encapsulamento</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Atributos privados e métodos públicos controlados. O <code>ProgramaFidelidade</code> é
            encapsulado dentro de <code>Cliente</code>, ocultando toda a lógica de pontuação e
            desconto do código externo.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Abstração</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Classes abstratas como <code>Pessoa</code> e <code>Servico</code> definem contratos
            que suas subclasses devem obrigatoriamente implementar, sem expor detalhes internos.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Interfaces</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            A interface genérica <code>IRepository&lt;TDomain, TCreateInput&gt;</code> define o
            contrato de acesso a dados (create, findAll, findById) implementado por
            <code> ClienteRepository</code>, <code>PetRepository</code>, <code>ProdutoRepository</code> e{" "}
            <code>VendaRepository</code>, além de outros repositórios de agenda — múltiplas
            implementações para o mesmo contrato.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Composição</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            <code>Cliente</code> é composto por <code>ProgramaFidelidade</code> e uma coleção
            de <code>Pet</code>. <code>Venda</code> é composta por uma coleção de{" "}
            <code>ItemVenda</code>, onde cada item referencia um <code>Produto</code> ou{" "}
            <code>Servico</code>.
          </p>
        </div>

        <div style={featureItemStyle}>
          <h3 style={{ color: "var(--accent)", margin: "0 0 0.5rem 0" }}>Padrões de Projeto</h3>
          <p style={{ margin: 0, color: "var(--text)" }}>
            Utiliza <strong>Repository Pattern</strong> (acesso a dados com contrato via interface),{" "}
            <strong>Mapper Pattern</strong> (conversão entre camadas), <strong>Factory Pattern</strong>{" "}
            (instanciação de serviços via <code>ServicoFactory</code>) e <strong>Service Pattern</strong>{" "}
            (orquestração de regras de negócio).
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
          <li><strong>Interfaces:</strong> Contratos que definem comportamentos entre camadas</li>
          <li><strong>Repositories:</strong> Acesso aos dados com Prisma ORM</li>
          <li><strong>Services:</strong> Orquestração de regras de negócio</li>
          <li><strong>DTOs:</strong> Transferência segura de dados entre camadas</li>
          <li><strong>Mappers:</strong> Conversão entre modelos de diferentes camadas</li>
          <li><strong>API:</strong> Backend em Express + TypeScript com endpoints REST</li>
          <li><strong>Frontend:</strong> Interface intuitiva em React + TypeScript</li>
        </ul>
      </div>
    </div>
  );
}