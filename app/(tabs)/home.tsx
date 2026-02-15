import AddTransaction from "@/components/AddTransaction";
import ExpenseItem from "@/components/ExpenseItem";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-screens";
import { useUser } from "@/hooks/useUser";
import { closeConnection, connectWebSocket } from "@/service/socketServices";

type Transaction = {
  id: string;
  name: string;
  category: string;
  type: string;
  amount: number;
  date: string;
  color: string;
};

type Wallet = {
  id: string;
  name: string;
  balance: number;
  walletType: string;
  color: string;
  icon: string;
};

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showBalance, setShowBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      connectWebSocket((message: string) => {
        console.log("WebSocket message received:", message);

        let data;
        try {
          data = JSON.parse(message);
        } catch {
          data = { type: message };
        }

        if (data.type === "WALLET_UPDATED") fetchWallets();
        if (data.type === "TRANSACTION_UPDATED") fetchTransactions();
      });
      fetchWallets();
      fetchTransactions();

      return () => {
        closeConnection();
      };
    }, [user]),
  );

  const WALLET_API =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api/wallet"
      : "http://192.168.8.115:8080/backend/api/wallet";

  const TRANSACTION_API =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api/transaction"
      : "http://192.168.8.115:8080/backend/api/transaction";

  const fetchWallets = async () => {
    try {
      const res = await fetch(`${WALLET_API}/public/${user.id}`);
      const json = await res.json();

      if (json.wallets) {
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
    } catch (err) {
      console.error("Failed to fetch wallets:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${TRANSACTION_API}/public/${user?.id}`);
      const json = await res.json();

      if (json.status && json.transactions) {
        const mapped: Transaction[] = json.transactions.map((t: any) => ({
          id: t.id.toString(),
          name: t.title,
          category: t.category.value,
          type: t.type.value === "Income" ? "Income" : "Expense",
          amount: Number(t.amount),
          date: new Date(t.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchWallets();
    fetchTransactions();
  }, [user]);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </Text>
        </View>

        <Pressable style={styles.searchButton}>
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
            {showBalance ? `$${totalBalance.toLocaleString()}` : "••••••"}
          </Text>
          <View style={styles.rowBetween}>
            <View style={styles.infoBlock}>
              <View style={styles.iconWrapper}>
                <Ionicons name="arrow-up" size={20} color="#10b981" />
              </View>
              <Text style={styles.smallLabel}>Income</Text>
              <Text style={[styles.amount, { color: "#10b981" }]}>
                ${totalIncome.toLocaleString()}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.iconWrapper}>
                <Ionicons name="arrow-down" size={20} color="#ef4444" />
              </View>
              <Text style={styles.smallLabel}>Expense</Text>
              <Text style={[styles.amount, { color: "#ef4444" }]}>
                ${totalExpense.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <Text style={[styles.name, { marginTop: 24, marginBottom: 12 }]}>
        All Transactions
      </Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

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
            onSave={fetchTransactions}
            loadWallet={fetchWallets}
          />
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
