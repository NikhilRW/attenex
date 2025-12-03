import { signUpUser } from "@controllers/auth/signUpUser";
import { Router } from "express";
import "dotenv/config";
import { signInUser } from "@controllers/auth/signInUser";

export const userRoutes = Router();

// Use clear, action-based routes and POST for operations that carry a request body
userRoutes.post("/signup", signUpUser);
userRoutes.post("/signin", signInUser);
