// components/ErrorMessage.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  suggestions?: string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "An Error Occurred", message, suggestions }) => {
  return (
    <div className="bg-red-900/70 border border-red-700 text-red-200 p-6 rounded-lg shadow-xl">
      <div className="flex items-center mb-3">
        <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
        <h3 className="text-xl font-semibold text-red-300">{title}</h3>
      </div>
      <p className="text-red-200 mb-3">{message}</p>
      {suggestions && suggestions.length > 0 && (
        <div>
          <p className="font-medium text-red-300 mb-1">Possible fixes:</p>
          <ul className="list-disc list-inside text-sm text-red-200 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;