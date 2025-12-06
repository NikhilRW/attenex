import { createMMKV } from "react-native-mmkv";

// Initialize MMKV instance
export const storage = createMMKV({
  id: "attenex-storage",
  encryptionKey: "attenex-secure-key-2024",
});

// Create a storage adapter compatible with Zustand's persist middleware
export const mmkvStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
