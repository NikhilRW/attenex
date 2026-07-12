import { device } from "detox";

const TEACHER_EMAIL    = 'nikhilwankhede0707@gmail.com';
const TEACHER_PASSWORD = '#Nikhil009';
const API_BASE = 'http://localhost:5000';

const TEACHER_LAT = 19.3010532862;
const TEACHER_LNG = 73.201598525;
const NEAR_LAT = 19.3019532862;
const NEAR_LNG = 73.202498525;
const FAR_LAT  = 21.0;
const FAR_LNG  = 75.0;

const ROLL_NO       = '99';
const TIMEOUT       = 180000;

const PASSCODE_INPUT = 'LECTURE_ENDED.PASSCODE_INPUT';
const VERIFY_BUTTON  = 'LECTURE_ENDED.VERIFY_BUTTON';

let lectureId  = null;
let passcode   = null;
let teacherTok = null;

async function apiSignIn(email, password) {
  const r = await fetch(`${API_BASE}/api/users/signin?authType=email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!d.success || !d.token) throw new Error(`Sign-in failed: ${JSON.stringify(d)}`);
  return d.token;
}

async function apiPost(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherTok}` },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiPut(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${teacherTok}` },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiGet(path) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${teacherTok}` },
  });
  return r.json();
}

async function getLatestLectureId() {
  const res = await apiGet('/api/lectures/active');
  if (!res.success || !res.data || !res.data.length) {
    throw new Error(`No active lectures: ${JSON.stringify(res)}`);
  }
  return res.data[0].id;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiPing(lectureId, lat, lng, timestampMs) {
  const body = { lectureId, latitude: lat, longitude: lng };
  if (timestampMs) {
    body._testTimestamp = new Date(timestampMs).toISOString();
  }
  return apiPost('/api/attendance/ping', body);
}

async function signInViaUI(email, password) {
  await element(by.id('SIGN_IN_SCREEN.EMAIL_FIELD')).typeText(email);
  await element(by.id('SIGN_IN_SCREEN.PASSWORD_FIELD')).typeText(password);
  await element(by.id('SIGN_IN_SCREEN.PASSWORD_FIELD')).tapReturnKey();
  await element(by.id('SIGN_IN_SCREEN.SIGN_IN_BUTTON')).tap();
  await waitFor(element(by.text('Welcome Back!'))).toBeVisible().withTimeout(10000);
}

async function createLectureViaUI() {
  await element(by.id('NAV_BUTTON_CLASSES')).tap();
  await waitFor(element(by.id('TEACHER_DASHBOARD_SCREEN.HEADER_SECTION.HEADER_TEXT_CONTAINER')))
    .toBeVisible().withTimeout(10000);

  await device.setLocation(TEACHER_LAT, TEACHER_LNG);

  await element(by.id('TEACHER_DASHBOARD_SCREEN.HEADER_SECTION.HEADER_TEXT_CONTAINER'))
    .swipe('down', 'slow', 0.4, 0.1, 0.1);

  await element(by.id('CREATE_LECTURE_SCREEN.CLASS_SELECTOR.BUTTON')).tap();
  await waitFor(element(by.id('CREATE_LECTURE_SCREEN.CLASS_SELECTOR_ITEM_1')))
    .toBeVisible().withTimeout(5000);
  await element(by.id('CREATE_LECTURE_SCREEN.CLASS_SELECTOR_ITEM_1')).tap();

  await element(by.id('CREATE_LECTURE_SCREEN.SUBJECT_SELECTOR.BUTTON')).tap();
  await waitFor(element(by.id('CREATE_LECTURE_SCREEN.SUBJECT_SELECTOR_ITEM_1')))
    .toBeVisible().withTimeout(5000);
  await element(by.id('CREATE_LECTURE_SCREEN.SUBJECT_SELECTOR_ITEM_1')).tap();

  await element(by.id('CREATE_LECTURE_SCREEN.DURATION_SELECTOR_BUTTON')).tap();
  await waitFor(element(by.id('CREATE_LECTURE_SCREEN.DURATION_OPTION_2')))
    .toBeVisible().withTimeout(5000);
  await element(by.id('CREATE_LECTURE_SCREEN.DURATION_OPTION_2')).tap();

  await element(by.id('CREATE_LECTURE_SCREEN.START_LECTURE.BUTTON')).tap();
  await waitFor(element(by.text('Lecture created successfully!')))
    .toBeVisible().withTimeout(20000);
  await element(by.text('OK')).tap();
}

async function switchToStudentViaUI() {
  await element(by.id('NAV_BUTTON_SETTINGS')).tap();
  await waitFor(element(by.id('SETTINGS_SCREEN.STUDENT_ROLE_OPTION_BUTTON')))
    .toBeVisible().withTimeout(5000);
  await element(by.id('SETTINGS_SCREEN.STUDENT_ROLE_OPTION_BUTTON')).tap();
  await element(by.id('SETTINGS_SCREEN.CONFIRM_ROLE_CHANGE_BUTTON')).tap();
  await waitFor(element(by.text('Role updated')))
    .toBeVisible().withTimeout(20000);
  await element(by.text('Ok')).tap();
}

async function switchToTeacherViaUI() {
  await element(by.id('NAV_BUTTON_SETTINGS')).tap();
  await waitFor(element(by.id('SETTINGS_SCREEN.TEACHER_ROLE_OPTION_BUTTON')))
    .toBeVisible().withTimeout(5000);
  await element(by.id('SETTINGS_SCREEN.TEACHER_ROLE_OPTION_BUTTON')).tap();
  await element(by.id('SETTINGS_SCREEN.CONFIRM_ROLE_CHANGE_BUTTON')).tap();
  await waitFor(element(by.text('Role updated')))
    .toBeVisible().withTimeout(20000);
  await element(by.text('Ok')).tap();
}

async function joinLectureViaUI() {
  const joinBtn = element(by.id('STUDENT_DASHBOARD.LECTURE_ITEM_1_JOIN_BUTTON'));
  await waitFor(joinBtn).toBeVisible().withTimeout(10000);
  await joinBtn.tap();

  try {
    await waitFor(element(by.id('STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.TEXT_INPUT')))
      .toBeVisible().withTimeout(3000);
    await element(by.id('STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.TEXT_INPUT')).typeText(ROLL_NO);
    await element(by.id('STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.TEXT_INPUT')).tapReturnKey();
    await element(by.id('STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.SUBMIT_BUTTON')).tap();
  } catch (_) {}

  await waitFor(element(by.text('Location tracking started. Wait for class to end, then verify attendance.')))
    .toBeVisible().withTimeout(10000);
  await element(by.text('Ok')).tap();
}

async function submitAttendanceViaUI(pass) {
  try {
    await waitFor(element(by.text('Ok')))
      .toBeVisible().withTimeout(15000);
    await element(by.text('Ok')).tap();
  } catch (_) {
    console.log('[UI] No alert — proceeding');
  }

  await device.setLocation(NEAR_LAT, NEAR_LNG);

  await waitFor(element(by.id(PASSCODE_INPUT))).toBeVisible().withTimeout(10000);
  await element(by.id(PASSCODE_INPUT)).typeText(pass);
  await element(by.id(PASSCODE_INPUT)).tapReturnKey();
  await element(by.id(VERIFY_BUTTON)).tap();
}

describe('Location & Attendance Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions: { location: 'always' }, newInstance: true });
    teacherTok = await apiSignIn(TEACHER_EMAIL, TEACHER_PASSWORD);
    console.log('[SETUP] Teacher token acquired');
  });

  afterEach(async () => {
    if (lectureId && teacherTok) {
      try {
        await apiPost('/api/users/update-role', { role: 'teacher' });
        await apiPut(`/api/lectures/${lectureId}/end`);
      } catch (_) {}
    }
    lectureId = null;
    passcode = null;
  });

  it('marks Present when student stays in range across lecture', async () => {
    await createLectureViaUI();
    lectureId = await getLatestLectureId();
    console.log(`[TEST] Lecture ${lectureId} created`);

    await switchToStudentViaUI();
    await device.setLocation(NEAR_LAT, NEAR_LNG);
    await sleep(2000);
    await joinLectureViaUI();

    const pingTimeBase = Date.now();

    // Fast-forward to 33 min ago → duration = 33 min (>= 30 → 3-window rule)
    // START [now-33min, now-22min], MIDDLE [now-22min, now-11min], END [now-11min, now]
    // Background pings (real-time) land in END → hasEnd=true automatically
    // We add a START ping and a MIDDLE ping to cover all 3 windows
    await apiPing(lectureId, NEAR_LAT, NEAR_LNG, pingTimeBase - 30 * 60000);
    await apiPing(lectureId, NEAR_LAT, NEAR_LNG, pingTimeBase - 15 * 60000);

    await apiPost('/api/test/fast-forward-lecture', { lectureId, minutesAgo: 33 });
     await apiPost('/api/users/update-role', { role: 'teacher' });
    await apiPut(`/api/lectures/${lectureId}/end`);
    const pRes = await apiGet(`/api/lectures/${lectureId}/passcode`);
    passcode = pRes.data.passcode;
    console.log(`[TEST] Passcode: ${passcode}`);

    await sleep(2000);
    await submitAttendanceViaUI(passcode);

    await waitFor(element(by.text('Attendance Marked Present!')))
      .toBeVisible().withTimeout(20000);
    await element(by.text('Ok')).tap();
    console.log('[TEST] ✓ PRESENT');
  }, TIMEOUT);

  it.skip('marks Incomplete when student leaves before lecture end', async () => {
    await switchToTeacherViaUI();
    await createLectureViaUI();
    lectureId = await getLatestLectureId();
    console.log(`[TEST] Lecture ${lectureId} created`);

    await switchToStudentViaUI();
    await device.setLocation(NEAR_LAT, NEAR_LNG);
    await sleep(2000);
    await joinLectureViaUI();

    const pingTimeBase = Date.now();

    // Only START pings, no MIDDLE → hasMiddle=false → Incomplete for >= 30 min
    // Background pings still provide END, but that doesn't rescue Incomplete
    await apiPing(lectureId, NEAR_LAT, NEAR_LNG, pingTimeBase - 30 * 60000);
    await apiPing(lectureId, NEAR_LAT, NEAR_LNG, pingTimeBase - 28 * 60000);
    await apiPing(lectureId, NEAR_LAT, NEAR_LNG, pingTimeBase - 26 * 60000);

    await apiPost('/api/test/fast-forward-lecture', { lectureId, minutesAgo: 33 });
    await apiPost('/api/users/update-role', { role: 'teacher' });
    await apiPut(`/api/lectures/${lectureId}/end`);
    const pRes = await apiGet(`/api/lectures/${lectureId}/passcode`);
    passcode = pRes.data.passcode;
    console.log(`[TEST] Passcode: ${passcode}`);

    await sleep(2000);
    await submitAttendanceViaUI(passcode);

    // Alert title is "Incomplete" (constant), description varies
    await waitFor(element(by.text('Incomplete')))
      .toBeVisible().withTimeout(20000);
    console.log('[TEST] ✓ INCOMPLETE');
  }, TIMEOUT);

  it.skip('device.setLocation simulates GPS correctly', async () => {
    await device.setLocation(NEAR_LAT, NEAR_LNG);
    const loc = await device.getLocation();
    console.log(`[TEST] GPS: ${loc.latitude}, ${loc.longitude}`);
    expect(Number(loc.latitude.toFixed(1))).toBeCloseTo(NEAR_LAT, 1);
  });
});
