import EditTransaction from "@/components/EditTransaction";
import ExpenseItem from "@/components/ExpenseItem";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  created_at: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  type: "income" | "expense";
};

export default function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      description: "Weekly groceries",
      amount: 156.50,
      created_at: new Date().toISOString(),
      categoryName: "Food",
      categoryColor: "#10b981",
      categoryIcon: "fast-food",
      type: "expense",
    },
    {
      id: "2",
      title: "Salary",
      description: "Monthly salary",
      amount: 5000.00,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      categoryName: "Salary",
      categoryColor: "#3b82f6",
      categoryIcon: "cash",
      type: "income",
    },
    {
      id: "3",
      title: "Uber Ride",
      description: null,
      amount: 24.30,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      categoryName: "Transport",
      categoryColor: "#f59e0b",
      categoryIcon: "car",
      type: "expense",
    },
    {
      id: "4",
      title: "Netflix Subscription",
      description: "Monthly subscription",
      amount: 15.99,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      categoryName: "Entertainment",
      categoryColor: "#ef4444",
      categoryIcon: "game-controller",
      type: "expense",
    },
    {
      id: "5",
      title: "Freelance Project",
      description: "Web design project",
      amount: 800.00,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      categoryName: "Business",
      categoryColor: "#8b5cf6",
      categoryIcon: "briefcase",
      type: "income",
    },
    {
      id: "6",
      title: "Coffee",
      description: "Morning coffee",
      amount: 4.50,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      categoryName: "Food",
      categoryColor: "#10b981",
      categoryIcon: "fast-food",
      type: "expense",
    },
    {
      id: "7",
      title: "Groceries",
      description: null,
      amount: 85.34,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      categoryName: "Food",
      categoryColor: "#10b981",
      categoryIcon: "fast-food",
      type: "expense",
    },
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description?.toLowerCase().includes(query.toLowerCase()) ||
          t.categoryName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };

  // Calculate totals
  const getTotalBalance = () => {
    return transactions.reduce((sum, t) => {
      return t.type === "income" ? sum + t.amount : sum - t.amount;
    }, 0);
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.created_at);
        return (
          t.type === "expense" && transactionDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.created_at);
        return (
          t.type === "income" && transactionDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Handle transaction press
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalVisible(true);
  };

  // Handle transaction update
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    setFilteredTransactions(
      searchQuery.trim() === ""
        ? updatedTransactions
        : updatedTransactions.filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
          )
    );
  };

  // Handle transaction delete
  const handleDeleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== transactionId);
    setTransactions(updatedTransactions);
    setFilteredTransactions(
      searchQuery.trim() === ""
        ? updatedTransactions
        : updatedTransactions.filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
          )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Expenses</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Balance</Text>
          <Text style={styles.summaryAmount}>
            ${getTotalBalance().toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItemSmall}>
            <Text style={styles.summaryLabelSmall}>Income</Text>
            <Text style={[styles.summaryAmountSmall, { color: "#10b981" }]}>
              +${getMonthlyIncome().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItemSmall}>
            <Text style={styles.summaryLabelSmall}>Expenses</Text>
            <Text style={[styles.summaryAmountSmall, { color: "#ef4444" }]}>
              -${getMonthlyExpenses().toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
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

      {/* Transactions List */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#374151" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery.trim() === ""
                ? "Add your first transaction to get started"
                : "Try adjusting your search"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleTransactionPress(item)}>
                <ExpenseItem transaction={item} />
              </Pressable>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {editModalVisible && selectedTransaction && (
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <EditTransaction
            transaction={selectedTransaction}
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

  transactionsSection: {
    flex: 1,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
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