const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// General fetch wrapper
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Request failed");
    }

    return res.json();
  } catch (err) {
    console.error(`Request error (${endpoint}):`, err.message);
    throw err;
  }
}

// Auth Endpoints
export const signup = (data) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify(data) });

export const signin = (data) =>
  request("/auth/signin", { method: "POST", body: JSON.stringify(data) });

// User Endpoints
export const getCurrentUser = (token) => {
  if (!token) return Promise.resolve(null);
  return request("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
};

// Recipes Endpoints
export const getRecipes = (token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return request("/recipes", { headers });
};

export const searchRecipes = (token, query) => {
  if (!query) return Promise.resolve([]);
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return request(`/recipes?q=${encodeURIComponent(query)}`, { headers });
};

export const getRecipeById = (id, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return request(`/recipes/${id}`, { headers });
};

export const createRecipe = (data, token) =>
  request("/recipes", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const updateRecipe = (id, data, token) =>
  request(`/recipes/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const deleteRecipe = (id, token) =>
  request(`/recipes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
