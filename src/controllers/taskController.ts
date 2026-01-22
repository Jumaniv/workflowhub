import { Response } from "express";
import { OrgRequest } from "../middleware/orgContextMiddleware";
import { createTaskSchema } from "../validators/taskValidators";
import { paginationSchema } from "../validators/paginationValidator";
import { AppError } from "../utils/AppError";

import Task from "../models/Task";

export const createTask = async (req: OrgRequest, res: Response) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Invalid request data", 400);

      // {
      //   statusCode: 400,
      //   message: "Invalid request data",
      //   details: parsed.error
      // };
    }

    const parsed1 = paginationSchema.safeParse(req.query);

    if (!parsed1.success) {
      throw new AppError("Invalid request data", 400);
      // throw {
      //   statusCode: 400,
      //   message: "Invalid request data",
      //   details: parsed.error
      // };
    }

    const { title, description, projectId, assignedTo } = parsed.data;

    if (!title || !projectId || !req.organizationId || !req.userId) {
      // return res.status(400).json({ message: "Missing required fields" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Missing required fields" };

      throw new AppError("Missing required fields", 400);

    }
    const normalizedTitle = title.trim().toLowerCase();

    const existingTask = await Task.findOne({
      title: normalizedTitle,
      project: projectId,
      organization: req.organizationId
    });

    if (existingTask) {
      // return res.status(409).json({
      //   message: "Task already exists in this project"
      // });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 409, message: "Task already exists in this project" };
      throw new AppError("Task already exists in this project", 409);

    }
    const task = await Task.create({
      title: normalizedTitle,
      description,
      project: projectId,
      organization: req.organizationId,
      createdBy: req.userId,
      assignedTo
    });

    res.status(201).json(task);
  } catch {
    // res.status(500).json({ message: "Failed to create task" });

    // Using error throwing to be caught by global error handler
    // throw { statusCode: 500, message: "Failed to create task" };
    throw new AppError("Failed to create task", 500);

  }
};

export const getTasksByProject = async (
  req: OrgRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !req.organizationId) {
      // return res.status(400).json({ message: "Missing parameters" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Missing parameters" };

      throw new AppError("Missing parameters", 400);

    }

    const tasks = await Task.find({
      project: projectId,
      organization: req.organizationId
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch {
    // res.status(500).json({ message: "Failed to fetch tasks" });

    // Using error throwing to be caught by global error handler
    // throw { statusCode: 500, message: "Failed to fetch tasks" };

    throw new AppError("Failed to fetch tasks", 500);
  }
};
export const updateTask = async (req: OrgRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status, assignedTo } = req.body;

    if (!taskId) {
      // return res.status(400).json({ message: "Task ID is required" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Task ID is required" };

      throw new AppError("Task ID is required", 400);
    }

    const updateData: any = {};

    if (status) {
      if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
        // return res.status(400).json({ message: "Invalid status value" });

        // Using error throwing to be caught by global error handler
        // throw { statusCode: 400, message: "Invalid status value" };

        throw new AppError("Invalid status value", 400);
      }
      updateData.status = status;
    }

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        organization: req.organizationId
      },
      updateData,
      { new: true }
    );

    if (!task) {
      // return res.status(404).json({ message: "Task not found" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 404, message: "Task not found" };

      throw new AppError("Task not found", 404);

    }

    res.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    // console.error("UPDATE TASK ERROR 👉", error);
    // res.status(500).json({ message: "Failed to update task" });

    // Using error throwing to be caught by global error handler
    // throw { statusCode: 500, message: "Failed to update task" };

    throw new AppError("Failed to update task", 500);
  }
};
export const getTasksWithFilters = async (req: OrgRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    console.log("QUERY PARAMS 👉", req.params);
    const { page = "1", limit = "10", status, assignedTo } = req.query;

    if (!projectId || !req.organizationId) {
      // return res.status(400).json({ message: "Missing parameters" });

      // Using error throwing to be caught by global error handler
      // throw { statusCode: 400, message: "Missing parameters" };

      throw new AppError("Missing parameters", 400);
    }

    const query: any = {
      project: projectId,
      organization: req.organizationId
    };

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query)
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      tasks
    });
  } catch (error) {
    // console.error("GET TASKS ERROR 👉", error);
    // res.status(500).json({ message: "Failed to fetch tasks" });


    // Using error throwing to be caught by global error handler
    // throw { statusCode: 500, message: "Failed to fetch tasks" };

    throw new AppError("Failed to fetch tasks", 500);


  }
};
