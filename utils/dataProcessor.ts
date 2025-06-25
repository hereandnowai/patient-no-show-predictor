
import { EnrichedPatientData, RiskLevel, BarChartDataPoint } from '../types';
import { AGE_GROUPS } from '../constants';

const getAgeGroup = (age: number): string => {
  if (age <= 18) return AGE_GROUPS[0]; // 0-18
  if (age <= 35) return AGE_GROUPS[1]; // 19-35
  if (age <= 50) return AGE_GROUPS[2]; // 36-50
  if (age <= 65) return AGE_GROUPS[3]; // 51-65
  return AGE_GROUPS[4]; // 65+
};

export const processRiskByAgeGroup = (predictions: EnrichedPatientData[]): BarChartDataPoint[] => {
  const ageGroupData: { [group: string]: { [level in RiskLevel]: number } } = {};

  AGE_GROUPS.forEach(group => {
    ageGroupData[group] = {
      [RiskLevel.LikelyToAttend]: 0,
      [RiskLevel.AtRisk]: 0,
      [RiskLevel.LikelyNoShow]: 0,
    };
  });

  predictions.forEach(p => {
    const age = typeof p.age === 'string' ? parseInt(p.age, 10) : p.age;
    if (isNaN(age)) return; // Skip if age is not a valid number

    const group = getAgeGroup(age);
    if (ageGroupData[group] && p.risk_level) {
      ageGroupData[group][p.risk_level]++;
    }
  });
  
  return AGE_GROUPS.map(groupName => ({
    name: groupName,
    ...ageGroupData[groupName]
  })).filter(dataPoint => 
    dataPoint[RiskLevel.LikelyToAttend] > 0 ||
    dataPoint[RiskLevel.AtRisk] > 0 ||
    dataPoint[RiskLevel.LikelyNoShow] > 0
  ); // Only include age groups with data
};
