export const JWT_SECRET = process.env.JWT_SECRET ?? 'secret-key';

const port = process.env.PORT || '3001';
const apiVersion = process.env.API_VERSION || 'v1';

export const config = {
  envName: process.env.NODE_ENV,
  port,
  jwtSecret: process.env.JWT_SECRET_KEY || 'SECRET_KEY',
  apiVersion,
  aws: {
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
      bucketName: process.env.AWS_BUCKET_NAME || '',
    },
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      `http://localhost:${port}/api/${apiVersion}/auth/google/callback`,
  },
  frontend: {
    webUrl: process.env.WEB_URL || `http://localhost:3000`,
    extensionUrl: process.env.EXTENSION_URL || `http://localhost:3000`,
  },
};
