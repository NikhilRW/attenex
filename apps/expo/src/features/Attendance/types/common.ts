import {
  AlertButton,
  AlertsOptions,
} from "react-native-paper-alerts/lib/typescript/type";

export type Lecture = {
  id: string;
  subject: string | null;
  className: string | null;
  duration: string;
  status: "active" | "ended";
  createdAt: string | null;
  startedAt: string | null;
  teacherLatitude: string;
  teacherLongitude: string;
};

export type AlertFunction = (
  title: string,
  message?: string,
  button?: AlertButton[],
  options?: AlertsOptions,
) => void;
