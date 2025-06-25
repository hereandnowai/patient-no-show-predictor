
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PatientData, PredictionResult, RiskLevel, EnrichedPatientData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key (process.env.API_KEY) is not set.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

function parseGeminiResponse(responseText: string, patientData: PatientData[]): PredictionResult[] {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      console.error("Gemini response is not an array:", parsed);
      throw new Error("AI response was not in the expected array format.");
    }
    
    return parsed.map((item: any) => {
      const originalPatient = patientData.find(p => p.patient_id === item.patient_id);
      return {
        patient_id: item.patient_id || originalPatient?.patient_id || "N/A",
        name: item.name || originalPatient?.name || "N/A",
        risk_level: Object.values(RiskLevel).includes(item.risk_level) ? item.risk_level as RiskLevel : RiskLevel.AtRisk,
        risk_score: typeof item.risk_score === 'number' ? Math.max(0, Math.min(1, item.risk_score)) : 0.5,
        suggested_action: item.suggested_action || "Review Manually",
      };
    });
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Raw response:", responseText);
    throw new Error(`Failed to parse AI's response. Please check console for details. Raw output: ${responseText.substring(0,100)}...`);
  }
}


const generatePrompt = (patients: PatientData[]): string => {
  const patientDataString = JSON.stringify(patients.map(p => ({
    patient_id: p.patient_id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    appointment_date: p.appointment_date,
    booked_date: p.booked_date,
    sms_reminder_sent: p.sms_reminder_sent,
    no_show_history: p.no_show_history,
    visit_reason: p.visit_reason,
    chronic_conditions: p.chronic_conditions,
    previous_no_shows: p.previous_no_shows,
  })), null, 2);

  return `
You are an AI assistant specialized in healthcare analytics. Your task is to predict patient no-show likelihood and suggest proactive actions.
Analyze the following patient appointment records. For each patient, provide a prediction in JSON format.

The CSV columns provided are: patient_id, name, age, gender, appointment_date, booked_date, sms_reminder_sent, no_show_history, visit_reason, chronic_conditions, previous_no_shows.

- 'sms_reminder_sent' (Yes/No): Indicates if an SMS reminder was sent.
- 'no_show_history' (Yes/No): Indicates if the patient has a history of missing appointments.
- 'chronic_conditions': A comma-separated list of conditions or a count.
- 'previous_no_shows': Number of previously missed appointments.

Based on this data, predict the no-show risk. The 'appointment_date' indicates the upcoming appointment, and 'booked_date' when it was made. Consider factors like how far in advance it was booked (days_booked_in_advance = appointment_date - booked_date), patient history, age, reason for visit, previous_no_shows, etc. A higher number of 'previous_no_shows' significantly increases risk. Not sending an SMS reminder ('sms_reminder_sent: No') can also increase risk. Appointments booked very far in advance or very last minute might have different risk profiles.

Output a JSON array, where each object represents a patient and has the following structure:
{
  "patient_id": "<original_patient_id>",
  "name": "<original_name>",
  "risk_level": "Likely to Attend" | "At Risk" | "Likely No-Show",
  "risk_score": number (a value between 0.0 for lowest risk and 1.0 for highest risk. For example: Likely to Attend ~0.0-0.3, At Risk ~0.3-0.7, Likely No-Show ~0.7-1.0),
  "suggested_action": "Send SMS Reminder" | "Send Call Reminder" | "Consider Double Booking" | "Monitor Closely" | "Send Cancellation Alert" | "No specific action needed"
}

Here is the patient data as a JSON array:
${patientDataString}

Ensure your entire response is ONLY the JSON array. Do not include any other text, explanations, or markdown fences.
The output must be a valid JSON array of objects, one for each patient provided in the input.
`;
};

interface ErrorDetails {
  message?: string;
  code?: string | number;
  statusString?: string;
}

function getErrorDetails(error: any): ErrorDetails {
    let msg: string | undefined;
    let codeVal: string | number | undefined;
    let statusStr: string | undefined;

    if (error.response?.data?.error && typeof error.response.data.error === 'object') { // Axios-like structure
        const payload = error.response.data.error;
        msg = typeof payload.message === 'string' ? payload.message : undefined;
        codeVal = error.response.status; // HTTP status code
        statusStr = typeof payload.status === 'string' ? payload.status : undefined;
    } else if (error.error && typeof error.error === 'object') { // Nested error: { error: { message, code, status } }
        const payload = error.error;
        msg = typeof payload.message === 'string' ? payload.message : undefined;
        codeVal = payload.code;
        statusStr = typeof payload.status === 'string' ? payload.status : undefined;
    } else if (typeof error.message === 'string') { // Top-level error.message is the primary source
        msg = error.message; // Assume it's the primary message first
        try {
            // Attempt to parse error.message if it's a JSON string
            const parsed = JSON.parse(error.message);
            let innerMsg: string | undefined;
            let innerCode: any;
            let innerStatus: string | undefined;

            if (parsed.error && typeof parsed.error === 'object') { // e.g. { "error": { "message": "...", "code": ..., "status": "..."}}
                innerMsg = typeof parsed.error.message === 'string' ? parsed.error.message : undefined;
                innerCode = parsed.error.code;
                innerStatus = typeof parsed.error.status === 'string' ? parsed.error.status : undefined;
            } else if (typeof parsed.message === 'string') { // e.g. { "message": "...", "code": ...}
                innerMsg = parsed.message;
                innerCode = parsed.code;
                innerStatus = typeof parsed.status === 'string' ? parsed.status : undefined;
            }

            if (innerMsg) msg = innerMsg; // Prefer inner message if successfully parsed
            if (innerCode) codeVal = innerCode;
            if (innerStatus) statusStr = innerStatus;

        } catch (e) {
            // error.message was not JSON, or parsing failed; msg remains the original error.message
        }
        // If code/status not found in parsed JSON (or if error.message wasn't JSON), check top-level error object properties
        if (!codeVal && error.code) codeVal = error.code;
        
        if (!statusStr && typeof error.status === 'string' && isNaN(parseInt(error.status, 10))) {
            statusStr = error.status;
        } else if (!codeVal && typeof error.status === 'number') { // if error.status is an HTTP code like 429
             codeVal = error.status;
        }

    } else { // No error.message string, check for direct code/status properties
        if (error.code) codeVal = error.code;
        if (typeof error.status === 'string' && isNaN(parseInt(error.status, 10))) {
            statusStr = error.status;
        } else if (typeof error.status === 'number') { // e.g. error.status = 429
            codeVal = error.status;
        }
    }
    
    // Consolidate: if statusStr is a numeric string (like "429") and codeVal is not set, use it for codeVal.
    if (!codeVal && statusStr && !isNaN(parseInt(statusStr, 10))) {
        codeVal = parseInt(statusStr, 10);
    }
    
    return { message: msg, code: codeVal, statusString: statusStr };
}


export const predictNoShowBatch = async (patientBatch: PatientData[]): Promise<EnrichedPatientData[]> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API_KEY might be missing.");
  }
  if (patientBatch.length === 0) {
    return [];
  }

  const prompt = generatePrompt(patientBatch);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json", 
        temperature: 0.2, 
      },
    });

    const predictions = parseGeminiResponse(response.text, patientBatch);
    
    return patientBatch.map(originalPatient => {
      const prediction = predictions.find(p => p.patient_id === originalPatient.patient_id);
      return {
        ...originalPatient,
        risk_level: prediction?.risk_level || RiskLevel.AtRisk,
        risk_score: prediction?.risk_score ?? 0.5,
        suggested_action: prediction?.suggested_action || "Review Manually",
      };
    });

  } catch (error: any) {
    console.error("Raw error caught by Gemini API call:", error);

    const { message: humanReadableMessage, code: apiCode, statusString: apiStatusStringVal } = getErrorDetails(error);
    
    const effectiveCodeStr = apiCode ? String(apiCode) : undefined;
    const statusForCheck = apiStatusStringVal || (error.error?.status);


    const isRateLimitError = effectiveCodeStr === "429" || 
                             statusForCheck === "RESOURCE_EXHAUSTED";

    if (isRateLimitError) {
      const messageParts = [];
      messageParts.push(`API Quota Exceeded or Rate Limit Reached.`);
      if (effectiveCodeStr) {
        messageParts.push(`(Status Code: ${effectiveCodeStr}).`);
      }

      let apiProvidedDetails = "";
      if (humanReadableMessage && humanReadableMessage.trim()) {
          apiProvidedDetails = humanReadableMessage.trim();
          // Ensure it ends with a period if it doesn't have one or other significant punctuation.
          if (!/[.!?]$/.test(apiProvidedDetails)) {
            apiProvidedDetails += ".";
          }
      } else {
          apiProvidedDetails = "No specific message provided by the API.";
      }
      messageParts.push(`Details: ${apiProvidedDetails}`);
      
      const lowerApiDetails = apiProvidedDetails.toLowerCase();
      if (!lowerApiDetails.includes("check your plan") && !lowerApiDetails.includes("billing details") && !lowerApiDetails.includes("quota")) {
        messageParts.push("Please check your Gemini API plan and billing details.");
      }
      messageParts.push("You can also wait and try again later, as this might be a temporary rate limit.");
      
      throw new Error(messageParts.join(" "));
    }
    
    let finalErrorMessage = humanReadableMessage || 'Unknown error during AI prediction.';
    
    const lowerFinalErrorMessage = finalErrorMessage.toLowerCase();
    const isApiKeyInvalid = lowerFinalErrorMessage.includes('api key not valid') || 
                            lowerFinalErrorMessage.includes('api_key_invalid') ||
                            (statusForCheck === 'INVALID_ARGUMENT' && lowerFinalErrorMessage.includes('api key')) ||
                            (effectiveCodeStr === "400" && lowerFinalErrorMessage.includes('api key'));

    if (isApiKeyInvalid) {
      throw new Error(`Invalid Gemini API Key. Please check your environment configuration. Details: ${finalErrorMessage}`);
    }
    
    if ((finalErrorMessage === 'Unknown error during AI prediction.' || finalErrorMessage === error.message || finalErrorMessage.trim().startsWith('{')) &&
        error && typeof error === 'object' && Object.keys(error).length > 0 &&
        !isRateLimitError) { 
      try {
        const errorJson = JSON.stringify(error);
        if (errorJson !== '{}' && errorJson.length < 500) { 
            finalErrorMessage = errorJson;
        } else if (errorJson !== '{}') {
            finalErrorMessage = "Complex error object received, check console for full details.";
        }
      } catch (e) { /* keep previous finalErrorMessage if stringify fails */ }
    }
    throw new Error(`AI prediction failed: ${finalErrorMessage}`);
  }
};
