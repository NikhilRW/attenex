import { Request, Response } from "express";
import { emailSignIn } from "./providers/emailSignIn";
import { selectOauthProvider } from "@utils/auth";
import * as v from "valibot";
import { authTypeQuerySchema } from "@attenex/api-contracts";

export const signInUser = async (req: Request, res: Response) => {
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
    return emailSignIn(req, res);
  }

  // TODO: write internal server error occured in the message.
  return res.status(400).json({
    success: false,
    message:
      "",
  });
};
