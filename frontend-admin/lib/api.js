const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
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

export const usersAPI = {
  updateMe:   (id, b) => request("PUT",    `/users/${id}`, b),
  getAll:     ()      => request("GET",    "/users"),
  deleteUser: (id)    => request("DELETE", `/users/${id}`),
};

export const destinationsAPI = {
  getAll:  ()      => request("GET",    "/destinations"),
  getOne:  (id)    => request("GET",    `/destinations/${id}`),
  create:  (b)     => request("POST",   "/destinations", b),
  update:  (id, b) => request("PUT",    `/destinations/${id}`, b),
  delete:  (id)    => request("DELETE", `/destinations/${id}`),
};

export const bookingsAPI = {
  getAll:       ()      => request("GET",  "/bookings"),
  getMine:      ()      => request("GET",  "/bookings/me"),
  create:       (b)     => request("POST", "/bookings", b),
  updateStatus: (id, b) => request("PUT",  `/bookings/${id}`, b),
};

export const reviewsAPI = {
  getAll:    ()      => request("GET",    "/reviews"),
  getByDest: (id)    => request("GET",    `/reviews/destination/${id}`),
  create:    (b)     => request("POST",   "/reviews", b),
  delete:    (id)    => request("DELETE", `/reviews/${id}`),
};

export const adminAPI = {
  getStats: () => request("GET", "/admin/stats"),
};

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload échoué");
  return data.url;
}