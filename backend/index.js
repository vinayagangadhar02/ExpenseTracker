const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());

let transactions = [];


app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});


app.post("/api/transactions", (req, res) => {
  const { amount, type, category } = req.body;
  if (!amount || !type || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transaction = {
    id: Date.now(),
    amount: parseFloat(amount),
    type,
    category,
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});


app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter((transaction) => transaction.id !== parseInt(id));
  res.status(200).json({ message: "Transaction deleted" });
});


app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { amount, type, category } = req.body;

  const index = transactions.findIndex((transaction) => transaction.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions[index] = {
    ...transactions[index],
    amount: parseFloat(amount),
    type,
    category,
  };

  res.json(transactions[index]);
});

app.listen(PORT, () => {
  console.log("Server running ");
});

