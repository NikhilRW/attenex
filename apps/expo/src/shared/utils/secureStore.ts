import * as SecureStore from "expo-secure-store";

import { mmkvStorage } from "./mmkvStorage";

const memoryStore = mmkvStorage;

const isMissingEntitlementError = (error: unknown) =>
  error instanceof Error && error.message.includes("A required entitlement isn't present");

/**
 * Secure store wrapper around Expo SecureStore for token management
 * Provides simple get/set/remove helpers, centralizing how we store sensitive values.
 */
export const secureStore = {
  async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
      });
      memoryStore.removeItem(key);
    } catch (err) {
      console.error("SecureStore#setItem error", err);
      if (isMissingEntitlementError(err)) {
        memoryStore.setItem(key, value);
        return;
      }
      throw err;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (err) {
      console.error("SecureStore#getItem error", err);
      if (isMissingEntitlementError(err)) {
        return memoryStore.getItem(key) ?? null;
      }
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
      memoryStore.removeItem(key);
    } catch (err) {
      console.error("SecureStore#removeItem error", err);
      if (isMissingEntitlementError(err)) {
        memoryStore.removeItem(key);
        return;
      }
      throw err;
    }
  },
};
