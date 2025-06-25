import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnrichedPatientData, RiskLevel, ChartDataItem } from '../types';
import { RISK_LEVEL_COLORS } from '../constants'; // Semantic colors for chart data

interface RiskPieChartProps {
  predictions: EnrichedPatientData[];
}

export const RiskPieChart: React.FC<RiskPieChartProps> = ({ predictions }) => {
  const data = Object.values(RiskLevel).map(level => ({
    name: level,
    value: predictions.filter(p => p.risk_level === level).length,
    fill: RISK_LEVEL_COLORS[level],
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return <p className="text-center text-gray-400">No data to display in pie chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          fill="#8884d8" // Default fill, overridden by Cell
          dataKey="value"
          nameKey="name"
          label={({ name, percent, fill }) => 
             <text x={0} y={0} dy={8} textAnchor="middle" fill={fill} fontSize="0.9rem" fontWeight="bold">
                {`${name}: ${(percent * 100).toFixed(0)}%`}
             </text>
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
          ))}
        </Pie>
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
        <Legend wrapperStyle={{ color: 'var(--brand-text-on-secondary, #FFFFFF)', paddingTop: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};