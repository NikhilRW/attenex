import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import React from "react";
import { ScrollView, View } from "react-native";
import { LectureEndedDoneButton } from "../components/LectureEndedDoneButton";
import { LectureEndedHeader } from "../components/LectureEndedHeader";
import { LectureEndedSuccessIcon } from "../components/LectureEndedSuccessIcon";
import { LectureEndedTitle } from "../components/LectureEndedTitle";
import { PasscodeCard } from "../components/PasscodeCard";
import { useLectureEnded } from "../hooks/useLectureEnded";
import { styles } from "../styles/LectureEndedScreen.styles";

const LectureEndedScreen = () => {
  const {
    lectureTitle,
    passcode,
    loading,
    fetchPasscodeData,
    handleDone,
  } = useLectureEnded();

  return (
    <View style={styles.container}>
      <FuturisticBackground />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <LectureEndedHeader onDone={handleDone} />

          <LectureEndedSuccessIcon />

          <LectureEndedTitle lectureTitle={lectureTitle as string} />

          <PasscodeCard
            passcode={passcode}
            loading={loading}
            onRefresh={fetchPasscodeData}
          />

          <LectureEndedDoneButton onDone={handleDone} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LectureEndedScreen;
