import { Request, Response } from "express";
import "dotenv/config";
import { emailSignUp } from "./providers/emailSignUp";
import { selectOauthProvider } from "@utils/auth";
import * as v from "valibot";
import { authTypeQuerySchema } from "@attenex/api-contracts";

export const signUpUser = async (req: Request, res: Response) => {
  const parsed = v.safeParse(authTypeQuerySchema, req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid authType parameter; expected 'email'|'google'|'linkedin'",
    });
  }

  const { authType } = parsed.output;
  const oauthResult = selectOauthProvider(authType, req, res);
  if (oauthResult !== null) return oauthResult;

  if (authType === "email") {
    return emailSignUp(req, res);
  }
  // TODO: write internal server error occured in the message.
  return res.status(400).json({
    success: false,
    message:
      "Invalid authType parameter; expected 'email'|'google'|'linkedin'",
  });
};
