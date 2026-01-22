import { Response } from "express";
import { OrgRequest } from "../middleware/orgContextMiddleware";
import { AIService } from "../services/aiService";
import Project from "../models/Project";
import crypto from "crypto";
import Task from "../models/Task";
import { AppError } from "../utils/AppError";


export const generateTaskSuggestions = async (
  req: OrgRequest,
  res: Response
) => {
  try {
    const { projectId, prompt } = req.body;

    if (!projectId || !prompt || !req.organizationId) {
      // return res.status(400).json({ message: "Missing required fields" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Missing required fields" };

      throw new AppError("Missing required fields", 400);
    }

    const project = await Project.findOne({
      _id: projectId,
      organization: req.organizationId
    });

    if (!project) {
      // return res.status(404).json({ message: "Project not found" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Project not found" };

      throw new AppError("Project not found", 400);

    }

    const suggestions = await AIService.generateTaskSuggestions(
      project.name,
      prompt
    );

    res.json({ projectId, suggestions });
  } catch (error: any) {
    // console.error("AI ERROR 👉", error?.response?.data || error.message);

    // res.status(500).json({
    //     message: "AI generation failed",
    //     error: error?.response?.data || error.message
    // });
    // throw {
    //   statusCode: 500,
    //   message: "AI generation failed",
    //   details: error?.response?.data || error.message
    // };

    throw new AppError("AI generation failed", 500);
  }
};

export const saveAiTasks = async (req: OrgRequest, res: Response) => {
  try {
    const { projectId, tasks } = req.body;

    if (!projectId || !Array.isArray(tasks)) {
      // return res.status(400).json({ message: "Invalid input" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Invalid input" };

      throw new AppError("Invalid input", 500);


    }

    const savedTasks = [];
    const existingTasks = [];

    for (const task of tasks) {
      const normalizedTitle = task.title.trim().toLowerCase();

      const fingerprint = crypto
        .createHash("sha256")
        .update(normalizedTitle + projectId + req.organizationId)
        .digest("hex");

      const exists = await Task.findOne({
        $or: [
          { fingerprint },
          {
            title: normalizedTitle,
            project: projectId,
            organization: req.organizationId
          }
        ]
      });

      if (exists) {
        existingTasks.push(exists);
        continue;
      }

      const newTask = await Task.create({
        title: normalizedTitle,
        project: projectId,
        organization: req.organizationId,
        createdBy: req.userId,
        fingerprint
      });

      savedTasks.push(newTask);
    }

    // 🔑 UX-aware response
    if (savedTasks.length === 0 && existingTasks.length > 0) {
      return res.json({
        message: "All suggested tasks already exist in this project",
        count: 0,
        existingTasks
      });
    }

    return res.json({
      message: "AI tasks saved successfully",
      count: savedTasks.length,
      tasks: savedTasks
    });
  } catch (error) {
    // console.error("SAVE AI TASK ERROR 👉", error);
    // throw {
    //   statusCode: 500,
    //   message: "AI generation failed",
    //   details: error
    // };


    throw new AppError("AI generation failed", 500);


  }
};

