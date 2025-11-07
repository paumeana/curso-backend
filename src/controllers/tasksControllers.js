import Task from "../models/TasksModel.js";

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).send("Error al obtener tareas");
  }
}

const addTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send("Datos inválidos");

    const newTask = new Task({ text });
    console.log(newTask)
    await newTask.save();

    res.status(201).json(newTask);
  } catch {
    res.status(400).send("Datos inválidos");
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedTask) return res.status(404).send("Task no encontrada");
    res.status(200).json(updatedTask);
  } catch {
    res.status(400).send("Datos inválidos");
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) return res.status(404).send("Task no encontrada");
    res.status(200).json({ message: "Task eliminada" });
  } catch {
    res.status(500).send("Error al eliminar la task");
  }
}

export default { getAllTasks, addTask, updateTask, deleteTask }