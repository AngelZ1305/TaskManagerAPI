import { TASKS_API } from "./config.js";
import { addButton, msg, taskList, taskTitle } from "./dom.js";
import { setAuthStatus, setFeedback } from "./feedback.js";
import { updateProgress } from "./progress.js";
import { render } from "./render.js";

export async function getTasks() {
  msg.textContent = "Cargando tareas...";

  try {
    const res = await fetch(TASKS_API, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      taskList.innerHTML = "";
      msg.textContent = "Inicia sesión para ver tus tareas.";
      updateProgress([]);
      setAuthStatus("No autenticado", "error");
      return;
    }

    if (!res.ok) {
      throw new Error(data?.error || "No se pudo obtener /tasks");
    }

    setAuthStatus("Autenticado", "completed");
    render(data, { completeTask, deleteTask });
  } catch (err) {
    msg.textContent = "No se pudieron cargar las tareas.";
    setFeedback(String(err.message || err), "error");
    updateProgress([]);
  }
}

export async function addTask(title) {
  addButton.disabled = true;

  try {
    const res = await fetch(TASKS_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, completed: false })
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error("Sesión expirada. Inicia sesión otra vez.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Error creando tarea");
    }

    taskTitle.value = "";
    setFeedback("Tarea agregada", "completed");
    await getTasks();
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  } finally {
    addButton.disabled = false;
  }
}

export async function deleteTask(id) {
  try {
    const res = await fetch(`${TASKS_API}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error("Sesión expirada. Inicia sesión otra vez.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Error eliminando tarea");
    }

    setFeedback("Tarea eliminada", "completed");
    await getTasks();
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  }
}

export async function completeTask(id, completed) {
  try {
    const res = await fetch(`${TASKS_API}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed })
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error("Sesión expirada. Inicia sesión otra vez.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Error actualizando tarea");
    }

    setFeedback("Estado actualizado", "completed");
    await getTasks();
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  }
}
