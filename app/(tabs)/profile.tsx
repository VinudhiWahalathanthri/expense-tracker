import React, { useState } from "react";
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

type User = {
  name: string;
  email: string;
  phone: string;
  currency: string;
  theme: string;
};

export default function Profile() {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    currency: "USD",
    theme: "Dark",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState<keyof User | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditPress = (field: keyof User) => {
    setEditField(field);
    setEditValue(user[field]);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      Alert.alert("Error", "Field cannot be empty");
      return;
    }

    if (editField) {
      setUser({ ...user, [editField]: editValue });
      setShowEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          Alert.alert("Logged out", "You have been logged out successfully");
        },
      },
    ]);
  };

  const getFieldLabel = (field: keyof User) => {
    const labels = {
      name: "Name",
      email: "Email",
      phone: "Phone Number",
      currency: "Currency",
      theme: "Theme",
    };
    return labels[field];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name
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

          {/* User Info */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleEditPress("name")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#3b82f6" }]}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Name</Text>
                  <Text style={styles.settingValue}>{user.name}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleEditPress("email")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#10b981" }]}>
                  <Ionicons name="mail" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>{user.email}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleEditPress("phone")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#f59e0b" }]}>
                  <Ionicons name="call" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Phone</Text>
                  <Text style={styles.settingValue}>{user.phone}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleEditPress("currency")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#8b5cf6" }]}>
                  <Ionicons name="cash" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Currency</Text>
                  <Text style={styles.settingValue}>{user.currency}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleEditPress("theme")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#ec4899" }]}>
                  <Ionicons name="moon" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Theme</Text>
                  <Text style={styles.settingValue}>{user.theme}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#ef4444" }]}>
                  <Ionicons name="notifications" size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingValue}>Enabled</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>

          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#06b6d4" }]}>
                  <Ionicons name="help-circle" size={20} color="#fff" />
                </View>
                <Text style={styles.settingLabelOnly}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#6366f1" }]}>
                  <Ionicons name="shield-checkmark" size={20} color="#fff" />
                </View>
                <Text style={styles.settingLabelOnly}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#14b8a6" }]}>
                  <Ionicons name="document-text" size={20} color="#fff" />
                </View>
                <Text style={styles.settingLabelOnly}>Terms & Conditions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: "#84cc16" }]}>
                  <Ionicons name="information-circle" size={20} color="#fff" />
                </View>
                <Text style={styles.settingLabelOnly}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {editField && getFieldLabel(editField)}
              </Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {editField && getFieldLabel(editField)}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${editField && getFieldLabel(editField).toLowerCase()}`}
                placeholderTextColor="#6b7280"
                value={editValue}
                onChangeText={setEditValue}
                keyboardType={editField === "email" ? "email-address" : "default"}
                autoCapitalize={editField === "email" ? "none" : "words"}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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