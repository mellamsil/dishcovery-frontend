const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // backend base URL

// General fetch wrapper
function request(endpoint, options = {}) {
  return fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((errorText) => {
          throw new Error(errorText || "Request failed");
        });
      }
      return res.json();
    })
    .catch((err) => {
      console.error(`Request error (${endpoint}):`, err.message);
      throw err;
    });
}

// Auth Endpoints
export const signup = (email, password) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signin = (email, password) => {
  return request("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// User Ednpoints
export const getCurrentUser = (token) => {
  if (!token) return Promise.resolve(null);

  return request("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  }).catch((err) => {
    console.error("Failed to fetch current user:", err.message);
    return null;
  });
};

// --- Placeholder fetchData ---
export function fetchData(endpoint) {
  return Promise.resolve({ data: `Fetched from ${endpoint}` });
}
