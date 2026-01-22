import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import orgRoutes from "./routes/orgRoutes";
import taskRoutes from "./routes/taskRoutes";
import aiRoutes from "./routes/aiRoutes";
import { errorHandler } from "./middleware/errorHandler";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/health", (_req, res) => {
  res.send("API healthy");
});

app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);




app.use(errorHandler);

export default app;
