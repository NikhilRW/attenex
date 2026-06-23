const signInButtonTestId = "SIGN_IN_SCREEN.SIGN_IN_BUTTON";
const emailFieldTestId = "SIGN_IN_SCREEN.EMAIL_FIELD";
const passwordFieldTestId = "SIGN_IN_SCREEN.PASSWORD_FIELD";
const headerTextContainerTestId =
  "TEACHER_DASHBOARD_SCREEN.HEADER_SECTION.HEADER_TEXT_CONTAINER";
const classSelectorTestId = "CREATE_LECTURE_SCREEN.CLASS_SELECTOR.BUTTON";
const classSelectorItemTestIdPrefix = "CREATE_LECTURE_SCREEN.CLASS_SELECTOR_ITEM_";
const lectureTopicInputTestId = "CREATE_LECTURE_SCREEN.LECTURE_TOPIC_INPUT";
const customDurationInputTestId = "CREATE_LECTURE_SCREEN.CUSTOM_DURATION_INPUT";
const durationSelectorButtonTestId =
  "CREATE_LECTURE_SCREEN.DURATION_SELECTOR_BUTTON";
const durationOptionTestIdPrefix = "CREATE_LECTURE_SCREEN.DURATION_OPTION_";
const startLectureButtonTestId = "CREATE_LECTURE_SCREEN.START_LECTURE.BUTTON";
const settingsButtonTestId = "NAV_BUTTON_SETTINGS";
const attendanceButtonTestId = "NAV_BUTTON_ATTENDANCE";
const teacherRoleOptionButtonTestId =
  "SETTINGS_SCREEN.TEACHER_ROLE_OPTION_BUTTON";
const studentRoleOptionButtonTestId =
  "SETTINGS_SCREEN.STUDENT_ROLE_OPTION_BUTTON";
const firstLectureItemJoinButtonTestIdPrefix =
  "STUDENT_DASHBOARD.LECTURE_ITEM_1_JOIN_BUTTON";
const confirmRoleChangeButtonTestId =
  "SETTINGS_SCREEN.CONFIRM_ROLE_CHANGE_BUTTON";
const rollNoModalSubmitButtonTestId =
  "STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.SUBMIT_BUTTON";
const rollNoModalTextInputTestId =
  "STUDENT_DASHBOARD.ROLL_NO_REQUIRED_MODAL.TEXT_INPUT";

describe("App", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should not sign in with incorrect credentials", async () => {
    const signInButton = element(by.id(signInButtonTestId));
    const emailField = element(by.id(emailFieldTestId));
    const passwordField = element(by.id(passwordFieldTestId));
    await emailField.typeText("test@example.com");
    await passwordField.typeText("wrongpassword");
    await passwordField.tapReturnKey();
    await waitFor(signInButton).toBeVisible().withTimeout(5000);
    await signInButton.tap();
    await waitFor(
      element(by.text("Invalid email or password. Please try again.")),
    )
      .toBeVisible()
      .withTimeout(6000);
    await emailField.clearText();
    await passwordField.clearText();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it("should sign in with correct credentials", async () => {
    const signInButton = element(by.id(signInButtonTestId));
    const emailField = element(by.id(emailFieldTestId));
    const passwordField = element(by.id(passwordFieldTestId));

    await emailField.typeText("nikhilwankhede0707@gmail.com");
    await passwordField.typeText("#Nikhil009");

    await passwordField.tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await signInButton.tap();

    await waitFor(element(by.text("Welcome Back!")))
      .toBeVisible()
      .withTimeout(6000);
  });

  it("should be able to create lecture", async () => {
    const headerTextContainer = element(by.id(headerTextContainerTestId));
    const classesNavButton = element(by.id("NAV_BUTTON_CLASSES"));
    await waitFor(classesNavButton).toBeVisible().withTimeout(12000);
    await classesNavButton.tap();
    await waitFor(headerTextContainer).toBeVisible().withTimeout(10000);
    await headerTextContainer.swipe("down", "slow", 0.4, 0.1, 0.1);

    const classSelector = element(by.id(classSelectorTestId));
    await classSelector.tap();
    const classSelectorItem = element(
      by.id(`${classSelectorItemTestIdPrefix}1`),
    );
    await waitFor(classSelectorItem).toBeVisible().withTimeout(5000);
    await classSelectorItem.tap();

    const lectureTopicInput = element(by.id(lectureTopicInputTestId));
    await waitFor(lectureTopicInput).toBeVisible().withTimeout(5000);
    await lectureTopicInput.typeText("Test Lecture");
    await lectureTopicInput.tapReturnKey();

    const durationSelectorButton = element(by.id(durationSelectorButtonTestId));
    await waitFor(durationSelectorButton).toBeVisible().withTimeout(5000);

    await durationSelectorButton.tap();
    const durationOption = element(by.id(`${durationOptionTestIdPrefix}1`));

    await waitFor(durationOption).toBeVisible().withTimeout(5000);
    await durationOption.tap();

    const startLectureButton = element(by.id(startLectureButtonTestId));
    await waitFor(startLectureButton).toBeVisible().withTimeout(5000);

    await startLectureButton.tap();
    await waitFor(element(by.text("Lecture created successfully!")))
      .toBeVisible()
      .withTimeout(6000);
    let okButton = element(by.text("OK"));
    await waitFor(okButton).toBeVisible().withTimeout(5000);
    await okButton.tap();
  });

  it("should be able to change user role to student", async () => {
    const settingsButton = element(by.id(settingsButtonTestId));
    await waitFor(settingsButton).toBeVisible().withTimeout(5000);
    await settingsButton.tap();
    const studentRoleOptionButton = element(
      by.id(studentRoleOptionButtonTestId),
    );
    await waitFor(studentRoleOptionButton).toBeVisible().withTimeout(5000);
    await studentRoleOptionButton.tap();

    const confirmRoleChangeButton = element(
      by.id(confirmRoleChangeButtonTestId),
    );
    await waitFor(confirmRoleChangeButton).toBeVisible().withTimeout(5000);
    await confirmRoleChangeButton.tap();

    await waitFor(element(by.text("Your role is now set to student.")))
      .toBeVisible()
      .withTimeout(5000);
    const okButton = element(by.text("Ok"));
    await waitFor(okButton).toBeVisible().withTimeout(5000);
    await okButton.tap();
  });

  it("should be able to join lecture", async () => {
    const attendanceButton = element(by.id(attendanceButtonTestId));
    await waitFor(attendanceButton).toBeVisible().withTimeout(5000);
    await attendanceButton.tap();

    const firstLectureItemJoinButton = element(
      by.id(`${firstLectureItemJoinButtonTestIdPrefix}`),
    );

    await waitFor(firstLectureItemJoinButton).toBeVisible().withTimeout(5000);
    await firstLectureItemJoinButton.tap();
    const rollNoModalSubmitButton = element(
      by.id(rollNoModalSubmitButtonTestId),
    );
    const rollNoModalTextInput = element(by.id(rollNoModalTextInputTestId));
    await waitFor(rollNoModalTextInput).toBeVisible().withTimeout(5000);
    await rollNoModalTextInput.typeText("66");
    await rollNoModalTextInput.tapReturnKey();
    await waitFor(rollNoModalSubmitButton).toBeVisible().withTimeout(5000);
    await rollNoModalSubmitButton.tap();
    await waitFor(
      element(
        by.text(
          "Location tracking started. Wait for class to end, then verify attendance.",
        ),
      ),
    )
      .toBeVisible()
      .withTimeout(5000);
  });
});
