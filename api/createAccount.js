// backend/api/createAccount.js

const jwt = require("jsonwebtoken");

let users = [
  { username: "testuser", email: "test@example.com", password: "password123" },
  { username: "johnDoe", email: "john@example.com", password: "johnPassword" },
];

module.exports = (req, res) => {
  // Enable CORS (if needed)
  const allowedOrigin = process.env.FRONTEND_URL;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(
    (user) => user.username === username || user.email === email
  );
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Create new user
  const newUser = { username, email, password };
  users.push(newUser);

  // Generate JWT
  const JWT_SECRET = process.env.JWT_SECRET || "default123";
  const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: "1d" });

  console.log("Users registered:", users);
  return res
    .status(201)
    .json({ message: "User record added successfully!", token });
};
