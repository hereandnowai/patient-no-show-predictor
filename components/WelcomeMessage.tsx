import React from 'react';
import { BrainIcon } from './icons'; // BrainIcon color is now var(--brand-primary) via icons.tsx

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="bg-[var(--brand-card-bg)] shadow-2xl rounded-xl p-8 md:p-12 text-center">
      <BrainIcon className="w-20 h-20 mx-auto mb-6" /> {/* Color from var(--brand-primary) */}
      <h2 className="text-4xl font-extrabold text-[var(--brand-primary)] mb-4">
        Welcome to the Patient No-Show Predictor
      </h2>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        Leverage the power of AI to predict which patients are likely to miss their appointments. 
        Upload your patient appointments dataset in CSV format to get started.
      </p>
      <div className="text-left bg-[var(--brand-secondary-hover)] p-6 rounded-lg max-w-xl mx-auto space-y-2 text-gray-400 text-sm">
        <p className="font-semibold text-[var(--brand-text-on-secondary)]">Instructions:</p>
        <ul className="list-disc list-inside space-y-1">
            <li>Prepare your patient data in a CSV file.</li>
            <li>Ensure your CSV has the following columns: <code className="bg-black/30 px-1 rounded text-xs text-[var(--brand-primary)]">patient_id, name, age, gender, appointment_date, booked_date, sms_reminder_sent, no_show_history, visit_reason, chronic_conditions, previous_no_shows</code>.</li>
            <li>Click the "Upload Patient Data" button below and select your CSV file.</li>
            <li>The AI will analyze the data and provide predictions and insights.</li>
        </ul>
      </div>
    </div>
  );
};