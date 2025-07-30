import { GroupedResult } from "@/types/Employees";

export interface CSVDataset {
  id: string;
  name: string;
  data: Array<unknown>;
  uploadedAt: Date;
}

export interface CSVsState {
  datasets: Record<string, CSVDataset>;
  activeDatasetId: string | null;
}
