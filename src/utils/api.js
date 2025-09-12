const API_URL = "http://localhost:3000/api"; // your backend base URL

function request(endpoint, options = {}) {
  return fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((errorText) => {
        throw new Error(errorText || "Request failed");
      });
    }
    return res.json();
  });
}

export const signup = (email, password) => {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const signin = (email, password) => {
  return request("/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = (token) => {
  return request("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export function fetchData(endpoint) {
  return Promise.resolve({ data: `Fetched from ${endpoint}` });
}

export function searchRecipes(query) {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
  return fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&apiKey=${API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    })
    .then((data) => data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });
}
