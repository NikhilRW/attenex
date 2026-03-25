import { message } from "@services/firebase";
import { sendNotification } from "@utils/sendNotification";
import { Request, Response } from "express";

export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    await sendNotification(
      "D7C",
      "FSWD LEC 6",
      "2625c51e-0824-4f3a-8d91-a98920dd4847",
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
