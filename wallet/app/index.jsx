import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 28,
          textAlign: "center",
        }}
      >
        Builing a Full-Stack Mobile App from Scratch with Expo and Node.js! 🚀
      </Text>
      <Text style={{ fontSize: 40, color: "red" }}>Wish me luck! 🤲🏾</Text>
    </View>
  );
}
