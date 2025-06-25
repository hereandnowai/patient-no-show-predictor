import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="bg-red-700/80 border-l-4 border-red-500 text-white p-6 rounded-lg shadow-md backdrop-blur-sm" role="alert">
      <div className="flex items-center">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-300 mr-3" />
        <div>
          <p className="font-bold text-red-100">Error</p>
          <p className="text-sm text-red-200">{message}</p>
        </div>
      </div>
    </div>
  );
};