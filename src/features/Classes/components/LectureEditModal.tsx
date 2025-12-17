import { LinearGradient } from "expo-linear-gradient";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { styles } from "../styles/TeacherDashboard.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

export const LectureEditModal = ({
  editModalVisible,
  setEditModalVisible,
  editTitle,
  setEditTitle,
  editDuration,
  setEditDuration,
  handleUpdateLecture,
}: {
  editModalVisible: boolean;
  setEditModalVisible: (visible: boolean) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editDuration: string;
  setEditDuration: (duration: string) => void;
  handleUpdateLecture: () => void;
}) => {
  const { colors, isDark } = useTheme();
  return (
    <Modal
      visible={editModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOutDown.duration(400)}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"]
                : ["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.modalContent,
              {
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.8)",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: colors.text.primary,
                      fontSize: 22,
                    },
                  ]}
                >
                  Edit Lecture
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 24, paddingTop: 10 }}>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text.secondary,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Title
                </Text>
                <TextInput
                  style={{
                    height: 56,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                    backgroundColor: isDark
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(255, 255, 255, 0.8)",
                    paddingHorizontal: 16,
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Lecture Title"
                  placeholderTextColor={colors.text.muted}
                />
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text.secondary,
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Duration (min)
                </Text>
                <TextInput
                  style={{
                    height: 56,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                    backgroundColor: isDark
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(255, 255, 255, 0.8)",
                    paddingHorizontal: 16,
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                  value={editDuration}
                  onChangeText={setEditDuration}
                  keyboardType="number-pad"
                  placeholder="60"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                padding: 20,
                paddingTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
                onPress={() => setEditModalVisible(false)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text.secondary,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={handleUpdateLecture}
              >
                <LinearGradient
                  colors={[colors.primary.main, "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    Update
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};
