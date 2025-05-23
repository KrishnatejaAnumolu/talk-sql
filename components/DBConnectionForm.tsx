// components/DBConnectionForm.tsx
import React, { useState, useEffect } from "react";
import { DBConnectionParams } from "../lib/db"; // Reuse interface
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface DBConnectionFormProps {
  onConnect: (params: DBConnectionParams) => Promise<void>;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

const DBConnectionForm: React.FC<DBConnectionFormProps> = ({
  onConnect,
  loading,
  error,
  isConnected,
}) => {
  const [params, setParams] = useState<DBConnectionParams>({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "",
  });

  // Load saved connection details from sessionStorage on component mount
  useEffect(() => {
    const savedParams = sessionStorage.getItem("dbConnectionParams");
    if (savedParams) {
      setParams(JSON.parse(savedParams));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const updatedParams = {
      ...params,
      [name]: type === "number" ? parseInt(value) || undefined : value,
    };
    setParams(updatedParams);
    // Save to sessionStorage whenever params change
    sessionStorage.setItem("dbConnectionParams", JSON.stringify(updatedParams));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(params);
  };

  if (isConnected) {
    return (
      <div className="bg-slate-700 p-6 rounded-lg shadow-xl text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-green-300">
          Successfully Connected!
        </h2>
        <p className="text-slate-300 mt-2">
          You can now proceed to the query page.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
    >
      <h2 className="text-3xl font-bold text-center text-sky-400 mb-8">
        Connect to MySQL
      </h2>
      {(["host", "user", "password", "database"] as const).map((field) => (
        <div key={field}>
          <label
            htmlFor={field}
            className="block text-sm font-medium text-slate-300 mb-1 capitalize"
          >
            {field}{" "}
            {field !== "password" && <span className="text-red-400">*</span>}
          </label>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            id={field}
            value={params[field] || ""}
            onChange={handleChange}
            required={field !== "password"}
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            placeholder={
              field === "host"
                ? "e.g., localhost or AWS RDS endpoint"
                : `Enter ${field}`
            }
          />
        </div>
      ))}
      <div>
        <label
          htmlFor="port"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Port
        </label>
        <input
          type="number"
          name="port"
          id="port"
          value={params.port || ""}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          placeholder="e.g., 3306"
        />
      </div>
      {error && (
        <div className="bg-red-700/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-300" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={loading || isConnected}
        className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:text-sky-500 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
        ) : (
          "Connect"
        )}
        {loading && "Connecting..."}
      </button>
    </form>
  );
};

export default DBConnectionForm;
