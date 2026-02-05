import axios from "axios";
import { TUser } from "../interface/index";

const SERVER_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

export const userRegister = async (user: TUser) => {
  return axiosInstance.post("/auth/register", user);
};

export const getUsers = async () => {
  return axiosInstance.get("/auth/users");
};

export const userLogin = async (user: TUser) => {
  return axiosInstance.post("/auth/login", user);
};

export const getCurrentUser = async () => {
  return axiosInstance.get("/auth/user");
};

export const userLogout = async () => {
  return axiosInstance.post("/auth/logout");
};

export const requestPasswordReset = async (user: TUser) => {
  return axiosInstance.post("auth/request-reset", user);
};

export const verifyResetCode = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  return axiosInstance.post("/auth/verify-reset-code", { email, code });
};

export const resetPassword = async ({
  email,
  code,
  newPassword,
}: {
  email: string;
  code: string;
  newPassword: string;
}) => {
  return axiosInstance.post("/auth/reset-password", {
    email,
    code,
    new_password: newPassword,
  });
};

export const getTasks = async () => {
  return axiosInstance
    .get("/tasks/all")
    .then((res) => {
      console.log(" TASKS:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Axios TASKS ERROR", err);
      throw err;
    });
};

export const getLists = async () => {
  return axiosInstance
    .get("/lists")
    .then((res) => {
      console.log(" LISTS:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(" Axios LISTS ERROR", err);
      throw err;
    });
};
