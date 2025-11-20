import { AppDataSource } from '../config/data-source';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.connected) {
      console.log('Database already connected');
      return;
    }

    try {
      await AppDataSource.initialize();
      this.connected = true;
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connected) {
      console.log('Database not connected');
      return;
    }

    try {
      await AppDataSource.destroy();
      this.connected = false;
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.connected && AppDataSource.isInitialized;
  }

  public getDataSource() {
    if (!this.connected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return AppDataSource;
  }
}
