import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Expense = {
  name: string;
  category: string;
  amount: number;
  type: string;
  date: string;
  color: string;
  icon: React.ElementType;
};

type Props = {
  expense: Expense;
};

export default function ExpenseItem({ expense }: Props) {
  const Icon = expense.icon;

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={[styles.iconWrapper, { backgroundColor: expense.color }]}>
        <Icon size={20} color="#fff" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {expense.name}
        </Text>
        <Text style={styles.category}>{expense.category}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            { color: expense.type === "expense" ? "#ef4444" : "#aeff00" },
          ]}
        >
          {expense.type === "expense"
            ? `- $${expense.amount.toFixed(2)}`
            : `+ $${expense.amount.toFixed(2)}`}
        </Text>
        <Text style={styles.date}>{expense.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    marginBottom: 12,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },

  category: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },

  amountContainer: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  date: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});
