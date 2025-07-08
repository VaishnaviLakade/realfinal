// server/routes/students.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/students?batch=E9
router.get("/", (req, res) => {
  const { batch } = req.query;
  if (!batch) return res.status(400).json({ error: "Batch is required" });

  const sql = "SELECT Roll_No, Name FROM Student WHERE batch = ?";
  db.query(sql, [batch], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log(results);
    res.json(results);
  });
});

router.get("/class", async (req, res) => {
  const { class: className } = req.query;

  if (!className) {
    return res.status(400).json({ error: "Class is required" });
  }

  let query = "";
  switch (className) {
    case "SE9":
      query =
        "SELECT Roll_No, Name FROM Student WHERE Roll_No >= '23101' AND Roll_No <= '23180'";
      break;
    case "SE10":
      query =
        "SELECT Roll_No, Name FROM Student WHERE Roll_No > '23180' AND Roll_No <= '23280'";
      break;
    case "SE11":
      query =
        "SELECT Roll_No, Name FROM Student WHERE Roll_No >= '23361' AND Roll_No <= '23363'";
      break;
    default:
      return res.status(400).json({ error: "Invalid class" });
  }

  try {
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
