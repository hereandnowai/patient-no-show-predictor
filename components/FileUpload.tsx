import React, { useState, useCallback, useRef } from 'react';
import { PatientData } from '../types';
import { parseCSV } from '../utils/csvParser';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onDataUploaded: (data: PatientData[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUploaded, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Invalid file type. Please upload a CSV file.');
        setFileName(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      setError(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedData = parseCSV(text);
          if (parsedData.length === 0) {
            setError('CSV file is empty or could not be parsed correctly.');
            if(fileInputRef.current) fileInputRef.current.value = ""; 
            setFileName(null);
            return;
          }
          // Basic validation for required columns
          const requiredColumns = ['patient_id', 'name', 'age', 'appointment_date', 'booked_date'];
          const headers = Object.keys(parsedData[0]);
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            setError(`CSV missing required columns: ${missingColumns.join(', ')}.`);
            if(fileInputRef.current) fileInputRef.current.value = "";
            setFileName(null);
            return;
          }

          const typedData = parsedData.map(row => ({
            ...row,
          })) as PatientData[];
          
          onDataUploaded(typedData);

        } catch (err) {
          console.error("Error parsing CSV:", err);
          setError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
          if(fileInputRef.current) fileInputRef.current.value = "";
          setFileName(null);
        }
      };
      reader.readAsText(file);
    } else {
      setFileName(null);
    }
  }, [onDataUploaded]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-6 bg-[var(--brand-secondary-hover)] rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-6 text-center">Upload Patient Data</h2>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={disabled}
        />
        <button
          onClick={handleButtonClick}
          disabled={disabled}
          className={`
            flex items-center justify-center px-8 py-4 border-2 border-dashed border-[var(--brand-primary)] 
            rounded-lg text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] hover:border-[var(--brand-primary-hover)] 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
            focus:ring-[var(--brand-primary)] focus:ring-opacity-50 w-full max-w-md
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <UploadIcon className="w-8 h-8 mr-3" />
          <span className="text-lg font-medium">{fileName || 'Click to select a CSV file'}</span>
        </button>
        {fileName && !error && (
          <p className="text-sm text-green-400 mt-2">File selected: {fileName}</p>
        )}
        {error && (
          <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
        <p className="text-xs text-gray-400 mt-2 text-center max-w-md">
          Expected CSV columns: patient_id, name, age, gender, appointment_date, booked_date, sms_reminder_sent, no_show_history, visit_reason, chronic_conditions, previous_no_shows.
        </p>
      </div>
    </div>
  );
};