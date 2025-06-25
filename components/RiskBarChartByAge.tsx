import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnrichedPatientData, RiskLevel, BarChartDataPoint } from '../types';
import { RISK_LEVEL_COLORS, AGE_GROUPS } from '../constants'; // Semantic colors for chart data
import { processRiskByAgeGroup } from '../utils/dataProcessor';


interface RiskBarChartByAgeProps {
  predictions: EnrichedPatientData[];
}

export const RiskBarChartByAge: React.FC<RiskBarChartByAgeProps> = ({ predictions }) => {
  const data = processRiskByAgeGroup(predictions);

  if (data.length === 0) {
    return <p className="text-center text-gray-400">Not enough data to display age group risks.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 223, 0, 0.2)" /> {/* Light primary color for grid */}
        <XAxis 
            dataKey="name" 
            angle={-35} 
            textAnchor="end" 
            height={70} 
            tick={{ fill: 'var(--brand-text-on-secondary, #FFFFFF)', fontSize: '0.8rem' }}
            interval={0}
        />
        <YAxis tick={{ fill: 'var(--brand-text-on-secondary, #FFFFFF)', fontSize: '0.8rem' }} allowDecimals={false} />
        <Tooltip 
            contentStyle={{ 
                backgroundColor: 'var(--brand-secondary-hover, #005050)', 
                border: '1px solid var(--brand-primary, #FFDF00)', 
                borderRadius: '8px',
                color: 'var(--brand-text-on-secondary, #FFFFFF)'
            }}
            itemStyle={{ color: 'var(--brand-text-on-secondary, #FFFFFF)' }}
            cursor={{ fill: 'rgba(255, 223, 0, 0.1)' }} // Light primary color for cursor
        />
        <Legend wrapperStyle={{ color: 'var(--brand-text-on-secondary, #FFFFFF)', paddingTop: '20px' }} />
        <Bar dataKey={RiskLevel.LikelyNoShow} stackId="a" fill={RISK_LEVEL_COLORS[RiskLevel.LikelyNoShow]} name="Likely No-Show" />
        <Bar dataKey={RiskLevel.AtRisk} stackId="a" fill={RISK_LEVEL_COLORS[RiskLevel.AtRisk]} name="At Risk" />
        <Bar dataKey={RiskLevel.LikelyToAttend} stackId="a" fill={RISK_LEVEL_COLORS[RiskLevel.LikelyToAttend]} name="Likely to Attend" />
      </BarChart>
    </ResponsiveContainer>
  );
};