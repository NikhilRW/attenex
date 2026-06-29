import db, { classes, lectures, users } from "@config/database_setup";
import { message } from "@services/firebase";
import { logger } from "@utils/logger";
import { eq } from "drizzle-orm";

export const lectureClosure = async (lectureId: string) => {
  const lecture = (
    await db
      .select({
        endedAt: lectures.endedAt,
        status: lectures.status,
        teacherId: lectures.teacherId,
        classId: lectures.classId,
      })
      .from(lectures)
      .where(eq(lectures.id, lectureId))
      .limit(1)
  )[0];

  const { className } = (
    await db
      .select({ className: classes.name })
      .from(classes)
      .where(eq(classes.id, lecture.classId))
  )[0];

  if (lecture.status === "ended") return;

  const endedAt = new Date();
  await db.update(lectures).set({ endedAt, status: "ended" });

  const user = (
    await db
      .select({ token: users.deviceToken })
      .from(users)
      .where(eq(users.id, lecture.teacherId))
      .limit(1)
  )[0];

  if (user.token !== "") {
    await message.send({
      token: user.token,
      data: {
        lectureId,
        ended: "true",
        endedAt: endedAt.toDateString(),
      },
    });
  }

  if (className) {
    await message.send({
      topic: className,
      data: {
        ended: "true",
      },
    });
  }
};
