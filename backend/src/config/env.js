import dotenv from 'dotenv';

dotenv.config();

const required = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'DIRECT_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
  'APP_BASE_URL',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
];

required.push("OPENAI_API_KEY");
required.push("GROQ_API_KEYS");
required.push("GEMINI_API_KEYS");

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(` Missing required env var: ${key}`);
    process.exit(1);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),

  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

  frontendUrl: process.env.FRONTEND_URL,
  appBaseUrl: process.env.APP_BASE_URL,

  emailHost: process.env.EMAIL_HOST,
  emailPort: Number(process.env.EMAIL_PORT),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,

  authMode: process.env.AUTH_MODE,

  groqApiKeys: process.env.GROQ_API_KEYS
    ? process.env.GROQ_API_KEYS.split(",")
    : [],

  geminiApiKeys: process.env.GEMINI_API_KEYS
    ? process.env.GEMINI_API_KEYS.split(",")
    : [],
};
