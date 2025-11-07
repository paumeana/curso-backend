import { Router } from "express"
import TasksControllers from "../controllers/tasksControllers.js";

const taskRouter = Router()

taskRouter.get("/", TasksControllers.getAllTasks);
taskRouter.post("/", TasksControllers.addTask);
taskRouter.put("/:id", TasksControllers.updateTask)
taskRouter.delete("/:id", TasksControllers.deleteTask);

export default taskRouter