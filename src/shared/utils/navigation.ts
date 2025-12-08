import { useAuthStore } from "../stores/authStore";

export const getStartingScreenPath = () => {
  const user = useAuthStore.getState().user;
  
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
