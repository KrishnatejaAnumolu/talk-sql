// pages/api/connect-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection, getSchema, DBConnectionParams } from '../../lib/db';

interface ConnectResponse {
  schema?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConnectResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const params: DBConnectionParams = req.body;

  let connection;
  try {
    connection = await getConnection(params);
    const schema = await getSchema(connection);
    await connection.end();
    res.status(200).json({ schema });
  } catch (error: any) {
    console.error("Connection API Error:", error);
    let errorMessage = "An unexpected error occurred while connecting to the database.";
    if (error.message.includes("Access denied")) {
        errorMessage = "Access denied. Please check your username and password.";
    } else if (error.message.includes("Unknown database")) {
        errorMessage = "The specified database does not exist. Please check the database name.";
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = "Could not connect to the database server. Please check the host and port, and ensure the server is running and accessible.";
    } else if (error.message.includes("Host, user, and database are required")) {
        errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}