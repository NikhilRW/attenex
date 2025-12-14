export type Lecture = {
  id: string;
  title: string;
  className: string;
  duration: string;
  status: "active" | "ended";
  createdAt: Date;
  startedAt: Date;
  teacherLatitude: string;
  teacherLongitude: string;
};
