import axios from "axios";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db, users } from "../../../config/database_setup";
import { logger } from "../../../utils/logger";
import * as v from "valibot";
import { linkedInAuthRequestSchema } from "@attenex/api-contracts";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "xxxx-xxxx-xxxx";
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";

export const linkedInAuth = async (req: Request, res: Response) => {
  try {
    const parsed = v.safeParse(linkedInAuthRequestSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: code and redirectUri",
      });
    }

    const { code, redirectUri } = parsed.output;

    logger.info("LinkedIn OAuth: Starting token exchange process");

    /**
     * Step 1: Exchange Authorization Code for Access Token
     *
     * This is the most critical security step. We send:
     * - grant_type: 'authorization_code' (standard OAuth flow)
     * - code: The authorization code from LinkedIn
     * - client_id & client_secret: Our LinkedIn app credentials
     * - redirect_uri: Must match exactly what was used in authorization
     *
     * LinkedIn responds with:
     * - access_token: Bearer token for API calls
     * - expires_in: Token lifetime (typically 60 days)
     * - token_type: Usually "Bearer"
     */
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      // Use URLSearchParams for proper form encoding
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET, // ⚠️ Never expose this to frontend
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Validate that we received an access token
    if (!access_token) {
      throw new Error("No access token received from LinkedIn");
    }

    logger.info("LinkedIn OAuth: Access token obtained successfully");

    /**
     * Step 2: Fetch User Profile from LinkedIn
     *
     * Using the access token, we can now call LinkedIn's user info endpoint
     * to get the authenticated user's profile data.
     *
     * This endpoint returns:
     * - sub: Unique user identifier (use as oauthId)
     * - name: Full display name
     * - email: Primary email address
     * - picture: Profile picture URL (if available)
     */
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const linkedinUser = profileResponse.data;

    logger.info(`LinkedIn OAuth: Retrieved profile for ${linkedinUser.email}`);
    logger.info(
      `LinkedIn OAuth: Retrieved profile for ${JSON.stringify(
        profileResponse.data
      )}`
    );

    /**
     * Step 3: Check if User Exists in Database
     *
     * We use the email as the primary identifier since it's unique and persistent.
     * LinkedIn users are pre-verified, so we set isVerified: true.
     *
     * If user exists: Update their LinkedIn OAuth info
     * If user doesn't exist: Create new user account
     */
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, linkedinUser.email))
      .limit(1);

    let user;

    if (existingUsers.length > 0) {
      // Existing user - update OAuth information
      user = existingUsers[0];
      await db
        .update(users)
        .set({
          name: linkedinUser.name || user.name, // Update name if changed
          oauthProvider: "linkedin",
          oauthId: linkedinUser.sub, // LinkedIn's unique user ID
          photoUrl: linkedinUser.picture || user.photoUrlz,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      logger.info(`LinkedIn OAuth: Updated existing user: ${user.email}`);
    } else {
      // New user - create account with LinkedIn data
      const newUsers = await db
        .insert(users)
        .values({
          email: linkedinUser.email,
          name: linkedinUser.name || linkedinUser.email.split("@")[0], // Fallback name
          oauthProvider: "linkedin",
          oauthId: linkedinUser.sub,
          photoUrl: linkedinUser.picture || linkedinUser.picture.url,
          isVerified: true, // LinkedIn users are pre-verified
        })
        .returning();

      user = newUsers[0];
      logger.info(`LinkedIn OAuth: Created new user: ${user.email}`);
    }

    /**
     * Step 4: Generate JWT Token for Session Management
     *
     * Create a JWT token containing essential user information.
     * This token will be used for authenticating subsequent API requests.
     *
     * Payload includes:
     * - userId: For database lookups
     * - email: For user identification
     * - role: For authorization checks
     *
     * Token expires in 30 days, requiring re-authentication
     */
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    /**
     * Step 5: Return Success Response
     *
     * Send back user data and JWT token to frontend.
     * Frontend will store this data for the user session.
     */
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      photoUrl: user.photoUrl,
      className: user.className,
      oauthProvider: user.oauthProvider || null,
    };
    res.json({
      success: true,
      user: safeUser,
      token,
    });
  } catch (error: any) {
    logger.error("LinkedIn OAuth error: " + error);

    if (error.response?.data) {
      return res.status(400).json({
        success: false,
        message:
          error.response.data.error_description ||
          "LinkedIn authentication failed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during LinkedIn authentication",
    });
  }
};