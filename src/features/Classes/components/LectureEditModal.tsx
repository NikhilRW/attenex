import { styles } from "@classes/styles/TeacherDashboard.styles";
import { LectureEditModalProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const ModalSurface = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.themeName === "dark"
      ? (["rgba(40, 40, 40, 0.95)", "rgba(20, 20, 20, 0.98)"] as const)
      : (["rgba(255, 255, 255, 0.95)", "rgba(245, 245, 255, 0.98)"] as const),
}));

const PrimaryButton = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, "#3B82F6"] as const,
}));

const CloseIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.secondary,
}));

const ModalInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

export const LectureEditModal: React.FC<LectureEditModalProps> = ({
  editModalVisible,
  setEditModalVisible,
  editTitle,
  setEditTitle,
  editDuration,
  setEditDuration,
  handleUpdateLecture,
}) => {
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
          style={styles.modalAnimatedWrapper}
        >
          <ModalSurface
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.modalContent, styles.modalSurface]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={[styles.modalTitle, styles.modalTitleLarge]}>
                  Edit Lecture
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <CloseIcon name="close" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <ModalInput
                  style={styles.modalInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Lecture Title"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration (min)</Text>
                <ModalInput
                  style={styles.modalInput}
                  value={editDuration}
                  onChangeText={setEditDuration}
                  keyboardType="number-pad"
                  placeholder="60"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text
                  style={[styles.modalBtnText, styles.modalBtnTextSecondary]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnWrapper}
                onPress={handleUpdateLecture}
              >
                <PrimaryButton
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalBtnPrimary}
                >
                  <Text
                    style={[styles.modalBtnText, styles.modalBtnTextPrimary]}
                  >
                    Update
                  </Text>
                </PrimaryButton>
              </TouchableOpacity>
            </View>
          </ModalSurface>
        </Animated.View>
      </View>
    </Modal>
  );
};
