import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send("Token requerido");

    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, JWT_SECRET)
    console.log(decode)
    req.user = decode;
    next();
  } catch (error) {
    console.log(error)
    res.status(403).send("Token inválido o expirado");
  }
};

export default authMiddleware