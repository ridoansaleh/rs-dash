export default class Order {
  constructor() {
    this.state = {
      consigneeName: "",
      consigneeAddress: "",
      consigneeCity: "",
      consigneeCountry: "",
      consigneePostalCode: null,
      consigneeProvince: "",
      consigneeNumber: null,
      height: null,
      weight: null,
      length: null,
      width: null,
      paymentType: "",
    };
  }

  get initialValues() {
    return this.state;
  }

  get initialValidation() {
    let result = {};
    for (const field in this.state) {
      result[field] = true;
    }
    return result;
  }
}
