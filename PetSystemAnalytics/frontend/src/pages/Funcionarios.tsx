import React, { useState } from 'react';
import { FuncionarioForm } from '../components/FuncionarioForm';
import { FuncionarioList } from '../components/FuncionarioList';

export function Funcionarios() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (funcionario: any) => {
    try {
      // TODO: Implementar chamada à API
      console.log('Criando funcionário:', funcionario);
      setShowForm(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  const sectionStyle: React.CSSProperties = {
    background: 'var(--bg)',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '2rem',
    boxShadow: 'var(--shadow)'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "1.5rem", margin: 0 }}>
      Gerenciamento de Funcionários
      </h1>

      {showForm && (
        <FuncionarioForm 
          onSubmit={handleSubmit}
        />
      )}

      {!showForm && (
        <button style={buttonStyle} onClick={() => setShowForm(true)}>
          + Novo Funcionário
        </button>
      )}

      <div style={sectionStyle}>
        <h2 style={{ color: "var(--accent)", marginTop: 0, fontSize: "1.25rem" }}>Lista de Funcionários</h2>
        <FuncionarioList key={refreshKey} />
      </div>
    </div>
  );
}
