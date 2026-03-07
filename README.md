Task Manager

Aplicación web sencilla para la gestión de tareas. Permite crear, visualizar, completar y eliminar tareas mediante una Web API desarrollada con Node.js y Express, consumida por un frontend en JavaScript vanilla.

El proyecto está desplegado en Render y conectado a GitHub, por lo que cualquier cambio enviado al repositorio se despliega automáticamente.

Demo
Frontend

- https://taskmanagerapi-front.onrender.com/

Backend API

- https://taskmanagerapi-sxsn.onrender.com/tasks

Tecnologías utilizadas
Backend

- Node.js

- Express

- CORS

- Frontend

- HTML

- CSS

- JavaScript (Vanilla)

Infraestructura

- Render (hosting)

- GitHub (control de versiones y despliegue automático)

Arquitectura del proyecto

El proyecto está dividido en dos aplicaciones independientes:

Frontend (Static Web Page)
        ↓ consume
Backend API (Node.js / Express)

El frontend realiza peticiones HTTP a la API para manipular las tareas.

El backend mantiene las tareas en memoria, por lo que los datos se reinician cuando el servidor se reinicia.

API Endpoints
- Base URL
https://taskmanagerapi-sxsn.onrender.com/tasks
Obtener todas las tareas
GET /tasks
Ejemplo de respuesta
[
  {
    "id": 1,
    "title": "Estudiar Web APIs",
    "completed": false
  }
]
- Crear una nueva tarea
POST /tasks
Body
{
  "title": "Nueva tarea",
  "completed": false
}
- Actualizar estado de una tarea
PUT /tasks/:id

Permite cambiar el estado de completado de una tarea.

Ejemplo
{
  "completed": true
}
- Eliminar una tarea
DELETE /tasks/:id

Elimina la tarea correspondiente al id.

Características

- Crear tareas

- Marcar tareas como completadas

- Eliminar tareas

- Feedback visual para el usuario

- Mensaje cuando no hay tareas

- Conteo de tareas completadas y pendientes

Despliegue

El proyecto está desplegado en Render utilizando integración directa con GitHub.

Cada vez que se realiza:

git push

Render detecta el cambio y actualiza automáticamente la aplicación en producción.

Imágenes del proyecto
Windows
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/e68458f0-780b-4553-a25d-afb9ed141c05" /> <br>
Móvil
<br><img width="346" height="623" alt="image" src="https://github.com/user-attachments/assets/30cc8191-cd3d-4d45-8a9a-f3ddfb774137" />
