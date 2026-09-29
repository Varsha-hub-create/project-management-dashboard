export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  task_count?: number;
  completed_tasks?: number;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
