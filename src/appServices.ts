import axios from "axios";
import { ENDPOINT } from './constant'
import type { ICredential, IOrder } from './types'

const instance = axios.create({
  baseURL: ENDPOINT.BASE_URL
});

const appServices = {
  login: ({ username, password }: ICredential): Promise<any> => {
    return instance.post(ENDPOINT.LOGIN, {
      username,
      password,
    });
  },
  getOrders: (session: string): Promise<any> => {
    return instance.get(ENDPOINT.ORDERS, {
      headers: {
        Authorization: session,
      },
    });
  },
  createOrder: (data: IOrder, session: string): Promise<any> => {
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
