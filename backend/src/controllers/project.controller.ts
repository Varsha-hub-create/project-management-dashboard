import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../config/database";
import { AuthRequest } from "../types/auth";

const projectSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().optional(),
});

export async function listProjects(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;

  const result = await pool.query(
    `SELECT p.*,
      COUNT(t.id)::int AS task_count,
      COUNT(t.id) FILTER (WHERE t.status = 'completed')::int AS completed_tasks
     FROM projects p
     LEFT JOIN tasks t ON t.project_id = p.id
     WHERE p.user_id = $1
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [user.id]
  );

  return res.json({ success: true, data: result.rows });
}

export async function createProject(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const parsed = projectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid project data",
    });
  }

  const result = await pool.query(
    `INSERT INTO projects (user_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user.id, parsed.data.name, parsed.data.description ?? null]
  );

  return res.status(201).json({
    success: true,
    data: result.rows[0],
  });
}

export async function getProject(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const projectId = Number(req.params.id);

  const project = await pool.query(
    `SELECT * FROM projects WHERE id = $1 AND user_id = $2`,
    [projectId, user.id]
  );

  if (project.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  const tasks = await pool.query(
    `SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );

  return res.json({
    success: true,
    data: {
      ...project.rows[0],
      tasks: tasks.rows,
    },
  });
}

export async function updateProject(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const projectId = Number(req.params.id);
  const parsed = projectSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid project data",
    });
  }

  const current = await pool.query(
    "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
    [projectId, user.id]
  );

  if (current.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  const project = current.rows[0];

  const result = await pool.query(
    `UPDATE projects
     SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [
      parsed.data.name ?? project.name,
      parsed.data.description ?? project.description,
      projectId,
      user.id,
    ]
  );

  return res.json({ success: true, data: result.rows[0] });
}

export async function deleteProject(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const projectId = Number(req.params.id);

  const result = await pool.query(
    "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id",
    [projectId, user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  return res.json({
    success: true,
    message: "Project deleted",
  });
}
