import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

export default function AddTransaction({ onClose, onSave }: { onClose: () => void; onSave: (transaction: any) => void }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setReceipt(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!amount || !category) {
      Alert.alert("Missing Fields", "Please fill amount and category.");
      return;
    }
    const transaction = { category, amount, description, date, receipt };
    onSave(transaction);
    onClose();
  };

  const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Shopping", value: "Shopping" },
    { label: "Other", value: "Other" },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Transaction</Text>

      <Text style={[styles.label, {marginBottom:15}]}>Category</Text>
       <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select a category"
        style={styles.dropdown}
        textStyle={{ color: "#fff" }}
        dropDownContainerStyle={{
          backgroundColor: "#2a2a2a",
          borderWidth: 0,
        }}
        listItemLabelStyle={{ color: "#fff" }}
      />

       <Text style={[styles.label, {marginBottom:15}]}>Select Wallet</Text>
       <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select a category"
        style={styles.dropdown}
        textStyle={{ color: "#fff" }}
        dropDownContainerStyle={{
          backgroundColor: "#2a2a2a",
          borderWidth: 0,
        }}
        listItemLabelStyle={{ color: "#fff" }}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        placeholderTextColor="#888"
        value={description}
        multiline={true}
        numberOfLines={4}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: "#fff" }}>{date.toDateString()}</Text>
        <Ionicons name="calendar-outline" size={20} color="#fff" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={{ color: "#000", fontWeight: "bold" }}>
          Save Transaction
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ color: "#fff" }}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 12,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    backgroundColor: "#1f1f1f",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  label: {
    color: "#a5a5a5",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    marginTop: 8,
    color: "#fff",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 12,
  },
  imageButton: {
    backgroundColor: "#292929",
    padding: 20,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    marginTop: 8,
  },
  receiptImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#a3e535",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  closeButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
});
