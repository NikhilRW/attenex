import { SharedValue } from "react-native-reanimated";

import { Role } from "@role-selection/types/common";

export interface RoleCardProps {
  role: "teacher" | "student";
  imageSource: number;
  title: string;
  description: string;
  isSelected: boolean;
  isDisabled: boolean;
  scale: SharedValue<number>;
  onPress: () => void;
}

export interface ConfirmButtonProps {
  selectedRole: Role;
  isUpdating: boolean;
  userRole: string | null | undefined;
  bottomInset: number;
  onConfirm: () => void;
}
