import React, { createContext } from 'react';
import { CSVDataset, CSVsState } from '@/types/CSV';
import { GroupedResult } from '@/types/Employees';

interface CSVsContextType {
  state: CSVsState;
  addDataset: (name: string, data: Array<unknown>) => string;
  removeDataset: (id: string) => void;
  setActiveDataset: (id: string | null) => void;
  getDataset: (id: string) => CSVDataset | undefined;
}

export const CSVsContext = createContext<CSVsContextType | undefined>(undefined);
