import cron from "node-cron";
import { lectureClosure } from "../tasks/lectureClosure";
import { logger } from "./logger";

// For Scheduling The Task To Schedule Lecture End At A Correct Time.

export const scheduleLectureEnd = async (
  lectureId: string,
  durationMinutes: number,
) => {
  const currentDate = new Date();

  let minutes = currentDate.getMinutes();
  let hours = currentDate.getHours();

  const extraHour = Math.floor((minutes + durationMinutes) / 60);
  const extraMinutes = Math.floor(
    (minutes + durationMinutes) % (60 * (extraHour <= 1 ? 1 : extraHour)),
  );

  hours = (hours + extraHour) % 23;
  minutes = extraMinutes;

  console.log(`hours : ${hours} minutes : ${minutes}`);

  const scheduleTimings = `${minutes} ${hours} * * *`;

  cron.schedule(scheduleTimings, async () => await lectureClosure(lectureId), {
    maxExecutions: 1,
    name: "cron-job-" + lectureId,
  });
  logger.info(
    `Scheduled lecture end for lectureId ${lectureId} at ${scheduleTimings} `,
  );
};

export const destroyScheduledLectureEnd = async (lectureId: string) => {
  cron.getTasks().forEach((task) => {
    if (task.name === "cron-job-" + lectureId) {
      task.destroy();
      logger.info("Destroy cron job");
    }
  });
};
