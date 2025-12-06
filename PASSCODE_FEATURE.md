# Passcode Feature Implementation

## Overview
Implemented a dynamic passcode system that refreshes every 15 seconds for lecture attendance verification. Students can only enter the passcode **after the lecture ends**, ensuring they stay in class for the entire duration.

## Updated Flow

### Teacher Flow:
1. Teacher creates lecture → Initial passcode generated automatically
2. Passcode displays prominently in lecture card
3. **Passcode auto-refreshes every 15 seconds**
4. Teacher verbally shares current passcode when ending the lecture
5. Teacher ends lecture → Students can now verify attendance

### Student Flow:
1. Student joins lecture (location validated, no passcode needed yet)
2. **Status: "Silent Guardian Active" - Tracking attendance in background**
3. Background pings continue (every 30 seconds)
4. **Student CANNOT enter passcode while lecture is active** (passcode input hidden)
5. **Teacher ends lecture** → Student's app detects lecture ended (polling every 5 seconds)
6. **Status changes to: "Lecture Ended"** → Passcode input appears
7. Student enters 4-digit passcode from teacher
8. Student clicks **"Verify Attendance"**
9. Backend validates: location + passcode + checkScore ≥4
10. Attendance marked as present/incomplete

## Backend Changes

### 1. Database Schema (`backend/src/config/database_setup.ts`)
- Added `passcode` varchar(4) field to lectures table
- Added `passcodeUpdatedAt` timestamp field to lectures table

### 2. Migration (`backend/drizzle/migrations/0003_add_passcode.sql`)
```sql
ALTER TABLE "lectures" ADD COLUMN "passcode" varchar(4);
ALTER TABLE "lectures" ADD COLUMN "passcode_updated_at" timestamp with time zone;
```

### 3. Utilities (`backend/src/utils/passcode.ts`)
- `generatePasscode()`: Generates random 4-digit passcode (1000-9999)
- `needsPasscodeRefresh(lastUpdated)`: Returns true if >15 seconds elapsed or null

### 4. Controllers

#### `backend/src/controllers/lectures/createLecture.ts`
- Generates initial passcode when creating new lecture
- Sets `passcodeUpdatedAt` to current timestamp

#### `backend/src/controllers/lectures/getPasscode.ts` (NEW)
- GET endpoint for teachers to fetch current passcode
- Automatically refreshes if >10 seconds elapsed
- Only accessible by lecture's teacher
- Returns passcode and last update timestamp

#### `backend/src/controllers/attendance/submitAttendance.ts`
- Added passcode validation before marking attendance
- Returns 403 if passcode doesn't match
- Validates student is within geofence AND has correct passcode

### 5. Routes (`backend/src/routes/lectureRoutes.ts`)
- Added `GET /api/lectures/:lectureId/passcode` endpoint

## Frontend Changes

### 1. Service Layer (`src/features/Classes/services/lectureService.ts`)
- Added `getPasscode(lectureId)` function to fetch current passcode

### 2. Teacher Dashboard (`src/features/Classes/screens/TeacherDashboard.tsx`)
- Added passcode state: `passcodes: Record<string, string>`
- Added `fetchPasscodes()` function to poll passcode for active lectures
- Polls passcode endpoint every 3 seconds (ensures smooth updates for 15s refresh)
- Displays passcode in lecture card:
  - 4 large digit boxes with gradient styling
  - Lock icon and "Passcode" label
  - **"Refreshes every 15s"** hint text
  - Only visible for active lectures

### 3. Student Dashboard (`src/features/Attendance/screens/StudentDashboard.tsx`)
- Added `lectureStatus` state to track if lecture is "active" or "ended"
- Added polling logic to check lecture status every 5 seconds
- **Updated UI based on lecture status**:
  - **While Active**: Shows "Silent Guardian Active" with tracking indicator, NO passcode input
  - **After Ended**: Shows "Lecture Ended" with passcode input and "Verify Attendance" button
- Validates passcode length before submission
- Sends passcode with attendance submission

### 4. Attendance Service (`src/features/Attendance/services/attendanceService.ts`)
- `submitAttendance()` already includes passcode parameter

## How It Works

### Teacher Flow:
1. Teacher creates lecture → Initial passcode generated automatically
2. TeacherDashboard polls `/api/lectures/:lectureId/passcode` every 3 seconds
3. Backend auto-refreshes passcode if >15 seconds elapsed
4. New passcode displays in lecture card immediately
5. **Teacher verbally shares current passcode when ending the lecture**
6. Teacher ends lecture

### Student Flow:
1. Student joins lecture (location validated, no passcode needed)
2. **Shows "Silent Guardian Active" - NO passcode input visible**
3. Background tracking starts (pings every 30 seconds)
4. Student's app polls lecture status every 5 seconds
5. **When teacher ends lecture**, student's app detects status change
6. **UI changes to "Lecture Ended" - Passcode input now appears**
7. Student enters 4-digit passcode from teacher
8. Student clicks **"Verify Attendance"**
9. Backend validates: location + passcode + checkScore ≥4
10. Attendance marked as present/incomplete

## Security Features

- **Passcode only accessible by lecture owner** (teacher)
- **Passcode required for final attendance submission** (prevents fake submissions)
- **Passcode only shown AFTER lecture ends** (students must stay for entire duration)
- **Passcode combined with location validation** (dual authentication)
- **Auto-refresh prevents replay attacks** (old passcode becomes invalid after 15s)
- **4-digit passcode** = 10,000 possible combinations
- **Students poll lecture status** (can't verify early even if they have passcode)

## Database Migration
Run to apply changes:
```bash
cd backend
npm run db:push
```

## Testing Checklist

### Backend:
- [ ] Create lecture generates initial passcode
- [ ] GET /passcode returns current passcode for teacher
- [ ] GET /passcode refreshes after 15+ seconds
- [ ] GET /passcode blocks non-teachers (403)
- [ ] Submit attendance validates passcode
- [ ] Submit attendance rejects wrong passcode (403)

### Frontend:
- [ ] Teacher sees passcode in active lecture cards
- [ ] Passcode updates automatically every 15 seconds
- [ ] Passcode hidden for ended lectures
- [ ] Student sees "Tracking..." while lecture is active
- [ ] Student CANNOT see passcode input while lecture is active
- [ ] Student sees "Lecture Ended" when teacher ends lecture
- [ ] Passcode input appears only after lecture ends
- [ ] Student gets error with wrong passcode
- [ ] Student marked present with correct passcode + location

## Notes

- **Backend refresh interval**: 15 seconds
- **Teacher polling interval**: 3 seconds (ensures immediate passcode updates in UI)
- **Student status polling**: 5 seconds (detects when lecture ends)
- This ensures students see the passcode input immediately after teacher ends lecture
- Passcode display uses gradient styling matching app design language
- Background location permission already configured in `app.json`
- If background permission error persists, rebuild the app after `app.json` changes

## Key Benefits

1. **Prevents Early Exits**: Students cannot verify attendance until lecture officially ends
2. **Real-time Updates**: Teacher sees fresh passcode every 15 seconds
3. **Better UX**: Students see clear status - "Tracking" vs "Ready to Verify"
4. **Fraud Prevention**: Even if student knows the passcode, they can't use it until lecture ends
