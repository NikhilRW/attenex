import { registerUser } from "@controllers/user/registerUser";
import { Router } from "express";

export const userRoutes = Router();

userRoutes.post("/", registerUser);