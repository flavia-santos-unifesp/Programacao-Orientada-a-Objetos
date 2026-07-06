import { useEffect, useState } from "react";
import { fetchAPI } from "../services/api";
import type { TipoServico } from "../types";

export interface FuncionarioDisponivel {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

interface ServicoAgendamentoModalProps {
  tipoServico: TipoServico;
  duracao: number;
  onConfirm: (funcionarioId: number, dataHora: string) => void;
  onCancel: () => void;
}

export function ServicoAgendamentoModal({
  tipoServico,
  duracao,
  onConfirm,
  onCancel,
}: ServicoAgendamentoModalProps) {
  const [data, setData] = useState<string>(""); // Apenas data (YYYY-MM-DD)
  const [hora, setHora] = useState<string>(""); // Apenas hora (HH:mm)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]); // Horários em 15min
  const [funcionarios, setFuncionarios] = useState<FuncionarioDisponivel[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar horários quando a data muda
  useEffect(() => {
    if (!data) {
      setHorariosDisponiveis([]);
      setHora("");
      setFuncionarios([]);
      return;
    }

    const carregarHorarios = async () => {
      try {
        setLoadingHorarios(true);
        setErro(null);
        
        // Usar endpoint sugerir-horarios para obter horários disponíveis
        const url = `/agendamentos/sugerir-horarios/${tipoServico}?duracao=${duracao}&quantidade=30&data=${data}`;
        const horariosData = await fetchAPI<Date[]>(url);
        
        // Converter para lista de strings HH:mm em intervalos de 15 min
        const horarios = horariosData
          .filter(h => new Date(h).toISOString().split('T')[0] === data) // Filtrar pela data selecionada
          .map(h => {
            const d = new Date(h);
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
          })
          .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicatas
          .sort(); // Ordena horários
        
        setHorariosDisponiveis(horarios);
        
        if (horarios.length === 0) {
          setErro("Nenhum horário disponível nesta data");
        }
      } catch (err) {
        console.error("Erro ao buscar horários:", err);
        setErro("Erro ao carregar horários");
        setHorariosDisponiveis([]);
      } finally {
        setLoadingHorarios(false);
      }
    };

    carregarHorarios();
  }, [data, duracao, tipoServico]);

  // Buscar funcionários quando data/hora completa muda
  useEffect(() => {
    if (!data || !hora) {
      setFuncionarios([]);
      return;
    }

    const carregarFuncionarios = async () => {
      try {
        setLoadingFuncionarios(true);
        setErro(null);
        
        const dataHora = new Date(`${data}T${hora}:00`).toISOString();
        const url = `/agendamentos/disponibilidade/${tipoServico}?dataHora=${encodeURIComponent(dataHora)}&duracao=${duracao}`;
        const dados = await fetchAPI<FuncionarioDisponivel[]>(url);
        setFuncionarios(dados);
        
        if (dados.length === 0) {
          setErro("Nenhum funcionário disponível neste horário");
        }
      } catch (err) {
        console.error("Erro ao buscar disponibilidade:", err);
        setErro("Erro ao verificar disponibilidade");
        setFuncionarios([]);
      } finally {
        setLoadingFuncionarios(false);
      }
    };

    carregarFuncionarios();
  }, [data, hora, duracao, tipoServico]);

  const handleConfirm = () => {
    if (!data || !hora || !selecionado) {
      alert("Selecione data, hora e funcionário");
      return;
    }
    const dataHora = new Date(`${data}T${hora}:00`).toISOString();
    onConfirm(selecionado, dataHora);
  };

  // Data mínima (hoje em formato YYYY-MM-DD)
  const hoje = new Date();
  const minData = hoje.toISOString().split('T')[0];

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "0.95rem",
    color: "var(--text)",
    background: "var(--bg)",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "var(--shadow)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "var(--text-h)", margin: "0 0 1.5rem" }}>
          📅 Agendar {tipoServico}
        </h2>

        {erro && (
          <div style={{ background: "#fee", border: "1px solid red", padding: "0.75rem", borderRadius: "4px", color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
            ⚠️ {erro}
          </div>
        )}

        {/* 1. Seleção de Data */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: "var(--text-h)", marginBottom: "0.5rem", fontWeight: "bold" }}>
            📆 Selecione a Data
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              setHora(""); // Reset hora quando mudar data
              setSelecionado(null); // Reset funcionário
            }}
            min={minData}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        {/* 2. Seleção de Hora (Grid de 15 em 15 min) */}
        {data && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "var(--text-h)", marginBottom: "0.5rem", fontWeight: "bold" }}>
              ⏰ Horários Disponíveis (15 em 15 minutos)
            </label>
            {loadingHorarios && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Carregando horários...</p>
            )}
            {horariosDisponiveis.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {horariosDisponiveis.map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setHora(h);
                      setSelecionado(null); // Reset funcionário quando mudar hora
                    }}
                    style={{
                      padding: "0.5rem",
                      border:
                        hora === h
                          ? "2px solid var(--accent)"
                          : "1px solid var(--border)",
                      background:
                        hora === h
                          ? "var(--accent-bg)"
                          : "transparent",
                      color: "var(--text)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: hora === h ? "bold" : "normal",
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
            {!loadingHorarios && horariosDisponiveis.length === 0 && data && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Nenhum horário disponível para esta data
              </p>
            )}
          </div>
        )}

        {/* 3. Seleção de Funcionário */}
        {data && hora && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "var(--text-h)", marginBottom: "0.5rem", fontWeight: "bold" }}>
              👤 Funcionário Disponível
            </label>
            {loadingFuncionarios && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Carregando funcionários...</p>
            )}
            {funcionarios.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {funcionarios.map((func) => (
                  <label
                    key={func.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem",
                      border: `2px solid ${
                        selecionado === func.id ? "var(--accent)" : "var(--border)"
                      }`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      background:
                        selecionado === func.id
                          ? "var(--accent-bg)"
                          : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="funcionario"
                      value={func.id}
                      checked={selecionado === func.id}
                      onChange={() => setSelecionado(func.id)}
                      style={{ marginRight: "0.75rem" }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "var(--text-h)" }}>{func.nome}</strong>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                          margin: "0.2rem 0 0",
                        }}
                      >
                        {func.cargo}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.6rem 1.5rem",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!data || !hora || !selecionado || loadingHorarios || loadingFuncionarios}
            style={{
              padding: "0.6rem 1.5rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: !data || !hora || !selecionado || loadingHorarios || loadingFuncionarios ? 0.5 : 1,
            }}
          >
            ✅ Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
}
