const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./db/db");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LiftSync backend is running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected",
      time: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Get all workouts
app.get("/workouts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM workouts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting workouts");
  }
});

// Add a new workout
app.post("/workouts", async (req, res) => {
  try {
    const { exercise, sets, reps, weight } = req.body;

    const result = await pool.query(
      "INSERT INTO workouts (exercise, sets, reps, weight) VALUES ($1, $2, $3, $4) RETURNING *",
      [exercise, sets, reps, weight]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding workout");
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});