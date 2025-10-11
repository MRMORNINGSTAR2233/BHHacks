/**
 * Environment configuration and validation
 */

export interface EnvConfig {
  googleApiKey: string;
  stabilityApiKey: string;
  replicateApiKey: string;
  nodeEnv: string;
}

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variable is missing
 */
export function validateEnv(): void {
  const required = [
    'GOOGLE_API_KEY',
    'STABILITY_API_KEY',
    'REPLICATE_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all API keys are configured.'
    );
  }
}

/**
 * Gets the environment configuration
 * @returns Environment configuration object
 */
export function getEnvConfig(): EnvConfig {
  return {
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    stabilityApiKey: process.env.STABILITY_API_KEY || '',
    replicateApiKey: process.env.REPLICATE_API_KEY || '',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

/**
 * Checks if a specific API key is configured
 * @param key - The environment variable name
 * @returns true if the key is set and non-empty
 */
export function hasApiKey(key: string): boolean {
  const value = process.env[key];
  return !!value && value.trim() !== '';
}
