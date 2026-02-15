import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  walletType: string;
  color: string;
  icon: string;
}

export default function Wallet() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const [categoryItems, setCategoryItems] = useState([
    { label: "CASH", value: "CASH" },
    { label: "CARD", value: "CARD" },
  ]);

  const [user, setUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

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

  useEffect(() => {
    fetchUser();
  }, []);

  const WALLET_API =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api/wallet/public"
      : "http://192.168.8.115:8080/backend/api/wallet/public";

       const WALLET_API2 =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api/wallet"
      : "http://192.168.8.115:8080/backend/api/wallet";

  const userId = user?.id;
  console.log(userId);

  const fetchWallets = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${WALLET_API}/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text();
      console.log("Raw backend response:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        return;
      }

      if (json.wallets) {
        console.log(wallets);
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
        const icons = ["cash", "card", "wallet"];

        const mappedWallets: Wallet[] = json.wallets.map((w: any) => ({
          id: w.value.toString(),
          name: w.name,
          balance: Number(w.balance),
          walletType: w.walletType,
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: icons[Math.floor(Math.random() * icons.length)],
        }));

        setWallets(mappedWallets);
      }
    } catch (error) {
      console.error("Failed to load wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [userId]);

  const handleAddWallet = async () => {
    if (!walletName.trim()) {
      Alert.alert("Error", "Please enter a wallet name");
      return;
    }

    if (!walletBalance.trim() || isNaN(Number(walletBalance))) {
      Alert.alert("Error", "Please enter a valid balance");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a wallet type");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      const res = await fetch(`${WALLET_API2}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: walletName,
          balance: Number(walletBalance),
          walletType: category,
        }),
      });

      const text = await res.text();
      console.log("Add wallet response:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        Alert.alert("Error", "Invalid server response");
        return;
      }

      if (json.status === true || json.success === true) {
        Alert.alert("Success", "Wallet added successfully!");
        setWalletName("");
        setWalletBalance("");
        setCategory(null);
        setShowModal(false);
        fetchWallets();
      } else {
        Alert.alert("Error", json.message || "Failed to add wallet");
      }
    } catch (error) {
      console.error("Add wallet error:", error);
      Alert.alert("Error", "Server error while adding wallet");
    }
  };

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <LinearGradient colors={["#1f1f1f", "#2a2a2a"]} style={styles.walletCard}>
      <View style={styles.walletHeader}>
        <View
          style={[styles.walletIconWrapper, { backgroundColor: item.color }]}
        >
          <Ionicons name={item.icon as any} size={24} color="#fff" />
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <Text style={styles.walletName}>{item.name}</Text>
      <Text style={styles.walletBalance}>
        ${item.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </Text>
    </LinearGradient>
  );

  const getTotalBalance = () => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallets</Text>
      </View>

      <LinearGradient colors={["#ffffff", "#e6f6ea"]} style={styles.totalCard}>
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <View style={styles.totalContent}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalBalance}>
            $
            {getTotalBalance().toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.totalSubtext}>
            Across {wallets.length} wallets
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.walletsSection}>
        <Text style={styles.sectionTitle}>All Wallets</Text>

        <FlatList
          data={wallets}
          keyExtractor={(item) => item.id}
          renderItem={renderWalletItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.addButton}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#000" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Wallet</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Mom's Card"
                placeholderTextColor="#6b7280"
                value={walletName}
                onChangeText={setWalletName}
              />
            </View>

            <Text style={[styles.inputLabel]}>Wallet Type</Text>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategory}
              setItems={setCategoryItems}
              placeholder="Select wallet type"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemLabelStyle={styles.dropdownItemText}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                Balance
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                value={walletBalance}
                onChangeText={setWalletBalance}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddWallet}
              >
                <Text style={styles.saveButtonText}>Add Wallet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 12,
    minHeight: 50,
  },

  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },

  dropdownContainer: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 12,
    marginTop: 4,
  },

  dropdownItemText: {
    color: "#fff",
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  totalCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 24,
  },

  totalContent: {
    zIndex: 2,
    alignItems: "center",
  },

  totalLabel: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },

  totalBalance: {
    color: "#111827",
    fontSize: 42,
    fontWeight: "bold",
    marginVertical: 8,
  },

  totalSubtext: {
    color: "#6b7280",
    fontSize: 14,
  },

  circleTop: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },

  circleBottom: {
    position: "absolute",
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },

  walletsSection: {
    flex: 1,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  walletCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },

  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  walletIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  walletName: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 4,
  },

  walletBalance: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },

  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 10,
    backgroundColor: "#a3e535",
    padding: 16,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-start",
  },

  modalContent: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,

    marginTop: 34,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  inputContainer: {
    marginBottom: 20,
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
    marginTop: 24,
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
