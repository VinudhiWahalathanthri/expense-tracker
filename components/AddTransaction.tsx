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

type Transaction = {
  category: string;
  amount: string;
  title: string;
  description: string;
  date: Date;
  type: "Income" | "Expense";
  wallet: string;
};

type Wallet = {
  id: string;
  name: string;
  balance: number;
  walletType: string;
  color: string;
  icon: string;
};

type Category = {
  id: string;
  value: string;
};

type TransactionType = {
  id: string;
  value: string;
};

type AddTransactionProps = {
  onClose: () => void;
  onSave: () => void;
  loadWallet: () => void;
};
export default function AddTransaction({
  onClose,
  onSave,
  loadWallet,
}: AddTransactionProps) {
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
        setWalletItems(
          data.wallets.map((w: any) => ({
            id: w.value.toString(),
            name: w.name,
            balance: Number(w.balance),
            walletType: w.walletType,
            color: colors[Math.floor(Math.random() * colors.length)],
            icon: icons[Math.floor(Math.random() * icons.length)],
          })),
        );
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
        setCategoryItems(
          data.categories.map((c: any) => ({
            id: c.id.toString(),
            value: c.value,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/data/type`);
      const data = await res.json();
      console.log(data);
      if (data.types) {
        setTypeItems(
          data.types.map((t: any) => ({
            id: t.id.toString(),
            value: t.value,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallets();
      fetchCategories();
      setLoading(false);
      fetchTypes();
    }
  }, [user]);

  const handleSave = async () => {
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
      const res = await fetch(`${API_BASE}/transaction/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.status) {
        Alert.alert("Success", "Transaction added successfully");
        onSave();
        loadWallet();
        sendMessage(JSON.stringify({ type: "TRANSACTION_UPDATED" }));

        onClose();
      } else {
        Alert.alert("Error", data.message || "Failed to add transaction");
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
      Alert.alert("Error", "Server error");
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"  
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Transaction</Text>
            <Pressable onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.typeSelector}>
            {typeItems.map((t) => (
              <Pressable
                key={t.id}
                style={[
                  styles.typeButton,
                  selectedType?.id === t.id && styles.typeButtonActive,
                ]}
                onPress={() => setSelectedType(t)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType?.id === t.id && styles.typeButtonTextActive,
                  ]}
                >
                  {t.value}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Category *</Text>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categoryItems.map((c) => ({ label: c.value, value: c.id }))}
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

          <Text style={[styles.label, { marginTop: 16 }]}>Wallet *</Text>
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

          <Text style={[styles.label, { marginTop: 16 }]}>Amount *</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            multiline
            numberOfLines={4}
            onChangeText={setDescription}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            <Ionicons name="calendar-outline" size={20} color="#a3e535" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowDatePicker(Platform.OS === "ios");
                if (d) setDate(d);
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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
