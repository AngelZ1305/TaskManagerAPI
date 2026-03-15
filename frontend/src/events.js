import { addButton, taskTitle, loginButton, logoutButton } from "./dom.js";
import { setFeedback } from "./feedback.js";
import { login, logout } from "./auth.js";
import { addTask } from "./tasks.js";

export function bindEvents() {
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
}
