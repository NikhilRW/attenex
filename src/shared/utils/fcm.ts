import { getMessaging, subscribeToTopic, unsubscribeFromTopic } from "@react-native-firebase/messaging";

export const subscribeToClassName = async (className: string) => {
  await subscribeToTopic(getMessaging(), className);
};

export const unsubscribeFromClassName = async (className: string) => {
  await unsubscribeFromTopic(getMessaging(), className);
}