// import { Stack } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        backgroundColor: COLORS.background,
        // backgroundColor: "#fff",
      }}
    />
  );
}
