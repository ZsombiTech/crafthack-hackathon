import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://crafthack-hackathon-backend-git-dev-hackathon-web3.vercel.app",
});

const cookies = document.cookie;
const token = cookies.split(";").find((item) => {
  const key = item.split("=")[0];
  return key.trim() === "token";
});

if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${
    token.split("=")[1]
  }`;
}

export default instance;
