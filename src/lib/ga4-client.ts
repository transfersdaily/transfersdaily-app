// GA4 Data API Client for server-side analytics queries
// Used by API routes to fetch analytics data from Google Analytics 4

import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * GA4 numeric property ID.
 * Found in GA4 Admin > Property Settings.
 */
export const GA4_PROPERTY_ID = '13922364170';

let cachedClient: BetaAnalyticsDataClient | null = null;

/**
 * Load GA4 service account credentials from environment or SSM Parameter Store.
 *
 * Priority:
 * 1. GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env var (for Vercel/non-AWS deployments)
 * 2. SSM Parameter Store at /transfersdaily/ga4/service-account-credentials (for AWS deployments)
 */
async function loadCredentials(): Promise<{ client_email: string; private_key: string }> {
  // Try environment variable first
  const envCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (envCredentials) {
    try {
      const parsed = JSON.parse(envCredentials);
      return { client_email: parsed.client_email, private_key: parsed.private_key };
    } catch {
      throw new Error('GA4 service account credentials are not valid JSON');
    }
  }

  // Fall back to SSM Parameter Store
  try {
    const { SSMClient, GetParameterCommand } = await import('@aws-sdk/client-ssm');
    const ssm = new SSMClient({});
    const result = await ssm.send(
      new GetParameterCommand({
        Name: '/transfersdaily/ga4/service-account-credentials',
        WithDecryption: true,
      })
    );

    const value = result.Parameter?.Value;
    if (!value) {
      throw new Error('SSM parameter value is empty');
    }

    try {
      const parsed = JSON.parse(value);
      return { client_email: parsed.client_email, private_key: parsed.private_key };
    } catch {
      throw new Error('GA4 service account credentials are not valid JSON');
    }
  } catch (error) {
    // If the error is our own JSON parsing error, re-throw it
    if (error instanceof Error && error.message.includes('not valid JSON')) {
      throw error;
    }
    // Otherwise, neither source had credentials
    throw new Error(
      'GA4 service account credentials not configured. ' +
        'Set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS env var or store in SSM at /transfersdaily/ga4/service-account-credentials'
    );
  }
}

/**
 * Get a cached GA4 Data API client instance.
 * Creates and caches the client on first call.
 */
export async function getGA4Client(): Promise<BetaAnalyticsDataClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const { client_email, private_key } = await loadCredentials();

  cachedClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email,
      private_key,
    },
  });

  return cachedClient;
}

/**
 * Clear the cached GA4 client instance.
 * Useful for testing or credential rotation.
 */
export function clearGA4ClientCache(): void {
  cachedClient = null;
}
