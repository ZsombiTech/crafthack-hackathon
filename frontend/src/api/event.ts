import axios from "../config/axios";

export const getAllEvents = async () => {
  try {
    const response = await axios.get("/event");
    return response;
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (data: any) => {
  try {
    const response = await axios.post("/event", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllParticipations = async () => {
  try {
    const response = await axios.get("/user/me/participation");
    return response;
  } catch (error) {
    throw error;
  }
};