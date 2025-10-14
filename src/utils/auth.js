import {
  signup as apiSignup,
  signin as apiSignin,
  getCurrentUser as apiGetCurrentUser,
} from "./api";

// Signup
export const signup = (data) => {
  return apiSignup(data).then((res) => {
    if (res.token) localStorage.setItem("token", res.token);
    return res;
  });
};

// Signin
export const signin = (data) => {
  return apiSignin(data).then((res) => {
    if (res.token) localStorage.setItem("token", res.token);
    return res;
  });
};

// Get current user
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return Promise.resolve(null);

  return apiGetCurrentUser(token)
    .then((user) => user)
    .catch(() => null);
};
