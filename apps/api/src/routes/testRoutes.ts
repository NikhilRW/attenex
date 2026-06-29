import { sendTestNotification } from "../controllers/test/sendTestNotification";
import express from "express";

const router = express.Router();

router.post("/send-notification", sendTestNotification);

export default router;
