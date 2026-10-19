import axios from "axios";

// Attach the login token (if any) to every request
axios.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
    /* ignore corrupted storage */
  }
  return config;
});

// If the token is invalid/expired, log out and go to the login page
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const isLoginCall = err.config?.url?.includes("/auth/login");
    if (status === 401 && !isLoginCall) {
      localStorage.removeItem("auth");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);
