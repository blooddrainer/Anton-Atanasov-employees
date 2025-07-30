import { ReactNode, useContext, useState } from 'react';
import { CSVDataset, CSVsState } from '@/types/CSV';
import { CSVsContext } from '../contexts/CSVsContext';

const initialState: CSVsState = {
  datasets: {},
  activeDatasetId: null,
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export function CSVsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CSVsState>(initialState);

  const addDataset = (name: string, data: Array<unknown>): string => {
    const id = generateId();
    const newDataset: CSVDataset = {
      id,
      name,
      data,
      uploadedAt: new Date(),
    };

    setState(prevState => ({
      ...prevState,
      datasets: {
        ...prevState.datasets,
        [id]: newDataset
      },
      activeDatasetId: id
    }));

    return id;
  };

  const removeDataset = (id: string) => {
    setState(prevState => {
      const { [id]: removed, ...remainingDatasets } = prevState.datasets;
      return {
        ...prevState,
        datasets: remainingDatasets,
        activeDatasetId: prevState.activeDatasetId === id ? null : prevState.activeDatasetId
      };
    });
  };

  const setActiveDataset = (id: string | null) => {
    setState(prevState => ({
      ...prevState,
      activeDatasetId: id
    }));
  };

  const getDataset = (id: string) => {
    return state.datasets[id];
  };

  return (
    <CSVsContext.Provider value={{
      state,
      addDataset,
      removeDataset,
      setActiveDataset,
      getDataset
    }}>
      {children}
    </CSVsContext.Provider>
  );
}

export function useCSVs() {
  const context = useContext(CSVsContext);
  if (context === undefined) {
    throw new Error('useCSVs must be used within a CSVsProvider');
  }
  return context;
}

