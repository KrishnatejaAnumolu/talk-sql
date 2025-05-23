// components/QueryInput.tsx
import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, loading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSubmit(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your data... e.g., 'Show me all customers from London' or 'List top 5 products by sales'"
          rows={3}
          className="w-full p-4 pr-16 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:text-sky-500 rounded-md text-white transition-colors"
          aria-label="Submit Query"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default QueryInput;
