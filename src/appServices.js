import axios from "axios";

const instance = axios.create({
  baseURL: "https://fe-screening.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

const appSevices = {
  login: ({ username, password }) => {
    return instance.post("/login", {
      username,
      password,
    });
  },
  getOrders: (session) => {
    return instance.get("/orders", {
      headers: {
        Authorization: session,
      },
    });
  },
  createrOrder: (data, session) => {
    return instance.post(
      "/orders",
      { ...data },
      {
        headers: {
          Authorization: session,
        },
      }
    );
  },
};

export default appSevices;
