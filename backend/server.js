const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Estudiar Web APIs", completed: false },
];

let nextId = 2;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "title es obligatorio y debe ser string" });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed es obligatorio y debe ser boolean" });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id inválido" });
  }

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "tarea no encontrada" });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.json({ message: "tarea eliminada", deleted });
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  task.completed = completed;

  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Task Manager API corriendo en http://localhost:${PORT}`);
});