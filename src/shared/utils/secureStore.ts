import * as SecureStore from "expo-secure-store";

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
    } catch (err) {
      // Fallback or log error if needed
      console.error("SecureStore#setItem error", err);
      throw err;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (err) {
      console.error("SecureStore#getItem error", err);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error("SecureStore#removeItem error", err);
      throw err;
    }
  },
};
