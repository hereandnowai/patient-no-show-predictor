
import { RiskLevel } from './types';

export const RISK_LEVEL_COLORS: { [key in RiskLevel]: string } = {
  [RiskLevel.LikelyToAttend]: "#34D399", // Tailwind emerald-400
  [RiskLevel.AtRisk]: "#FBBF24",       // Tailwind amber-400
  [RiskLevel.LikelyNoShow]: "#F87171",   // Tailwind red-400
};

export const RISK_LEVEL_TEXT_CLASS: { [key in RiskLevel]: string } = {
  [RiskLevel.LikelyToAttend]: "text-emerald-400",
  [RiskLevel.AtRisk]: "text-amber-400",
  [RiskLevel.LikelyNoShow]: "text-red-400",
};

export const RISK_LEVEL_BG_CLASS: { [key in RiskLevel]: string } = {
  [RiskLevel.LikelyToAttend]: "bg-emerald-500",
  [RiskLevel.AtRisk]: "bg-amber-500",
  [RiskLevel.LikelyNoShow]: "bg-red-500",
};

export const RISK_LEVEL_BADGE_CLASS: { [key in RiskLevel]: string } = {
  [RiskLevel.LikelyToAttend]: "bg-emerald-100 text-emerald-800 border-emerald-300",
  [RiskLevel.AtRisk]: "bg-amber-100 text-amber-800 border-amber-300",
  [RiskLevel.LikelyNoShow]: "bg-red-100 text-red-800 border-red-300",
};


export const AGE_GROUPS = ["0-18", "19-35", "36-50", "51-65", "65+"];

export const PREDICTION_CSV_HEADERS = [
  { label: "Patient ID", key: "patient_id" },
  { label: "Name", key: "name" },
  { label: "Risk Level", key: "risk_level" },
  { label: "Risk Score", key: "risk_score" },
  { label: "Suggested Action", key: "suggested_action" },
];
