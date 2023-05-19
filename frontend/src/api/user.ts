import { deleteCookie } from "../components/Wrapper";
import axios from "../config/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  fullname: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post("/auth/register", {
      name: fullname,
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get("/user/me");
    return response;
  } catch (error) {
    if ((error as any).response.status === 401) {
      deleteCookie("token");
      window.location.href = "/login";
    }
  }
};

export const getByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
