import React from 'react';
import { EnrichedPatientData, RiskLevel } from '../types';
import { RiskPieChart } from './RiskPieChart';
import { RiskBarChartByAge } from './RiskBarChartByAge';
import { HighRiskPatientsTable } from './HighRiskPatientsTable';
import { ChartPieIcon, ChartBarIcon, ListBulletIcon, ExclamationTriangleIcon } from './icons';

interface DashboardProps {
  predictions: EnrichedPatientData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center p-8 bg-[var(--brand-card-bg)] rounded-lg shadow-xl">
        <ExclamationTriangleIcon className="w-16 h-16 text-amber-400 mx-auto mb-4" /> {/* Keep amber for warning */}
        <h3 className="text-2xl font-semibold text-[var(--brand-text-on-secondary)]">No Prediction Data Available</h3>
        <p className="text-gray-400 mt-2">Upload a CSV file to see the dashboard insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-[var(--brand-card-bg)] p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-6 flex items-center">
          <ChartPieIcon className="w-7 h-7 mr-3 text-[var(--brand-primary)]" />
          No-Show Risk Distribution
        </h2>
        <div className="h-80 md:h-96">
          <RiskPieChart predictions={predictions} />
        </div>
      </section>

      <section className="bg-[var(--brand-card-bg)] p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-6 flex items-center">
          <ChartBarIcon className="w-7 h-7 mr-3 text-[var(--brand-primary)]" />
          No-Show Risk by Age Group
        </h2>
        <div className="h-96 md:h-[500px]">
          <RiskBarChartByAge predictions={predictions} />
        </div>
      </section>

      <section className="bg-[var(--brand-card-bg)] p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-[var(--brand-primary)] mb-6 flex items-center">
          <ListBulletIcon className="w-7 h-7 mr-3 text-[var(--brand-primary)]" />
          Top 10 Highest-Risk Patients
        </h2>
        <HighRiskPatientsTable predictions={predictions} />
      </section>
    </div>
  );
};