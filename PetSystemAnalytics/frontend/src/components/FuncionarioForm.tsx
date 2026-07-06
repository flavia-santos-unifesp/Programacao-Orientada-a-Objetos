import React, { useState } from 'react';
import { fetchAPI } from '../services/api';

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
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para formatar telefone
  const formatTelefone = (value: string): string => {
    // Remove tudo que não é número
    const números = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitado = números.slice(0, 11);

    // Aplica a máscara
    if (limitado.length === 0) return "";
    if (limitado.length <= 2) return `(${limitado}`;
    if (limitado.length <= 7) return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  };
  
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const telefoneFormatado = formatTelefone(valor);
    setFormData({ ...formData, telefone: telefoneFormatado });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome || !formData.email || !formData.telefone || !formData.cargo) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido.');
      return;
    }

    try {
      setLoading(true);
      await fetchAPI('/funcionarios', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccess('Funcionário cadastrado com sucesso!');
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        cargo: '',
      });
      // Chamar callback opcional
      await onSubmit(formData);
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
      <h2 style={{ color: 'var(--accent)', marginTop: 0, fontSize: '1.25rem' }}>Cadastrar Funcionário</h2>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ✓ {success}
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
        onChange={handleTelefoneChange}
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
