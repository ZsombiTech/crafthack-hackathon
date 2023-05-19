import axios from "../config/axios";

export const getMatches = async () => {
  try {
    const response = await axios.get("/apply/match");
    return response;
  } catch (error) {
    return { data: [] };
  }
};

export const makeTeams = async () => {
  try {
    const response = await axios.get("/apply/create_teams");
    return response;
  } catch (error) {
    return { data: [] };
  }
};
