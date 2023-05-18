import axios from "../config/axios";

export const getChat = () => {
  try {
    const response = axios.get("/apply");
    return response;
  } catch (error) {
    throw error;
  }
};

export const postChat = (message: string) => {
  try {
    const response = axios.post("/apply", { message });
    return response;
  } catch (error) {
    throw error;
  }
};
