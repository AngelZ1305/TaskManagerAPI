const API_ORIGIN = "http://localhost:3000";
const TASKS_API = `${API_ORIGIN}/tasks`;
const LOGIN_API = `${API_ORIGIN}/login`;
const LOGOUT_API = `${API_ORIGIN}/logout`;

const taskTitle = document.getElementById("taskTitle");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const msg = document.getElementById("msg");
const errorMsg = document.getElementById("errorMsg");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const authStatus = document.getElementById("authStatus");

function setFeedback(text, type) {
  errorMsg.className = type ? (type === "error" ? "error" : "completed") : "";
  errorMsg.textContent = text || "";

  if (text) {
    setTimeout(() => {
      errorMsg.textContent = "";
      errorMsg.className = "";
    }, 2500);
  }
}

function setAuthStatus(text, type) {
  authStatus.className = type ? (type === "error" ? "error" : "completed") : "";
  authStatus.textContent = text || "";
}

function render(tasks) {
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
      await completeTask(task.id, checkbox.checked);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Eliminar";

    deleteButton.addEventListener("click", async () => {
      await deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(left);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }
}

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    return setFeedback("Ingresa correo y contraseña", "error");
  }

  try {
    const res = await fetch(LOGIN_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Error en login");
    }

    setAuthStatus(`Sesión iniciada: ${data.user.email}`, "completed");
    setFeedback("Login correcto", "completed");
    passwordInput.value = "";

    await getTasks();
  } catch (err) {
    setAuthStatus("No autenticado", "error");
    setFeedback(String(err.message || err), "error");
  }
}

async function logout() {
  try {
    const res = await fetch(LOGOUT_API, {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Error al cerrar sesión");
    }

    taskList.innerHTML = "";
    msg.textContent = "Sesión cerrada";
    updateProgress([]);
    setAuthStatus("No autenticado", "error");
    setFeedback("Logout correcto", "completed");
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  }
}

async function getTasks() {
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
    render(data);
  } catch (err) {
    msg.textContent = "No se pudieron cargar las tareas.";
    setFeedback(String(err.message || err), "error");
    updateProgress([]);
  }
}

async function addTask(title) {
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

async function deleteTask(id) {
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

async function completeTask(id, completed) {
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

function updateProgress(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").textContent = percent + "%";
}

addButton.addEventListener("click", () => {
  const title = taskTitle.value.trim();

  if (!title) {
    return setFeedback("Escribe un título primero.", "error");
  }

  if (title.length > 50) {
    return setFeedback("El título no puede tener más de 50 caracteres.", "error");
  }

  addTask(title);
});

taskTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addButton.click();
});

loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);

setAuthStatus("No autenticado", "error");
getTasks();
