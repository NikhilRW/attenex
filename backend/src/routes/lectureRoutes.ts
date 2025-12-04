import express from "express";
import { createLecture } from "../controllers/lectures/createLecture";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// POST /api/lectures/create - Create a new lecture
router.post("/create", authenticate, createLecture);

export default router;
