import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const [data, setData] = useState<string | undefined>('');

  const handleAPICall = async () => {
    try {
      console.log("i am here");
      // const response = await fetch("http://localhost:5000/api/test",{method:'GET'});
      const response = await fetch("http://192.168.0.102:5000/api/test",{method:'GET'});
      console.log(response);
      const data = await response.json() as { message: string };
      console.log(data);
      setData(data.message);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  return (
    <View>
      <Text>SignIn</Text>
      <TouchableOpacity onPress={async()=>await handleAPICall()}>
        <Text>Fectch Data From Backend</Text>
      </TouchableOpacity>
        <Text>{data}</Text>
    </View>
  );
};

export default SignIn;
