# Personal Expense Tracker System

## Project Description
The Personal Expense Tracker System allows users to record financial transactions by entering the amount, category, date, and notes for each expense or income entry.

The system provides a dashboard that displays the total balance and recent transactions.

It also enables users to edit transaction details and remove incorrect or duplicate records.

Through this application, users can easily monitor their budgets and improve personal financial planning using a simple and user-friendly interface.

---

## Detailed System Flow

### 1. User Access
- The user opens the Personal Expense Tracker System.
- The dashboard page is displayed.

### 2. Add Expense/Income Entry
- The user selects **Add Transaction**.
- The user inputs the following details:
  - Amount
  - Category
  - Date
  - Notes
  - Transaction Type (Income or Expense)
- The system validates the input data.
- The transaction is saved to the database.

### 3. Display Dashboard
- The system retrieves all saved transactions from the database.
- The dashboard displays:
  - Total Balance
  - Total Income
  - Total Expenses
  - Recent Transactions

### 4. Edit Transaction
- The user selects a transaction from the list.
- The system displays the existing details.
- The user updates the information.
- The updated transaction details are saved to the database.

### 5. Delete Transaction
- The user selects a wrong or duplicate transaction.
- The user clicks the **Delete** button.
- The system asks for confirmation.
- After confirmation, the selected transaction is removed from the database.

### 6. Logout / Exit
- The user logs out or exits the application.
