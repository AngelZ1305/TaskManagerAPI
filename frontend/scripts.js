const API_BASE = "https://taskmanagerapi-sxsn.onrender.com/tasks";

const taskTitle = document.getElementById("taskTitle");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const msg = document.getElementById("msg");
const errorMsg = document.getElementById("errorMsg");

function setFeedback(text, type) {
    errorMsg.className = type ? (type === "error" ? "error" : "completed") : "";
    errorMsg.textContent = text || "";
    if (text) setTimeout(() => { errorMsg.textContent = ""; errorMsg.className = ""; }, 2500);
}

function render(tasks) {
    taskList.innerHTML = ""
    
    updateProgress(tasks || []);
;

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
        title.textContent = `${task.title}`;

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

async function getTasks() {
    msg.textContent = "Cargando tareas...";
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("No se pudo obtener /tasks");
        const tasks = await res.json();
        render(tasks);
        updateProgress(tasks);
    } catch (err) {
        msg.textContent = "No se pudieron cargar las tareas.";
        setFeedback(String(err.message || err), "error");
        updateProgress([]);
    }
}

async function addTask(title) {
    addButton.disabled = true;
    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, completed: false })
        });

        const data = await res.json().catch(() => ({}));
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
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Error eliminando tarea");
        setFeedback("Tarea eliminada", "completed");
        await getTasks();
    } catch (err) {
        setFeedback(String(err.message || err), "error");
    }
}

async function completeTask(id, completed) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Error actualizando tarea");

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
    if (!title) return setFeedback("Escribe un título primero.", "error");
    if (title.length > 50) return setFeedback("El título no puede tener más de 50 caracteres.", "error");
    addTask(title);
});

taskTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addButton.click();
});

getTasks();