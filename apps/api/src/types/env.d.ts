declare  {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PGHOST: string,
      PGUSER: string,
      PGPASSWORD: string,
      PGDATABASE: string,
      PGPORT?: number
    }
  }
}