import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import LocalStorage from "lib/LocalStorage";
import { QUERY_STORAGE_CACHE } from "constants/layout";

const clientPersister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => {
      const value = LocalStorage.getString(key);
      return value ?? null;
    },
    setItem: (key: string, value: string) => {
      LocalStorage.set(key, value);
    },
    removeItem: (key: string) => {
      LocalStorage.delete(key);
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: QUERY_STORAGE_CACHE } },
});

export default { clientPersister, queryClient };
