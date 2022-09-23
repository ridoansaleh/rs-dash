import type { IOrder, IOrderValidStatus, OrderKeys } from '../types'

export default class Order {
  state: IOrder

  constructor() {
    this.state = {
      consigneeName: "",
      consigneeAddress: "",
      consigneeCity: "",
      consigneeCountry: null,
      consigneePostalCode: null,
      consigneeProvince: null,
      consigneeNumber: null,
      height: null,
      weight: null,
      length: null,
      width: null,
      paymentType: "",
    };
  }

  get initialValues(): IOrder {
    return this.state;
  }

  get validationStatus() {
    let result: Partial<IOrderValidStatus> = {};
    for (const field in this.state) {
      result[field as OrderKeys] = true;
    }
    return result;
  }
}
