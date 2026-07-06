import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchAPI } from "../services/api";
import type { KPIResponse } from "../types";

interface DashboardProps {
  kpis: KPIResponse;
}

interface EvolutionData {
  mes: number;
  mesNome: string;
  faturamento: number;
}

interface ChartData {
  nome: string;
  quantidade: number;
}

export function Dashboard({ kpis: initialKpis }: DashboardProps) {
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [kpis, setKpis] = useState<KPIResponse>(initialKpis);
  const [evolucaoFaturamento, setEvolucaoFaturamento] = useState<EvolutionData[]>([]);
  const [servicosMaisVendidos, setServicosMaisVendidos] = useState<ChartData[]>([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const cores = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#ffa07a", "#98d8c8"];

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar KPIs com filtro
      const kpisData = await fetchAPI<KPIResponse>(`/kpis?mes=${mes}&ano=${ano}`);
      setKpis(kpisData);

      // Carregar evolução de faturamento
      const evolucao = await fetchAPI<EvolutionData[]>(`/kpis/evolucao-faturamento?ano=${ano}`);
      setEvolucaoFaturamento(evolucao);

      // Carregar serviços mais vendidos (ano inteiro)
      const servicos = await fetchAPI<ChartData[]>(`/kpis/servicos-mais-vendidos?ano=${ano}`);
      setServicosMaisVendidos(servicos);

      // Carregar produtos mais vendidos (ano inteiro)
      const produtos = await fetchAPI<ChartData[]>(`/kpis/produtos-mais-vendidos?ano=${ano}`);
      setProdutosMaisVendidos(produtos);
    } catch (erro) {
      console.error("Erro ao carregar dados do dashboard:", erro);
    } finally {
      setLoading(false);
    }
  };

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

  const chartContainerStyle: React.CSSProperties = {
    background: "var(--bg)",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    marginTop: "1.5rem",
  };

  const chartTitleStyle: React.CSSProperties = {
    color: "var(--text-h)",
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
  };

  const filterStyle: React.CSSProperties = {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    alignItems: "center",
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    fontSize: "1rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem" }}>📊 Dashboard</h1>

      {/* Filtros */}
      <div style={filterStyle}>
        <label style={{ color: "var(--text)", fontWeight: "500" }}>
          Mês:
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            style={{ ...selectStyle, marginLeft: "0.5rem", width: "auto" }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>
                {new Date(ano, m - 1).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}
          </select>
        </label>

        <label style={{ color: "var(--text)", fontWeight: "500" }}>
          Ano:
          <select
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            style={{ ...selectStyle, marginLeft: "0.5rem", width: "auto" }}
          >
            {[2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        {loading && <span style={{ color: "var(--text)", marginLeft: "auto" }}>Carregando...</span>}
      </div>

      {/* Cards de KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

      {/* Gráficos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "1.5rem",
        marginTop: "1rem"
      }}>
        {/* Evolução de Faturamento */}
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>📈 Evolução de Faturamento</h3>
          {evolucaoFaturamento.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoFaturamento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mesNome" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="faturamento" stroke="#4ecdc4" dot={{ fill: "#4ecdc4" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Sem dados disponíveis</p>
          )}
        </div>

        {/* Serviços Mais Vendidos */}
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>🐾 Serviços Mais Vendidos - {ano}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>Dados de todo o ano</p>
          {servicosMaisVendidos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicosMaisVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#45b7d1">
                  {servicosMaisVendidos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Sem dados disponíveis</p>
          )}
        </div>

        {/* Produtos Mais Vendidos */}
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>📦 Produtos Mais Vendidos - {ano}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>Dados de todo o ano</p>
          {produtosMaisVendidos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produtosMaisVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#ffa07a">
                  {produtosMaisVendidos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Sem dados disponíveis</p>
          )}
        </div>
      </div>
    </div>
  );
}