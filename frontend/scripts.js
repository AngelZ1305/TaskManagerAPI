import { setAuthStatus } from "./src/feedback.js";
import { bindEvents } from "./src/events.js";
import { getTasks } from "./src/tasks.js";

bindEvents();
setAuthStatus("No autenticado", "error");
getTasks();
