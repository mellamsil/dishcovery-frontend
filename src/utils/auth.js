export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ token: "fake-token-12345" });
      } else {
        reject("Invalid credentials");
      }
    }, 500); // simulate network delay
  });
};

// Simulate token verification
export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === "fake-token-12345") {
        resolve({
          data: {
            name: "Fake User",
            email: "fake@example.com",
            _id: "fake-id",
          },
        });
      } else {
        reject("Token invalid or expired");
      }
    }, 500);
  });
};
