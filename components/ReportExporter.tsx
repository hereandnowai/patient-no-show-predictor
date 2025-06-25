import React from 'react';
import { EnrichedPatientData } from '../types';
import { PREDICTION_CSV_HEADERS } from '../constants';
import { DownloadIcon } from './icons';

interface ReportExporterProps {
  predictions: EnrichedPatientData[];
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ predictions }) => {
  const convertToCSV = (data: EnrichedPatientData[]): string => {
    const headerRow = PREDICTION_CSV_HEADERS.map(col => col.label).join(',');
    const dataRows = data.map(row => 
      PREDICTION_CSV_HEADERS.map(col => {
        let value = (row as any)[col.key];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`; // Enclose in quotes if contains comma
        }
        if (typeof value === 'number' && col.key === 'risk_score') {
          return value.toFixed(2);
        }
        return value;
      }).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
  };

  const handleExport = () => {
    if (predictions.length === 0) return;
    const csvData = convertToCSV(predictions);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'patient_no_show_predictions_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="text-center md:text-right">
      <button
        onClick={handleExport}
        disabled={predictions.length === 0}
        className="
          inline-flex items-center px-6 py-3 border border-transparent text-base font-medium 
          rounded-lg shadow-sm text-[var(--brand-text-on-primary)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--brand-secondary)] focus:ring-[var(--brand-primary-hover)]
          disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        Export Report (CSV)
      </button>
    </div>
  );
};