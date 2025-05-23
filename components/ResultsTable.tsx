// components/ResultsTable.tsx
import React from "react";
import { Table, AlertCircle } from "lucide-react";
import type { FieldPacket } from "mysql2"; // Import FieldPacket type

interface ResultsTableProps {
  results: any[];
  fields?: FieldPacket[]; // Make fields optional or ensure it's always passed
  error?: string | null; // For errors specific to results display
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  fields,
  error,
}) => {
  if (error) {
    return (
      <div className="bg-red-700/30 border border-red-600 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-red-300" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No results to display. Try a different query!</p>
      </div>
    );
  }

  // Use fields if available for headers, otherwise infer from the first result
  const headers = fields
    ? fields.map((field) => field.name)
    : Object.keys(results[0] || {});

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-700/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700">
          {results.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-slate-700/70 transition-colors"
            >
              {headers.map((header) => (
                <td
                  key={`${rowIndex}-${header}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-slate-200"
                >
                  {typeof row[header] === "object"
                    ? JSON.stringify(row[header])
                    : String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
