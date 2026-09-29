const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Request failed");
  }

  return result.data;
}
