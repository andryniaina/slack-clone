import { registerAs } from '@nestjs/config';

function getEnvVar(key: string, defaultValue: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value ?? defaultValue;
}

export const appConfig = registerAs('app', () => ({
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  database: {
    url: getEnvVar('DATABASE_URL', 'mongodb://localhost:27017/slack'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'dev-secret-key'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  },
  cors: {
    origin: getEnvVar('CORS_ORIGIN', '*'),
    credentials: true,
  },
})); 