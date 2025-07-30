import React, { useEffect, useState } from 'react';

// Store
import { useCSVs } from '@/store/providers/CSVsProvider';

// Types
import { GroupedResult } from '@/types/Employees';
import {DataTable} from "@/components/DataTable";
import {Column} from "@/types/DataTable";

interface Project {
  empId: string;
  projectId: string;
  startDate: string;
  endDate: string;
}

interface Projects {
  [key: string]: Project[];
}

interface EmployeesMap {
  [key: string]: number;
}

const columns: Column<GroupedResult>[] = [
  {
    field: 'empId1',
    header: 'Employee ID #1',
  },
  {
    field: 'empId2',
    header: 'Employee ID #2',
  },
  {
    field: 'projectId',
    header: 'Project ID',
    sortable: true,
  },
  {
    field: 'workDays',
    header: 'Days worked',
    sortable: true,
  },
];

/**
 * Calculate the number of days between dates
 *
 * @param {number} startDate - timestamp
 * @param {number} endDate - timestamp
 * @returns {number}
 */
const daysBetweenDates = (startDate: number, endDate: number): number => {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Calculate the overlap of two periods
 *
 * @param startDate1
 * @param endDate1
 * @param startDate2
 * @param endDate2
 * @returns {number}
 */
const crossWorkDays = (startDate1: string, endDate1: string, startDate2: string, endDate2: string): number => {
  const parsedStartDate1: number = Date.parse(startDate1);
  let parsedEndDate1: number = Date.parse(endDate1);
  const parsedStartDate2: number = Date.parse(startDate2);
  let parsedEndDate2: number = Date.parse(endDate2);

  if (Number.isNaN(parsedEndDate1)) {
    parsedEndDate1 = Date.now();
  }

  if (Number.isNaN(parsedEndDate2)) {
    parsedEndDate2 = Date.now();
  }

  const maxStartDate: number = Math.max(parsedStartDate1, parsedStartDate2);
  const minEndDate: number = Math.min(parsedEndDate1, parsedEndDate2);

  if (minEndDate < maxStartDate) {
    // If they didn't work in same time, we return 0 days
    return 0;
  }

  return daysBetweenDates(maxStartDate, minEndDate);
}

/**
 * Filter employees by overlap periods
 * @param {Project[]} employees
 * @returns {Array}
 */
const getCrossWorkDays = (employees: Array<Project>): Array<GroupedResult> => {
  const data: GroupedResult[] = [];
  const employeesMap: EmployeesMap = {};

  for (let i = 0; i < employees.length; i++) {
    for (let j = i + 1; j < employees.length; j++) {
      const employee1 = employees[i];
      const employee2 = employees[j];

      if (employee1.empId === employee2.empId) {
        continue;
      }

      const workDays = crossWorkDays(
        employee1.startDate,
        employee1.endDate,
        employee2.startDate,
        employee2.endDate,
      );

      if (workDays > 0) {
        const employeeMapId = employee1.empId + ':' + employee2.empId;

        if (!employeesMap[employeeMapId]) {
          employeesMap[employeeMapId] = 0;
        }

        employeesMap[employeeMapId] += workDays;
      }
    }
  }

  Object.keys(employeesMap).forEach((key) => {
    const [employee1, employee2] = key.split(':');

    data.push({
      empId1: employee1,
      empId2: employee2,
      workDays: employeesMap[key],
    });
  });

  return data;
};

export default function Data() {
  const [data, setData] = useState<Array<GroupedResult>>([]);
  const { state } = useCSVs();
  const activeDataset = state.activeDatasetId
    ? state.datasets[state.activeDatasetId]
    : null;

  useEffect(() => {
    if (!activeDataset) {
      return;
    }

    const records: Projects = activeDataset.data.reduce((obj: Projects, item: any): Projects => {
      if (!Array.isArray(item) || item.length < 4) {
        console.error('Unknown data format');
        return obj;
      }

      const [empId, projectId, startDate, endDate] = item;

      if (!obj[projectId]) {
        obj[projectId] = [];
      }

      obj[projectId].push({
        empId: String(empId).trim(),
        projectId: String(projectId).trim(),
        startDate: String(startDate).trim(),
        endDate: String(endDate).trim(),
      });

      return obj;
    }, {});
    const projectResults: GroupedResult[] = [];

    for (const projectId in records) {
      const employees: GroupedResult[] = getCrossWorkDays(records[projectId]);

      employees.forEach((employee: GroupedResult) => {
        projectResults.push({
          projectId,
          ...employee,
        });
      })
    }

    setData(projectResults
      .sort((a: GroupedResult, b: GroupedResult) => b.workDays - a.workDays));
  }, []);

  return (
    <DataTable data={data} columns={columns} pageSize={10} />
  );
}
