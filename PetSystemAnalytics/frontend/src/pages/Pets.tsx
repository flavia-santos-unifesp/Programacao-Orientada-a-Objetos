import { useEffect, useState } from "react";
import { PetForm } from "../components/PetForm";
import { PetList } from "../components/PetList";
import type { PetResponse, CreatePetDTO } from "../types";
import { fetchAPI } from "../services/api";

export function Pets() {
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar pets do backend
  useEffect(() => {
    const carregarPets = async () => {
      try {
        const data = await fetchAPI<PetResponse[]>("/pets");
        setPets(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar pets");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarPets();
  }, []);

  const handleAddPet = async (data: CreatePetDTO) => {
    try {
      const novoPet = await fetchAPI<PetResponse>("/pets", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setPets([...pets, novoPet]);
      setError(null);
    } catch (err) {
      setError("Erro ao adicionar pet");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        🐕 Gestão de Pets
      </h1>
      {error && <div style={{ color: "red", padding: "0.5rem" }}>{error}</div>}
      {loading ? <p>Carregando...</p> : <PetForm onSubmit={handleAddPet} />}
      {loading ? <p>Carregando...</p> : <PetList pets={pets} />}
    </div>
  );
}