export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  db_password: process.env.DB_PASSWORD || '',
  db_host: process.env.DB_HOST || '',
  db_port: process.env.DB_PORT || '',
  db_username: process.env.DB_USERNAME || '',
  db_name: process.env.DB_NAME || '',
});
