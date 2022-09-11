import axios from "axios";
import { ENDPOINT } from './constant'

const instance = axios.create({
  baseURL: ENDPOINT.BASE_URL
});

const appServices = {
  login: ({ username, password }) => {
    return instance.post(ENDPOINT.LOGIN, {
      username,
      password,
    });
  },
  getOrders: (session) => {
    return instance.get(ENDPOINT.ORDERS, {
      headers: {
        Authorization: session,
      },
    });
  },
  createOrder: (data, session) => {
    return instance.post(
      ENDPOINT.ORDERS,
      data,
      {
        headers: {
          Authorization: session,
        },
      }
    );
  },
};

export default appServices;
