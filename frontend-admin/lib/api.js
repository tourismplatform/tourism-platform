const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import { Cookies } from "./cookies";

function authHeaders() {
  const token = typeof window !== "undefined"
    ? Cookies.get("token")
    : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body = null) {
  const options = { method, headers: authHeaders() };
  if (body) options.body = JSON.stringify(body);
  const res  = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur serveur");
  return data;
}

export const authAPI = {
  login:    (b) => request("POST", "/auth/login", b),
  register: (b) => request("POST", "/auth/register", b),
  me:       ()  => request("GET",  "/auth/me"),
};

export const adminAPI = {
  getStats: () => request("GET", "/admin/stats"),
  getUsers: () => request("GET", "/admin/users"),
};

export const destinationsAPI = {
  getAll:  ()      => request("GET",    "/destinations"),
  getOne:  (id)    => request("GET",    `/destinations/${id}`),
  create:  (b)     => request("POST",   "/admin/destinations", b),
  update:  (id, b) => request("PUT",    `/admin/destinations/${id}`, b),
  delete:  (id)    => request("DELETE", `/admin/destinations/${id}`),
};

export const bookingsAPI = {
  getAll:       ()      => request("GET",  "/admin/bookings"),
  getMine:      ()      => request("GET",  "/bookings/my"),
  create:       (b)     => request("POST", "/bookings", b),
  updateStatus: (id, b) => request("PUT",  `/admin/bookings/${id}`, b),
};

export const reviewsAPI = {
  getAll:    ()      => request("GET",    "/admin/reviews"),
  getByDest: (id)    => request("GET",    `/reviews/${id}`),
  create:    (b)     => request("POST",   "/reviews", b),
  delete:    (id)    => request("DELETE", `/admin/reviews/${id}`),
};


export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const token = Cookies.get("token");
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload échoué");
  return data.url;
}