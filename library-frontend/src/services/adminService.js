import api from "./api";

export async function fetchUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function updateUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
}

export async function deleteUser(id) {
  await api.delete(`/admin/users/${id}`);
}

export async function fetchSystemConfig() {
  const { data } = await api.get("/admin/config");
  return data;
}

export async function updateSystemConfig(config) {
  const { data } = await api.put("/admin/config", config);
  return data;
}
