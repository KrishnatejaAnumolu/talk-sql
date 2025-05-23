// pages/index.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import DBConnectionForm from "../components/DBConnectionForm";
import { DBConnectionParams } from "../lib/db";

// Store connection details and schema in memory or sessionStorage for simplicity
// For a more robust solution, consider React Context or a state management library
interface AppState {
  dbConfig: DBConnectionParams | null;
  schema: string | null;
}
let appState: AppState = { dbConfig: null, schema: null }; // Simple in-memory store

// Helper to manage app state (alternative to context for this simple case)
export const getAppState = () => appState;
export const setAppState = (newState: Partial<AppState>) => {
  appState = { ...appState, ...newState };
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if already connected from a previous interaction (e.g., navigating back)
    if (getAppState().dbConfig && getAppState().schema) {
      setIsConnected(true);
      // Optional: auto-redirect if already connected
      // router.push('/query');
    }
  }, [router]);

  const handleConnect = async (params: DBConnectionParams) => {
    setLoading(true);
    setError(null);
    setIsConnected(false);
    try {
      const response = await fetch("/api/connect-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to connect.");
      }
      setAppState({ dbConfig: params, schema: data.schema });
      setIsConnected(true);
      // Wait a bit to show success message before redirecting
      setTimeout(() => router.push("/query"), 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setAppState({ dbConfig: null, schema: null }); // Clear state on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Connect to Database">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-10">
        <DBConnectionForm
          onConnect={handleConnect}
          loading={loading}
          error={error}
          isConnected={isConnected}
        />
        {isConnected && (
          <button
            onClick={() => router.push("/query")}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
          >
            Go to Query Page →
          </button>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
