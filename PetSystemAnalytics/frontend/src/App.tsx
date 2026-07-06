import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Produtos } from "./pages/Produtos";
import { Servicos } from "./pages/Servicos";
import { OProjeto } from "./pages/OProjeto";
import { Equipe } from "./pages/Equipe";
import { Pets } from "./pages/Pets";
import { Vendas } from "./pages/Vendas";
import { mockKPIs } from "./data/mockData";
import type { KPIResponse } from "./types";
import "./App.css";

type Page = "dashboard" | "clientes" | "produtos" | "servicos" | "pets" | "vendas" | "projeto" | "equipe";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const initialKpis: KPIResponse = mockKPIs;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "var(--accent)",
        color: "white",
        padding: "2rem",
        boxShadow: "var(--shadow)"
      }}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>🐾 Pet System Analytics</h1>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <nav style={{
          width: "250px",
          background: "var(--bg)",
          borderRight: "1px solid var(--border)",
          padding: "1rem",
          boxShadow: "var(--shadow)"
        }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { id: "dashboard", icon: "📊", label: "Dashboard" },
              { id: "clientes", icon: "👥", label: "Clientes" },
              { id: "pets", icon: "🐕", label: "Pets" },
              { id: "produtos", icon: "📦", label: "Produtos" },
              { id: "servicos", icon: "🐾", label: "Serviços" },
              { id: "vendas", icon: "🛒", label: "Vendas" },
              { id: "projeto", icon: "📋", label: "O Projeto" },
              { id: "equipe", icon: "👥", label: "Equipe" }
            ].map((item) => (
              <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => setCurrentPage(item.id as Page)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75rem",
                    border: "none",
                    borderRadius: "4px",
                    background: currentPage === item.id ? "var(--accent)" : "transparent",
                    color: currentPage === item.id ? "white" : "var(--text)",
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    fontSize: "1rem",
                    transition: "all 0.2s"
                  }}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          background: "var(--bg)"
        }}>
          {currentPage === "dashboard" && <Dashboard kpis={initialKpis} />}
          {currentPage === "clientes" && <Clientes />}
          {currentPage === "produtos" && <Produtos />}
          {currentPage === "servicos" && <Servicos />}
          {currentPage === "pets" && <Pets />}
          {currentPage === "vendas" && <Vendas />}
          {currentPage === "projeto" && <OProjeto />}
          {currentPage === "equipe" && <Equipe />}
        </main>
      </div>
    </div>
  );
}