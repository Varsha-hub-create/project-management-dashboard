import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Project } from "../types";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    try {
      const data = await api<Project[]>("/projects");
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createProject() {
    if (!name.trim()) return;

    await api<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    load();
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  useEffect(() => {
    load();
  }, []);

  const totalTasks = projects.reduce(
    (sum, project) => sum + Number(project.task_count ?? 0),
    0
  );

  const completedTasks = projects.reduce(
    (sum, project) => sum + Number(project.completed_tasks ?? 0),
    0
  );

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <h1>Project Dashboard</h1>
          <p>Manage projects and track your work.</p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="stats">
        <div><strong>{projects.length}</strong><span>Projects</span></div>
        <div><strong>{totalTasks}</strong><span>Total Tasks</span></div>
        <div><strong>{completedTasks}</strong><span>Completed</span></div>
      </section>

      <section className="create-box">
        <h2>Create Project</h2>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createProject}>Create Project</button>
      </section>

      <section>
        <h2>Projects</h2>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.description || "No description"}</p>
              <div className="project-meta">
                <span>{project.task_count ?? 0} tasks</span>
                <span>{project.completed_tasks ?? 0} completed</span>
              </div>
            </article>
          ))}

          {projects.length === 0 && (
            <p>No projects yet. Create your first project above.</p>
          )}
        </div>
      </section>
    </main>
  );
}
