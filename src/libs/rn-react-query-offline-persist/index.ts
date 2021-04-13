import { Promisable } from 'type-fest';
import { QueryClient } from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';
import { hydrate, dehydrate, DehydratedState } from 'react-query/hydration';

interface PersistedClient {
  buster: string;
  timestamp: number;
  clientState: DehydratedState;
}

interface Persistor {
  removeClient(): Promisable<void>;
  restoreClient(): Promisable<PersistedClient | undefined>;
  persistClient(persistClient: PersistedClient): Promisable<void>;
}

interface PersistQueryClientOptions {
  /** The QueryClient to persist */
  queryClient: QueryClient;
  /** The Persistor interface for storing and restoring the cache
   * to/from a persisted location */
  persistor: Persistor;
  /** The max-allowed age of the cache.
   * If a persisted cache is found that is older than this
   * time, it will be discarded */
  maxAge?: number;
  /** A unique string that can be used to forcefully
   * invalidate existing caches if they do not share the same buster string */
  buster?: string;
}

interface CreateLocalStoragePersistorOptions {
  /** The key to use when storing the cache to localstorage */
  localStorageKey?: string;
  /** To avoid localstorage spamming,
   * pass a time in ms to throttle saving the cache to disk */
  throttleTime?: number;
  /** The max-allowed age of the cache.
   * If a persisted cache is found that is older than this
   * time, it will be discarded */
  maxAge?: number;
  /** A unique string that can be used to forcefully
   * invalidate existing caches if they do not share the same buster string */
  buster?: string;
}

export async function persistQueryClient({
  queryClient,
  persistor,
  maxAge = 1000 * 60 * 60 * 24,
  buster = ''
}: PersistQueryClientOptions) {
  // Subscribe to changes
  const saveClient = () => {
    const persistClient: PersistedClient = {
      buster,
      timestamp: Date.now(),
      clientState: dehydrate(queryClient)
    };

    persistor.persistClient(persistClient);
  };

  // Attempt restore
  try {
    const persistedClient = await persistor.restoreClient();

    if (persistedClient) {
      if (persistedClient.timestamp) {
        const expired = Date.now() - persistedClient.timestamp > maxAge;
        const busted = persistedClient.buster !== buster;
        if (expired || busted) {
          persistor.removeClient();
        } else {
          hydrate(queryClient, persistedClient.clientState);
        }
      } else {
        persistor.removeClient();
      }
    }
  } catch (err) {
    // SEND THIS LOGS TO OUR ERROR REPORTER
    console.error(err);
    console.warn(
      'Encountered an error attempting to restore client cache from persisted location. As a precaution, the persisted cache will be discarded.'
    );
    persistor.removeClient();
  }

  // Subscribe to changes in the query cache to trigger the save
  queryClient.getQueryCache().subscribe(saveClient);
}

export function createLocalStoragePersistor(
  options: CreateLocalStoragePersistorOptions = {}
) {
  const {
    localStorageKey = `@REACT_QUERY_OFFLINE_CACHE`,
    throttleTime = 1000
  } = options;

  const persistorMethods: Persistor = {
    persistClient: () => undefined,
    restoreClient: () => undefined,
    removeClient: () => undefined
  };

  if (AsyncStorage) {
    persistorMethods.persistClient = throttle((persistedClient) => {
      AsyncStorage.setItem(localStorageKey, JSON.stringify(persistedClient));
    }, throttleTime);

    persistorMethods.restoreClient = async () => {
      const cacheString = await AsyncStorage.getItem(localStorageKey);

      if (!cacheString) return;

      return JSON.parse(cacheString) as PersistedClient;
    };

    persistorMethods.removeClient = async () => {
      return await AsyncStorage.removeItem(localStorageKey);
    };
  }

  return persistorMethods;
}

function throttle(func: (...args: any[]) => any, wait = 100) {
  let timer: number | null = null;

  return function (...args: any[]) {
    if (timer === null) {
      timer = setTimeout(() => {
        func(...args);
        timer = null;
      }, wait);
    }
  };
}
