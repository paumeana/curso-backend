import { Router } from "express"
import UserController from "../controllers/authControllers.js"

const authRouter = Router()

authRouter.post("/register", UserController.register);
authRouter.post("/login", UserController.login);

export default authRouter