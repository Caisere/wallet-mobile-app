import { useAuth, useSignUp } from "@clerk/expo";
import { Link, Redirect, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  // KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants/colors";
import { styles as style } from "../../assets/styles/auth.styles";
import { finalizeAndNavigate } from "../../lib/helper";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");

  // handle-sign-up function
  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // send verification code to email
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    // verify the received code
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await finalizeAndNavigate(signUp, router);
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return <Redirect href={"/"} />;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
    // true
  ) {
    return (
      <KeyboardAwareScrollView
        enablesAutomaticScroll={true}
        contentContainerStyle={{ flexGrow: 1 }}
        enablesOnAndroid={true}
        style={{ flex: 1 }}
        // extraScrollHeight={100}
      >
        <View style={style.container}>
          <Text type="title" style={style.title}>
            Verify your account
          </Text>
          <TextInput
            style={style.input}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => setCode(code)}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <Text style={styles.error}>{errors.fields.code.message}</Text>
          )}
          <Pressable
            style={({ pressed }) => [
              style.button,
              fetchStatus === "fetching" && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            <Text style={style.buttonText}>Verify</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={styles.secondaryButtonText}>I need a new code</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enablesAutomaticScroll={true}
      enablesOnAndroid={true}
      // extraScrollHeight={100}
    >
      <View style={style.container}>
        <Image
          source={require("../../assets/images/revenue-i1.png")}
          style={style.illustration}
        />
        <View style={{ gap: 12, width: "100%" }}>
          <Text type="title" style={style.title}>
            Create Account
          </Text>

          {/* email */}
          <TextInput
            style={style.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="your-email@email.com"
            placeholderTextColor="#666666"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            keyboardType="email-address"
          />
          {errors.fields.emailAddress && (
            <Text style={styles.error}>
              {errors.fields.emailAddress.message}
            </Text>
          )}

          {/* password */}
          <View style={{ position: "relative" }}>
            <TextInput
              style={style.input}
              value={password}
              placeholder="*************"
              placeholderTextColor="#666666"
              secureTextEntry={showPassword ? false : true}
              onChangeText={(password) => setPassword(password)}
              // key
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: 12,
                padding: 4,
              }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
          {errors.fields.password && (
            <Text style={styles.error}>{errors.fields.password.message}</Text>
          )}

          {/* sign-up button */}
          <Pressable
            style={({ pressed }) => [
              style.button,
              (!emailAddress || !password || fetchStatus === "fetching") &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text style={style.buttonText}>Sign Up</Text>
          </Pressable>

          {/* {errors && (
        <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>
      )} */}

          <View style={style.footerContainer}>
            <Text style={style.footerText}>Already have an account? </Text>
            <Link href="/sign-in">
              <Text type="link" style={style.linkText}>
                Sign In
              </Text>
            </Link>
          </View>

          {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
    padding: 20,
    gap: 12,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 36,
    fontWeight: 600,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    // backgroundColor: "#0a7ea4",
    backgroundColor: "#074a07",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});
