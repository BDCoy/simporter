import initSqlJs, { Database } from 'sql.js';

class SQLiteService {
  private db: Database | null = null;
  private static instance: SQLiteService;

  private constructor() {}

  static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  async initialize(): Promise<void> {
    if (this.db) return;

    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    this.db = new SQL.Database();
    
    // Create some initial tables
    this.db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      const results: any[] = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      
      stmt.free();
      return results;
    } catch (error) {
      console.error('SQL Error:', error);
      throw error;
    }
  }

  async exec(sql: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.run(sql);
    } catch (error) {
      console.error('SQL Error:', error);
      throw error;
    }
  }

  exportDatabase(): Uint8Array {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.export();
  }

  importDatabase(data: Uint8Array): void {
    const SQL = require('sql.js');
    this.db = new SQL.Database(data);
  }
}

export const sqliteService = SQLiteService.getInstance();