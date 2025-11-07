# Documentación del Proyecto: Backend Prompt

## 📘 Descripción General

**Backend Prompt** es un servidor **Node.js con Express y MongoDB** que proporciona una API RESTful para manejar autenticación de usuarios y gestión de tareas.  
El proyecto está pensado para integrarse con un frontend (por ejemplo, React) y se despliega en **Render.com**, mientras que la base de datos se aloja en **MongoDB Atlas**.

Su propósito principal es servir como entorno backend en un curso de *Prompt Engineering para desarrolladores FrontEnd*, mostrando cómo la IA puede optimizar procesos en un flujo de desarrollo fullstack.

---

## 🧱 Estructura del Proyecto

```
backend-prompt/
│
├── src/
│   ├── config/
│   │   └── mongodb.js               # Conexión con MongoDB
│   ├── controllers/
│   │   ├── authControllers.js       # Lógica de autenticación y registro
│   │   └── tasksControllers.js      # Lógica CRUD de tareas
│   ├── middlewares/
│   │   └── authMiddleware.js        # Verificación de tokens JWT
│   ├── mock/
│   │   └── tasks.json               # Datos de ejemplo
│   ├── models/
│   │   ├── TasksModel.js            # Modelo Mongoose para tareas
│   │   └── UsersModel.js            # Modelo Mongoose para usuarios
│   ├── routes/
│   │   ├── authRoutes.js            # Rutas de login y registro
│   │   └── tasksRoutes.js           # Rutas protegidas para tareas
│
├── test/
│   ├── app.test.js                  # Pruebas del servidor Express
│   └── demo.test.js                 # Ejemplos de test
│
├── package.json                     # Dependencias y scripts
└── README.md                        # Documentación
```

---

## ⚙️ Tecnologías Utilizadas

- **Node.js** – entorno de ejecución JavaScript del servidor.
- **Express.js** – framework para crear la API.
- **Mongoose** – ODM para modelar la base de datos MongoDB.
- **JWT (jsonwebtoken)** – autenticación mediante tokens.
- **Bcrypt.js** – cifrado de contraseñas.
- **Cors** – permite la conexión entre dominios (frontend-backend).
- **Morgan** – logger HTTP.
- **Jest / Supertest** – framework de testing.

---

## 🔌 Configuración de la Base de Datos

El archivo `src/config/mongodb.js` maneja la conexión con **MongoDB Atlas** o una instancia local.  
Ejemplo de configuración típica:

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 👥 Autenticación

Los controladores en `authControllers.js` implementan las rutas `/register` y `/login`:

- **POST /register:** crea un nuevo usuario, encripta la contraseña con *bcrypt* y guarda el registro.
- **POST /login:** valida credenciales y devuelve un *token JWT*.

El middleware `authMiddleware.js` se usa para proteger rutas, verificando el token incluido en el header Authorization.

```js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
```

---

## 🗂️ Rutas Principales

| Método | Ruta | Descripción |
|--------|------|--------------|
| **POST** | `/api/auth/register` | Registrar usuario |
| **POST** | `/api/auth/login` | Iniciar sesión y obtener token |
| **GET** | `/api/tasks` | Obtener todas las tareas (protegida) |
| **POST** | `/api/tasks` | Crear una nueva tarea (protegida) |
| **PUT** | `/api/tasks/:id` | Editar una tarea |
| **DELETE** | `/api/tasks/:id` | Eliminar una tarea |

---

## 🧪 Testing

El proyecto cuenta con pruebas configuradas con **Jest** y **Supertest** en la carpeta `test/`.  
Estas verifican la correcta respuesta de los endpoints y la autenticación.

Ejemplo:

```js
import request from "supertest";
import app from "../src/app";

describe("Pruebas de autenticación", () => {
  it("debería registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "123456" });
    expect(res.statusCode).toBe(201);
  });
});
```

---

## 🚀 Scripts Disponibles

| Comando | Descripción |
|----------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Ejecuta con nodemon en modo desarrollo |
| `npm test` | Ejecuta las pruebas con Jest |

---

## 🌍 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes claves:

```
PORT=4000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/backend
JWT_SECRET=clave_secreta
NODE_ENV=development
```

---

## 🧠 Conclusión

El proyecto **Backend Prompt** representa un entorno backend educativo para prácticas de desarrollo fullstack moderno, integrando herramientas de IA en el flujo de trabajo mediante prompts bien diseñados.  
Su arquitectura modular y estructura MVC permiten escalar el proyecto fácilmente hacia entornos productivos o de aprendizaje avanzado.

