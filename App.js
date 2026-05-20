import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { db } from "./firebase";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("income");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);
    });

    return () => unsub();
  }, []);

  // CLEAR FORM
  const clearForm = () => {
    setAmount("");
    setCategory("");
    setDate("");
    setNotes("");
    setType("income");
    setEditingId(null);
    setModalVisible(false);
  };

  // SAVE / UPDATE
  const saveTransaction = async () => {
    if (!amount || !category || !date) {
      Alert.alert("Required", "Please fill all required fields");
      return;
    }

    const data = {
      amount: parseFloat(amount),
      category,
      date,
      notes,
      type,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "transactions", editingId), data);

        Alert.alert(
          "Updated Successfully ✅",
          "Transaction has been updated."
        );
      } else {
        await addDoc(collection(db, "transactions"), data);

        Alert.alert(
          "Added Successfully 🎉",
          "New transaction added."
        );
      }

      clearForm();
    } catch (e) {
      Alert.alert("Error ❌", "Failed to save transaction");
    }
  };

  // DELETE
  const deleteTransaction = async (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "transactions", id));

              Alert.alert(
                "Deleted Successfully 🗑️",
                "Transaction removed."
              );
            } catch (e) {
              Alert.alert(
                "Error ❌",
                "Failed to delete transaction"
              );
            }
          },
        },
      ]
    );
  };

  // EDIT
  const editTransaction = (item) => {
    setEditingId(item.id);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setDate(item.date);
    setNotes(item.notes || "");
    setType(item.type);
    setModalVisible(true);
  };

  // TOTALS
  const incomeTotal = transactions
    .filter((i) => i.type === "income")
    .reduce((t, i) => t + i.amount, 0);

  const expenseTotal = transactions
    .filter((i) => i.type === "expense")
    .reduce((t, i) => t + i.amount, 0);

  const balance = incomeTotal - expenseTotal;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Expense Tracker</Text>
            <Text style={styles.subtitle}>
              Manage your finances easily
            </Text>
          </View>

          <View style={styles.profileIcon}>
            <Ionicons name="person-outline" size={22} color="#fff" />
          </View>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>

          <Text style={styles.balanceAmount}>
            ₱{balance.toLocaleString()}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.incomeLabel}>Income</Text>

              <Text style={styles.incomeText}>
                ₱{incomeTotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.expenseLabel}>Expense</Text>

              <Text style={styles.expenseText}>
                ₱{expenseTotal.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            clearForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />

          <Text style={styles.addButtonText}>
            Add Transaction
          </Text>
        </TouchableOpacity>

        {/* RECENT */}
        <Text style={styles.sectionTitle}>
          Recent Transactions
        </Text>

        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.leftRow}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor:
                      item.type === "income"
                        ? "#DCFCE7"
                        : "#FEE2E2",
                  },
                ]}
              >
                <Ionicons
                  name={
                    item.type === "income"
                      ? "arrow-down"
                      : "arrow-up"
                  }
                  size={18}
                  color={
                    item.type === "income"
                      ? "#16A34A"
                      : "#DC2626"
                  }
                />
              </View>

              <View>
                <Text style={styles.category}>
                  {item.category}
                </Text>

                <Text style={styles.date}>
                  {item.date}
                </Text>

                <Text style={styles.note}>
                  {item.notes || "No notes"}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      item.type === "income"
                        ? "#16A34A"
                        : "#DC2626",
                  },
                ]}
              >
                {item.type === "income" ? "+" : "-"}₱
                {item.amount.toLocaleString()}
              </Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => editTransaction(item)}
                >
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color="#3B82F6"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteTransaction(item.id)}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingId
                ? "Edit Transaction"
                : "Add Transaction"}
            </Text>

            <Text style={styles.modalSubtitle}>
              Fill in the details below.
            </Text>

            {/* AMOUNT */}
            <View style={styles.inputBox}>
              <Ionicons
                name="cash-outline"
                size={18}
                color="#3B82F6"
              />

              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
              />
            </View>

            {/* CATEGORY */}
            <View style={styles.inputBox}>
              <Ionicons
                name="pricetag-outline"
                size={18}
                color="#22C55E"
              />

              <TextInput
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
              />
            </View>

            {/* DATE */}
            <View style={styles.inputBox}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#8B5CF6"
              />

              <TextInput
                placeholder="Date"
                value={date}
                onChangeText={setDate}
                style={styles.input}
              />
            </View>

            {/* NOTES */}
            <View style={styles.inputBox}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#F59E0B"
              />

              <TextInput
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
              />
            </View>

            {/* TYPE */}
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" &&
                    styles.activeIncome,
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "income" && {
                      color: "#fff",
                    },
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" &&
                    styles.activeExpense,
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" && {
                      color: "#fff",
                    },
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveTransaction}
            >
              <Text style={styles.saveButtonText}>
                {editingId
                  ? "Update Transaction"
                  : "Save Transaction"}
              </Text>
            </TouchableOpacity>

            {/* CLOSE */}
            <TouchableOpacity onPress={clearForm}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
  },

  subtitle: {
    color: "#64748B",
    marginTop: 3,
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  balanceCard: {
    margin: 20,
    padding: 22,
    borderRadius: 25,
    backgroundColor: "#fff",
    elevation: 4,
  },

  balanceLabel: {
    color: "#64748B",
    fontSize: 14,
  },

  balanceAmount: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 8,
    color: "#0F172A",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 21,
  },

  statBox: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    padding: 15,
  },

  incomeLabel: {
    color: "#22C55E",
    fontWeight: "600",
  },

  incomeText: {
    color: "#16A34A",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  expenseLabel: {
    color: "#EF4444",
    fontWeight: "600",
  },

  expenseText: {
    color: "#DC2626",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  addButton: {
    marginHorizontal: 20,
    backgroundColor: "#2563EB",
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  transactionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  category: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  date: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  note: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },

  amount: {
    fontSize: 16,
    fontWeight: "800",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalSubtitle: {
    color: "#64748B",
    marginTop: 5,
    marginBottom: 20,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 55,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  typeRow: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 15,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 5,
    alignItems: "center",
  },

  activeIncome: {
    backgroundColor: "#22C55E",
  },

  activeExpense: {
    backgroundColor: "#EF4444",
  },

  typeText: {
    fontWeight: "700",
    color: "#334155",
  },

  saveButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  closeText: {
    textAlign: "center",
    marginTop: 16,
    color: "#64748B",
    fontWeight: "600",
  },
});
