import {
  getMessaging,
  subscribeToTopic,
  unsubscribeFromTopic,
  getToken,
} from "@react-native-firebase/messaging";

export const subscribeToClassName = async (className: string) => {
  if (!className) return;
  await subscribeToTopic(getMessaging(), className);
};

export const unsubscribeFromClassName = async (className: string) => {
  if (!className) return;
  await unsubscribeFromTopic(getMessaging(), className);
};

export const getDeviceToken = async () => {
  return await getToken(getMessaging());
};
