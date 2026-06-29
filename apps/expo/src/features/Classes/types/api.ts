export interface CreateLectureAPIResponse {
  success: boolean;
  message: string;
  data: {
    lecture: {
      id: string;
      subject: string;
      subjectId?: string | null;
      className: string;
      duration: string;
      status: string;
      createdAt: Date;
    };
  };
}