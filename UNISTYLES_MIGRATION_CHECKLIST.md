# Unistyles Migration Checklist

Goal: finish removing legacy UI theming based on `useTheme()` so theme changes are driven by Unistyles in one pass.

## Done already

- [x] Global Unistyles setup
- [x] `StyleSheet.create` callback normalization
- [x] Attendance feature migration
- [x] Classes feature migration
- [x] Settings feature migration
- [x] Theme mode persistence bridged to `UnistylesRuntime`

## Remaining migration work

### 1) App shell

- [x] Migrate `src/app/_layout.tsx`
  - Still reads `useTheme()` for `isDark` and `colors`
  - Replace UI color reads with Unistyles-friendly approach
  - Keep only theme-mode state access if absolutely needed
  - Re-check integrations that depend on theme values:
    - notification accent colors
    - `PaperProvider` theme selection
    - safe-area / root wrappers

### 2) Shared navigation

- [x] Migrate `src/shared/components/CustomTabBar.tsx`
  - Still uses `useTheme()` and inline color objects
  - Move theme-dependent container/background/border/icon styling to Unistyles styles
  - Use `withUnistyles` for any non-style prop mapping if needed
  - Remove legacy `colors` prop threading into `TabBarButton`

### 3) Auth feature

#### Screens
- [x] `src/features/Auth/screens/SignIn.tsx`
- [x] `src/features/Auth/screens/SignUp.tsx`
- [x] `src/features/Auth/screens/ForgotPassword.tsx`
- [x] `src/features/Auth/screens/ResetPassword.tsx`

#### Hooks / helpers used by UI
- [x] `src/features/Auth/hooks/useLinkedInAuth.ts`
  - Only if theme values are still being used for UI-facing behavior

#### Common components
- [x] `src/features/Auth/components/common/AuthHeader.tsx`
- [x] `src/features/Auth/components/common/AuthFooter.tsx`
- [x] `src/features/Auth/components/common/AuthOptions.tsx`
- [x] `src/features/Auth/components/common/BackButton.tsx`
- [x] `src/features/Auth/components/common/FuturisticButton.tsx`
- [x] `src/features/Auth/components/common/FuturisticDivider.tsx`
- [x] `src/features/Auth/components/common/FuturisticInput.tsx`
- [x] `src/features/Auth/components/common/SocialLoginButtons.tsx`

#### Forgot password components
- [x] `src/features/Auth/components/ForgotPassword/EmailSent.tsx`
- [x] `src/features/Auth/components/ForgotPassword/ForgotPasswordForm.tsx`

#### Reset password components
- [x] `src/features/Auth/components/ResetPassword/InvalidResetPasswordLink.tsx`
- [x] `src/features/Auth/components/ResetPassword/PasswordRequirements.tsx`
- [x] `src/features/Auth/components/ResetPassword/VerifyingResetPasswordLink.tsx`

#### Verify email components
- [x] `src/features/Auth/components/VerifyEmail/VerifyEmailHelp.tsx`
- [x] `src/features/Auth/components/VerifyEmail/VerifyEmailIcon.tsx`
- [x] `src/features/Auth/components/VerifyEmail/VerifyEmailMessage.tsx`

### 4) Role selection feature

- [x] `src/features/RoleSelection/components/ConfirmButton.tsx`
- [x] `src/features/RoleSelection/components/RoleCard.tsx`
- [x] `src/features/RoleSelection/components/RoleSelectionHeader.tsx`

## Infra / cleanup after UI migration

### Keep for now, but simplify later

- [ ] `src/shared/hooks/useTheme.ts`
  - Keep as the persisted theme-mode bridge for now
  - After all UI stops using `useTheme()`, trim it so it no longer exposes legacy `colors` / `isDark` for rendering

- [ ] `src/shared/hooks/index.ts`
  - Remove `useTheme` export if no UI imports remain

### State-only usages that are not the main blocker

- [ ] `src/features/Settings/screens/SettingsScreen.tsx`
  - `useThemeStore` usage is acceptable here because it is mode state, not legacy color rendering
  - Optional cleanup later if theme mode is centralized elsewhere

- [ ] `src/shared/stores/authStore.ts`
  - Imports `useThemeStore`; verify whether this is only reading persisted mode/state
  - Not a primary source of staggered UI repaint unless it feeds UI colors directly

## Migration rules for the remaining files

- [ ] Remove `useTheme()` from render paths
- [ ] Prefer `StyleSheet.create((theme, rt) => ({}))`
- [ ] Use `rt.colorScheme`, `rt.insets`, etc. instead of manual theme branching in JSX
- [ ] Move inline theme-based objects into stylesheets
- [ ] Use `withUnistyles` for props like icon `color`, `placeholderTextColor`, gradient `colors`, `contentContainerStyle`, etc.
- [ ] Merge styles with arrays only; never spread Unistyles styles
- [ ] After each feature cluster, run error checks and search again for `useTheme(` in that folder

## Definition of done

- [x] No remaining UI component imports `useTheme` from `@shared/hooks/useTheme`
- [ ] Theme changes repaint the app atomically instead of feature-by-feature
- [ ] `useTheme.ts` becomes persistence/runtime bridge only, or is removed entirely if no longer needed
