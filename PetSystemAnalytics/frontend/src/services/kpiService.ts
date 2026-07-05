import type { KPIResponse } from "../types";
import { fetchAPI } from "./api";

export const kpiService = {
  getKPIs: () =>
    fetchAPI<KPIResponse>("/kpis"),
};