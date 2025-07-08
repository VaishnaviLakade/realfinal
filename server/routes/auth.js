const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection file

router.post("/login", async (req, res) => {
  console.log("Hello");
  const { user, pass } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM teachers WHERE email = ? AND password = ?", [
        user,
        pass,
      ]);

    if (rows.length > 0) {
      return res.status(200).send("Login Successful");
    } else {
      return res.status(401).send("Invalid Email or Password");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
