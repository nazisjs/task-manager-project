const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = []; // временная база

// Регистрация
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });
  console.log("Users:", users);
  res.json({ message: "Registered" });
});

// Логин
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Logged in" });
});

app.listen(5000, () => console.log("Server running on port 5000"));