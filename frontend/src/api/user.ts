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
    throw error;
  }
};