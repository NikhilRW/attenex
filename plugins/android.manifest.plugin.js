const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;
    androidManifest.application[0]["meta-data"].push({
        "$": {
            "android:name": "com.google.firebase.messaging.default_notification_color",
            "tools:replace": "android:resource",
            "android:resource":"@color/notification_icon_color"
        }
    }) 
    
    console.log(JSON.stringify(androidManifest));    
    return config;
  });
};

// {
//     "$": {
//         "xmlns:android": "http://schemas.android.com/apk/res/android"
//     },
//     "uses-permission": [
//         {
//             "$": {
//                 "android:name": "android.permission.INTERNET"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.SYSTEM_ALERT_WINDOW"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.VIBRATE"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.READ_EXTERNAL_STORAGE"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.WRITE_EXTERNAL_STORAGE"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.ACCESS_COARSE_LOCATION"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.ACCESS_FINE_LOCATION"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.ACCESS_BACKGROUND_LOCATION"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.FOREGROUND_SERVICE"
//             }
//         },
//         {
//             "$": {
//                 "android:name": "android.permission.FOREGROUND_SERVICE_LOCATION"
//             }
//         }
//     ],
//     "queries": [
//         {
//             "intent": [
//                 {
//                     "action": [
//                         {
//                             "$": {
//                                 "android:name": "android.intent.action.VIEW"
//                             }
//                         }
//                     ],
//                     "category": [
//                         {
//                             "$": {
//                                 "android:name": "android.intent.category.BROWSABLE"
//                             }
//                         }
//                     ],
//                     "data": [
//                         {
//                             "$": {
//                                 "android:scheme": "https"
//                             }
//                         }
//                     ]
//                 }
//             ]
//         }
//     ],
//     "application": [
//         {
//             "$": {
//                 "android:name": ".MainApplication",
//                 "android:label": "@string/app_name",
//                 "android:icon": "@mipmap/ic_launcher",
//                 "android:roundIcon": "@mipmap/ic_launcher_round",
//                 "android:allowBackup": "true",
//                 "android:theme": "@style/AppTheme",
//                 "android:supportsRtl": "true",
//                 "android:enableOnBackInvokedCallback": "false"
//             },
//             "activity": [
//                 {
//                     "$": {
//                         "android:name": ".MainActivity",
//                         "android:configChanges": "keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode",
//                         "android:launchMode": "singleTask",
//                         "android:windowSoftInputMode": "adjustResize",
//                         "android:theme": "@style/Theme.App.SplashScreen",
//                         "android:exported": "true",
//                         "android:screenOrientation": "portrait"
//                     },
//                     "intent-filter": [
//                         {
//                             "action": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.action.MAIN"
//                                     }
//                                 }
//                             ],
//                             "category": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.category.LAUNCHER"
//                                     }
//                                 }
//                             ]
//                         },
//                         {
//                             "action": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.action.VIEW"
//                                     }
//                                 }
//                             ],
//                             "category": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.category.DEFAULT"
//                                     }
//                                 },
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.category.BROWSABLE"
//                                     }
//                                 }
//                             ],
//                             "data": [
//                                 {
//                                     "$": {
//                                         "android:scheme": "attenex"
//                                     }
//                                 },
//                                 {
//                                     "$": {
//                                         "android:scheme": "exp+attenex"
//                                     }
//                                 }
//                             ]
//                         },
//                         {
//                             "$": {
//                                 "data-generated": "true"
//                             },
//                             "action": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.action.VIEW"
//                                     }
//                                 }
//                             ],
//                             "data": [
//                                 {
//                                     "$": {
//                                         "android:scheme": "https",
//                                         "android:host": "attenex.vercel.app",
//                                         "android:pathPrefix": "/auth"
//                                     }
//                                 },
//                                 {
//                                     "$": {
//                                         "android:scheme": "exp+attenex"
//                                     }
//                                 }
//                             ],
//                             "category": [
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.category.BROWSABLE"
//                                     }
//                                 },
//                                 {
//                                     "$": {
//                                         "android:name": "android.intent.category.DEFAULT"
//                                     }
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ],
//             "meta-data": [
//                 {
//                     "$": {
//                         "android:name": "expo.modules.updates.ENABLED",
//                         "android:value": "false"
//                     }
//                 },
//                 {
//                     "$": {
//                         "android:name": "expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH",
//                         "android:value": "ALWAYS"
//                     }
//                 },
//                 {
//                     "$": {
//                         "android:name": "expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS",
//                         "android:value": "0"
//                     }
//                 },
                
//             ]
//         }
//     ]
// }