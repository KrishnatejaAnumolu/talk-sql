// lib/db.ts
import mysql from 'mysql2/promise';

export interface DBConnectionParams {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

export async function getConnection(params: DBConnectionParams) {
  if (!params.host || !params.user || !params.database) {
    throw new Error('Host, user, and database are required.');
  }
  return await mysql.createConnection({
    host: params.host,
    port: params.port || 3306,
    user: params.user,
    password: params.password,
    database: params.database,
  });
}

export async function getSchema(connection: mysql.Connection): Promise<string> {
  let schemaString = "";

  try {
    const [tables] = await connection.execute<mysql.RowDataPacket[]>("SHOW TABLES");

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0] as string;
      const [tableDefinition] = await connection.execute<mysql.RowDataPacket[]>(`SHOW CREATE TABLE \`${tableName}\``);
      if (tableDefinition && tableDefinition.length > 0) {
        schemaString += `${tableDefinition[0]['Create Table']};\n\n`;
      }
    }
  } catch (error) {
    console.error("Error fetching schema:", error);
    throw new Error("Could not fetch database schema. Please check permissions and database structure.");
  }
  return schemaString.trim();
}