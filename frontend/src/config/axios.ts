import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://crafthack-hackathon-backend-git-dev-hackathon-web3.vercel.app",
});

const cookies = document.cookie;
const token = cookies.split(";").find((item) => {
  return item.includes("token");
});

if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${
    token.split("=")[1]
  }`;
}

export default instance;
