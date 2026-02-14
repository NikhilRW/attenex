import { Dispatch, SetStateAction } from "react";
import { ThemeMode, UserRole } from "./common";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

export interface ThemeOptionProps {
  mode: ThemeMode | UserRole;
  isActive: boolean;
  onPress: () => void;
  icon: string;
  label: string;
}

export interface ProfileSectionProps {
  displayName: string;
  onDisplayNameChange: Dispatch<SetStateAction<string>>;
  onNameUpdate: UseMutateAsyncFunction<
    {
      success: boolean;
      message: string;
    },
    any,
    any,
    {
      prevName: string;
    }
  >;
  savingName: boolean;
  userPhotoUrl?: string | null;
  userEmail?: string | null;
  userName?: string | null;
}

export interface RoleSectionProps {
  role: UserRole;
  userRole?: string | null;
  onRoleChange: Dispatch<SetStateAction<UserRole>>;
  onRoleUpdate: () => Promise<void>;
  savingRole: boolean;
}

export interface AppearanceSectionProps {
  mode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export interface DangerZoneSectionProps {
  userProvider?: string | null;
  onResetPassword: () => Promise<void>;
  onLogout: () => Promise<void>;
  onDeleteAccount: () => void;
}
