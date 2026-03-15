import { msg, taskList } from "./dom.js";
import { updateProgress } from "./progress.js";

export function render(tasks, actions) {
  taskList.innerHTML = "";
  updateProgress(tasks || []);

  if (!tasks || tasks.length === 0) {
    msg.textContent = "No hay tareas.";
    return;
  }

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  msg.textContent = `Tareas: ${tasks.length} (${completedCount} completadas, ${pendingCount} pendientes)`;

  for (const task of tasks) {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.className = "left";

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.title;

    const state = document.createElement("span");
    state.className = `state ${String(task.completed)}`;
    state.textContent = task.completed ? "Completada" : "Pendiente";

    left.appendChild(title);
    left.appendChild(state);

    const checkbox = document.createElement("input");
    checkbox.className = "checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", async () => {
      await actions.completeTask(task.id, checkbox.checked);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Eliminar";

    deleteButton.addEventListener("click", async () => {
      await actions.deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(left);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }
}
