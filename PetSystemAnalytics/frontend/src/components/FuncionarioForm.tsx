import React, { useState } from 'react';

interface CreateFuncionarioDTO {
  nome: string;
  telefone: string;
  email: string;
  cargo: string;
}

interface FuncionarioFormProps {
  onSubmit: (funcionario: CreateFuncionarioDTO) => Promise<void>;
}

export function FuncionarioForm({ onSubmit }: FuncionarioFormProps) {
  const [formData, setFormData] = useState<CreateFuncionarioDTO>({
    nome: '',
    telefone: '',
    email: '',
    cargo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nome || !formData.email || !formData.telefone || !formData.cargo) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        cargo: '',
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao criar funcionário.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle: React.CSSProperties = {
    background: 'var(--bg)',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '2rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'var(--input-bg)',
    color: 'var(--text)',
    fontFamily: 'inherit',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const cargoOptions = ['Gerente', 'Veterinário', 'Banho e Tosa', 'Recepcionista', 'Outro'];

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ color: 'var(--accent)', marginTop: 0 }}>Cadastrar Funcionário</h2>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <input
        type="tel"
        name="telefone"
        placeholder="Telefone"
        value={formData.telefone}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <select
        name="cargo"
        value={formData.cargo}
        onChange={handleChange}
        style={inputStyle}
        required
      >
        <option value="">Selecione um cargo</option>
        {cargoOptions.map(cargo => (
          <option key={cargo} value={cargo}>
            {cargo}
          </option>
        ))}
      </select>

      <button 
        type="submit" 
        style={buttonStyle}
        disabled={loading}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
