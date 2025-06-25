
import { PatientData } from '../types';

export const parseCSV = (csvText: string): PatientData[] => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error("CSV file must contain a header row and at least one data row.");
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const data: PatientData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(','); // Simple split, doesn't handle commas in quotes
    const entry: any = {};
    for (let j = 0; j < header.length; j++) {
      let value: string | number = values[j] ? values[j].trim() : '';
      if (header[j] === 'age' || header[j] === 'previous_no_shows') {
        value = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(value as number)) value = 0; // Default to 0 if parsing fails
      }
      entry[header[j]] = value;
    }
    data.push(entry as PatientData);
  }
  return data;
};
