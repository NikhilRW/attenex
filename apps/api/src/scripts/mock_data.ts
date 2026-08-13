/**
 * Data Seeder for Attenex API
 *
 * Seeds lectures + attendance records for testing on a real device.
 *
 * Two modes:
 *
 * 1. EXISTING-ENTITIES mode (default) — seeds lectures and attendance for an
 *    existing class / teacher / subject. Also adds N mock students to the
 *    existing class (--students, default 50) and gives them VARYING attendance
 *    so the analytics graph shows a realistic spread. Uses these defaults
 *    (override with flags):
 *      teacher id:  b5569849-2eed-44fa-ada4-36274fbf6fac
 *      class id:    6ef31f4c-2982-4e0e-8b7f-f8da45f5f218  (D7C)
 *      subject id:  5af3f971-4a62-4436-8b0b-e1b0e8f0d364  (Focus)
 *
 * 2. MOCK mode (--mock) — creates mock teacher, class, subjects and
 *    students first, then seeds lectures + attendance for them.
 *
 * Usage (run from apps/api):
 *   bun run mock:add                               # seed for the default real entities
 *   bun run mock:add -- --days=7                   # only last 7 days
 *   bun run mock:add -- --students=50              # add 50 mock students to the class
 *   bun run mock:add -- --lat=28.61 --lng=77.2 --radius=1000
 *   bun run mock:add -- --class-id=... --teacher-id=... --subject-id=...
 *   bun run mock:add -- --mock                     # legacy mock users mode
 *   bun run mock:remove                            # remove what the script seeded
 *
 * Seeded lectures:
 *   - One lecture per day for the last N days (default 14) at 10:00 local.
 *   - The LATEST lecture is ACTIVE with passcode "1234" so the student
 *     dashboard can show it and you can test the join flow. It gets NO
 *     pre-seeded attendance (so you can join/verify fresh on your phone).
 *   - All other lectures are "ended" (feed the teacher analytics graph).
 *   - Real students of the class are always marked "present".
 *   - Mock students get varying attendance: ~82% present, ~10% incomplete,
 *     ~8% absent (deterministic per day, so re-runs are stable).
 *   - teacherLatitude/teacherLongitude default to Delhi and geofenceRadius
 *     defaults to 50000m (50 km) so you can join from anywhere in the city;
 *     adjust with --lat/--lng/--radius to match your real location.
 *
 * The script prints a JWT for the teacher id so you can call protected
 * endpoints directly, e.g.:
 *   curl -H "Authorization: Bearer <token>" \
 *     "http://localhost:5000/api/analytics/teacher?startDate=2026-07-27&endDate=2026-08-03"
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { and, eq, inArray, sql } from "drizzle-orm";

import {
  attendance,
  attendanceAttempts,
  attendancePings,
  classes,
  db,
  geofenceLogs,
  lectures,
  subjects,
  users,
} from "../config/database_setup";
import { logger } from "../utils/logger";

const MOCK_EMAIL_PREFIX = "mock.";
const MOCK_EMAIL_DOMAIN = "attenex.dev";
const MOCK_PASSWORD = "MockPass@123";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Defaults: real entities used to test on a real device with a real account
const DEFAULT_TEACHER_ID = "b5569849-2eed-44fa-ada4-36274fbf6fac";
const DEFAULT_CLASS_ID = "6ef31f4c-2982-4e0e-8b7f-f8da45f5f218";
const DEFAULT_SUBJECT_ID = "5af3f971-4a62-4436-8b0b-e1b0e8f0d364";
const DEFAULT_LAT = "28.6139";
const DEFAULT_LNG = "77.2090";
const DEFAULT_RADIUS = "50000"; // 50 km so you can join from anywhere in the city

// Markers used to identify lectures seeded by this script (for --remove)
const SEEDED_PASSCODES = ["1234", "0000"];
const ACTIVE_PASSCODE = "1234";

type Args = {
  action: "add" | "remove";
  days: number;
  students: number;
  mock: boolean;
  teacherId: string;
  classId: string;
  subjectId: string;
  lat: string;
  lng: string;
  radius: string;
};

const printUsage = () => {
  console.log(`
Data seeder for Attenex API

Modes:
  --mock              Seed legacy mock users/class/subjects instead of using existing entities

Options:
  --add               Seed data (default)
  --remove, --clean   Remove data seeded by this script
  --days=N            Number of days of lecture history to seed (default: 14)
  --students=N        Mock students in the existing class (default: 50); with --mock, total students to create
  --class-id=<uuid>   Existing class to attach lectures to
  --teacher-id=<uuid> Existing teacher/user to attach lectures to
  --subject-id=<uuid> Existing subject to attach lectures to
  --lat=<number>      Teacher latitude for the geofence (default: 28.6139)
  --lng=<number>      Teacher longitude for the geofence (default: 77.2090)
  --radius=<meters>   Geofence radius in meters (default: 50000)
  --help, -h          Show this help

Examples:
  bun run mock:add
  bun run mock:add -- --days=7 --lat=28.6139 --lng=77.2090 --radius=200
  bun run mock:add -- --students=80
  bun run mock:add -- --class-id=... --teacher-id=... --subject-id=...
  bun run mock:add -- --mock --students=20
  bun run mock:remove
  `);
};

const parseArgs = (argv: string[]): Args => {
  const args: Args = {
    action: "add",
    days: 14,
    students: 50,
    mock: false,
    teacherId: DEFAULT_TEACHER_ID,
    classId: DEFAULT_CLASS_ID,
    subjectId: DEFAULT_SUBJECT_ID,
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    radius: DEFAULT_RADIUS,
  };
  for (const arg of argv.slice(2)) {
    if (arg === "--add" || arg === "--seed") {
      args.action = "add";
    } else if (arg === "--remove" || arg === "--clean" || arg === "--delete") {
      args.action = "remove";
    } else if (arg === "--mock") {
      args.mock = true;
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else if (arg.startsWith("--days=")) {
      args.days = Math.max(1, parseInt(arg.split("=")[1], 10) || 14);
    } else if (arg.startsWith("--students=")) {
      args.students = Math.max(1, parseInt(arg.split("=")[1], 10) || 12);
    } else if (arg.startsWith("--class-id=")) {
      args.classId = arg.split("=")[1];
    } else if (arg.startsWith("--teacher-id=")) {
      args.teacherId = arg.split("=")[1];
    } else if (arg.startsWith("--subject-id=")) {
      args.subjectId = arg.split("=")[1];
    } else if (arg.startsWith("--lat=")) {
      args.lat = arg.split("=")[1];
    } else if (arg.startsWith("--lng=")) {
      args.lng = arg.split("=")[1];
    } else if (arg.startsWith("--radius=")) {
      args.radius = arg.split("=")[1];
    }
  }
  return args;
};

const mockEmail = (name: string) => `${MOCK_EMAIL_PREFIX}${name}@${MOCK_EMAIL_DOMAIN}`;

// Deterministic seeded PRNG (mulberry32) so per-day attendance is stable across re-runs
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Creates the missing mock students (mock.student1..N@attenex.dev) in the
 * given class. Existing mock emails are reused, so re-runs are idempotent.
 */
const ensureMockStudents = async (className: string, count: number) => {
  const existing = await db
    .select({ email: users.email })
    .from(users)
    .where(sql`${users.email} ILIKE ${`${MOCK_EMAIL_PREFIX}%@${MOCK_EMAIL_DOMAIN}`}`);
  const existingEmails = new Set(existing.map((u) => u.email));

  const passwordHash = bcrypt.hashSync(MOCK_PASSWORD, 10);
  const toCreate = [];
  for (let i = 1; i <= count; i++) {
    const email = mockEmail(`student${i}`);
    if (existingEmails.has(email)) continue;
    toCreate.push({
      email,
      name: `Mock Student ${i}`,
      role: "student" as const,
      passwordHash,
      isVerified: true,
      className,
      rollNo: `M${String(i).padStart(3, "0")}`,
    });
  }

  if (toCreate.length > 0) {
    await db.insert(users).values(toCreate);
    logger.info(`Created ${toCreate.length} mock students in class "${className}".`);
  } else {
    logger.info(`All ${count} mock students already exist in class "${className}".`);
  }
};

// ============================ MOCK MODE ============================

const removeMockData = async () => {
  logger.info("Removing mock data...");

  const mockUsers = await db
    .select()
    .from(users)
    .where(sql`${users.email} ILIKE ${`${MOCK_EMAIL_PREFIX}%@${MOCK_EMAIL_DOMAIN}`}`);

  if (mockUsers.length === 0) {
    logger.info("No mock data found. Nothing to remove.");
    return;
  }

  const userIds = mockUsers.map((u) => u.id);
  const teacherIds = mockUsers.filter((u) => u.role === "teacher").map((u) => u.id);

  const mockLectures = teacherIds.length
    ? await db
        .select({ id: lectures.id })
        .from(lectures)
        .where(inArray(lectures.teacherId, teacherIds))
    : [];
  const lectureIds = mockLectures.map((l) => l.id);

  // Delete children first to satisfy foreign keys
  if (lectureIds.length > 0) {
    await db.delete(geofenceLogs).where(inArray(geofenceLogs.lectureId, lectureIds));
    await db.delete(attendancePings).where(inArray(attendancePings.lectureId, lectureIds));
    await db.delete(attendanceAttempts).where(inArray(attendanceAttempts.lectureId, lectureIds));
    await db.delete(attendance).where(inArray(attendance.lectureId, lectureIds));
    await db.delete(lectures).where(inArray(lectures.id, lectureIds));
  }

  if (teacherIds.length > 0) {
    await db.delete(classes).where(inArray(classes.teacherId, teacherIds));
    await db.delete(subjects).where(inArray(subjects.teacherId, teacherIds));
  }

  await db.delete(users).where(inArray(users.id, userIds));

  logger.info(`Removed ${userIds.length} mock users, ${lectureIds.length} mock lectures.`);
};

const addMockData = async ({ days, students: studentCount }: Args) => {
  // Keep re-runs idempotent: wipe any existing mock data first
  await removeMockData();

  const passwordHash = bcrypt.hashSync(MOCK_PASSWORD, 10);

  // 1. Teacher
  const [teacher] = await db
    .insert(users)
    .values({
      email: mockEmail("teacher"),
      name: "Mock Teacher",
      role: "teacher",
      passwordHash,
      isVerified: true,
    })
    .returning();
  logger.info(`Created teacher: ${teacher.email}`);

  // 2. Class + subjects
  const [mockClass] = await db
    .insert(classes)
    .values({ name: "Mock CS 101", teacherId: teacher.id })
    .returning();

  const subjectNames = ["Mock Mathematics", "Mock Physics", "Mock Computer Science"];
  const mockSubjects = await db
    .insert(subjects)
    .values(subjectNames.map((name) => ({ name, teacherId: teacher.id })))
    .returning();
  logger.info(`Created class "${mockClass.name}" + ${mockSubjects.length} subjects.`);

  // 3. Students
  const studentValues = Array.from({ length: studentCount }, (_, i) => ({
    email: mockEmail(`student${i + 1}`),
    name: `Mock Student ${i + 1}`,
    role: "student" as const,
    passwordHash,
    isVerified: true,
    className: mockClass.name,
    rollNo: `MS${String(i + 1).padStart(2, "0")}`,
  }));
  const mockStudents = await db.insert(users).values(studentValues).returning();
  logger.info(`Created ${mockStudents.length} students.`);

  // 4. Lectures + attendance for the mock class
  await seedLecturesWithAttendance({
    days,
    teacherId: teacher.id,
    classId: mockClass.id,
    subjectIds: mockSubjects.map((s) => s.id),
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    radius: DEFAULT_RADIUS,
    students: mockStudents.map((s) => ({ id: s.id, isMock: true })),
  });
};

// ============================ EXISTING-ENTITIES MODE ============================

/**
 * Removes what this script seeded for the given entities: the marker-passcode
 * lectures + their attendance, and any mock students added to the class.
 */
const removeSeededLectures = async ({ teacherId, classId, subjectId }: Args) => {
  logger.info(`Removing script-seeded lectures for class ${classId}, subject ${subjectId}...`);

  const seeded = await db
    .select({ id: lectures.id })
    .from(lectures)
    .where(
      and(
        eq(lectures.teacherId, teacherId),
        eq(lectures.classId, classId),
        eq(lectures.subjectId, subjectId),
        inArray(lectures.passcode, SEEDED_PASSCODES),
      ),
    );
  const seededIds = seeded.map((l) => l.id);

  if (seededIds.length === 0) {
    logger.info("No script-seeded lectures found. Nothing to remove.");
  } else {
    await db.delete(geofenceLogs).where(inArray(geofenceLogs.lectureId, seededIds));
    await db.delete(attendancePings).where(inArray(attendancePings.lectureId, seededIds));
    await db.delete(attendanceAttempts).where(inArray(attendanceAttempts.lectureId, seededIds));
    await db.delete(attendance).where(inArray(attendance.lectureId, seededIds));
    await db.delete(lectures).where(inArray(lectures.id, seededIds));
    logger.info(`Removed ${seededIds.length} seeded lectures.`);
  }

  // Also remove mock students added to this class by the seeder
  const mockStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.role, "student"),
        sql`${users.email} ILIKE ${`${MOCK_EMAIL_PREFIX}%@${MOCK_EMAIL_DOMAIN}`}`,
      ),
    );
  const mockIds = mockStudents.map((s) => s.id);
  if (mockIds.length > 0) {
    await db.delete(attendancePings).where(inArray(attendancePings.studentId, mockIds));
    await db.delete(attendanceAttempts).where(inArray(attendanceAttempts.studentId, mockIds));
    await db.delete(attendance).where(inArray(attendance.studentId, mockIds));
    await db.delete(users).where(inArray(users.id, mockIds));
    logger.info(`Removed ${mockIds.length} mock students.`);
  }
};

/**
 * Seeds lectures + attendance for EXISTING class / teacher / subject.
 * Adds N mock students to the class and gives them varying attendance;
 * real students are always marked "present".
 */
const seedForExistingEntities = async (args: Args) => {
  const { teacherId, classId, subjectId, days, lat, lng, radius, students } = args;

  const [mockClass] = await db.select().from(classes).where(eq(classes.id, classId));
  if (!mockClass) {
    logger.error(`Class not found: ${classId}`);
    process.exit(1);
  }

  const [mockSubject] = await db.select().from(subjects).where(eq(subjects.id, subjectId));
  if (!mockSubject) {
    logger.error(`Subject not found: ${subjectId}`);
    process.exit(1);
  }

  const realStudents = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.className, mockClass.name),
        eq(users.role, "student"),
        sql`${users.email} NOT ILIKE ${`${MOCK_EMAIL_PREFIX}%@${MOCK_EMAIL_DOMAIN}`}`,
      ),
    );
  if (realStudents.length === 0) {
    logger.error(`No real students found in class "${mockClass.name}".`);
    process.exit(1);
  }

  // Wipe anything this script previously seeded for these entities (incl. mock students)
  await removeSeededLectures(args);

  // Add N mock students to the existing class so attendance counts vary
  await ensureMockStudents(mockClass.name, students);
  const mockStudents = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.className, mockClass.name),
        eq(users.role, "student"),
        sql`${users.email} ILIKE ${`${MOCK_EMAIL_PREFIX}%@${MOCK_EMAIL_DOMAIN}`}`,
      ),
    );

  logger.info(
    `Using existing class "${mockClass.name}" (${realStudents.length} real + ${mockStudents.length} mock students), subject "${mockSubject.name}".`,
  );

  await seedLecturesWithAttendance({
    days,
    teacherId,
    classId,
    subjectIds: [subjectId],
    lat,
    lng,
    radius,
    students: [
      ...realStudents.map((s) => ({ id: s.id, isMock: false })),
      ...mockStudents.map((s) => ({ id: s.id, isMock: true })),
    ],
  });
};

// ============================ SHARED SEEDING ============================

type SeedInput = {
  days: number;
  teacherId: string;
  classId: string;
  subjectIds: string[];
  lat: string;
  lng: string;
  radius: string;
  students: { id: string; isMock: boolean }[];
};

const seedLecturesWithAttendance = async ({
  days,
  teacherId,
  classId,
  subjectIds,
  lat,
  lng,
  radius,
  students,
}: SeedInput) => {
  const now = new Date();
  const realStudents = students.filter((s) => !s.isMock);
  const mockStudents = students.filter((s) => s.isMock);
  let lecturesCreated = 0;
  let presentCreated = 0;
  let incompleteCreated = 0;

  for (let i = 0; i < days; i++) {
    const subjectId = subjectIds[i % subjectIds.length];
    const isLatest = i === days - 1;
    const startedAt = new Date(now);
    startedAt.setDate(now.getDate() - (days - 1 - i));
    if (!isLatest) {
      startedAt.setHours(10, 0, 0, 0);
    }

    const [lecture] = await db
      .insert(lectures)
      .values({
        teacherId,
        classId,
        subjectId,
        passcode: isLatest ? ACTIVE_PASSCODE : "0000",
        passcodeUpdatedAt: startedAt,
        duration: "60",
        status: isLatest ? "active" : "ended",
        teacherLatitude: lat,
        teacherLongitude: lng,
        geofenceRadius: radius,
        createdAt: startedAt,
        startedAt,
        endedAt: isLatest ? null : new Date(startedAt.getTime() + 60 * 60 * 1000),
      })
      .returning();

    // The ACTIVE (latest) lecture gets no pre-seeded attendance so you can
    // still test joining/verifying on a real phone.
    if (!isLatest) {
      // Real students are always present
      for (const student of realStudents) {
        await insertAttendance({
          lectureId: lecture.id,
          studentId: student.id,
          startedAt,
          status: "present",
          lat,
          lng,
        });
        presentCreated++;
      }

      // Mock students get deterministic, varying attendance per day
      const rng = mulberry32(i + 1);
      for (const student of mockStudents) {
        const roll = rng();
        if (roll < 0.82) {
          await insertAttendance({
            lectureId: lecture.id,
            studentId: student.id,
            startedAt,
            status: "present",
            lat,
            lng,
          });
          presentCreated++;
        } else if (roll < 0.92) {
          await insertAttendance({
            lectureId: lecture.id,
            studentId: student.id,
            startedAt,
            status: "incomplete",
            lat,
            lng,
          });
          incompleteCreated++;
        }
        // else: absent -> no attendance record
      }
    }

    lecturesCreated++;
  }

  // Print summary + teacher JWT for direct API testing
  const token = jwt.sign(
    { id: teacherId, role: "teacher" },
    JWT_SECRET,
    { expiresIn: 10 * 24 * 60 * 60 }, // 10 days
  );

  const endDate = now.toISOString().slice(0, 10);
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - (days - 1));
  const startDateStr = startDate.toISOString().slice(0, 10);

  console.log("\n=========================== Seed Data Ready ===========================");
  console.log(`  Teacher:  ${teacherId}`);
  console.log(`  Class:    ${classId}`);
  console.log(`  Subject:  ${subjectIds.join(", ")}`);
  console.log(
    `  Lectures: ${lecturesCreated} (latest is ACTIVE, passcode "${ACTIVE_PASSCODE}", no pre-seeded attendance)`,
  );
  console.log(`  Students: ${realStudents.length} real + ${mockStudents.length} mock`);
  console.log(
    `  Attendance: ${presentCreated} present, ${incompleteCreated} incomplete (absent not stored)`,
  );
  console.log("");
  console.log(`  Teacher JWT (10d, for direct API calls):`);
  console.log(`  ${token}`);
  console.log("");
  console.log(`  Try: curl -H "Authorization: Bearer <token>" \\`);
  console.log(
    `       "http://localhost:5000/api/analytics/teacher?startDate=${startDateStr}&endDate=${endDate}"`,
  );
  console.log("========================================================================\n");

  logger.info(
    `Done: ${lecturesCreated} lectures, ${presentCreated} present + ${incompleteCreated} incomplete attendance records.`,
  );
};

const insertAttendance = async ({
  lectureId,
  studentId,
  startedAt,
  status,
  lat,
  lng,
}: {
  lectureId: string;
  studentId: string;
  startedAt: Date;
  status: "present" | "incomplete";
  lat: string;
  lng: string;
}) => {
  await db.insert(attendance).values({
    lectureId,
    studentId,
    joinTime: new Date(startedAt.getTime() + 2 * 60 * 1000),
    submitTime: new Date(startedAt.getTime() + 50 * 60 * 1000),
    status,
    checkScore: status === "present" ? "7" : "1",
    method: "auto",
    locationSnapshot: { lat, lng, accuracy: 5 },
  });
};

// ============================ MAIN ============================

const main = async () => {
  const args = parseArgs(process.argv);

  try {
    if (args.action === "remove") {
      if (args.mock) {
        await removeMockData();
      } else {
        await removeSeededLectures(args);
      }
    } else if (args.mock) {
      await addMockData(args);
    } else {
      await seedForExistingEntities(args);
    }
  } catch (error) {
    logger.error("Seed script failed:", error);
    process.exit(1);
  }

  process.exit(0);
};

main();
