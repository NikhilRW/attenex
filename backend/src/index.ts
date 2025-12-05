import { userRoutes } from "@routes/userRoutes";
import cors from "cors";
import "dotenv/config";
import express from "express";
import attendanceRoutes from "./routes/attendanceRoutes";
import lectureRoutes from "./routes/lectureRoutes";
import { logger } from "./utils/logger";

/**
 * Attenex Backend Server
 *
 * Express.js server for the Attenex attendance management system.
 * Provides REST API endpoints for user authentication, class management,
 * lecture sessions, and attendance tracking.
 *
 * Authentication Methods:
 * - Traditional: Email/password with bcrypt hashing and JWT tokens
 * - OAuth: Google Sign-In (mobile native) and LinkedIn OAuth (WebView-based)
 *
 * Security Features:
 * - CORS enabled for cross-origin requests from React Native app
 * - JSON body parsing for API requests
 * - JWT-based session management
 * - Server-side OAuth token exchange (client secrets never exposed)
 *
 * API Routes:
 * - /api/users: User management (registration, profile updates)
 * - /api/auth: Authentication endpoints (LinkedIn OAuth, Google auth)
 */

// Initialize Express application
const app = express();

// Server configuration
const PORT = process.env.PORT || 5000;

/**
 * CORS Middleware
 *
 * Enables Cross-Origin Resource Sharing to allow requests from the React Native app.
 * In production, configure specific origins for security.
 */
app.use(cors());

/**
 * JSON Body Parser Middleware
 *
 * Parses incoming JSON payloads in request bodies.
 * Required for API endpoints that receive JSON data (user registration, OAuth callbacks, etc.)
 */
app.use(express.json());

/**
 * User Management Routes
 *
 * Handles user-related operations:
 * - User registration and profile management
 * - Google OAuth user creation/verification
 * - User data retrieval and updates
 */
app.use("/api/users", userRoutes);

/**
 * Lecture Management Routes
 *
 * Handles lecture-related operations:
 * - Lecture creation by teachers
 * - Lecture management (start, end, update)
 * - Passcode generation and refresh
 * - Attendance tracking
 */
app.use("/api/lectures", lectureRoutes);
app.use("/api/attendance", attendanceRoutes);

/**
 * Authentication Routes
 *
 * Handles all authentication-related operations:
 * - LinkedIn OAuth: Complete OAuth 2.0 flow with WebView integration
 *   - POST /api/auth/linkedin: Exchange authorization code for user session
 *   - Server-side token exchange ensures client secret security
 *   - Creates/updates user accounts with LinkedIn profile data
 *   - Returns JWT tokens for session management
 *
 * Security Note: LinkedIn client secret is stored server-side only,
 * never exposed to mobile clients.
 */

/**
 * Server Startup
 *
 * Starts the Express server on the configured port.
 * Logs the server URL for development convenience.
 */
app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
});
