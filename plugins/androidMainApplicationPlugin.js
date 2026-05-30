const { withMainApplication } = require('@expo/config-plugins');

module.exports = (config) => {
  return withMainApplication(config, (config) => {
    const modResults = config.modResults.contents;
    const lines = modResults.split('\n');
    const onCreateIndex = lines.indexOf('  override fun onCreate() {');
    if(onCreateIndex != -1){
      const initializationCallString = `    ReactNativePerformance.onAppStarted()`;
      if(!lines.includes(initializationCallString)){
        lines.splice(onCreateIndex + 1, 0,initializationCallString)
      }
      const importString = `import com.shopify.reactnativeperformance.ReactNativePerformance`
      if(!lines.includes(importString)){
        lines.splice(2,0,importString)
      }
    }
    config.modResults.contents = lines.join('\n');
    return config;
  });
};
