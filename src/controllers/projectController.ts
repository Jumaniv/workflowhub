// import { Response } from "express";
// import { AuthRequest } from "../middleware/authMiddleware";
// import Project from "../models/Project";

// export const createProject = async (req: AuthRequest, res: Response) => {
//   try {
//     const { name, organizationId } = req.body;

//     if (!name || !organizationId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const project = await Project.create({
//       name,
//       organization: organizationId,
//       createdBy: req.userId
//     });

//     res.status(201).json(project);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create project" });
//   }
// };

import { Response } from "express";
import { OrgRequest } from "../middleware/orgContextMiddleware";
import Project from "../models/Project";

export const createProject = async (req: OrgRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || !req.organizationId || !req.userId) {
            // return res.status(400).json({ message: "Missing required data" });
            
        // Using error throwing to be caught by global error handler
        throw { statusCode: 400, message: "Missing required data" };
        }

        const project = await Project.create({
            name,
            organization: req.organizationId,
            createdBy: req.userId
        });

        res.status(201).json(project);
    } catch {
        // res.status(500).json({ message: "Failed to create project" });

        
        // Using error throwing to be caught by global error handler
        throw { statusCode: 500, message: "Failed to create project" };
    }
};
export const getProjects = async (req: OrgRequest, res: Response) => {
    try {
        if (!req.organizationId) {
            // return res.status(400).json({ message: "Organization context missing" });
            
        // Using error throwing to be caught by global error handler
        throw { statusCode: 400, message: "Organization context missing" };
        }

        const projects = await Project.find({
            organization: req.organizationId
        }).sort({ createdAt: -1 });

        res.json(projects);
    } catch {
        // res.status(500).json({ message: "Failed to fetch projects" });


        // Using error throwing to be caught by global error handler
        throw { statusCode: 500, message: "Failed to fetch projects" };

    }
};
