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

export const getAllParticipantsForEvent = async (eventId: number) => {
  try {
    const response = await axios.get(`/event/${eventId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postParticipation = async (eventId: number, data: any) => {
  try {
    const response = await axios.post(
      `/user/me/participation/${eventId}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
