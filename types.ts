
export interface PatientData {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  appointment_date: string;
  booked_date: string;
  sms_reminder_sent: string; // "Yes" or "No"
  no_show_history: string; // "Yes" or "No"
  visit_reason: string;
  chronic_conditions: string;
  previous_no_shows: number;
  [key: string]: any; // Allow other properties from CSV
}

export enum RiskLevel {
  LikelyToAttend = "Likely to Attend",
  AtRisk = "At Risk",
  LikelyNoShow = "Likely No-Show",
}

export interface PredictionResult {
  patient_id: string;
  name: string;
  risk_level: RiskLevel;
  risk_score: number; // 0.0 (low) to 1.0 (high)
  suggested_action: string;
}

export interface EnrichedPatientData extends PatientData, PredictionResult {}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface BarChartDataPoint {
  name: string; // Age group or Visit reason
  [RiskLevel.LikelyToAttend]: number;
  [RiskLevel.AtRisk]: number;
  [RiskLevel.LikelyNoShow]: number;
}
