import { LectureEndedDoneButton } from "@classes/components/LectureEndedDoneButton";
import { LectureEndedHeader } from "@classes/components/LectureEndedHeader";
import { LectureEndedSuccessIcon } from "@classes/components/LectureEndedSuccessIcon";
import { LectureEndedTitle } from "@classes/components/LectureEndedTitle";
import { PasscodeCard } from "@classes/components/PasscodeCard";
import { useLectureEnded } from "@classes/hooks/useLectureEnded";
import { styles } from "@classes/styles/LectureEndedScreen.styles";
import React from "react";
import { ScrollView, View } from "react-native";

const LectureEndedScreen = () => {
  const { lectureTitle, passcode, loading, fetchPasscodeData, handleDone } =
    useLectureEnded();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
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
