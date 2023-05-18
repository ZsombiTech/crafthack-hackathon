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

export const signup = async (
  fullname: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axios.post("/auth/signup", {
      fullname,
      email,
      password,
      confirmPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
