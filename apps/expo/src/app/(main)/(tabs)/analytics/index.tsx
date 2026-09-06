import StudentAnalyticsScreen from "@analytics/screens/StudentAnalyticsScreen";
import TeacherAnalyticsScreen from "@analytics/screens/TeacherAnalyticsScreen";
import { useAuthStore } from "@shared/stores/authStore";

const Analytics = () => {
  const role = useAuthStore((state) => state.user?.role);

  return role === "student" ? <StudentAnalyticsScreen /> : <TeacherAnalyticsScreen />;
};

export default Analytics;
