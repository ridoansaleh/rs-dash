import { cityList } from './pages/new-order/data'

export interface ICredential {
  username: string
  password: string
}

export type countryCodes = 'SG' | 'MY' | 'ID'
export type provinceNames = keyof typeof cityList
export type CredentialKeys = keyof ICredential

export interface ISelectOption {
  name: string
  code: string
}

export interface IOrder {
  consigneeName: string
  consigneeAddress: string
  consigneeCity: string
  consigneeCountry: countryCodes | null
  consigneePostalCode: number | string | null
  consigneeProvince: provinceNames | null
  consigneeNumber: number | string | null
  height: number | null
  weight: number | null
  length: number | null
  width: number | null
  paymentType: string
}

export interface IOrderValidStatus {
  consigneeName: boolean
  consigneeAddress: boolean
  consigneeCity: boolean
  consigneeCountry: boolean
  consigneePostalCode: boolean
  consigneeProvince: boolean
  consigneeNumber: boolean
  height: boolean
  weight: boolean
  length: boolean
  width: boolean
  paymentType: boolean
}

export type OrderKeys = keyof IOrder
