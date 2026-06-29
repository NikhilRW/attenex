import { message } from "@services/firebase";
import { sendNotification } from "@utils/sendNotification";
import { Request, Response } from "express";

export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    await sendNotification(
      "D7C",
      "FSWD LEC 6",
      "580f5378-eb8d-40e8-8a05-6393fef89d93",
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
