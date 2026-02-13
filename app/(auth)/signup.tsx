import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
// import { useAuth } from "@/context/AuthContext";
type Student = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
};

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/backend/api/users"
    : "http://192.168.8.115:8080/backend/api/users";


const SignUpScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const registerUser = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const text = await response.text();
      console.log("Server raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Response is not JSON:", err);
        Alert.alert(
          "Error",
          "Server returned unexpected response. Check console."
        );
        return;
      }

      if (response.ok && data.status) {
        Alert.alert("Success", data.message);
        navigation.navigate("/(auth)");
      } else {
        Alert.alert("Error", data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Cannot reach server. Check console for details.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Hey, Welcome to</Text>
          <Text style={[styles.title, { color: "#a3e535", marginTop: 15 }]}>
            Expense Tracker
          </Text>
          <Text style={styles.subTitle}>
            Register to track your expenses starting today!
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <View
              style={[
                styles.emailInputWrapper,
                firstNameFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color="#d3d3d3"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your first name"
                placeholderTextColor="grey"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFirstNameFocused(true)}
                onBlur={() => setFirstNameFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View
              style={[
                styles.emailInputWrapper,
                lastNameFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color="#d3d3d3"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your last name"
                placeholderTextColor="grey"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setLastNameFocused(true)}
                onBlur={() => setLastNameFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.emailInputWrapper,
                emailFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#d3d3d3"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="grey"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                passwordFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#d3d3d3"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor="grey"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#636363"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                confirmPasswordFocused && styles.focusedInput,
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#d3d3d3"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor="grey"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <Pressable
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <MaterialCommunityIcons
                  name={
                    showConfirmPassword ? "eye-off-outline" : "eye-outline"
                  }
                  size={22}
                  color="#636363"
                />
              </Pressable>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={registerUser}
          >
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)")}>
              <Text style={styles.signUpText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>HHDP Assignment Project</Text>
      </View>
    </SafeAreaView>
  );
};
;

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignContent: "center",
  },

  signUpText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    lineHeight: 20,
    color: "#a3e535",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "bold",
  },
  title: {
    marginTop: 40,
    fontFamily: "LatoBlack",
    fontSize: 30,
    lineHeight: 29,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 19,
    color: "#a5a5a5",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 24,
  },
  label: {
    fontFamily: "Lato",
    fontSize: 16,
    lineHeight: 20,
    color: "#8c8c8c",
  },
  emailInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#545454",
    borderRadius: 8,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  passwordContainer: {
    marginTop: 15,
  },
  passwordInputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#545454",
    borderRadius: 8,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Lato",
    marginLeft: 8,
    paddingVertical: 0,
    flex: 1,
    color: "#fff",
  },
  loginSection: {
    marginTop: 45,
  },
  loginButton: {
    backgroundColor: "#a3e535",
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 45,
    alignItems: "center",
  },
  loginButtonText: {
    fontFamily: "Lato",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 19,
    color: "black",
  },
  forgotText: {
    fontFamily: "LatoBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#3D83F5",
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "LatoBold",
    fontSize: 16,
    lineHeight: 20,
    color: "#D0D0D0",
    textAlign: "center",
    marginBottom: 18,
  },
  focusedInput: {
    borderColor: "#9ca78c",
    borderWidth: 2,
  },
});
