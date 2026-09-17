import {
  getMessaging,
  subscribeToTopic,
  unsubscribeFromTopic,
  getToken,
} from "@react-native-firebase/messaging";
// NOTE:IMP for ios removed the blocking await
export const subscribeToClassName = async (className: string) => {
  if (!className) return;
  subscribeToTopic(getMessaging(), className);
};

export const unsubscribeFromClassName = async (className: string) => {
  if (!className) return;
  unsubscribeFromTopic(getMessaging(), className);
};

export const getDeviceToken = async () => {
  return getToken(getMessaging());
};
