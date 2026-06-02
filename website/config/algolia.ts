/**
 * Algolia DocSearch Configuration - Application Layer
 *
 * Search integration settings.
 * Separated to allow easy swapping of search providers.
 */

export const algoliaConfig = {
  /** Algolia application ID */
  appId: process.env.ALGOLIA_APP_ID || 'YOUR_APP_ID',

  /** Algolia search API key (public, safe to commit) */
  apiKey: process.env.ALGOLIA_API_KEY || 'YOUR_SEARCH_API_KEY',

  /** Algolia index name */
  indexName: 'zerolang',

  /** Contextual search - filters results by current language */
  contextualSearch: true,

  /** Optional: external domain crawling */
  externalUrlRegex: 'zerolang\\.ai',
};

export type AlgoliaConfig = typeof algoliaConfig;
