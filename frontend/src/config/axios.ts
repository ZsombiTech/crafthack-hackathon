import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://crafthack-hackathon-backend-git-dev-hackathon-web3.vercel.app",
  timeout: 1000,
});

export default instance;
