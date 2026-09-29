import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../config/database";
import { AuthRequest } from "../types/auth";

const taskSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  due_date: z.string().optional(),
});

export async function listTasks(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const projectId = Number(req.params.projectId);

  const access = await pool.query(
    "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
    [projectId, user.id]
  );

  if (access.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  const result = await pool.query(
    `SELECT * FROM tasks
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  return res.json({ success: true, data: result.rows });
}

export async function createTask(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const projectId = Number(req.params.projectId);
  const parsed = taskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data",
    });
  }

  const access = await pool.query(
    "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
    [projectId, user.id]
  );

  if (access.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }

  const result = await pool.query(
    `INSERT INTO tasks
      (project_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      projectId,
      parsed.data.title,
      parsed.data.description ?? null,
      parsed.data.status ?? "todo",
      parsed.data.priority ?? "medium",
      parsed.data.due_date ?? null,
    ]
  );

  return res.status(201).json({
    success: true,
    data: result.rows[0],
  });
}

export async function updateTask(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const taskId = Number(req.params.id);
  const parsed = taskSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data",
    });
  }

  const current = await pool.query(
    `SELECT t.* FROM tasks t
     JOIN projects p ON p.id = t.project_id
     WHERE t.id = $1 AND p.user_id = $2`,
    [taskId, user.id]
  );

  if (current.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const task = current.rows[0];

  const result = await pool.query(
    `UPDATE tasks
     SET title = $1,
         description = $2,
         status = $3,
         priority = $4,
         due_date = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [
      parsed.data.title ?? task.title,
      parsed.data.description ?? task.description,
      parsed.data.status ?? task.status,
      parsed.data.priority ?? task.priority,
      parsed.data.due_date ?? task.due_date,
      taskId,
    ]
  );

  return res.json({ success: true, data: result.rows[0] });
}

export async function deleteTask(req: Request, res: Response) {
  const user = (req as AuthRequest).user!;
  const taskId = Number(req.params.id);

  const result = await pool.query(
    `DELETE FROM tasks t
     USING projects p
     WHERE t.id = $1
       AND t.project_id = p.id
       AND p.user_id = $2
     RETURNING t.id`,
    [taskId, user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.json({
    success: true,
    message: "Task deleted",
  });
}
