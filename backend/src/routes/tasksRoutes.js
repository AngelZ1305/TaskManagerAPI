const express = require("express");

function createTasksRouter({ authenticateToken, tasksStore }) {
  const router = express.Router();

  router.use(authenticateToken);

  router.get("/", (req, res) => {
    res.json(tasksStore.getTasks());
  });

  router.post("/", (req, res) => {
    const { title, completed } = req.body ?? {};

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "title es obligatorio y debe ser string" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed es obligatorio y debe ser boolean" });
    }

    const newTask = tasksStore.createTask(title, completed);
    return res.status(201).json(newTask);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id invÃ¡lido" });
    }

    const deleted = tasksStore.deleteTaskById(id);

    if (!deleted) {
      return res.status(404).json({ error: "tarea no encontrada" });
    }

    return res.json({ message: "tarea eliminada", deleted });
  });

  router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { completed } = req.body;
    const task = tasksStore.findTaskById(id);

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed debe ser boolean" });
    }

    task.completed = completed;
    return res.json(task);
  });

  return router;
}

module.exports = createTasksRouter;
