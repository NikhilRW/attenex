export const codeStr = `
  import { View, Text,Button,ToastAndroid } from 'react-native'

  import React from 'react'

  const App = () => {
  
  
    return (
      <View style={{flex:1,justifyContent: "center", alignItems: "center"}}>
      <Text>Hello World!</Text>
      <Button title="Click Me" onPress={()=>{ToastAndroid.show('Here',10)}} />
      </View>
    )
  }

  export default App;
`;