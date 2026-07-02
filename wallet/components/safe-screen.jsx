import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

export default function SafeScreen({ children }) {
  return (
    <SafeAreaView
      // edges={["top", "left", "right"]}
      style={{
        flex: 1,
        // backgroundColor: "#fff",
        // backgroundColor: "#0a7ea4",
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </SafeAreaView>
  );
}
