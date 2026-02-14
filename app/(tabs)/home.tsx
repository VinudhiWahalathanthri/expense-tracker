import AddTransaction from "@/components/AddTransaction";
import ExpenseItem from "@/components/ExpenseItem";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-screens";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const expenses = [
    {
      id: "1",
      name: "Uber Ride",
      category: "Transport",
      type: "expense",
      amount: 15.75,
      date: "Feb 12",
      color: "#10b981",
      icon: () => <MaterialCommunityIcons name="car" size={20} color="#fff" />,
    },
    {
      id: "2",
      name: "Coffee",
      category: "Food & Drink",
      type: "expense",
      amount: 4.5,
      date: "Feb 12",
      color: "#f59e0b",
      icon: () => (
        <MaterialCommunityIcons name="coffee" size={20} color="#fff" />
      ),
    },
    {
      id: "3",
      name: "Netflix Subscription",
      category: "Income",
      type: "income",
      amount: 12.99,
      date: "Feb 10",
      color: "#ef4444",
      icon: () => <Ionicons name="cash" size={20} color="#fff" />,
    },
    {
      id: "4",
      name: "Groceries",
      category: "Food & Drink",
      type: "expense",
      amount: 85.34,
      date: "Feb 9",
      color: "#3b82f6",
      icon: () => <MaterialCommunityIcons name="cart" size={20} color="#fff" />,
    },
  ];

  const [showBalance, setShowBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleSaveTransaction = (transaction: any) => {
    console.log("Saved Transaction:", transaction);
  };

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
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </Text>
        </View>

        <Pressable style={styles.searchButton} onPress={handleLogout}>
          <Ionicons name="search" size={20} color="#000" />
        </Pressable>
      </View>

      <LinearGradient colors={["#ffffff", "#e6f6ea"]} style={styles.card}>
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Total Balance</Text>
            <Pressable onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#6b7280"
              />
            </Pressable>
          </View>

          <Text style={styles.balance}>
            {showBalance ? "$12,458.50" : "••••••"}
          </Text>
          <View style={styles.rowBetween}>
            <View style={styles.infoBlock}>
              <View style={styles.iconWrapper}>
                <Ionicons name="arrow-up" size={20} color="#10b981" />
              </View>
              <Text style={styles.smallLabel}>Income</Text>
              <Text style={[styles.amount, { color: "#10b981" }]}>
                $1,000,000
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.iconWrapper}>
                <Ionicons name="arrow-down" size={20} color="#ef4444" />
              </View>
              <Text style={styles.smallLabel}>Expense</Text>
              <Text style={[styles.amount, { color: "#ef4444" }]}>
                $1,000,000
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

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
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }}>
          <AddTransaction
            onClose={() => setShowModal(false)}
            onSave={handleSaveTransaction}
          />
        </View>
      </Modal>

      <View style={{ marginTop: 24 }}>
        <Text style={[styles.name, { marginBottom: 12 }]}>
          Recent Transactions
        </Text>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItem expense={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    color: "#9ca3af",
    fontSize: 18,
    lineHeight: 26,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },

  searchButton: {
    backgroundColor: "#a3e535",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 10,
    backgroundColor: "#a3e535",
    padding: 8,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.1)",
  },

  card: {
    width: "100%",
    aspectRatio: 1.7,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    marginTop: 16,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    zIndex: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },

  balance: {
    color: "#111827",
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 8,
  },

  smallLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },

  amount: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  infoBlock: {
    alignItems: "flex-start",
  },

  iconWrapper: {
    backgroundColor: "#ffffff",
    padding: 6,
    borderRadius: 8,
    marginBottom: 4,
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
});
