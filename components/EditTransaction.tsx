import React, { useState } from "react";
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

type Transaction = {
  id: number;
  category: string;
  amount: string;
  title: string;
  description: string;
  date: Date;
  type: "income" | "expense";
  wallet: string;
};

type EditTransactionProps = {
  transaction: Transaction;
  onClose: () => void;
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
};

export default function EditTransaction({
  transaction,
  onClose,
}: EditTransactionProps) {
  const [selectedType, setSelectedType] = useState(transaction.type);
  const [category, setCategory] = useState<string | null>(transaction.category);
  const [wallet, setWallet] = useState<string | null>(transaction.wallet);
  const [amount, setAmount] = useState(transaction.amount);
  const [title, setTitle] = useState(transaction.title);
  const [description, setDescription] = useState(transaction.description);
  const [date, setDate] = useState(new Date(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const [categoryItems, setCategoryItems] = useState([
    {
      label: "Food & Dining",
      value: "food",
      icon: () => <Ionicons name="fast-food" size={18} color="#10b981" />,
    },
    {
      label: "Transport",
      value: "transport",
      icon: () => <Ionicons name="car" size={18} color="#f59e0b" />,
    },
    {
      label: "Entertainment",
      value: "entertainment",
      icon: () => <Ionicons name="game-controller" size={18} color="#ef4444" />,
    },
    {
      label: "Shopping",
      value: "shopping",
      icon: () => <Ionicons name="cart" size={18} color="#8b5cf6" />,
    },
    {
      label: "Bills & Utilities",
      value: "bills",
      icon: () => <Ionicons name="receipt" size={18} color="#3b82f6" />,
    },
    {
      label: "Health",
      value: "health",
      icon: () => <Ionicons name="medical" size={18} color="#ec4899" />,
    },
    {
      label: "Other",
      value: "other",
      icon: () => (
        <Ionicons name="ellipsis-horizontal" size={18} color="#6b7280" />
      ),
    },
  ]);

  const [walletItems, setWalletItems] = useState([
    {
      label: "Cash",
      value: "cash",
      icon: () => <Ionicons name="cash" size={18} color="#10b981" />,
    },
    {
      label: "Credit Card",
      value: "credit",
      icon: () => <Ionicons name="card" size={18} color="#3b82f6" />,
    },
    {
      label: "Debit Card",
      value: "debit",
      icon: () => <Ionicons name="card-outline" size={18} color="#f59e0b" />,
    },
    {
      label: "Bank Account",
      value: "bank",
      icon: () => <Ionicons name="business" size={18} color="#8b5cf6" />,
    },
  ]);

  const handleUpdate = async () => {
    if (!amount || !category || !wallet) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      category,
      wallet,
      amount,
      title,
      description,
      date,
      type: selectedType,
    };

    try {
      console.log("Updated Transaction:", updatedTransaction);

      Alert.alert("Success", "Transaction updated successfully!");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update transaction.");
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
              console.log("Deleted Transaction ID:", transaction.id);

              Alert.alert("Deleted", "Transaction deleted successfully.");
              onClose();
            } catch (error) {
              Alert.alert("Error", "Failed to delete transaction.");
            }
          },
        },
      ],
    );
  };

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
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "expense" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("expense")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === "expense" && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "income" && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType("income")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === "income" && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </Pressable>
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
            items={walletItems}
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

          <Text style={[styles.label, { marginTop: walletOpen ? 180 : 16 }]}>
            Title
          </Text>
          <TextInput
            style={[styles.input]}
            placeholder="Add notes (optional)"
            placeholderTextColor="#6b7280"
            value={title}
            multiline={true}
            numberOfLines={4}
            onChangeText={setTitle}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { marginTop: walletOpen ? 180 : 16 }]}>
            Description
          </Text>
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

          <Text style={[styles.label, { marginTop: walletOpen ? 180 : 16 }]}>
            Date
          </Text>
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
