import "expo-router/entry";
import "./unistyles";

// import BackgroundFetch from "react-native-background-fetch";
// import { mmkvStorage } from "./shared/utils";
// import { userService } from "./shared/services/userService";
// const initBackgroundFetch = async () => {
//   const status = await BackgroundFetch.configure(
//     {
//       minimumFetchInterval: 15,
//       stopOnTerminate: false,
//       enableHeadless: true,
//       startOnBoot: true,
//     },
//     async (taskId) => {
//       console.log("[BackgroundFetch] Task start: ", taskId);
//       await syncFullNameUpdate();
//       BackgroundFetch.finish(taskId);
//     },
//     (taskId) => {
//       BackgroundFetch.finish(taskId);
//     },
//   );
// };

// initBackgroundFetch();

// async function syncFullNameUpdate() {
//   console.log("Background Task Started");
//   const newDisplayName = mmkvStorage.getItem("new-display-name");
//   if (newDisplayName) {
//     const response = await userService.updateUserFullName(newDisplayName);
//     console.log("Background Task Response  : " + response.success);
//     if (response.success) {
//       mmkvStorage.setItem("new-display-name", "");
//       mmkvStorage.setItem("name-updated-flag", "true");
//     }
//   }
// }
