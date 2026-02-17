import { useAlerts } from "react-native-paper-alerts";
import { LectureWithCount } from "../types";
import { lectureService } from "../services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";

export const useLectureCard = (lecture:LectureWithCount) => {
    const { alert } = useAlerts();
    const queryClient = useQueryClient();
      const { mutateAsync: deleteLecture, isPending: isDeletingLecture } = useMutation<{sucess:boolean},LectureWithCount,>({
        mutationKey: mutationKeys.lectures.delete.default,
    });
       const handleDeleteLecture = () => {
         if (lecture.status !== "ended") {
            alert(
                "Cannot Delete",
                "Only ended lectures can be deleted. Please end the lecture first.",
            );
            return;
        }

        alert(
            "Delete Lecture",
            `Are you sure you want to delete "${lecture.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = deleteLecture(lecture);
                            if (res.success) {
                                await queryClient.invalidateQueries({ queryKey: queryKeys.lectures.teacher })
                            }
                        } catch (error: any) {
                            alert("Error", error.message || "Failed to delete lecture");
                        }
                    },
                },
            ],
        );
    }
  
 
    return {
        handleDeleteLecture,
        isDeletingLecture
    }
};