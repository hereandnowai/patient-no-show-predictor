import React from 'react';
import { EnrichedPatientData, RiskLevel } from '../types';
import { RISK_LEVEL_TEXT_CLASS, RISK_LEVEL_BADGE_CLASS } from '../constants'; // Risk level colors remain semantic

interface HighRiskPatientsTableProps {
  predictions: EnrichedPatientData[];
}

const RiskLevelIndicator: React.FC<{ level: RiskLevel }> = ({ level }) => (
  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${RISK_LEVEL_BADGE_CLASS[level]}`}>
    {level}
  </span>
);

export const HighRiskPatientsTable: React.FC<HighRiskPatientsTableProps> = ({ predictions }) => {
  const riskScoreMap: Record<RiskLevel, number> = {
    [RiskLevel.LikelyNoShow]: 3,
    [RiskLevel.AtRisk]: 2,
    [RiskLevel.LikelyToAttend]: 1,
  };

  const sortedPatients = [...predictions]
    .sort((a, b) => {
      if (b.risk_score !== a.risk_score) {
        return b.risk_score - a.risk_score;
      }
      return riskScoreMap[b.risk_level] - riskScoreMap[a.risk_level];
    })
    .slice(0, 10);

  if (sortedPatients.length === 0) {
    return <p className="text-center text-gray-400">No high-risk patients identified or no data available.</p>;
  }

  return (
    <div className="overflow-x-auto bg-[var(--brand-secondary-hover)] rounded-lg shadow">
      <table className="min-w-full divide-y divide-[var(--brand-secondary)]">
        <thead className="bg-black/30">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">Patient ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">Risk Level</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">Risk Score</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">Suggested Action</th>
          </tr>
        </thead>
        <tbody className="bg-[var(--brand-card-bg)] divide-y divide-[var(--brand-secondary)]">
          {sortedPatients.map((patient) => (
            <tr key={patient.patient_id} className="hover:bg-[var(--brand-secondary-hover)] transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{patient.patient_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-on-secondary)] font-medium">{patient.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <RiskLevelIndicator level={patient.risk_level} />
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${RISK_LEVEL_TEXT_CLASS[patient.risk_level]}`}>
                {patient.risk_score.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{patient.suggested_action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};