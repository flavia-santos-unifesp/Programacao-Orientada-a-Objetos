import { useEffect, useMemo, useState } from "react";
import { fetchAPI } from "../services/api";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
}

interface Agendamento {
  id: number;
  dataHora: string;
  duracao: number;
  status: "PENDENTE" | "CONFIRMADO" | "REALIZADO" | "CANCELADO";
  funcionarioId: number;
  funcionario: Funcionario;
  itemVenda?: {
    id: number;
    tipo: string;
    servico?: string;
    pet?: {
      nome: string;
      cliente?: {
        nome: string;
      };
    };
  };
}

interface DayColumn {
  date: Date;
  label: string;
  key: string;
}

const HORA_INICIO = 8;
const HORA_FIM = 17;
const SLOT_MINUTOS = 15;
const PIXELS_POR_HORA = 64;
const HEADER_HEIGHT = 40;
const WORK_MINUTES = (HORA_FIM - HORA_INICIO) * 60;

const diasSemanaPt = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // segunda como início
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHourMinute(minutesFromStart: number): string {
  const total = HORA_INICIO * 60 + minutesFromStart;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getMinutesFromStart(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() - HORA_INICIO * 60;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function statusColor(status: Agendamento["status"]): string {
  switch (status) {
    case "PENDENTE":
      return "#f59e0b";
    case "CONFIRMADO":
      return "#0ea5e9";
    case "REALIZADO":
      return "#22c55e";
    case "CANCELADO":
      return "#ef4444";
    default:
      return "#64748b";
  }
}

function getServicoLabel(ag: Agendamento): string {
  if (ag.itemVenda?.servico) return ag.itemVenda.servico;
  if (ag.itemVenda?.tipo) return ag.itemVenda.tipo;
  return "Serviço";
}

export function Agenda() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<number | "all">("all");
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const [funcs, ags] = await Promise.all([
          fetchAPI<Funcionario[]>("/funcionarios"),
          fetchAPI<Agendamento[]>("/agendamentos"),
        ]);

        setFuncionarios(funcs);
        setAgendamentos(ags.filter((a) => a.status !== "CANCELADO"));
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Erro ao carregar agenda");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const days: DayColumn[] = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i);
      return {
        date,
        key: formatDateKey(date),
        label: `${diasSemanaPt[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}`,
      };
    });
  }, [weekStart]);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const filteredAgendamentos = useMemo(() => {
    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(weekEnd);
    end.setHours(23, 59, 59, 999);

    return agendamentos.filter((a) => {
      const d = new Date(a.dataHora);
      const inWeek = d >= start && d <= end;
      const byFunc = selectedFuncionario === "all" || a.funcionarioId === selectedFuncionario;
      return inWeek && byFunc;
    });
  }, [agendamentos, selectedFuncionario, weekStart, weekEnd]);

  const agendaByFuncionario = useMemo(() => {
    const base = (selectedFuncionario === "all"
      ? funcionarios
      : funcionarios.filter((f) => f.id === selectedFuncionario)
    ).map((f) => ({ funcionario: f, eventos: [] as Agendamento[] }));

    for (const item of base) {
      item.eventos = filteredAgendamentos
        .filter((ag) => ag.funcionarioId === item.funcionario.id)
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }

    return base;
  }, [funcionarios, filteredAgendamentos, selectedFuncionario]);

  const ticks = useMemo(() => {
    const t: number[] = [];
    for (let m = 0; m <= WORK_MINUTES; m += SLOT_MINUTOS) t.push(m);
    return t;
  }, []);


  const gridHeight = (HORA_FIM - HORA_INICIO) * PIXELS_POR_HORA;
  const totalHeight = gridHeight + HEADER_HEIGHT; // inclui faixa até 17h

  const headerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    alignItems: "end",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontFamily: "var(--sans)",
    background: "var(--bg)",
    color: "var(--text)",
  };

  const titleRange = `${weekStart.toLocaleDateString("pt-BR")} - ${weekEnd.toLocaleDateString("pt-BR")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ color: "var(--text-h)", margin: 0,fontSize: "1.5rem"}}>Agenda de Serviços</h1>
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Visualização semanal por funcionário, com blocos de alocação e espaços livres para disponibilidade.
      </p>

      {error && (
        <div style={{ background: "#fee", color: "#b00020", border: "1px solid #f5a5a5", padding: "0.8rem", borderRadius: "8px" }}>
         {error}
        </div>
      )}

      <div style={headerStyle}>
        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", color: "var(--text)", fontWeight: 600 }}>
            Funcionário
          </label>
          <select
            value={selectedFuncionario}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedFuncionario(value === "all" ? "all" : parseInt(value));
            }}
            style={inputStyle}
          >
            <option value="all">Todos</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>{f.nome} ({f.cargo})</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", color: "var(--text)", fontWeight: 600 }}>
            Semana
          </label>
          <input
            type="date"
            value={formatDateKey(weekStart)}
            onChange={(e) => setWeekStart(getStartOfWeek(new Date(`${e.target.value}T00:00:00`)))}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setWeekStart((prev) => addDays(prev, -7))}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            ◀ Semana anterior
          </button>
          <button
            onClick={() => setWeekStart((prev) => addDays(prev, 7))}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            Próxima semana ▶
          </button>
        </div>

        <div style={{ marginLeft: "auto", color: "var(--text)", fontWeight: 600 }}>
          {titleRange}
        </div>
      </div>

      {loading ? (
        <p>Carregando agenda...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {agendaByFuncionario.map(({ funcionario, eventos }) => (
            <div
              key={funcionario.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                background: "var(--bg)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "var(--text-h)" }}>{funcionario.nome}</strong>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{funcionario.cargo}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "90px repeat(7, 1fr)", minHeight: totalHeight}}>
                <div style={{ borderRight: "1px solid var(--border)", position: "relative", background: "var(--code-bg)",height: totalHeight }}>
                  {Array.from({ length: HORA_FIM - HORA_INICIO + 1 }).map((_, i) => {
                    const hour = HORA_INICIO + i;
                    const top = HEADER_HEIGHT + (i * PIXELS_POR_HORA) + (PIXELS_POR_HORA / 2);
                    return (
                      <div
                        key={hour}
                        style={{
                          position: "absolute",
                          top,
                          left: 0,
                          right: 0,
                          transform: "translateY(-50%)",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          textAlign: "center",
                        }}
                      >
                        {String(hour).padStart(2, "0")}:00
                      </div>
                    );
                  })}
                </div>

                {days.map((day) => {
                  const dayEvents = eventos.filter((ev) => formatDateKey(new Date(ev.dataHora)) === day.key);

                  return (
                    <div key={day.key} style={{ borderRight: "1px solid var(--border)", position: "relative" }}>
                      <div style={{ height: 38, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--text-h)", background: "var(--code-bg)" }}>
                        {day.label}
                      </div>

                      <div style={{ position: "relative", height: gridHeight }}>
                        {ticks.map((m) => (
                          <div
                            key={m}
                            style={{
                              position: "absolute",
                              top: (m / 60) * PIXELS_POR_HORA,
                              left: 0,
                              right: 0,
                              borderTop: m % 60 === 0 ? "1px solid rgba(125,125,125,0.25)" : "1px dashed rgba(125,125,125,0.12)",
                            }}
                          />
                        ))}

                        

                        {dayEvents.map((ev) => {
                          const inicio = new Date(ev.dataHora);
                          const startMinutesRaw = getMinutesFromStart(inicio);
                          const startMinutes = clamp(startMinutesRaw, 0, WORK_MINUTES);
                          const duration = clamp(ev.duracao, SLOT_MINUTOS, WORK_MINUTES - startMinutes);

                          const top = (startMinutes / 60) * PIXELS_POR_HORA;
                          const height = Math.max((duration / 60) * PIXELS_POR_HORA, 20);

                          const cliente = ev.itemVenda?.pet?.cliente?.nome || "Cliente";
                          const pet = ev.itemVenda?.pet?.nome || "Pet";
                          const servico = getServicoLabel(ev);
                          const cor = statusColor(ev.status);

                          return (
                            <div
                              key={ev.id}
                              title={`${servico} | ${cliente} - ${pet}`}
                              style={{
                                position: "absolute",
                                left: 6,
                                right: 6,
                                top,
                                height,
                                background: `${cor}33`,
                                border: `1px solid ${cor}`,
                                borderLeft: `4px solid ${cor}`,
                                borderRadius: 8,
                                padding: "0.25rem 0.35rem",
                                overflow: "hidden",
                                color: "var(--text-h)",
                                fontSize: "0.75rem",
                                lineHeight: 1.2,
                              }}
                            >
                              <div style={{ fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                                {servico}
                              </div>
                              <div style={{ opacity: 0.9, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                                {cliente} • {pet}
                              </div>
                              <div style={{ opacity: 0.75 }}>
                                {inicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                {" - "}
                                {formatHourMinute(startMinutes + duration)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
