import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import passwordRoutes from "./routes/password.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);   
app.use("/login", authRoutes);
app.use("/password", passwordRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening http://localhost:${PORT}`);
});

export default app;
