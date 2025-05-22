import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/transactions";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [category, setCategory] = useState("food");
  const [editingId, setEditingId] = useState(null);

  const fetchTransactions = async () => {
    const response = await axios.get(API_URL);
    setTransactions(response.data);
  };

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount");
      return;
    }

    const transaction = { amount, type, category };

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, transaction);
      setEditingId(null);
    } else {
      await axios.post(API_URL, transaction);
    }

    setAmount("");
    setType("credit");
    setCategory("food");
    fetchTransactions();
  };

  const handleDeleteTransaction = async (id:any) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTransactions();
  };

  const handleEditTransaction = (transaction:any) => {
    setEditingId(transaction.id);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
  };

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction:any) => {
      return transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Transaction Manager</h1>
      <h2 className="text-lg">Total Balance: ${calculateBalance().toFixed(2)}</h2>

      <Input
        placeholder="Enter amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full"
      />
      
      <Select value={type} onValueChange={setType} >
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="credit">Credit</SelectItem>
          <SelectItem value="debit">Debit</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="transport">Transport</SelectItem>
          <SelectItem value="shopping">Shopping</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleAddTransaction} className="w-full">
        {editingId ? "Update Transaction" : "Add Transaction"}
      </Button>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((transaction:any) => (
              <li
                key={transaction.id}
                className="p-2 border rounded-md flex justify-between items-center"
              >
                <div>
                  <span>
                    {transaction.type} - {transaction.category}
                  </span>
                  <span className="ml-4">${transaction.amount}</span>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleEditTransaction(transaction)}>
                    Edit
                  </Button>
                  <Button className="text-black" size="sm" variant="destructive" onClick={() => handleDeleteTransaction(transaction.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
