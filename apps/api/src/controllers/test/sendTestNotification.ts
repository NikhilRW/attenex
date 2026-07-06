import { message } from "@services/firebase";
import { sendNotification } from "@utils/sendNotification";
import { Request, Response } from "express";

export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    await sendNotification(
      "D7C",
      "FSWD LEC 6",
      "aae0264a-1423-4897-a433-f26887d1ef6e",
      "60",
    );
    return res.status(200).json({
      success: true,
      message: "Sended the notification sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
};
