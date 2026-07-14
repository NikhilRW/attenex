import { useAuthStore } from "@shared/stores/authStore";

import { UserSchema } from "../schemas/auth";

export const getStartingScreenPath = (newUser: UserSchema | null = null) => {
  let user = newUser;
  if (!user) {
    user = useAuthStore.getState().user;
  }

  if (!user) {
    return "/(auth)/sign-in";
  }
  if (user?.role === "teacher") {
    return "/(main)/(tabs)/classes";
  }
  if (user?.role === "student") {
    return "/(main)/(tabs)/attendance";
  }
  if (!user?.role) {
    return "/(main)/(tabs)/role-selection";
  }
  return "/(auth)/sign-in";
};
