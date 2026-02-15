import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      Alert.alert("Logged out", "You have been logged out successfully!");
      router.replace("/(auth)");
    } catch (err) {
      console.error("Error logging out:", err);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName &&
                  user?.lastName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.firstName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.iconWrapper, { backgroundColor: "#3b82f6" }]}
                >
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Name</Text>
                  <Text style={styles.settingValue}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.iconWrapper, { backgroundColor: "#10b981" }]}
                >
                  <Ionicons name="mail" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>{user?.email}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  profileCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#a3e535",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },

  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#a3e535",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1f1f1f",
  },

  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },

  userEmail: {
    color: "#9ca3af",
    fontSize: 14,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  settingsGroup: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    overflow: "hidden",
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  settingText: {
    flex: 1,
  },

  settingLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 2,
  },

  settingValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  settingLabelOnly: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  logoutButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },

  versionText: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  inputContainer: {
    marginBottom: 24,
  },

  inputLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#2a2a2a",
  },

  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#a3e535",
  },

  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
