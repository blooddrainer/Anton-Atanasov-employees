import React, {ChangeEvent, JSX} from 'react';
import {useNavigate} from 'react-router';
import { useTranslation } from 'react-i18next';
import Papa, {ParseResult} from 'papaparse';

// Store
import { useCSVs } from '@/store/providers/CSVsProvider';

// Components
import { Uploader } from '@/components/Uploader';

// Styles
import * as styles from './UploadFile.module.less';

const CSV_REQUIRED_HEADERS = ['EmpID', 'ProjectID', 'DateFrom', 'DateTo'];

const csvValidate = ([headers]: string[]) => {
  return CSV_REQUIRED_HEADERS.every((header) => headers.includes(header));
};

function UploadFile(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addDataset } = useCSVs();

  const onFileSelected = (file: File): void => {
    Papa.parse(file, {
      complete: (results: ParseResult<unknown>): void => {
        if (!csvValidate(results.data as string[])) {
          console.error('Invalid CSV file');
          return;
        }

        // Add the new dataset to the context
        const dataId = addDataset(file.name, results.data);

        navigate(`/data/${dataId}`);
      },
      error: (error: Error): void => {
        console.error('Error parsing CSV:', error);
      }
    });
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <Uploader onFileSelect={onFileSelected} />
      </div>
    </div>
  );
}

export default UploadFile;
