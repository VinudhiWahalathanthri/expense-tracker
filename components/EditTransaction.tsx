import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendMessage } from "@/service/socketServices";

type TransactionType = {
  id: string;
  value: string;
};

type Category = {
  id: string;
  value: string;
};

type Wallet = {
  id: string;
  name: string;
  balance: number;
  walletType: string;
  color: string;
  icon: string;
};

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

type EditTransactionProps = {
  transaction: Transaction;
  onClose: () => void;
};

export default function EditTransaction({
  transaction,
  onClose,
  loadTransactions,
}: EditTransactionProps) {
  const [typeItems, setTypeItems] = useState<TransactionType[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const [categoryItems, setCategoryItems] = useState<Category[]>([]);
  const [walletItems, setWalletItems] = useState<Wallet[]>([]);
  const [selectedType, setSelectedType] = useState<{
    id: number;
    value: string;
  } | null>(null);

  const [user, setUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(transaction)

  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const API_BASE =
    Platform.OS === "android"
      ? "http://10.0.2.2:8080/backend/api"
      : "http://192.168.8.115:8080/backend/api";

  const fetchWallets = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/wallet/public/${user.id}`);
      const data = await res.json();
      if (data.wallets) {
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
        const icons = ["cash", "card", "wallet"];
        const mapped = data.wallets.map((w: any) => ({
          label: w.name,
          value: w.value.toString(),
          id: w.value.toString(),
          name: w.name,
          balance: Number(w.balance),
          walletType: w.walletType,
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: icons[Math.floor(Math.random() * icons.length)],
        }));
        setWalletItems(mapped);
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/data/categories`);
      const data = await res.json();
      if (data.categories) {
        const mapped = data.categories.map((c: any) => ({
          label: c.value,
          value: c.id.toString(),
          id: c.id.toString(),
        }));
        setCategoryItems(mapped);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/data/type`);
      const data = await res.json();
      if (data.types) {
        const mapped = data.types.map((t: any) => ({
          id: t.id,
          value: t.value,
        }));
        setTypeItems(mapped);
        const transactionTypeObj = mapped.find(
          (t: any) => t.value.toLowerCase() === transaction.type.toLowerCase(),
        );
        if (transactionTypeObj) {
          setSelectedType(transactionTypeObj);
        }
      }
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  const fetchTransactionById = async (transactionId: number) => {
    try {
      const res = await fetch(`${API_BASE}/transaction/getby/${transactionId}`);
      const data = await res.json();

      if (!data.status || !data.transaction) {
        Alert.alert("Error", "Failed to load transaction details");
        return;
      }

      const t = data.transaction;

      setTitle(t.title || "");
      setDescription(t.description || "");
      setAmount(t.amount.toString());
      setCategory(t.category.id.toString());
      setWallet(t.wallet.id.toString());
      setSelectedType({
        id: t.type.id,
        value: t.type.value,
      });

      if (t.createdAt) {
        setDate(new Date(t.createdAt));
      }
    } catch (err) {
      console.error("Error fetching transaction:", err);
      Alert.alert("Error", "Server error while loading transaction");
    }
  };

  useEffect(() => {
    if (transaction) {
     fetchTransactionById(transaction.id)
    }
  }, [transaction]);

  useEffect(() => {
    if (user) {
      fetchWallets();
      fetchCategories();
      fetchTypes();
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!amount || !category || !wallet || !selectedType) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (!user) return;

    const body = {
      userId: user.id,
      walletId: wallet,
      categoryId: category,
      typeId: selectedType.id,
      amount: Number(amount),
      title,
      description,
    };

    try {
      const res = await fetch(
        `${API_BASE}/transaction/edit/${transaction.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();
      if (data.status) {
        Alert.alert("Success", "Transaction updated successfully");
        sendMessage(JSON.stringify({ type: "TRANSACTION_UPDATED" }));
        loadTransactions();
        onClose();
      } else {
        Alert.alert("Error", data.message || "Failed to update transaction");
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
      Alert.alert("Error", "Server error");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_BASE}/transaction/delete/${transaction.id}`,
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                },
              );

              const data = await res.json();
              if (data.status) {
                Alert.alert("Success", "Transaction deleted successfully");
                sendMessage(JSON.stringify({ type: "TRANSACTION_UPDATED" }));
                onClose();
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Failed to delete transaction",
                );
              }
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Error", "Failed to delete transaction");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Transaction</Text>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable onPress={handleDelete}>
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </Pressable>

              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>
          </View>

          <View style={styles.typeSelector}>
            {typeItems.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType?.id === type.id && styles.typeButtonActive,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType?.id === type.id && styles.typeButtonTextActive,
                  ]}
                >
                  {type.value}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Category *</Text>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setCategory}
            setItems={setCategoryItems}
            placeholder="Select a category"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            listItemLabelStyle={styles.dropdownItemText}
            selectedItemContainerStyle={styles.selectedItem}
            onOpen={() => setWalletOpen(false)}
            zIndex={3000}
            zIndexInverse={1000}
          />

          <Text style={[styles.label, { marginTop: categoryOpen ? 180 : 16 }]}>
            Select Wallet *
          </Text>
          <DropDownPicker
            open={walletOpen}
            value={wallet}
            items={walletItems.map((w) => ({
              label: w.name,
              value: w.id,
              icon: () => (
                <Ionicons name={w.icon as any} size={18} color={w.color} />
              ),
            }))}
            setOpen={setWalletOpen}
            setValue={setWallet}
            setItems={setWalletItems}
            placeholder="Select a wallet"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
            listItemLabelStyle={styles.dropdownItemText}
            selectedItemContainerStyle={styles.selectedItem}
            onOpen={() => setCategoryOpen(false)}
            zIndex={2000}
            zIndexInverse={2000}
          />

          <Text style={[styles.label, { marginTop: walletOpen ? 180 : 16 }]}>
            Amount *
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#6b7280"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Transaction title"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes (optional)"
            placeholderTextColor="#6b7280"
            value={description}
            multiline={true}
            numberOfLines={4}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#a3e535" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    backgroundColor: "#1f1f1f",
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  closeIcon: {
    padding: 4,
  },

  typeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
  },

  typeButtonActive: {
    backgroundColor: "#a3e535",
  },

  typeButtonText: {
    color: "#9ca3af",
    fontSize: 15,
    fontWeight: "600",
  },

  typeButtonTextActive: {
    color: "#000",
  },

  label: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },

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

  selectedItem: {
    backgroundColor: "#3a3a3a",
  },

  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 16,
  },

  currencySymbol: {
    color: "#a3e535",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 16,
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

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },

  dateText: {
    color: "#fff",
    fontSize: 16,
  },

  buttonContainer: {
    marginTop: 32,
    gap: 12,
  },

  saveButton: {
    backgroundColor: "#a3e535",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
