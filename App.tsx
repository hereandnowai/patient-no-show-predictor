import React, { useState, useEffect, useCallback } from 'react';
import { PatientData, EnrichedPatientData, RiskLevel } from './types';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ReportExporter } from './components/ReportExporter';
import { predictNoShowBatch } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorAlert } from './components/ErrorAlert';
import { WelcomeMessage } from './components/WelcomeMessage';

const App: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<PatientData[] | null>(null);
  const [predictions, setPredictions] = useState<EnrichedPatientData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError("Gemini API key is missing. Please ensure it's configured in your environment variables.");
    }
  }, []);

  const handleDataUploaded = useCallback((data: PatientData[]) => {
    setUploadedData(data);
    setPredictions(null); // Clear previous predictions
    setError(null); // Clear previous errors
  }, []);

  const processPredictions = useCallback(async () => {
    if (!uploadedData || uploadedData.length === 0) return;
    if (apiKeyMissing) return;

    setIsLoading(true);
    setError(null);
    try {
      const results = await predictNoShowBatch(uploadedData);
      setPredictions(results);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching predictions.";
      if (errorMessage.includes("API key not valid")) {
        setError("Invalid Gemini API Key. Please check your environment configuration.");
      } else {
        setError(errorMessage);
      }
      setPredictions(null);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedData, apiKeyMissing]);


  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      processPredictions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedData]); // Deliberately dependent on uploadedData to trigger processing

  const handleReset = () => {
    setUploadedData(null);
    setPredictions(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-secondary)] text-[var(--brand-text-on-secondary)]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {apiKeyMissing && (
          <ErrorAlert message="Critical Error: Gemini API key (API_KEY) is not configured in the environment. The application cannot function." />
        )}

        {!apiKeyMissing && !uploadedData && !isLoading && (
          <WelcomeMessage />
        )}
        
        {!apiKeyMissing && (
          <div className="bg-[var(--brand-card-bg)] shadow-2xl rounded-xl p-6 md:p-10 mb-8">
            <FileUpload onDataUploaded={handleDataUploaded} disabled={isLoading || apiKeyMissing} />
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <LoadingSpinner />
            <p className="text-xl text-[var(--brand-primary)]">AI is analyzing patient data... Please wait.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="my-6">
            <ErrorAlert message={error} />
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              Try Again
            </button>
          </div>
        )}

        {predictions && !isLoading && !error && (
          <>
            <div className="mb-8">
              <ReportExporter predictions={predictions} />
            </div>
            <Dashboard predictions={predictions} />
            <div className="mt-8 text-center">
               <button
                onClick={handleReset}
                className="px-6 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
              >
                Upload New Data
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;