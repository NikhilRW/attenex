import {
  AlertButton,
  AlertsOptions,
} from "react-native-paper-alerts/lib/typescript/type";

export type Lecture = {
  id: string;
  subject: string;
  className: string;
  duration: string;
  status: "active" | "ended";
  createdAt: Date;
  startedAt: Date;
  teacherLatitude: string;
  teacherLongitude: string;
};

export type AlertFunction = (
  title: string,
  message?: string,
  button?: AlertButton[],
  options?: AlertsOptions,
) => void;
