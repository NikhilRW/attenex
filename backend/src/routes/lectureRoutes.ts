import express from "express";
import { addManualAttendance } from "../controllers/lectures/addManualAttendance";
import { createLecture } from "../controllers/lectures/createLecture";
import { deleteLecture } from "../controllers/lectures/deleteLecture";
import { endLecture } from "../controllers/lectures/endLecture";
import { fetchLectureAttendance } from "../controllers/lectures/fetchLectureAttendance";
import { getActiveLectures } from "../controllers/lectures/getActiveLectures";
import { getLectureDetails } from "../controllers/lectures/getLectureDetails";
import { getStudentLectures } from "../controllers/lectures/getStudentLectures";
import { getTeacherClasses } from "../controllers/lectures/getTeacherClasses";
import { updateLecture } from "../controllers/lectures/updateLecture";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Lecture Management
router.post("/create", authenticate, createLecture);
router.get("/active", authenticate, getActiveLectures);
router.get("/student/lectures", authenticate, getStudentLectures);
router.get("/classes", authenticate, getTeacherClasses);
router.get("/:lectureId/details", authenticate, getLectureDetails);
router.put("/:lectureId/end", authenticate, endLecture);
router.put("/:lectureId/update", authenticate, updateLecture);
router.delete("/:lectureId", authenticate, deleteLecture);

// Attendance Management
router.get("/:lectureId/attendance", authenticate, fetchLectureAttendance);
router.post("/:lectureId/attendance/manual", authenticate, addManualAttendance);

export default router;
