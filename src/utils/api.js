const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// General fetch wrapper
function request(endpoint, options = {}) {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const fullEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(`${API_URL}${fullEndpoint}`, { ...options, headers })
    .then(function (res) {
      return res.text().then(function (text) {
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text || "Invalid server response" };
        }

        if (!res.ok) {
          const error = new Error(
            data?.validation?.body?.message || data?.message || "Request failed"
          );
          error.status = res.status;
          error.data = data;
          throw error;
        }

        return data;
      });
    })
    .catch(function (err) {
      console.error(
        "Request error (" + endpoint + "):",
        err.data || err.message
      );
      throw err;
    });
}

// AUTH ENDPOINTS
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
  }).then(function (res) {
    const token = res.token || res.accessToken || res.jwt || res.authToken;
    if (token) {
      localStorage.setItem("authToken", token);
      console.log("Auth token saved:", token);
    } else {
      console.warn("No token found in signin response:", res);
    }
    return res;
  });
}

// USER ENDPOINTS
export function getCurrentUser() {
  return request("/users/me").catch(function () {
    return null;
  });
}

export function updateProfile(data) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");

  return fetch(API_URL + "/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  })
    .then(function (res) {
      return res.text().then(function (text) {
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
      });
    })
    .catch(function (err) {
      console.error("updateProfile error:", err.message);
      throw err;
    });
}

// RECIPE ENDPOINTS
export function getRecipes() {
  const token = localStorage.getItem("authToken");
  console.log("Token used in getRecipes:", token);
  return request("/recipes/saved", {
    headers: token ? { Authorization: "Bearer " + token } : {},
  });
}

export function searchRecipes(query) {
  if (!query) return Promise.resolve([]);
  return request("/recipes?q=" + encodeURIComponent(query));
}

export function getRecipeById(id) {
  return request("/recipes/" + id);
}

export function createRecipe(data) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return Promise.reject(new Error("No auth token found. Please log in."));
  }

  return request("/recipes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function updateRecipe(id, data) {
  return request("/recipes/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRecipe(id) {
  return request("/recipes/" + id, { method: "DELETE" });
}

// SPOONACULAR RECIPES (max 30)
export function getSpoonacularRecipes(count) {
  const maxCount = 30;
  const number = Math.min(count || 12, maxCount);

  return fetch(
    "https://api.spoonacular.com/recipes/random?number=" +
      number +
      "&apiKey=" +
      import.meta.env.VITE_SPOON_API_KEY
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      return data.recipes || data.results || [];
    })
    .catch(function (err) {
      console.error("Spoonacular API Error:", err.message);
      return [];
    });
}
