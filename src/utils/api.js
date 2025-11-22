const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

if (!SPOONACULAR_KEY) {
  console.warn("Spoonacular API key is missing in .env!");
}

// General fetch wrapper
function request(endpoint, options = {}) {
  const token = localStorage.getItem("authToken");
  const fullEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(`${API_URL}${fullEndpoint}`, { ...options, headers })
    .then(async (res) => {
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text || "Invalid server response" };
      }

      if (!res.ok) {
        const error = new Error(
          data?.validation?.body?.message || data?.message || "Request failed",
        );
        error.status = res.status;
        error.data = data;
        throw error;
      }
      return data;
    })
    .catch((err) => {
      console.error(`Request error (${endpoint}):`, err.data || err.message);
      throw err;
    });
}

// Auth Endpoints
export function signup(data) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signin(data) {
  return request("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => {
    const token = res.token || res.accessToken || res.jwt || res.authToken;
    if (token) localStorage.setItem("authToken", token);
    return res;
  });
}

// User Endpoints
export function getCurrentUser() {
  return request("/users/me").catch(() => null);
}

export function updateProfile(data) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");

  return fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const text = await res.text();
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = { message: text || "Invalid server response" };
      }

      if (!res.ok) {
        const error = new Error(result.message || "Failed to update profile");
        error.status = res.status;
        throw error;
      }
      return result;
    })
    .catch((err) => {
      console.error("updateProfile error:", err.message);
      throw err;
    });
}

// Recipe Endpoints
export function getRecipes() {
  const token = localStorage.getItem("authToken");
  return request("/recipes/saved", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function searchRecipes(query) {
  if (!query) return Promise.resolve([]);
  return request(`/recipes?q=${encodeURIComponent(query)}`);
}

export function getRecipeById(id) {
  return request(`/recipes/${id}`);
}

export function createRecipe(data) {
  const token = localStorage.getItem("authToken");
  if (!token)
    return Promise.reject(new Error("No auth token found. Please log in."));
  return request("/recipes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export function updateRecipe(id, data) {
  return request(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRecipe(id) {
  return request(`/recipes/${id}`, { method: "DELETE" });
}

// Spoonacular API
function spoonacularFetch(url) {
  if (!SPOONACULAR_KEY) {
    console.warn("⚠️ Spoonacular API key missing!");
    return Promise.resolve([]);
  }
  const fullUrl = url.includes("?")
    ? `${url}&apiKey=${SPOONACULAR_KEY}`
    : `${url}?apiKey=${SPOONACULAR_KEY}`;
  return fetch(fullUrl)
    .then((res) => res.json())
    .then((data) => data.recipes || data.results || [])
    .catch((err) => {
      console.error("Spoonacular API error:", err.message);
      return [];
    });
}

export function getSpoonacularRecipes(count = 12) {
  const number = Math.min(count, 30);
  return spoonacularFetch(
    `https://api.spoonacular.com/recipes/random?number=${number}`,
  );
}

export function searchSpoonacularRecipes(query, number = 10) {
  if (!query) return Promise.resolve([]);
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query,
  )}&number=${number}&addRecipeInformation=true`;
  return spoonacularFetch(url);
}
