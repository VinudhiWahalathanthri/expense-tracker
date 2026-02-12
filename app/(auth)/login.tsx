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
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
// import { useAuth } from "@/context/AuthContext";

type Student = {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  password?: string;
  nic?: string;
  otpExpiry?: { toDate: () => Date };
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);


  const navigation = useNavigation();

  const handleLogin = () =>{
    navigation.navigate("(tabs)")
  }

  //   const navigation = useNavigation();
  //   const { setUser } = useAuth();

  //   const handleLogin = async () => {
  //     if (!email || !password) {
  //       Alert.alert("Missing Fields", "Please enter email and password/OTP.");
  //       return;
  //     }

  //     try {
  //       const q = query(collection(db, "students"), where("email", "==", email));
  //       const snapshot = await getDocs(q);

  //       if (snapshot.empty) {
  //         Alert.alert("Login Failed", "Student not found.");
  //         return;
  //       }

  //       const docData = snapshot.docs[0];
  //       const student: Student = { id: docData.id, ...docData.data() };

  //       if (student.status === "Deactive") {
  //         Alert.alert("Account Deactivated", "Please contact administration.");
  //         return;
  //       }

  //       if (student.password) {
  //         if (student.password === password) {
  //           Alert.alert("Login Successful", `Welcome ${student.name}`);
  //           setUser(student);
  //           router.replace("/(tabs)");
  //         } else {
  //           Alert.alert("Incorrect Password", "Please try again.");
  //         }
  //       } else {
  //         const otpExpiry = student.otpExpiry?.toDate();
  //         const now = new Date();
  //         if (password === student.nic && otpExpiry && now < otpExpiry) {
  //           Alert.alert("OTP Login Successful", `Welcome ${student.name}`);
  //           setUser(student);
  //           router.replace("/(tabs)");
  //         } else {
  //           Alert.alert("Invalid OTP", "OTP is incorrect or expired.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Login error:", error);
  //       Alert.alert("Error", "Something went wrong during login.");
  //     }
  //   };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            Hey, <Text style={{ color: "#a3e535" }}>Welcome Back</Text>
          </Text>
          <Text style={styles.subTitle}>Login to track all your expenses</Text>

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
                color={"#d3d3d3"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={"grey"}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                value={email}
                onChangeText={setEmail}
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
                color={"#d3d3d3"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password"
                placeholderTextColor={"grey"}
                secureTextEntry
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <Text style={styles.footerText}>
              Don't have an account ?{"    "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signUpText}>Sign Up</Text>
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

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignContent: "center",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
