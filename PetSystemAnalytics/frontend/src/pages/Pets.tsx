import { useState } from "react";
import { PetForm } from "../components/PetForm";
import { PetList } from "../components/PetList";
import type { PetResponse, CreatePetDTO } from "../types";
import { mockPets } from "../data/mockData";

export function Pets() {
  const [pets, setPets] = useState<PetResponse[]>(mockPets);

  const handleAddPet = (data: CreatePetDTO) => {
    const novoPet: PetResponse = {
      ...data,
      id: Math.max(...pets.map(p => p.id), 0) + 1,
    };
    setPets([...pets, novoPet]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        🐕 Gestão de Pets
      </h1>
      <PetForm onSubmit={handleAddPet} />
      <PetList pets={pets} />
    </div>
  );
}