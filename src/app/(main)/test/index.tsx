import { useAuthStore } from "@/shared/stores/authStore";
import { Redirect } from "expo-router";

const TestRoute = () => {
  const user = useAuthStore((state) => state.user);

  return user ? (
    user.role === "teacher" ? (
      <Redirect href={"/(main)/classes"} />
    ) : (
      <Redirect href={"/(main)/attendance"} />
    )
  ) : (
    <Redirect href={"/(auth)/sign-in"} />
  );
};

export default TestRoute;
