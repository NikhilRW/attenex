# Teacher Dashboard Lecture APIs Documentation

## Base URL
```
http://localhost:3000/api/lectures
```

All endpoints require authentication via Bearer token in the Authorization header.

---

## 1. Create Lecture
**Endpoint:** `POST /create`

**Description:** Creates a new lecture with geolocation and passcode.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "className": "CS101",
  "lectureName": "Introduction to Algorithms",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "duration": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Lecture created successfully",
  "data": {
    "lecture": {
      "id": "uuid",
      "title": "Introduction to Algorithms",
      "className": "CS101",
      "passcode": "1234",
      "status": "active",
      "createdAt": "2025-12-05T10:00:00Z"
    }
  }
}
```

---

## 2. Get Active Lectures
**Endpoint:** `GET /active`

**Description:** Fetches all active lectures for the authenticated teacher.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction to Algorithms",
      "className": "CS101",
      "classId": "class-uuid",
      "duration": "60",
      "status": "active",
      "passcode": "1234",
      "createdAt": "2025-12-05T10:00:00Z",
      "startedAt": "2025-12-05T10:00:00Z",
      "teacherLatitude": "37.7749",
      "teacherLongitude": "-122.4194"
    }
  ]
}
```

---

## 3. End Lecture
**Endpoint:** `PUT /:lectureId/end`

**Description:** Ends an active lecture and marks incomplete attendance as absent.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lecture ended successfully",
  "data": {
    "lecture": {
      "id": "uuid",
      "status": "ended",
      "endedAt": "2025-12-05T11:00:00Z"
    }
  }
}
```

---

## 4. Update Lecture
**Endpoint:** `PUT /:lectureId/update`

**Description:** Updates lecture details (title, duration, or location). Cannot update ended lectures.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body (all fields optional):**
```json
{
  "title": "Advanced Algorithms",
  "duration": 90,
  "latitude": 37.7750,
  "longitude": -122.4195
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lecture updated successfully",
  "data": {
    "lecture": {
      "id": "uuid",
      "title": "Advanced Algorithms",
      "duration": "90",
      "teacherLatitude": "37.7750",
      "teacherLongitude": "-122.4195",
      "status": "active"
    }
  }
}
```

---

## 5. Delete Lecture
**Endpoint:** `DELETE /:lectureId`

**Description:** Permanently deletes a lecture and all associated attendance records.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lecture deleted successfully",
  "data": {
    "lectureId": "uuid"
  }
}
```

---

## 6. Fetch Lecture Attendance
**Endpoint:** `GET /:lectureId/attendance`

**Description:** Fetches all attendance records for a specific lecture with student details.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lectureId": "uuid",
    "attendanceCount": 15,
    "attendance": [
      {
        "id": "attendance-uuid",
        "studentId": "student-uuid",
        "studentName": "John Doe",
        "studentEmail": "john@example.com",
        "joinTime": "2025-12-05T10:05:00Z",
        "submitTime": "2025-12-05T11:00:00Z",
        "status": "present",
        "checkScore": "85",
        "method": "auto",
        "locationSnapshot": {
          "lat": 37.7749,
          "lng": -122.4194,
          "accuracy": 10
        }
      }
    ]
  }
}
```

---

## 7. Add Manual Attendance
**Endpoint:** `POST /:lectureId/attendance/manual`

**Description:** Manually adds or updates attendance for a student by email.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "studentEmail": "john@example.com"
}
```

**Response (201 for new, 200 for update):**
```json
{
  "success": true,
  "message": "Manual attendance added successfully",
  "data": {
    "attendance": {
      "id": "attendance-uuid",
      "studentId": "student-uuid",
      "studentName": "John Doe",
      "studentEmail": "john@example.com",
      "status": "present",
      "method": "manual"
    }
  }
}
```

---

## 8. Get Lecture Details
**Endpoint:** `GET /:lectureId/details`

**Description:** Fetches detailed information about a specific lecture including student count.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lecture": {
      "id": "uuid",
      "title": "Introduction to Algorithms",
      "className": "CS101",
      "status": "active",
      "createdAt": "2025-12-05T10:00:00Z"
    },
    "studentCount": 15
  }
}
```

---

## 9. Get Teacher Classes
**Endpoint:** `GET /classes`

**Description:** Fetches all classes created by the authenticated teacher.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "class-uuid",
      "name": "CS101"
    },
    {
      "id": "class-uuid-2",
      "name": "CS201"
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Please login"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only teachers can perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Lecture not found or you don't have permission to access it"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input or validation error"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Usage Notes

1. **Authentication**: All endpoints require a valid JWT token obtained from login.
2. **Authorization**: Only users with role "teacher" can access these endpoints.
3. **Geolocation**: Latitude and longitude are required for creating lectures (used for geofencing).
4. **Passcode**: A random 4-digit passcode is automatically generated for each lecture.
5. **Cascade Delete**: Deleting a lecture will also delete all associated attendance records.
6. **Manual Attendance**: Can be added or updated even after the lecture ends.
7. **Update Restrictions**: Ended lectures cannot be updated or modified.

---

## Frontend Integration

The lecture service file has been updated with all these API endpoints:
- `createLecture()`
- `getActiveLectures()`
- `endLecture()`
- `updateLecture()`
- `deleteLecture()`
- `fetchLectureAttendance()`
- `addManualAttendance()`
- `getLectureDetails()`
- `getTeacherClasses()`

Import from: `@/src/features/Classes/services/lectureService`
