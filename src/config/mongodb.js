import mongoose from "mongoose"

const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri)
    console.log("😋 Conectado a Mongodb")
  } catch (error) {
    console.log("❌ Error al conectarse a la base de datos")
    process.exit(1)
  }
}

export default connectDb