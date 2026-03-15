let tasks = [
  { id: 1, title: "Estudiar Web APIs", completed: false }
];

let nextId = 2;

function getTasks() {
  return tasks;
}

function createTask(title, completed) {
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed
  };

  tasks.push(newTask);
  return newTask;
}

function deleteTaskById(id) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  return tasks.splice(index, 1)[0];
}

function findTaskById(id) {
  return tasks.find((task) => task.id === id);
}

module.exports = {
  getTasks,
  createTask,
  deleteTaskById,
  findTaskById
};
