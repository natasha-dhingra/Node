const express = require("express");
const router = express.Router();
const pool = require("../main");

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Task creation failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const taskId = req.params.id;
    const userId = req.user.userId;
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, description, completed, taskId, userId]
    );
    if (result.rows.length === 0)
      return res.status(403).json({ error: "Unauthorized" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Task update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.userId;
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [taskId, userId]
    );
    if (result.rows.length === 0)
      return res.status(403).json({ error: "Unauthorized" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Task deletion failed" });
  }
});

module.exports = router;