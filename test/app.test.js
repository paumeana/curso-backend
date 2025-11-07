// tests/app.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Zjk0OWY1NGFhZDU0N2ZkNzIzZjExOCIsImVtYWlsIjoicGFibG9wYWJsaXRvQGdtYWlsLmNvbSIsInRlc3QiOjEsImlhdCI6MTc2MTE2Nzg2NywiZXhwIjoxNzYxMTcxNDY3fQ.w-kwyvQk9gfwO9_IX8gYR9duc46XzR66NKe09n7nwJE";
let createdTaskId = "68f94a394aad547fd723f11b";

// 🧭 1. Testear /status
describe("🧭 Endpoint /status", () => {
  it("debería responder con 200 (OK) o 503 (DOWN)", async () => {
    const response = await request(app).get("/status");

    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("uptime");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("dbStatus");
  });
});

// 🔐 2. Testear autenticación (register & login)
describe("🔐 Autenticación", () => {
  const email = `test${Date.now()}@mail.com`;
  const password = "123456";

  it("debería registrar un usuario nuevo", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email, password });

    expect([201, 400]).toContain(res.status);
  });

  it("debería loguear al usuario y devolver un token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("debería fallar al loguear con credenciales inválidas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "incorrecto" });

    expect(res.status).toBe(400);
  });
});

// 📝 3. Testear CRUD de Tareas (requiere token)
describe("📝 CRUD de tareas", () => {
  it("debería crear una tarea nueva", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Tarea de prueba" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("text", "Tarea de prueba");

    createdTaskId = res.body.id;
  });

  it("debería listar tareas", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debería actualizar la tarea creada", async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("completed", true);
  });

  it("debería eliminar la tarea creada", async () => {
    const res = await request(app)
      .delete(`/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Task eliminada");
  });
});

// 🚫 4. Testear errores y validaciones
describe("🚫 Casos de error", () => {
  it("debería fallar al crear tarea sin token", async () => {
    const res = await request(app).post("/tasks").send({ text: "Error" });
    expect(res.status).toBe(401);
  });

  it("debería fallar al crear tarea sin texto", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("debería devolver 404 en rutas inexistentes", async () => {
    const res = await request(app).get("/ruta/que/no/existe");
    expect(res.status).toBe(404);
  });
});

// 🧹 Cerrar la conexión a la base de datos al terminar
afterAll(async () => {
  await mongoose.connection.close();
});
