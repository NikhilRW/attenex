import { Dispatch, SetStateAction } from "react";
import { TextInputProps } from "react-native";

/**
 * AuthFooter component props
 */
export interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkPress: () => void;
}

/**
 * AuthHeader component props
 */
export interface AuthHeaderProps {
  title: string;
  logoSource: number;
}

/**
 * AuthOptions component props
 */
export interface AuthOptionsProps {
  rememberMe: boolean;
  onToggleRememberMe: () => void;
  onForgotPassword?: () => void;
}

/**
 * FuturisticButton component props
 */
export interface FuturisticButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  gradient?: string[];
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

/**
 * FuturisticDivider component props
 */
export interface FuturisticDividerProps {
  text: string;
}

/**
 * FuturisticInput component props
 */
export interface FuturisticInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  error?: string;
}

/**
 * SocialLoginButtons component props
 */
export interface SocialLoginButtonsProps {
  onGooglePress?: () => Promise<void>;
  onLinkedInPress?: () => void;
  isGoogleLoading?: boolean;
}

/**
 * EmailSent component props
 */
export interface EmailSentProps {
  email: string;
  emailParam: string | string[];
  setEmailSent: Dispatch<SetStateAction<boolean>>;
  handleRequestReset: () => void;
}

/**
 * ForgotPasswordForm component props
 */
export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleRequestReset: () => void;
}

/**
 * PasswordRequirements component props
 */
export interface PasswordRequirementsProps {
  password: string;
  confirmPassword: string;
}

/**
 * ResetPasswordFormHeader component props
 */
export interface ResetPasswordFormHeaderProps {
  userName: string;
}
