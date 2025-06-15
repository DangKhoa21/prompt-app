const port = process.env.PORT || '3001';
const apiVersion = process.env.API_VERSION || 'v1';

export const config = {
  envName: process.env.NODE_ENV,
  port,
  token: {
    auth: {
      jwtSecret: process.env.JWT_SECRET_KEY || 'SECRET_KEY',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h', // JWT expires in 1 hour
    },
    resetPassword: {
      jwtSecret: process.env.RESET_PASSWORD_SECRET || 'RESET_PASSWORD_SECRET',
      expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || '2m', // Reset password token expires in 2 minutes
    },
  },
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
  mailService: {
    senderName: process.env.MAIL_SENDER_NAME || '',
    domain: process.env.MAIL_DOMAIN || '',
    resend: {
      apiKey: process.env.RESEND_API_KEY || '',
    },
  },
};
