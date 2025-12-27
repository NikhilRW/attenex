import {
  LectureEndedDoneButton,
  LectureEndedHeader,
  LectureEndedSuccessIcon,
  LectureEndedTitle,
  PasscodeCard,
} from "@classes/components";
import { useLectureEnded } from "@classes/hooks";
import { lectureEndedStyles as styles } from "@classes/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import React from "react";
import { ScrollView, View } from "react-native";

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
