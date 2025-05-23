// components/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "Processing...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
      <Loader2 className="w-12 h-12 animate-spin text-sky-500 mb-4" />
      <p>{message}</p>
    </div>
  );
};
export default LoadingSpinner;
