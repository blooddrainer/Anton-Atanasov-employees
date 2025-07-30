import React, { JSX, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

// Styles
import * as styles from './Uploader.module.less';

interface Props {
  onFileSelect: (file: File) => void;
}

const ALLOWED_FILE_TYPES = ['text/csv', 'application/vnd.ms-excel'];

export const Uploader = ({ onFileSelect }: Props): JSX.Element=> {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const { t } = useTranslation();

  const validateFile = (file: File): boolean => {
    return ALLOWED_FILE_TYPES.includes(file.type);
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) {
      console.error('Invalid file type');
      return;
    }

    onFileSelect(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(isDragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragActive(false);
    setIsDragReject(false);

    const files = Array.from(e.dataTransfer?.files || []) as File[];

    if (files.length > 1) {
      console.error('Please drop only one file');
      return;
    }

    const file = files[0];

    if (!validateFile(file)) {
      setIsDragReject(true);
      setTimeout(() => setIsDragReject(false), 2000);
      return;
    }

    handleFile(file);
  }, [handleFile]);

  return (
    <div
      className={clsx(styles.dropZone, {
        [styles.dragActive]: isDragActive,
        [styles.dragReject]: isDragReject
      })}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
    >
      <div className={styles.icon}>
        📁
      </div>
      <p className={styles.dropZoneText}>
        {isDragActive
          ? t('uploader.drop_csv_file_here')
          : isDragReject
            ? t('uploader.invalid_file_type')
            : t('uploader.drag_n_drop_file_here')}
      </p>
      <input
        type="file"
        id="fileInput"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleFile(file);
          }
        }}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => document.getElementById('fileInput')?.click()}
        className={styles.button}
      >
        {t('uploader.select_file')}
      </button>
    </div>
  );
}
