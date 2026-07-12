import { sendTestNotification } from "../controllers/test/sendTestNotification";
import { fastForwardLecture } from "../controllers/test/fastForwardLecture";
import express from "express";

const router = express.Router();

router.post("/send-notification", sendTestNotification);
router.post("/fast-forward-lecture", fastForwardLecture);

export default router;
