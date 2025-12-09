import { User } from "@/backend/src/config/database_setup";
import { useAuthStore } from "../stores/authStore";

export const getStartingScreenPath = (newUser: User | null = null) => {
  let user = newUser;
  if (!user) {
    user = useAuthStore.getState().user;
  }

  if (!user) {
    return "/(auth)/sign-in";
  }
  if (user?.role === "teacher") {
    return "/(main)/classes";
  }
  if (user?.role === "student") {
    return "/(main)/attendance";
  }
  if (!user?.role) {
    return "/(main)/role-selection";
  }
  return "/(auth)/sign-in";
};
