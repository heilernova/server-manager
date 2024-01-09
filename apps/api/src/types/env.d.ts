declare  {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production';
      readonly PORT?: string;
      readonly PGHOST: string,
      readonly PGUSER: string,
      readonly PGPASSWORD: string,
      readonly PGDATABASE: string,
      readonly PGPORT?: number
    }
  }
}