export const initialOrder = {
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

export const countryList = [
  {
    name: "Singapore",
    code: "SG",
  },
  {
    name: "Malaysia",
    code: "MY",
  },
  {
    name: "Indonesia",
    code: "ID",
  },
];

export const provinceList = {
  SG: ["Singapore"],
  MY: ["Perak", "Johor"],
  ID: ["DKI Jakarta", "Jawa Barat"],
};

export const cityList = {
  Singapore: ["Singapore"],
  Johor: ["Johor Bahru", "Kluang", "Batu Pahat", "Kota Tinggi"],
  Perak: ["Perak", "Taiping", "Seri Manjung"],
  "DKI Jakarta": [
    "Jakarta Utara",
    "Jakarta Barat",
    "Jakarta Pusat",
    "Jakarta Timur",
    "Jakarta Selatan",
    "Kepulauan Seribu",
  ],
  "Jawa Barat": [
    "Bandung",
    "Cimahi",
    "Cirebon",
    "Bogor",
    "Bekasi",
    "Garut",
    "Tasikmalaya",
    "Subang",
    "Cianjur",
    "Sukabumi",
  ],
};

export const paymentTypeList = ["cod", "prepaid"];
