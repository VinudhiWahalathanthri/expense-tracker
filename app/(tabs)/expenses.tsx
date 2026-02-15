import EditTransaction from "@/components/EditTransaction";
import ExpenseItem from "@/components/ExpenseItem";
import { closeConnection, connectWebSocket } from "@/service/socketServices";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  amount: number;
  date: string;
  color: string;
};

export default function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [user, setUser] = useState<{
    id: number;
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

        if (data.type === "TRANSACTION_UPDATED") fetchTransactions();
      });

      fetchTransactions();

      return () => {
        closeConnection();
      };
    }, [user]),
  );

  const TRANSACTION_API =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api/transaction"
      : "http://192.168.8.115:8080/backend/api/transaction";

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${TRANSACTION_API}/public/${user?.id}`);
      const json = await res.json();

      if (json.status && json.transactions) {
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

        const mapped: Transaction[] = json.transactions.map((t: any) => ({
          id: t.id.toString(),
          name: t.title,
          description: t.description || "",
          category: t.category.value,
          type: t.type.value === "Income" ? "Income" : "Expense",
          amount: Number(t.amount),
          date: new Date(t.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          color: colors[Math.floor(Math.random() * colors.length)],
        }));

        setTransactions(mapped);
        setFilteredTransactions(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredTransactions(filtered);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalVisible(true);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>My Expenses</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color="#374151" />
      <Text style={styles.emptyStateText}>No transactions found</Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery.trim() === ""
          ? "Add your first transaction to get started"
          : "Try adjusting your search"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleTransactionPress(item)}>
            <ExpenseItem expense={item} />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {editModalVisible && selectedTransaction && (
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <EditTransaction
            transaction={selectedTransaction}
            loadTransactions={fetchTransactions}
            onClose={() => setEditModalVisible(false)}
          />
        </Modal>
      )}
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
    marginBottom: 16,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  summaryCard: {
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  summaryItem: {
    alignItems: "center",
    marginBottom: 16,
  },

  summaryLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },

  summaryAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },

  summaryItemSmall: {
    alignItems: "center",
  },

  summaryLabelSmall: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },

  summaryAmountSmall: {
    fontSize: 16,
    fontWeight: "600",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyStateText: {
    color: "#9ca3af",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },

  emptyStateSubtext: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 8,
  },
});
