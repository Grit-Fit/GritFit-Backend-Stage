// api/signIn.js

import jwt from "jsonwebtoken";

// In-memory users array (should be shared or moved to a database)
let users = [
  { username: "testuser", email: "test@example.com", password: "password123" },
  { username: "johnDoe", email: "john@example.com", password: "johnPassword" },
];

export default function handler(req, res) {
  const allowedOrigin = process.env.FRONTEND_URL || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
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

  const { email, password } = req.body;
  console.log("Sign-in attempt:", { email, password });

  const existingUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (existingUser) {
    console.log("Signed In Successfully");
    const JWT_SECRET = process.env.JWT_SECRET || "default123";
    const token = jwt.sign(
      { username: existingUser.username, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json({ message: "User signed in successfully!", token });
  } else {
    console.log("Sign-in result: Failure");
    return res.status(401).json({
      message:
        "Invalid Username or Password, Please create an account if not registered.",
    });
  }
}
