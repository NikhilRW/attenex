export interface CreateLectureAPIResponse {
  success: boolean;
  message: string;
  data: {
    lecture: {
      id: string;
      title: string;
      className: string;
      duration: string;
      status: string;
      createdAt: Date;
    };
  };
}