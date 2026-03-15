import { LOGIN_API, LOGOUT_API } from "./config.js";
import { msg, passwordInput, taskList, emailInput } from "./dom.js";
import { setAuthStatus, setFeedback } from "./feedback.js";
import { updateProgress } from "./progress.js";
import { getTasks } from "./tasks.js";

export async function login() {
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

export async function logout() {
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
